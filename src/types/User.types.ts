import { OpenImageChoice, LevelOf3Dae } from '../database/entity/User';

export interface SimpleUserInfo {
  id: string,
  email: string,
  nickname: string,
}

export interface DetailedUserInfo {
  nickname: string,
  openImageChoice: OpenImageChoice,
  levelOf3Dae: LevelOf3Dae,
  messageToFriend: string,
}
