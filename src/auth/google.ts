import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { User, Provider } from '../entity/User';

export default () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: 'http://localhost:4000/auth/google/callback',
      },
      async (_, __, profile, cb) => {
        try {
          const {
            id, displayName, emails, provider,
          } = profile;
          if (!emails) {
            return cb('Email not found');
          }
          const email = emails[0].value;
          console.log('Receive email: ', email);
          const existingUser = await User.findOne({
            where: {
              provider,
              email,
            },
          });
          if (existingUser) {
            // 이미 가입된 유저, 로그인 처리
            console.log('User Exist: ', existingUser);
            return cb(undefined, existingUser);
          }

          const newUser = await User.create({
            email,
            nickname: displayName,
            provider: Provider.GOOGLE,
            snsId: id,
          }).save();
          console.log('User Create: ', newUser);
          return cb(undefined, newUser);
        } catch (error) {
          console.error(error);
          return cb(error);
        }
      },
    ),
  );
};
