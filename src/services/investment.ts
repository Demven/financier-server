import { query } from '../dal';
import Investment from '../types/Investment';

export async function findAllByAccountIdForYear (id:number, year:number):Promise<Investment[]> {
  return query({
    name: `investment-get-all-by-account-id-${id}-for-year-${year}`,
    text: 'SELECT * FROM "investment" WHERE "accountId"=$1 AND "year"=$2;',
    values: [id, year],
  })
    .then(({ rows }) => rows as Investment[]);
}

export async function findInvestmentsAmountsByAccountId (accountId:number):Promise<Investment[]> {
  return query({
    name: `investment-get-amounts-by-account-id-${accountId}`,
    text: 'SELECT "year","month","week","shares","pricePerShare" FROM "investment" WHERE "accountId"=$1 ORDER BY "year";',
    values: [accountId],
  })
    .then(({ rows }) => rows as Investment[]);
}
