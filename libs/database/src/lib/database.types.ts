import { Field, QueryResultRow } from 'slonik';

export type JobStatusEnum =
  | 'created'
  | 'retry'
  | 'active'
  | 'completed'
  | 'expired'
  | 'cancelled'
  | 'failed';

export type DatabaseResultsQuery = {
  fields: readonly Field[];
  rowCount: number;
  rows: readonly QueryResultRow[];
};

export type DatabaseResults = {
  fields: string[];
  data: QueryResultRow[];
};
