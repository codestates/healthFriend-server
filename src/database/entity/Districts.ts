import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { AbleDistricts } from './AbleDistricts';

@Entity()
export class Districts {
  @PrimaryGeneratedColumn('uuid')
  idOfDong: string;

  @Column({ type: 'varchar', length: 255 })
  nameOfDong: string;

  @Column({ type: 'int' })
  idOfGu: number;

  @Column({ type: 'varchar', length: 255 })
  nameOfGu: string;

  @OneToMany(
    () => AbleDistricts,
    (ableDistricts) => ableDistricts.district,
  )
  selectedDong: AbleDistricts[];
}
