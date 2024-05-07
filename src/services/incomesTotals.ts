import { query } from '../dal';
import { findIncomesAmountsByAccountId } from './income';
import { calculateTotalsForItems } from '../utils/totals';
import Totals from '../types/Totals';
import Income from '../types/Income';

export async function getIncomesTotals (accountId: number):Promise<Totals> {
  return query({
    name: `incomes-totals-get-all-for-account-id-${accountId}`,
    text: 'SELECT * FROM "incomesTotals" WHERE "accountId"=$1',
    values: [accountId],
  })
    .then(({ rows }) => rows?.[0]?.totals as Totals);
}

export async function saveIncomesTotals (accountId: number, totals: Totals):Promise<boolean> {
  const totalsUpdated:boolean|void = await query({
    name: `incomes-totals-save-for-account-id-${accountId}`,
    text: `UPDATE "incomesTotals"
           SET "totals"=$2::jsonb,
               "updatedAt"=now()
           WHERE "accountId"=$1;`,
    values: [accountId, totals],
  })
    .then(({ rowCount }) => rowCount === 1);

  return totalsUpdated === true;
}

export async function calculateIncomesTotalsForAccount (accountId:number):Promise<Totals> {
  const allIncomes:Income[] = await findIncomesAmountsByAccountId(accountId);

  return calculateTotalsForItems(allIncomes);
}


