import express from 'express';
import passport from 'passport';

import createToken, { Result, UserInfo } from '../utils/createToken';

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
    const userInfo = {
      id,
      email,
      nickname,
    };
    const result = createToken(userInfo) as Result;
    return res.status(200).json({ result });
  },
);

export default router;
