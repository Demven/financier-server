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
    name: `account-get-one-by-email-${email}`,
    text: 'SELECT * FROM account WHERE "email"=$1;',
    values: [email],
  })
    .then(({ rows: [account] }) => account as Account);
}

export async function findAll ():Promise<Account[]> {
  return query({
    name: 'account-get-all',
    text: 'SELECT * FROM account',
  })
    .then(({ rows }) => rows as Account[])
    .then((accounts) => accounts.map(account => ({
      ...account,
      password: '***',
    })));
}

export async function createAccount (account:Account):Promise<Account> {
  const {
    firstName,
    lastName,
    email,
    password,
    language,
    currencyType,
    currencySymbol,
  } = account;

  return query({
    name: 'account-create',
    text: `INSERT INTO "account" ("firstName","lastName","email","password","language","currencyType","currencySymbol","createdAt","updatedAt")
           VALUES ($1,$2,$3,$4,$5,$6,$7,now(),now())
           RETURNING *;`,
    values: [firstName, lastName, email, password, language, currencyType, currencySymbol],
  }, { doNotLogValues: true })
    .then(({ rows: [account] }) => ({
      ...account,
      password: '***',
    }) as Account);
}

export async function confirmEmail (id:number, email:string):Promise<boolean> {
  return query({
    name: `account-confirm-email-${email}`,
    text: `UPDATE "account"
           SET "isConfirmed"=true,
               "updatedAt"=now()
           WHERE id=$1;`,
    values: [id],
  })
    .then(({ rowCount }) => rowCount === 1);
}

export async function resetPassword (accountId:number):Promise<boolean> {
  return query({
    name: `account-reset-password-for-account-${accountId}`,
    text: `UPDATE "account"
           SET "isReset"=true,
               "updatedAt"=now()
           WHERE id=$1;`,
    values: [accountId],
  })
    .then(({ rowCount }) => rowCount === 1);
}

export async function setUpNewPassword (accountId:number, password:string):Promise<boolean> {
  return query({
    name: `account-set-up-new-password-for-account-${accountId}`,
    text: `UPDATE "account"
           SET "isReset"=false,
               "password"=$2,
               "updatedAt"=now()
           WHERE id=$1;`,
    values: [accountId, password],
  })
    .then(({ rowCount }) => rowCount === 1);
}
