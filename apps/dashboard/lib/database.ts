import { Database } from '@pgbossui/database';

const PGBOSS_DATABASE_URL =
  process.env.PGBOSS_DATABASE_URL ||
  'postgres://postgres:password@localhost:5432/outlet_pgboss';

export const database = new Database(PGBOSS_DATABASE_URL);
