import { query } from '../dal';
import Account from '../types/Account';

export async function findByEmailAndPassword (email:string, password:string):Promise<Account> {
  return query({
    name: 'account-get-one-by-email-and-password',
    text: 'SELECT * FROM account WHERE "email"=$1 AND "password"=$2;',
    values: [email, password],
  }, { doNotLogValues: true })
    .then(({ rows: [account] }) => account as Account);
}

export async function findById (id:number):Promise<Account> {
  return query({
    name: 'account-get-one-by-id',
    text: 'SELECT * FROM account WHERE "id"=$1;',
    values: [id],
  })
    .then(({ rows: [account] }) => account as Account);
}

export async function findByEmail (email:string):Promise<Account> {
  return query({
    name: 'account-get-one-by-email-and-password',
    text: 'SELECT * FROM account WHERE "email"=$1;',
    values: [email],
  })
    .then(({ rows: [account] }) => account as Account);
}
