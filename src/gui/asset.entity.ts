import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class AssetEntity {
  @PrimaryColumn()
  filename: string;

  @Column()
  url: string;
}
