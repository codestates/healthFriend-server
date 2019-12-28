import {
  Entity, PrimaryGeneratedColumn, ManyToOne, Column,
} from 'typeorm';
import { User } from './User';

export enum Motivation {
  WEIGHT_INCREASE = '최대 중량 증가',
  WEIGHT_LOSS = '체중 감소',
  FIND_FRIEND = '친구 찾기',
  LONELINESS = '외로움',
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
