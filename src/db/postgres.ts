import { Pool, QueryResult, PoolClient} from 'pg';
import { logger } from '../utils/logger';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// const dbClient = new Client({
//   connectionString: process.env.DATABASE_URL,
// });

type Handler = (tx: PoolClient) => Promise<QueryResult>;

export const getConnection = async (handler: Handler) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await handler(client);
    await client.query('COMMIT');

    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    logger.error(e);
    throw e;
  } finally {
    client.release();
  }
};

export const queryAsync = (queryString: string, values: any[]) =>
  getConnection((client: PoolClient) => client.query(queryString, values));

export const queryRowsAsync = (queryString: string, values: any[]) =>
  queryAsync(queryString, values).then((res: QueryResult) => res.rows);

pool.on('error', (err) => {
  logger.error('An idle client has experienced an error', err.stack);
});
