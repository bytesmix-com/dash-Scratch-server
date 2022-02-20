import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginationArgs } from 'src/utils/page-pagination';
import { VideoService } from 'src/video/video.service';
import { In, Like, Repository } from 'typeorm';
import { PlaylistEntity } from './entities/playlist.entity';
import { AddOrModifyRegularPlaylistInput } from './playlist.input';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(PlaylistEntity)
    private readonly playlistRepository: Repository<PlaylistEntity>,
    private readonly videoService: VideoService,
  ) {}

  async existingRegularPlaylistWeeks() {
    const list = await this.playlistRepository.find({
      where: { playlistType: '정규' },
      order: { week: 'ASC' },
    });
    return list.map((item) => item.week);
  }

  async paginatedRegularPlaylist(
    pagination: PaginationArgs,
    options?: { nameFilter?: string },
  ) {
    const query = this.playlistRepository.createQueryBuilder();

    query.andWhere({
      playlistType: '정규',
    });

    if (options?.nameFilter) {
      query.andWhere({ name: Like(`%${options.nameFilter}%`) });
    }

    return await paginate(query, pagination);
  }

  async regularPlaylists() {
    return await this.playlistRepository.find({
      where: {
        playlistType: '정규',
      },
      order: {
        week: 'ASC',
      },
    });
  }

  async getById(id: number) {
    return await this.playlistRepository.findOne(id);
  }

  async getByWeek(week: number) {
    return await this.playlistRepository.findOne({
      week,
    });
  }

  async deleteRegularPlaylist(ids: number[]) {
    await this.playlistRepository.delete({
      id: In(ids),
    });
  }

  async getThumbnails(id: number) {
    const playlist = await this.playlistRepository.findOne(id, {
      relations: ['videos'],
    });
    return playlist.videos
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 3)
      .map((video) => video.video_thumbnail);
  }

  async addOrModifyRegularPlaylist(input: AddOrModifyRegularPlaylistInput) {
    if (input.id) {
      const playlist = await this.playlistRepository.findOne(input.id);
      playlist.description = input.description;
      playlist.name = input.name;
      playlist.isPublic = input.isPublic;
      playlist.week = input.week;
      playlist.shareScratchWithRegularPlaylistId =
        input.shareScratchWithRegularPlaylistId;
      return await this.playlistRepository.save(playlist);
    }
    const playlistByWeek = await this.getByWeek(input.week);
    if (playlistByWeek) {
      throw new PreconditionFailedException(
        '동일한 주차에 플레이리스트가 이미 존재합니다',
      );
    }
    return await this.playlistRepository.save(
      this.playlistRepository.create({
        description: input.description,
        name: input.name,
        isPublic: input.isPublic,
        week: input.week,
        shareScratchWithRegularPlaylistId:
          input.shareScratchWithRegularPlaylistId,
      }),
    );
  }

  async getWeekPlaylistProgress(playlistId: number, studentId: number) {
    const playlist = await this.playlistRepository.findOne(playlistId, {
      relations: ['videos'],
    });
    return await this.videoService.getAverageProgress(
      playlist.videos.map((video) => video.id),
      studentId,
    );
  }

  async isScratchSharedToOtherPlaylist(playlistId: number) {
    const count = await this.playlistRepository.count({
      shareScratchWithRegularPlaylistId: playlistId,
    });
    return count !== 0;
  }
}
