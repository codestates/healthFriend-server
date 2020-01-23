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

interface FileUrl{
  url: string;
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

    deleteProfileImage: combineResolvers(
      isAuthenticated,
      async (_: any, args: FileUrl, { userInfo }) => {
        const me = await getUserRepository().validateUserId(userInfo.id);
        const result = await getImageRepo().deleteImage(me, args.url);
        return result;
      },
    ),
  },
};

export { imageResolver };
