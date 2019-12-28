import passport from 'passport';

import { getUserRepository } from '../database';
import GoogleStrategy from './google';

export default () => {
  passport.serializeUser((user: any, done: any) => done(null, user.id));
  passport.deserializeUser(async (id: string, done: any) => {
    try {
      const user = await getUserRepository().findOne({ where: { id } });
      return done(null, user);
    } catch (error) {
      console.error(error);
      return done(error);
    }
  });

  GoogleStrategy();
};
