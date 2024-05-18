import { query } from '../dal';
import { findAllByAccountIdForWeek, findInvestmentsAmountsByAccountId } from './investment';
import { calculateTotalsForItems, patchTotalsForWeekItems } from '../utils/totals';
import Investment from '../types/Investment';
import Totals from '../types/Totals';
import Item from '../types/Item';

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
  }, { doNotLogValues: true })
    .then(({ rowCount }) => rowCount === 1);

  return totalsUpdated === true;
}

export async function calculateInvestmentsTotalsForAccount (accountId:number):Promise<Totals> {
  const allInvestments:Investment[] = await findInvestmentsAmountsByAccountId(accountId);

  return calculateTotalsForItems(allInvestments);
}

export async function patchInvestmentsTotals (
  accountId:number,
  currentTotals:Totals,
  year:number,
  month:number,
  week:number,
  investmentBefore?:Investment,
):Promise<Totals> {
  const updatedWeekInvestments:Investment[] = await findAllByAccountIdForWeek(accountId, year, month, week);

  let patchedTotals:Totals = await patchTotalsForWeekItems({
    currentTotals,
    items: updatedWeekInvestments as Item[],
    year,
    month,
    week,
  });
  const needToPatchTwoDifferentWeeks:boolean = !!investmentBefore && (
    year !== investmentBefore.year
    || month !== investmentBefore.month
    || week !== investmentBefore.week
  );

  if (needToPatchTwoDifferentWeeks && investmentBefore?.year && investmentBefore?.month && investmentBefore?.week) {
    const weekInvestments:Investment[] = await findAllByAccountIdForWeek(
      accountId,
      investmentBefore.year,
      investmentBefore.month,
      investmentBefore.week,
    );

    patchedTotals = patchTotalsForWeekItems({
      currentTotals: patchedTotals,
      items: weekInvestments as Item[],
      year: investmentBefore.year,
      month: investmentBefore.month,
      week: investmentBefore.week,
    });
  }

  saveInvestmentsTotals(accountId, patchedTotals);

  return patchedTotals;
}
