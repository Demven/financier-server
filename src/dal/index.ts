import { PoolClient, Pool, PoolConfig } from 'pg';

const {
  DATABASE_URL,
  POSTGRES_HOST,
  POSTGRES_USER,
  POSTGRES_DATABASE,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
} = process.env;

let pool:Pool;

const connectionConfig:PoolConfig = DATABASE_URL
  ? <PoolConfig>{
      connectionString: DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    }
  : <PoolConfig>{
      user: POSTGRES_USER,
      host: POSTGRES_HOST,
      database: POSTGRES_DATABASE,
      password: POSTGRES_PASSWORD,
      port: POSTGRES_PORT,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };

export async function connectToDatabase() {
  console.info(`Connect to the database: ${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DATABASE}...`);

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
