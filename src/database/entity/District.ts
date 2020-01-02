import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class District {
  @PrimaryGeneratedColumn('uuid')
  idOfDong: string;

  @Column({ type: 'varchar', length: 255 })
  nameOfDong: string;

  @Column({ type: 'int' })
  idOfGu: number;

  @Column({ type: 'varchar', length: 255 })
  nameOfGu: string;
}
