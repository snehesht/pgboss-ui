import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    if (req.method !== 'GET') {
      return res.status(405).end(`Method ${req.method} not allowed`);
    }

    const { token } = cookie.parse(req.headers.cookie || '');
    if (!token) {
      res.status(401).end('Unauthorized');
    }
    const { username } = jwt.verify(token, process.env.JWT_SECRET) as {
      username: string;
    };
    if (username !== process.env.USERNAME) {
      return res.status(401).send('Unauthorized');
    }
    return res.status(200).end();
  } catch (error) {
    console.log(error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).send('Unauthorized');
    }
    return res.status(500).send(error.message);
  }
}
