import { gql } from 'apollo-server-express';

const subscriptionSchema = gql`
  type Subscription {
    subscribeRequestFriend: User
  }
`;

export { subscriptionSchema };
