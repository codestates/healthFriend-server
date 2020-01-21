import { gql } from 'apollo-server-express';

const enumSchema = gql`
  enum GenderEnum {
    MALE
    FEMALE
  }

  enum OpenImageChoiceEnum {
    OPEN
    FRIEND
    CLOSE
  }

  enum LevelOf3DaeEnum {
    L1
    L2
    L3
    L4
    L5
  }

  enum MotivationEnum {
    WEIGHT_INCREASE
    WEIGHT_LOSS
    FIND_FRIEND
    LONELINESS
  }

  enum WeekdayEnum {
    MONDAY
    TUESDAY
    WEDNESDAY
    THURSDAY
    FRIDAY
    SATURDAY
    SUNDAY
  }
`;

export { enumSchema };
