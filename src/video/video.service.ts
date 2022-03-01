import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { parse } from 'date-fns';
import { PreconditionFailedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VideoFileEntity } from './entities/video-file.entity';
import { In, Like, Not, Repository } from 'typeorm';
import { VideoEntity } from './entities/video.entity';
import * as _ from 'lodash';
import { paginate, PaginationArgs } from 'src/utils/page-pagination';
import { AddOrModifyVideoInput } from './video.input';
import { PlaylistEntity } from 'src/playlist/entities/playlist.entity';
import { VideoProgressEntity } from './entities/video-progress.entity';
import { RecommendedPlaylistVideosFilterInput } from 'src/playlist/playlist.input';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(VideoFileEntity)
    private readonly videoFileRepository: Repository<VideoFileEntity>,
    @InjectRepository(VideoEntity)
    private readonly videoRepository: Repository<VideoEntity>,
    @InjectRepository(VideoProgressEntity)
    private readonly videoProgressRepository: Repository<VideoProgressEntity>,
  ) {}

  async getVideoById(id: number, relations?: string[]) {
    return await this.videoRepository.findOne(id, {
      relations,
    });
  }

  async paginatedVideos(
    pagination: PaginationArgs,
    options?: {
      titleFilter?: string;
      playlistIdFilter?: number;
      filter?: RecommendedPlaylistVideosFilterInput;
    },
  ) {
    const query = this.videoRepository.createQueryBuilder();

    if (options?.titleFilter) {
      query.andWhere({
        title: Like(`%${options?.titleFilter}%`),
      });
    }

    if (options?.playlistIdFilter) {
      query.andWhere('playlistId = :playlistId', {
        playlistId: options?.playlistIdFilter,
      });
    }

    if (options?.filter) {
      if (options.filter.week) {
        // 해당 주차에 연결된 추천 강의 영상을 내려줌
        query.andWhere(`recommendWeeks like '%:recommendWeeks,%'`, {
          recommendWeeks: options.filter.week,
        });
      }
    }

    return paginate(query, pagination, 'ASC', 'id');
  }

  async getOrderInPlaylistByVideoId(videoId: number) {
    const video = await this.videoRepository.findOne(videoId, {
      relations: ['playlist'],
    });
    const videos = await this.videosByPlaylist(video.playlist.id);
    return videos.findIndex((item) => item.id === video.id);
  }

  async videosByPlaylist(playlistId: number) {
    const query = this.videoRepository.createQueryBuilder();

    query.andWhere('playlistId = :playlistId', {
      playlistId: playlistId,
    });

    query.orderBy({ sort: 'ASC' });

    return query.getMany();
  }

  async addOrModifyVideo(input: AddOrModifyVideoInput) {
    if (input.id) {
      const video = await this.videoRepository.findOne(input.id);

      Object.keys(input).forEach((key) => {
        if (
          [
            'playlistId',
            'fileUrls',
            'isRegularPlaylist',
            'recommendWeeks',
          ].includes(key)
        ) {
          return;
        }

        if (!_.isNil(input[key])) {
          video[key] = input[key];
        }
      });

      if (!input.isRegularPlaylist) {
        video.playlist = {
          id: 1, // 추천 플레이리스트 id
        } as PlaylistEntity;
      } else {
        if (!_.isNil(input.playlistId)) {
          video.playlist = {
            id: input.playlistId,
          } as PlaylistEntity;
        } else {
          throw new PreconditionFailedException(
            '정규 과정은 플레이리스트 id값이 들어와야합니다',
          );
        }
      }

      if (!_.isNil(input.files)) {
        video.files = input.files.map((file) => {
          return this.videoFileRepository.create({
            url: file.url,
            fileName: file.fileName,
          });
        });
      }

      if (!_.isNil(input.recommendWeeks)) {
        video.recommendWeeks = input.recommendWeeks.join(',') + ',';
      }

      return await this.videoRepository.save(video);
    } else {
      if (input.isRegularPlaylist && !input.playlistId) {
        throw new PreconditionFailedException(
          '정규 과정은 플레이리스트 id값이 들어와야합니다',
        );
      }

      const newVideo = this.videoRepository.create({
        video_url: input.video_url,
        video_title: input.video_title,
        video_createdAt: input.video_createdAt,
        video_channelName: input.video_channelName,
        video_lengthInSeconds: input.video_lengthInSeconds,
        video_thumbnail: input.video_thumbnail,
        title: input.title,
        description: input.description,
        shareScratchInRegularPlaylist: input.shareScratchInRegularPlaylist,
        isPublic: input.isPublic,
        tags: input.tags,
        recommendWeeks: (input.recommendWeeks ?? []).join(',') + ',',
        files: input.files.map((file) =>
          this.videoFileRepository.create({
            url: file.url,
            fileName: file.fileName,
          }),
        ),
      });

      // 각 플레이리스트에 추가
      if (input.isRegularPlaylist) {
        // 정규
        newVideo.playlistId = input.playlistId;
      } else {
        // 추천
        newVideo.playlistId = 1;
      }

      return await this.videoRepository.save(newVideo);
    }
  }

  async deleteVideo(ids: number[]) {
    await this.videoRepository.delete({
      id: In(ids),
    });
  }

  async scrapYoutubeVideoLink(link: string) {
    try {
      let youtubeId;

      const v = new URL(link);
      if (v.hostname === 'youtu.be') {
        // https://youtu.be/-U9hRlDqmik
        const match2 = /https:\/\/youtu.be\/(.*)$/.exec(link);
        youtubeId = match2[1];
      } else if (
        v.hostname === 'www.youtube.com' ||
        v.hostname === 'youtube.com'
      ) {
        youtubeId = v.searchParams.get('v');
      }

      if (!youtubeId) {
        throw new PreconditionFailedException(
          '유튜브 영상 ID를 파싱할 수 없습니다. 관리자에게 시도한 url을 알려주세요.',
        );
      }

      const { data } = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?id=${youtubeId}&key=${process.env.YOUTUBE_API_KEY}&part=snippet,contentDetails`,
      );

      if (data.items.length == 0) {
        throw new Error();
      }

      const item = data.items[0];
      if (item.contentDetails.duration == 'P0D') {
        throw new PreconditionFailedException(
          '라이브 스트리밍 영상은 업로드 할 수 없습니다',
        );
      }
      let durationMatch = /(?:PT)(\d+)M(\d+)?S?/
        .exec(item.contentDetails.duration)
        ?.slice(0);

      if (!durationMatch) {
        durationMatch = /(?:PT)(\d+)H(\d+)M(\d+)S/
          .exec(item.contentDetails.duration)
          .slice(0);
        durationMatch = durationMatch.slice(1);
      }

      return {
        video_link: `https://www.youtube.com/watch?v=${youtubeId}`,
        video_title: item.snippet.title,
        video_createdAt: new Date(item.snippet.publishedAt),
        video_channelName: item.snippet.channelTitle,
        video_lengthInSeconds:
          parseInt(durationMatch[1] ?? '0') * 60 +
          parseInt(durationMatch[2] ?? '0'),
        video_thumbnail: (
          item.snippet.thumbnails.standard ??
          item.snippet.thumbnails.high ??
          item.snippet.thumbnails.medium ??
          item.snippet.thumbnails.default
        ).url,
      };
    } catch (e) {
      console.error(e);
      throw new PreconditionFailedException(
        '해당 유튜브 영상 정보를 가져오는데 실패히였습니다. 링크를 다시 한번 확인해주세요.',
        'youtube-scrape-fail',
      );
    }
  }

  async markVideoProgress(
    studentId: number,
    videoId: number,
    progress: number,
  ) {
    const prevProgress = await this.videoProgressRepository.findOne({
      where: {
        student: { id: studentId },
        video: { id: videoId },
      },
    });

    if (!prevProgress) {
      return await this.videoProgressRepository.save(
        this.videoProgressRepository.create({
          student: {
            id: studentId,
          },
          video: {
            id: videoId,
          },
          progress,
        }),
      );
    }
    if (prevProgress.progress < progress) {
      prevProgress.progress = progress;
    }

    return await this.videoProgressRepository.save(prevProgress);
  }

  async getProgress(studentId: number, videoId: number) {
    const progressObj = await this.videoProgressRepository.findOne({
      where: {
        studentId: studentId,
        videoId: videoId,
      },
    });
    return progressObj?.progress ?? 0;
  }

  async getFiles(videoId: number) {
    const files = await this.videoFileRepository.find({
      where: {
        videoId: videoId,
      },
    });

    return files;
  }

  async getLastAccessedVideo(studentId: number) {
    const progress = await this.videoProgressRepository.findOne({
      where: {
        studentId: studentId,
      },
      order: {
        updatedAt: 'DESC',
      },
      relations: ['video'],
    });

    return progress?.video ?? null;
  }

  async getAverageProgress(videoIds: number[], studentId: number) {
    if (videoIds.length == 0) return 0;
    const query = this.videoProgressRepository.createQueryBuilder();

    query.where({
      videoId: In(videoIds),
      studentId: studentId,
    });

    query.select('sum(progress)', 'sum_progress');

    const result = await query.getRawOne();
    return (result.sum_progress ?? 0) / videoIds.length;
  }

  async getTotalAverageProgress(studentId: number) {
    const videos = await this.videoRepository.find({ playlistId: Not(1) });

    return await this.getAverageProgress(
      videos.map((video) => video.id),
      studentId,
    );
  }
}
