import express from 'express';
import passport from 'passport';

import { SimpleUserInfo } from '../types/User.types';
import { createToken } from '../utils/controllToken';

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    // console.log('REQ.USER: ', req.user);
    const { id, email, nickname } = req.user as SimpleUserInfo;
    if (!id || !email || !nickname) {
      res.status(401).send('Login Error.');
    }
    const accessToken = createToken({ id, email, nickname });
    res.cookie('access-token', accessToken, {
      // httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });
    // eslint-disable-next-line no-nested-ternary
    const redirectUrl = process.env.NODE_ENV === 'production'
      ? 'https://healthfriend.club'
      : process.env.NODE_ENV === 'doit'
        ? 'https://hf2.doitreviews.com'
        : 'http://localhost:3000';
    res.status(200).redirect(redirectUrl);
  },
);

export default router;
