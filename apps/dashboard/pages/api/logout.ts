import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', '', {
        httpOnly: true,
        sameSite: true,
        secure: false,
        path: '/',
        maxAge: -1,
      })
    );
    return res.status(200).redirect('/');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
