import jwt from 'jsonwebtoken';

export default async (
  resolver: any,
  parent: any,
  args: any,
  context: any,
  info: any,
) => {
  // middleware
  const { req } = context;
  if (!req && !req.cookies['access-token']) {
    return null;
  }

  interface User {
    id: string,
    email: string,
    nickname: string
  }

  const user = jwt.verify(
    req.cookies['access-token'],
    process.env.JWT_SECRET as string,
  ) as User;
  req.userId = user.id as string;

  const result = await resolver(parent, args, context, info);
  // afterware

  return result;
};
