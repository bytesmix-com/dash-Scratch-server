import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetEntity } from './asset.entity';
import { GUIController } from './gui.controller';
import { GUIEntity } from './gui.entity';
import { GUIService } from './gui.service';

@Module({
  imports: [TypeOrmModule.forFeature([GUIEntity, AssetEntity])],
  providers: [GUIService],
  controllers: [GUIController],
})
export class GUIModule {}
