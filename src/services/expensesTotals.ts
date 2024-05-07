import { query } from '../dal';
import { findExpensesAmountsByAccountId } from './expense';
import { calculateTotalsForItems } from '../utils/totals';
import Totals from '../types/Totals';
import Expense from '../types/Expense';

export async function getExpensesTotals (accountId: number):Promise<Totals> {
  return query({
    name: `expenses-totals-get-all-for-account-id-${accountId}`,
    text: 'SELECT * FROM "expensesTotals" WHERE "accountId"=$1',
    values: [accountId],
  })
    .then(({ rows }) => rows?.[0]?.totals as Totals);
}

export async function saveExpensesTotals (accountId: number, totals: Totals):Promise<boolean> {
  const totalsUpdated:boolean|void = await query({
    name: `expenses-totals-save-for-account-id-${accountId}`,
    text: `UPDATE "expensesTotals"
           SET "totals"=$2::jsonb,
               "updatedAt"=now()
           WHERE "accountId"=$1;`,
    values: [accountId, totals],
  })
    .then(({ rowCount }) => rowCount === 1);

  return totalsUpdated === true;
}

export async function calculateExpensesTotalsForAccount (accountId:number):Promise<Totals> {
  const allExpenses:Expense[] = await findExpensesAmountsByAccountId(accountId);

  return calculateTotalsForItems(allExpenses);
}
