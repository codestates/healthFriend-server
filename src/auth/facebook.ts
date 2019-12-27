import passport from 'passport';
import { User, Provider } from '../entity/User';
const FacebookStrategy = require('passport-facebook').Strategy;

export default () => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: 'http://localhost:4000/auth/facebook/callback',
        profileFields: ['id', 'emails', 'name'],
      },
      async (_: any, __: any, profile: any, cb: any) => {
        try {
          console.log(profile);
          const { id, displayName, emails, provider } = profile;
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
            console.log('User Exist: ', existingUser);
            return cb(undefined, existingUser);
          }

          const newUser = await User.create({
            email,
            nickname: displayName,
            provider: Provider.FACEBOOK,
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
