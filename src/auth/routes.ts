import express from 'express';
import passport from 'passport';

import createToken, { UserInfo } from '../utils/createToken';

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const { id, email, nickname } = req.user as UserInfo;
    const accessToken = createToken({ id, email, nickname });
    res.cookie('access-token', accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 15,
    });
    res.status(200).redirect('http://localhost:4000/graphql');
  },
);

export default router;
