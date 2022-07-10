import PgBoss = require('pg-boss');

import { environment } from './environments/environment';

const queue: PgBoss = new PgBoss({
  connectionString: environment.pgboss_database_url,
  monitorStateIntervalSeconds: 5,
});

queue.on('error', (error) => {
  console.error(`Queue Error`, error);
});

export default queue;

export type MonitorStateRecord = {
  created: number;
  retry: number;
  active: number;
  completed: number;
  expired: number;
  cancelled: number;
  failed: number;
};

export type MonitorStateData = {
  created: number;
  retry: number;
  active: number;
  completed: number;
  expired: number;
  cancelled: number;
  failed: number;
  queues: Record<string, MonitorStateRecord>;
  all: number;
};
