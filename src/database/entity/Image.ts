import {
  Entity, PrimaryGeneratedColumn, ManyToOne, Column,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => User,
    (user) => user.images,
  )
  user: User;

  @Column({ type: 'varchar', length: 255 })
  filename: string;
}
