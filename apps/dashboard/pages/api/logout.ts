import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    res.setHeader('Content-Type', 'application/json');

    if (req.method !== 'POST') {
      return res.status(405).end(`Method ${req.method} not allowed`);
    }

    const cookieMaxAge = 86400;
    const cookieExpires = new Date(Date.now() + cookieMaxAge);
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', '', {
        httpOnly: true,
        sameSite: true,
        secure: false,
        path: '/',
        expires: cookieExpires,
        maxAge: cookieMaxAge,
      })
    );
    return res.status(200).end();
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
