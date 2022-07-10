import {
  createPool,
  Field,
  QueryResultRow,
  SlonikError,
  sql,
  DatabasePool,
} from 'slonik';
import { raw } from 'slonik-sql-tag-raw';
import { DatabaseResultsQuery, DatabaseResults } from './database.types';

export class Database {
  private url: string;
  private pool: DatabasePool;
  constructor(url: string) {
    this.url = url;
    this.pool = createPool(this.url);
  }

  private parseError(error: SlonikError | Error): string {
    console.error('lib/database', error);
    if (error instanceof SlonikError) {
      if (error.name === 'ConnectionError') {
        return `Error connecting to postgres database`;
      }
    }
    return error.message;
  }

  private processResults(results: DatabaseResultsQuery): DatabaseResults {
    const { rows, rowCount, fields } = results;
    const fieldNames = fields.map((field: Field) => field.name);
    if (rowCount === 0) {
      return { fields: fieldNames, data: [] };
    }
    const data = rows.map((row: QueryResultRow) => row);
    return { fields: fieldNames, data };
  }

  async getAllJobs(
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
      const results = await this.pool.connect(async (connection) => {
        return await connection.query(
          sql`SELECT * FROM pgboss.job WHERE ${sql.join(
            whereQuery,
            sql` AND `
          )} ORDER BY pgboss.job.createdon DESC offset ${offset} LIMIT ${limit};`
        );
      });
      return this.processResults(results);
    } catch (error) {
      if (error instanceof SlonikError) {
        const errorMessage = this.parseError(error);
        throw new Error(errorMessage);
      }
      throw error;
    }
  }

  async getAllArchivedJobs(
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
      const results = await this.pool.connect(async (connection) => {
        return await connection.query(
          sql`SELECT * FROM pgboss.archive WHERE ${sql.join(
            whereQuery,
            sql` AND `
          )} ORDER BY pgboss.archive.archivedon DESC offset ${offset} LIMIT ${limit};`
        );
      });
      return this.processResults(results);
    } catch (error) {
      if (error instanceof SlonikError) {
        const errorMessage = this.parseError(error);
        throw new Error(errorMessage);
      }
      throw error;
    }
  }

  async getAllSchedules(
    offset: number = 0,
    limit: number = 20
  ): Promise<DatabaseResults> {
    try {
      const results = await this.pool.connect(async (connection) => {
        return await connection.query(
          sql`SELECT * FROM pgboss.schedule ORDER BY pgboss.schedule.name ASC offset ${offset} LIMIT ${limit};`
        );
      });
      return this.processResults(results);
    } catch (error) {
      if (error instanceof SlonikError) {
        const errorMessage = this.parseError(error);
        throw new Error(errorMessage);
      }
      throw error;
    }
  }

  async getAllSubscription(
    offset: number = 0,
    limit: number = 20
  ): Promise<DatabaseResults> {
    try {
      const results = await this.pool.connect(async (connection) => {
        return await connection.query(
          sql`SELECT * FROM pgboss.subscription ORDER BY pgboss.subscription.name ASC offset ${offset} LIMIT ${limit};`
        );
      });
      return this.processResults(results);
    } catch (error) {
      if (error instanceof SlonikError) {
        const errorMessage = this.parseError(error);
        throw new Error(errorMessage);
      }
      throw error;
    }
  }
}
