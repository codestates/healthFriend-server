import passport from 'passport';

import { User } from '../entity/User';
import GoogleStrategy from './google';
import FacebookStrategy from './facebook';

export default () => {
  passport.serializeUser((user: any, done: any) => done(null, user.id));
  passport.deserializeUser(async (id: string, done: any) => {
    try {
      const user = await User.findOne({ where: { id } });
      return done(null, user);
    } catch (error) {
      console.error(error);
      return done(error);
    }
  });

  GoogleStrategy();
  FacebookStrategy();
};
