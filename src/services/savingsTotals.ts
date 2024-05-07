import { query } from '../dal';
import { findSavingsAmountsByAccountId } from './saving';
import { calculateTotalsForItems } from '../utils/totals';
import Totals from '../types/Totals';
import Saving from '../types/Saving';

export async function getSavingsTotals (accountId: number):Promise<Totals> {
  return query({
    name: `savings-totals-get-all-for-account-id-${accountId}`,
    text: 'SELECT * FROM "savingsTotals" WHERE "accountId"=$1',
    values: [accountId],
  })
    .then(({ rows }) => rows?.[0]?.totals as Totals);
}

export async function saveSavingsTotals (accountId: number, totals: Totals):Promise<boolean> {
  const totalsUpdated:boolean|void = await query({
    name: `savings-totals-save-for-account-id-${accountId}`,
    text: `UPDATE "savingsTotals"
           SET "totals"=$2::jsonb,
               "updatedAt"=now()
           WHERE "accountId"=$1;`,
    values: [accountId, totals],
  })
    .then(({ rowCount }) => rowCount === 1);

  return totalsUpdated === true;
}

export async function calculateSavingsTotalsForAccount (accountId:number):Promise<Totals> {
  const allSavings:Saving[] = await findSavingsAmountsByAccountId(accountId);

  return calculateTotalsForItems(allSavings);
}


