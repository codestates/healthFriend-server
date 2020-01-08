import {
  OpenImageChoice,
  LevelOf3Dae,
  Provider,
  Gender,
} from '../database/entity/User';

export interface SimpleUserInfo {
  id: string;
  email: string;
  nickname: string;
}

export interface DetailedUserInfo {
  nickname: string;
  gender: Gender;
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
  gender: Array<Gender|null>;
  openImageChoice: Array<OpenImageChoice|null>;
  levelOf3Dae: Array<LevelOf3Dae|null>;
  motivations: Array<string|null>;
  weekdays: Array<string|null>;
  districts: Array<string|null>;
}

export interface LoginInfo {
  email: string;
  password: string;
}
