import { query } from '../dal';
import { findAllByAccountIdForWeek, findSavingsAmountsByAccountId } from './saving';
import { calculateTotalsForItems, patchTotalsForWeekItems } from '../utils/totals';
import Saving from '../types/Saving';
import Totals from '../types/Totals';
import Item from '../types/Item';

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
  }, { doNotLogValues: true })
    .then(({ rowCount }) => rowCount === 1);

  return totalsUpdated === true;
}

export async function calculateSavingsTotalsForAccount (accountId:number):Promise<Totals> {
  const allSavings:Saving[] = await findSavingsAmountsByAccountId(accountId);

  return calculateTotalsForItems(allSavings);
}

export async function patchSavingsTotals (
  accountId:number,
  currentTotals:Totals,
  year:number,
  month:number,
  week:number,
  savingBefore?:Saving,
):Promise<Totals> {
  const updatedWeekSavings:Saving[] = await findAllByAccountIdForWeek(accountId, year, month, week);

  let patchedTotals:Totals = await patchTotalsForWeekItems({
    currentTotals,
    items: updatedWeekSavings as Item[],
    year,
    month,
    week,
  });

  const needToPatchTwoDifferentWeeks:boolean = !!savingBefore && (
    year !== savingBefore.year
    || month !== savingBefore.month
    || week !== savingBefore.week
  );

  if (needToPatchTwoDifferentWeeks && savingBefore?.year && savingBefore?.month && savingBefore?.week) {
    const weekSavings:Saving[] = await findAllByAccountIdForWeek(
      accountId,
      savingBefore.year,
      savingBefore.month,
      savingBefore.week,
    );

    patchedTotals = patchTotalsForWeekItems({
      currentTotals: patchedTotals,
      items: weekSavings as Item[],
      year: savingBefore.year,
      month: savingBefore.month,
      week: savingBefore.week,
    });
  }

  saveSavingsTotals(accountId, patchedTotals);

  return patchedTotals;
}
