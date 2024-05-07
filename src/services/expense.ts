import { query } from '../dal';
import Expense from '../types/Expense';

export async function findAllByAccountIdForYear (accountId:number, year:number):Promise<Expense[]> {
  return query({
    name: `expense-get-all-by-account-id-${accountId}-for-year-${year}`,
    text: 'SELECT * FROM expense WHERE "accountId"=$1 AND "year"=$2;',
    values: [accountId, year],
  })
    .then(({ rows }) => rows as Expense[]);
}

export async function findExpensesAmountsByAccountId (accountId:number):Promise<Expense[]> {
  return query({
    name: `expense-get-amounts-by-account-id-${accountId}`,
    text: 'SELECT "year","month","week","amount" FROM "expense" WHERE "accountId"=$1 ORDER BY "year";',
    values: [accountId],
  })
    .then(({ rows }) => rows as Expense[]);
}
