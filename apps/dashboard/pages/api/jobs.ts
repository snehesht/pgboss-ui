import { NextApiRequest, NextApiResponse } from 'next';
import { database } from '../../lib/database';
import { JobStatusEnum } from '@pgbossui/database';

type Data = {
  fields?: string[];
  data?: Object[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    res.status(405).end(`Method ${req.method} not allowed`);
  }

  const search = req.body.search || '';
  const state: JobStatusEnum | 'all' = req.body.state || 'all';
  const offset = parseInt(req.body.offset) || 0;
  const limit = parseInt(req.body.limit) || 20;
  try {
    const { fields, data } = await database.getAllJobs(
      offset,
      limit,
      state,
      search
    );
    res.status(200).json({ fields, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
