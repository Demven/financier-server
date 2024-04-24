import { Client, ClientConfig } from 'pg';

const {
  POSTGRES_HOST,
  POSTGRES_USER,
  POSTGRES_DB,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
} = process.env;

let client:Client;

export async function connectToDatabase():Promise<Client> {
  console.info(`Connect to the database: ${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}...`);

  client = new Client(<ClientConfig>{
    user: POSTGRES_USER,
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    password: POSTGRES_PASSWORD,
    port: POSTGRES_PORT,
  });

  await client.connect();

  console.info('Connected.');

  return client;
}

export async function disconnect () {
  return await client.end();
}

export default function getConnection ():Client {
  return client;
}
