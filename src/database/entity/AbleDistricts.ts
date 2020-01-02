import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './User';
import { Districts } from './Districts';

@Entity()
export class AbleDistricts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.ableDistricts)
  user: User;

  @ManyToOne(() => Districts, (district) => district.selectedDong)
  district: Districts;
}
