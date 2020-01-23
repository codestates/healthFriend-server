import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated } from '../auth';
import { getUserRepository, getImageRepo } from '../../database';

interface GraphqlFile {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: any;
}
interface FileArgs {
  file: Promise<GraphqlFile>;
}

const imageResolver = {
  Mutation: {
    profileImageUpload: combineResolvers(
      isAuthenticated,
      async (_: any, args: FileArgs, { userInfo }) => {
        const me = await getUserRepository().validateUserId(userInfo.id);
        const file = await args.file;
        // console.log('Mutation - profileImageUpload: ', me);
        // console.log('Mutation - profileImageUpload: ', file);
        const result = await getImageRepo().saveImages(me, file);
        return result;
      },
    ),
  },
};

export { imageResolver };
