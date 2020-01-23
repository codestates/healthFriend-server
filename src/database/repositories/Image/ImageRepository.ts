import { EntityRepository, Repository } from 'typeorm';
import AWS from 'aws-sdk';
import { ApolloError } from 'apollo-server-express';
import { User } from '../../entity/User';
import { Image } from '../../entity/Image';

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_REGION,
  apiVersion: process.env.S3_API_VERSION,
});

const s3Folder = process.env.S3_FOLDER as string;

interface DeleteParam {
  Bucket: string;
  Delete: {
    Objects: Array<{ Key: string }>;
  };
}

@EntityRepository(Image)
export class ImageRepository extends Repository<Image> {
  async saveImages(me: User, image: any) {
    try {
      const { createReadStream, filename } = image;
      const fileStream = createReadStream();

      const currentDate = new Date().toISOString().slice(0, 7);
      const s3Filename = `${s3Folder}/${currentDate}/${
        me.id
      }_${+new Date()}_${filename}`;

      const uploadParams = {
        ACL: 'public-read',
        Bucket: process.env.S3_BUCKET as string,
        Key: s3Filename,
        Body: fileStream,
        Conditions: [
          ['content-length-range', 0, process.env.S3_FILE_SIZE], // 10 Mb
          { acl: 'public-read' },
        ],
      };
      const result = await s3.upload(uploadParams).promise();
      if (result && result.Location) {
        await this.saveImageAddress(me, result.Location);
      }
      return result;
    } catch (error) {
      throw new ApolloError(
        'Profile image save error.',
        'PROFILE_IMAGE_SAVE_ERROR',
      );
    }
  }

  async deleteImage(me: User, url: string) {
    try {
      const filePath = url.match(`(${s3Folder}).+`);
      if (filePath) {
        // console.log('FILE PATH', filePath[0]);
        const deleteFile = [{ Key: filePath[0] }];
        const deleteParams: DeleteParam = {
          Bucket: process.env.S3_BUCKET as string,
          Delete: {
            Objects: deleteFile,
          },
        };
        const result = await s3.deleteObjects(deleteParams).promise();
        if (result) await this.deleteImageAddress(me);
      }
      return true;
    } catch (error) {
      throw new ApolloError(
        'Profile image delete error.',
        'PROFILE_IMAGE_DELETE_ERROR',
      );
    }
  }

  async deleteImageAddress(me: User) {
    await this.delete({ user: me });
  }

  async saveImageAddress(me: User, location: string) {
    // transaction 추가
    const savedImageAddress = await this.findOne({ user: me });
    if (savedImageAddress) {
      await this.deleteImage(me, savedImageAddress.filename);
    }
    await this.save({ user: me, filename: location });
  }
}
