import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VideoService } from 'src/video/video.service';
import { Repository } from 'typeorm';
import { AssetEntity } from './asset.entity';
import { GUIEntity } from './gui.entity';

@Injectable()
export class GUIService {
  constructor(
    @InjectRepository(GUIEntity)
    private readonly guiRepository: Repository<GUIEntity>,
    @InjectRepository(AssetEntity)
    private readonly assetRepository: Repository<AssetEntity>,
    private readonly videoService: VideoService,
  ) {}

  async saveProject(id: string, data: JSON) {
    const prev = await this.guiRepository.findOne(id);
    if (!prev) {
      await this.guiRepository.save(
        this.guiRepository.create({
          id: id,
          data: data,
        }),
      );
    } else {
      prev.data = data;
      await this.guiRepository.save(prev);
    }
  }

  async getProject(id: string) {
    return (await this.guiRepository.findOne(id))?.data;
  }

  async saveAsset(filename: string, url: string) {
    await this.assetRepository.save(
      this.assetRepository.create({
        filename,
        url,
      }),
    );
  }

  async getAssetUrl(filename: string) {
    return (await this.assetRepository.findOne(filename))?.url;
  }
}
