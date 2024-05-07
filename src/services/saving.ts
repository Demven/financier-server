import { query } from '../dal';
import Saving from '../types/Saving';

export async function findAllByAccountIdForYear (id:number, year:number):Promise<Saving[]> {
  return query({
    name: `saving-get-all-by-account-id-${id}-for-year-${year}`,
    text: 'SELECT * FROM "saving" WHERE "accountId"=$1 AND "year"=$2;',
    values: [id, year],
  })
    .then(({ rows }) => rows as Saving[]);
}

export async function findSavingsAmountsByAccountId (accountId:number):Promise<Saving[]> {
  return query({
    name: `saving-get-amounts-by-account-id-${accountId}`,
    text: 'SELECT "year","month","week","amount" FROM "saving" WHERE "accountId"=$1 ORDER BY "year";',
    values: [accountId],
  })
    .then(({ rows }) => rows as Saving[]);
}
