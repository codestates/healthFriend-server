import { DetailedUserInfo } from '../types/User.types';

export const registerMutation = (email: string) => `
mutation {
  registerForTest(email: "${email}") {
    token
  }
}
`;

export const meQuery = `
{
  me {
    email
    nickname
  }
}
`;

export const meMutation = (arg: DetailedUserInfo) => `
mutation {
  me(
    nickname: "${arg.nickname}"
    gender: ${arg.gender}
    openImageChoice: ${arg.openImageChoice}
    levelOf3Dae: ${arg.levelOf3Dae}
    messageToFriend: "${arg.messageToFriend}"
  ) {
    id
    email
    nickname
    gender
    openImageChoice
    levelOf3Dae
    messageToFriend
  }
}
`;
