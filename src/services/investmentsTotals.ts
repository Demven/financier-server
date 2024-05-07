import { query } from '../dal';
import { findInvestmentsAmountsByAccountId } from './investment';
import { calculateTotalsForItems } from '../utils/totals';
import Totals from '../types/Totals';
import Investment from '../types/Investment';

export async function getInvestmentsTotals (accountId:number):Promise<Totals> {
  return query({
    name: `investments-totals-get-all-for-account-id-${accountId}`,
    text: 'SELECT * FROM "investmentsTotals" WHERE "accountId"=$1',
    values: [accountId],
  })
    .then(({ rows }) => rows?.[0]?.totals as Totals);
}

export async function saveInvestmentsTotals (accountId:number, totals:Totals):Promise<boolean> {
  const totalsUpdated:boolean|void = await query({
    name: `investments-totals-save-for-account-id-${accountId}`,
    text: `UPDATE "investmentsTotals"
           SET "totals"=$2::jsonb,
               "updatedAt"=now()
           WHERE "accountId"=$1;`,
    values: [accountId, totals],
  })
    .then(({ rowCount }) => rowCount === 1);

  return totalsUpdated === true;
}

export async function calculateInvestmentsTotalsForAccount (accountId:number):Promise<Totals> {
  const allInvestments:Investment[] = await findInvestmentsAmountsByAccountId(accountId);

  return calculateTotalsForItems(allInvestments);
}
