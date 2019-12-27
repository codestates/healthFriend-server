import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Motivations } from './Motivations';

export enum Provider {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}

export enum OpenImageChoice {
  OPEN = 'open',
  FRIEND = 'friend',
  CLOSE = 'close',
}

export enum LevelOf3Dae {
  L1 = '1: 0 ~ 99',
  L2 = '2: 100 ~ 199',
  L3 = '3: 200 ~ 299',
  L4 = '4: 300 ~ 399',
  L5 = '5: 400 ~ 499',
}

@Entity()
export class User extends BaseEntity {
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
