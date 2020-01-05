import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Motivations } from './Motivations';
import { ExerciseAbleDays } from './ExerciseAbleDays';
import { AbleDistricts } from './AbleDistricts';

export enum Provider {
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum OpenImageChoice {
  OPEN = 'OPEN',
  FRIEND = 'FRIEND',
  CLOSE = 'CLOSE',
}

export enum LevelOf3Dae {
  L1 = 'L1',
  L2 = 'L2',
  L3 = 'L3',
  L4 = 'L4',
  L5 = 'L5',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  nickname: string;

  @Column({ type: 'enum', enum: Provider })
  provider: Provider;

  @Column({ type: 'varchar', length: 255 })
  snsId: string;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({
    type: 'enum',
    enum: OpenImageChoice,
    default: OpenImageChoice.OPEN,
  })
  openImageChoice: OpenImageChoice;

  @Column({ type: 'enum', enum: LevelOf3Dae, default: LevelOf3Dae.L1 })
  levelOf3Dae: LevelOf3Dae;

  @Column({
    type: 'text',
    nullable: true,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  messageToFriend: string;

  @OneToMany(
    () => Motivations,
    (motivations) => motivations.owner,
  )
  motivations: Motivations[];

  @OneToMany(
    () => ExerciseAbleDays,
    (exerciseAbleDays) => exerciseAbleDays.user,
  )
  ableDays: ExerciseAbleDays[];

  @OneToMany(
    () => AbleDistricts,
    (ableDistricts) => ableDistricts.user,
  )
  ableDistricts: AbleDistricts[];

  @ManyToMany(
    () => User,
    (user) => user.following,
  )
  @JoinTable({
    name: 'friend_request',
    joinColumn: {
      name: 'followers',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'following',
      referencedColumnName: 'id',
    },
  })
  followers: User[];

  @ManyToMany(
    () => User,
    (user) => user.followers,
  )
  following: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
