import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistEntity } from './entities/playlist.entity';
import { RegularPlaylistResolver } from './resolvers/regular-playlist.resolver';
import { PlaylistService } from './playlist.service';
import { RecommendedPlaylistResolver } from './resolvers/recommended-playlist.resolver';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([PlaylistEntity])],
  providers: [
    RegularPlaylistResolver,
    PlaylistService,
    RecommendedPlaylistResolver,
  ],
})
export class PlaylistModule {}
