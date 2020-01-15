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

    const maxAge = 1000 * 60 * 60 * 24; // 1 day
    let redirectUrl: string;
    let domain: string;
    if (process.env.NODE_ENV === 'production') {
      redirectUrl = 'https://healthfriend.club';
      domain = 'healthfriend.club';
    } else {
      redirectUrl = 'http://localhost:3000';
      domain = 'localhost';
    }

    res.cookie('access-token', accessToken, { domain, maxAge });
    res.cookie('stream-chat-token', streamChatToken, { domain, maxAge });
    return res.status(200).redirect(redirectUrl);
  },
);

export default router;
