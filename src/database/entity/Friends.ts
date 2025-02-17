import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  // JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Friends {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => User,
    (user) => user.friends,
  )
  me: User;

  @ManyToOne(() => User)
  friend: User;

  @Column({ type: Boolean, default: false })
  checked: Boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
