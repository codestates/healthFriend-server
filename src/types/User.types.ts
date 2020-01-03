import {
  OpenImageChoice,
  LevelOf3Dae,
  Provider,
} from '../database/entity/User';

export interface SimpleUserInfo {
  id: string;
  email: string;
  nickname: string;
}

export interface DetailedUserInfo {
  nickname: string;
  openImageChoice: OpenImageChoice;
  levelOf3Dae: LevelOf3Dae;
  messageToFriend: string;
}

export interface RegisterUserInfo {
  email: string;
  nickname: string;
  provider: Provider;
  snsId: string;
}

export interface UserQueryCondition {
  openImageChoice: OpenImageChoice|null;
  levelOf3Dae: LevelOf3Dae|null;
  motivations: Array<string|null>;
  weekdays: Array<string|null>;
  districts: Array<string|null>;
}
