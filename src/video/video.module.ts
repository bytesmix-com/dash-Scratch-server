import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoFileEntity } from './entities/video-file.entity';
import { VideoProgressEntity } from './entities/video-progress.entity';
import { VideoEntity } from './entities/video.entity';
import { VideoResolver } from './video.resolver';
import { VideoService } from './video.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      VideoFileEntity,
      VideoEntity,
      VideoProgressEntity,
    ]),
  ],
  providers: [VideoResolver, VideoService],
  exports: [VideoService],
})
export class VideoModule {}
