import { createPool, SlonikError, sql } from 'slonik';
import { raw } from 'slonik-sql-tag-raw';
import {
  JobStatusEnum,
  DatabaseResultsQuery,
  DatabaseResults,
} from './database.types';

const PGBOSS_DATABASE_URL =
  process.env.PGBOSS_DATABASE_URL ||
  'postgres://postgres:password@localhost:5432/outlet_pgboss';

const pool = createPool(PGBOSS_DATABASE_URL);

function parseError(error: SlonikError): string {
  console.error('lib/database', error);
  if (error instanceof SlonikError) {
    if (error.name === 'ConnectionError') {
      return `Error connecting to postgres database`;
    }
  }
  return error.message;
}

function processResults(results: DatabaseResultsQuery): DatabaseResults {
  const { rows, rowCount, fields } = results;
  const fieldNames = fields.map((field) => field.name);
  if (rowCount === 0) {
    return { fields: fieldNames, data: [] };
  }
  const data = rows.map((row) => row);
  return { fields: fieldNames, data };
}

export async function getAllJobs(
  offset: number,
  limit: number,
  state: string = 'all',
  search?: string
): Promise<DatabaseResults> {
  try {
    let whereQuery = [sql`name not ilike '__pgboss__%'`];
    if (state !== 'all') {
      whereQuery.push(sql`pgboss.job.state = ${state}`);
    }
    if (search !== '') {
      whereQuery.push(raw(`name ilike '%${search}%'`));
    }
    const results = await pool.connect(async (connection) => {
      return await connection.query(
        sql`SELECT * FROM pgboss.job WHERE ${sql.join(
          whereQuery,
          sql` AND `
        )} ORDER BY pgboss.job.createdon DESC offset ${offset} LIMIT ${limit};`
      );
    });
    return processResults(results);
  } catch (error) {
    const errorMessage = parseError(error);
    throw new Error(errorMessage);
  }
}

export async function getAllArchivedJobs(
  offset: number,
  limit: number,
  state: string = 'all',
  search?: string
): Promise<DatabaseResults> {
  try {
    let whereQuery = [sql`name not ilike '__pgboss__%'`];
    if (state !== 'all') {
      whereQuery.push(sql`pgboss.archive.state = ${state}`);
    }
    if (search !== '') {
      whereQuery.push(raw(`name ilike '%${search}%'`));
    }
    const results = await pool.connect(async (connection) => {
      return await connection.query(
        sql`SELECT * FROM pgboss.archive WHERE ${sql.join(
          whereQuery,
          sql` AND `
        )} ORDER BY pgboss.archive.archivedon DESC offset ${offset} LIMIT ${limit};`
      );
    });
    return processResults(results);
  } catch (error) {
    const errorMessage = parseError(error);
    throw new Error(errorMessage);
  }
}

export async function getAllSchedules(
  offset: number = 0,
  limit: number = 20
): Promise<DatabaseResults> {
  try {
    const results = await pool.connect(async (connection) => {
      return await connection.query(
        sql`SELECT * FROM pgboss.schedule ORDER BY pgboss.schedule.name ASC offset ${offset} LIMIT ${limit};`
      );
    });
    return processResults(results);
  } catch (error) {
    const errorMessage = parseError(error);
    throw new Error(errorMessage);
  }
}

export async function getAllSubscription(
  offset: number = 0,
  limit: number = 20
): Promise<DatabaseResults> {
  try {
    const results = await pool.connect(async (connection) => {
      return await connection.query(
        sql`SELECT * FROM pgboss.subscription ORDER BY pgboss.subscription.name ASC offset ${offset} LIMIT ${limit};`
      );
    });
    return processResults(results);
  } catch (error) {
    const errorMessage = parseError(error);
    throw new Error(errorMessage);
  }
}
