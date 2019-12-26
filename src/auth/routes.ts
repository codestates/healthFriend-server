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
    const { id, email, nickname } = req.user as SimpleUserInfo;
    const accessToken = createToken({ id, email, nickname });
    res.cookie('access-token', accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    });
    res.status(200).redirect('http://localhost:3000');
  },
);

export default router;
