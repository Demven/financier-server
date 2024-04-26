import { PoolClient, Pool, PoolConfig } from 'pg';

const {
  POSTGRES_HOST,
  POSTGRES_USER,
  POSTGRES_DB,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
} = process.env;

let pool:Pool;

export async function connectToDatabase() {
  console.info(`Connect to the database: ${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}...`);

  pool = new Pool(<PoolConfig>{
    user: POSTGRES_USER,
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    password: POSTGRES_PASSWORD,
    port: POSTGRES_PORT,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  await pool.connect();

  console.info('Connected.');
}

export async function disconnect () {
  return await pool.end();
}

export async function query (sql:string):Promise<any> {
  console.info('Query DB: ', sql);

  const client:PoolClient = await pool.connect();
  const result = await client.query(sql);

  client.release();

  return result;
}
