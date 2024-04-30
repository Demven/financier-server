import { PoolClient, Pool, PoolConfig } from 'pg';

const {
  NODE_ENV,
  POSTGRES_HOST,
  POSTGRES_USER,
  POSTGRES_DB,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
} = process.env;

let pool:Pool;

const connectionConfig:PoolConfig = NODE_ENV === 'development'
  ? <PoolConfig>{
    user: POSTGRES_USER,
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    password: POSTGRES_PASSWORD,
    port: POSTGRES_PORT,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  }
  : <PoolConfig>{
    connectionString: process.env.POSTGRES_URL
  };

export async function connectToDatabase() {
  console.info(`Connect to the database: ${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}...`);

  pool = new Pool(connectionConfig);

  await pool.connect();

  console.info('Connected.');
}

export async function disconnect () {
  return await pool.end();
}

export async function query (
  { name, text, values = [] }:{ name:string; text: string; values?:any[] },
  { doNotLogValues }:{ doNotLogValues: boolean; } = { doNotLogValues: false },
):Promise<any> {
  console.info('Query', `"${name}"`, text, doNotLogValues ? '' : values);

  const client:PoolClient = await pool.connect();
  const result = await client.query({
    name,
    text,
    values,
  });

  client.release();

  return result;
}
