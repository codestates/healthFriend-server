import { DetailedUserInfo } from '../types/User.types';

export const registerMutation = (email: string, password: string) => `
mutation {
  registerForTest(email: "${email}", password: "${password}") {
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

export const userQuery = (userId: string) => `
{
  user(userId: "${userId}") {
    id
    role
    email
    nickname
    gender
    openImageChoice
    levelOf3Dae
    messageToFriend
    motivations {
      motivation
    }
    weekdays {
      weekday
    }
    ableDistricts {
      district {
        nameOfDong
      }
    }
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

export const loginQuery = (email: string, password: string) => `
{
  login (email: "${email}", password: "${password}") {
    token
  }
}
`;
