import express from 'express';
import passport from 'passport';
import { StreamChat } from 'stream-chat';

import { TokenUserInfo } from '../types/User.types';
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
    const user = req.user as TokenUserInfo;
    const accessToken = createToken(user as TokenUserInfo);
    if (!accessToken) return res.status(401).send('Login Error.');

    const client = new StreamChat('', process.env.STREAM_CHAT_SECRET);
    const streamChatToken = client.createToken(user.id);

    res.cookie('access-token', accessToken, {
      // httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });
    res.cookie('stream-chat-token', streamChatToken, {
      // httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });
    // eslint-disable-next-line no-nested-ternary
    const redirectUrl = process.env.NODE_ENV === 'production'
      ? 'https://healthfriend.club'
      : 'http://localhost:3000';
    return res.status(200).redirect(redirectUrl);
  },
);

export default router;
