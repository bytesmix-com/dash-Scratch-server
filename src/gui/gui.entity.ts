import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class GUIEntity {
  @PrimaryColumn()
  id: string;

  @Column({
    type: 'json',
  })
  data: JSON;
}
