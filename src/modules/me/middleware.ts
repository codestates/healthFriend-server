export default async (
  resolver: any,
  parent: any,
  args: any,
  context: any,
  info: any,
) => {
  // middleware
  // console.log('Before check context: ', context);
  if (!context.userInfo && !context.userInfo.id) {
    return null;
  }
  // console.log('After check context: ', context);

  const result = await resolver(parent, args, context, info);
  // afterware

  return result;
};
