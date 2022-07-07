import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    res.setHeader('Content-Type', 'application/json');

    if (req.method !== 'POST') {
      return res.status(405).end(`Method ${req.method} not allowed`);
    }

    if (!req.body.username) {
      return res.status(401).end(`username is required`);
    }
    if (!req.body.password) {
      return res.status(401).end(`password is required`);
    }
    const { username, password } = req.body;
    if (
      username === process.env.USERNAME &&
      password === process.env.PASSWORD
    ) {
      const cookieMaxAge = 24 * 60 * 60 * 1000;
      const cookieExpires = new Date(Date.now() + cookieMaxAge);
      const jwtCookie = jwt.sign(
        {
          username,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor((Date.now() + cookieMaxAge) / 1000),
        },
        process.env.JWT_SECRET
      );
      res.setHeader(
        'Set-Cookie',
        cookie.serialize('token', jwtCookie, {
          httpOnly: true,
          sameSite: true,
          secure: false,
          path: '/',
          expires: cookieExpires,
          maxAge: cookieMaxAge,
        })
      );
      return res.status(200).end();
    }
    return res.status(401).send('Unauthorized');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
