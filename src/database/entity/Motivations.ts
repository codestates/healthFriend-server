import {
  Entity, PrimaryGeneratedColumn, ManyToOne, Column,
} from 'typeorm';
import { User } from './User';

export enum Motivation {
  WEIGHT_INCREASE = 'WEIGHT_INCREASE',
  WEIGHT_LOSS = 'WEIGHT_LOSS',
  FIND_FRIEND = 'FIND_FRIEND',
  LONELINESS = 'LONELINESS',
}

@Entity()
export class Motivations {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => User,
    (user) => user.motivations,
  )
  owner: User;

  @Column({ type: 'enum', enum: Motivation })
  motivation: string;
}
