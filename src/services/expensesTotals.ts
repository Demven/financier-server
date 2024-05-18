import { query } from '../dal';
import { findAllByAccountIdForWeek, findExpensesAmountsByAccountId } from './expense';
import { calculateTotalsForItems, patchTotalsForWeekItems } from '../utils/totals';
import Totals from '../types/Totals';
import Expense from '../types/Expense';
import Item from '../types/Item';

export async function getExpensesTotals (accountId:number):Promise<Totals> {
  return query({
    name: `expenses-totals-get-all-for-account-id-${accountId}`,
    text: 'SELECT * FROM "expensesTotals" WHERE "accountId"=$1',
    values: [accountId],
  })
    .then(({ rows }) => rows?.[0]?.totals as Totals);
}

export async function saveExpensesTotals (accountId:number, totals:Totals):Promise<boolean> {
  const totalsUpdated:boolean|void = await query({
    name: `expenses-totals-save-for-account-id-${accountId}`,
    text: `UPDATE "expensesTotals"
           SET "totals"=$2::jsonb,
               "updatedAt"=now()
           WHERE "accountId"=$1;`,
    values: [accountId, totals],
  }, { doNotLogValues: true })
    .then(({ rowCount }) => rowCount === 1);

  return totalsUpdated === true;
}

export async function calculateExpensesTotalsForAccount (accountId:number):Promise<Totals> {
  const allExpenses:Expense[] = await findExpensesAmountsByAccountId(accountId);

  return calculateTotalsForItems(allExpenses);
}

export async function patchExpensesTotals (
  accountId:number,
  currentTotals:Totals,
  year:number,
  month:number,
  week:number,
  expenseBefore?:Expense,
):Promise<Totals> {
  const updatedWeekExpenses:Expense[] = await findAllByAccountIdForWeek(accountId, year, month, week);

  let patchedTotals:Totals = patchTotalsForWeekItems({
    currentTotals,
    items: updatedWeekExpenses as Item[],
    year,
    month,
    week,
  })

  const needToPatchTwoDifferentWeeks:boolean = !!expenseBefore && (
    year !== expenseBefore.year
    || month !== expenseBefore.month
    || week !== expenseBefore.week
  );

  if (needToPatchTwoDifferentWeeks && expenseBefore?.year && expenseBefore?.month && expenseBefore?.week) {
    const weekExpenses:Expense[] = await findAllByAccountIdForWeek(
      accountId,
      expenseBefore.year,
      expenseBefore.month,
      expenseBefore.week,
    );

    patchedTotals = patchTotalsForWeekItems({
      currentTotals: patchedTotals,
      items: weekExpenses as Item[],
      year: expenseBefore.year,
      month: expenseBefore.month,
      week: expenseBefore.week,
    });
  }

  saveExpensesTotals(accountId, patchedTotals);

  return patchedTotals;
}
