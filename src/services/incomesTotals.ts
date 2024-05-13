import { query } from '../dal';
import { findAllByAccountIdForWeek, findIncomesAmountsByAccountId } from './income';
import { calculateTotalsForItems, patchTotalsForWeekItems } from '../utils/totals';
import Totals from '../types/Totals';
import Income from '../types/Income';
import Item from '../types/Item';

export async function getIncomesTotals (accountId: number):Promise<Totals> {
  return query({
    name: `incomes-totals-get-all-for-account-id-${accountId}`,
    text: 'SELECT * FROM "incomesTotals" WHERE "accountId"=$1',
    values: [accountId],
  })
    .then(({ rows }) => rows?.[0]?.totals as Totals);
}

export async function saveIncomesTotals (accountId:number, totals:Totals):Promise<boolean> {
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

export async function patchIncomesTotals (
  accountId:number,
  currentTotals:Totals,
  year:number,
  month:number,
  week:number,
  incomeBefore?:Income,
):Promise<Totals> {
  const updatedWeekIncomes:Income[] = await findAllByAccountIdForWeek(
    accountId,
    year,
    month,
    week,
  );

  let patchedTotals:Totals = await patchTotalsForWeekItems({
    currentTotals,
    items: updatedWeekIncomes as Item[],
    year,
    month,
    week,
  });

  const needToPatchTwoDifferentWeeks:boolean = !!incomeBefore && (
    year !== incomeBefore.year
    || month !== incomeBefore.month
    || week !== incomeBefore.week
  );

  if (needToPatchTwoDifferentWeeks && incomeBefore?.year && incomeBefore?.month && incomeBefore?.week) {
    const weekIncomes:Income[] = await findAllByAccountIdForWeek(
      accountId,
      incomeBefore.year,
      incomeBefore.month,
      incomeBefore.week,
    );

    patchedTotals = patchTotalsForWeekItems({
      currentTotals: patchedTotals,
      items: weekIncomes as Item[],
      year: incomeBefore.year,
      month: incomeBefore.month,
      week: incomeBefore.week,
    });
  }

  saveIncomesTotals(accountId, patchedTotals);

  return patchedTotals;
}
