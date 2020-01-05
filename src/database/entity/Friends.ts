import {
  Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Friends {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, (user) => user.friends)
  me: User;

  @ManyToOne(() => User)
  @JoinColumn()
  friend: User;
}
