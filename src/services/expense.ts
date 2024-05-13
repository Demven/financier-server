import { query } from '../dal';
import { getExpensesTotals, patchExpensesTotals } from './expensesTotals';
import Expense from '../types/Expense';
import Totals from '../types/Totals';

export function findById (id:number):Promise<Expense> {
  return query({
    name: `expense-get-all-by-id-${id}`,
    text: 'SELECT * FROM expense WHERE "id"=$1;',
    values: [id],
  })
    .then(({ rows }) => rows[0] as Expense);
}

export function findAllByAccountIdForYear (accountId:number, year:number):Promise<Expense[]> {
  return query({
    name: `expense-get-all-by-account-id-${accountId}-for-year-${year}`,
    text: 'SELECT * FROM expense WHERE "accountId"=$1 AND "year"=$2;',
    values: [accountId, year],
  })
    .then(({ rows }) => rows as Expense[]);
}

export function findAllByAccountIdForWeek (accountId:number, year:number, month:number, week:number):Promise<Expense[]> {
  return query({
    name: `expense-get-all-by-account-id-${accountId}-for-week-${year}-${month}-${week}`,
    text: 'SELECT * FROM expense WHERE "accountId"=$1 AND "year"=$2 AND "month"=$3 AND "week"=$4;',
    values: [accountId, year, month, week],
  })
    .then(({ rows }) => rows as Expense[]);
}

export function findExpensesAmountsByAccountId (accountId:number):Promise<Expense[]> {
  return query({
    name: `expense-get-amounts-by-account-id-${accountId}`,
    text: 'SELECT "year","month","week","amount" FROM "expense" WHERE "accountId"=$1 ORDER BY "year";',
    values: [accountId],
  })
    .then(({ rows }) => rows as Expense[]);
}

export async function addExpense (accountId:number, expense:Expense):Promise<{ success:boolean; expense:Expense|undefined; totals:Totals; }> {
  const {
    name,
    categoryId,
    dateString,
    year,
    month,
    week,
    amount,
  } = expense;

  const currentTotals:Totals = await getExpensesTotals(accountId);

  return query({
    name: 'expense-add',
    text: `INSERT INTO "expense" ("accountId","name","categoryId","dateString","year","month","week","amount","createdAt","updatedAt")
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,now(),now())
           RETURNING *;`,
    values: [accountId, name, categoryId, dateString, year, month, week, amount],
  })
    .then(({ rows: [expense] }) => expense as Expense)
    .then(async (expense:Expense) => {
      if (!expense) {
        return {
          success: false,
          expense: undefined,
          totals: currentTotals,
        };
      }

      const patchedTotals:Totals = await patchExpensesTotals(
        accountId,
        currentTotals,
        year,
        month,
        week,
      );

      return {
        success: true,
        expense,
        totals: patchedTotals,
      };
    });
}

export async function updateExpense (accountId:number, expense:Expense):Promise<{ success:boolean; totals:Totals; }> {
  const {
    id,
    name,
    categoryId,
    dateString,
    year,
    month,
    week,
    amount,
  } = expense;

  const currentTotals:Totals = await getExpensesTotals(accountId);
  const currentExpense:Expense = await findById(id);

  return query({
    name: 'expense-update',
    text: `UPDATE "expense"
           SET "accountId"=$2,
               "name"=$3,
               "categoryId"=$4,
               "dateString"=$5,
               "year"=$6,
               "month"=$7,
               "week"=$8,
               "amount"=$9,
               "updatedAt"=now()
             WHERE id=$1;`,
    values: [id, accountId, name, categoryId, dateString, year, month, week, amount],
  })
    .then(({ rowCount }) => rowCount === 1)
    .then(async (success:boolean) => {
      if (!success) {
        return {
          success: false,
          totals: currentTotals,
        };
      }

      const patchedTotals:Totals = await patchExpensesTotals(
        accountId,
        currentTotals,
        year,
        month,
        week,
        currentExpense,
      );

      return {
        success: true,
        totals: patchedTotals,
      };
    });
}

export async function deleteExpense (accountId:number, id:number):Promise<{ success:boolean; totals:Totals; }> {
  const { year, month, week }:Expense = await findById(id);

  const currentTotals:Totals = await getExpensesTotals(accountId);

  return query({
    name: 'expense-delete',
    text: `DELETE FROM "expense"
           WHERE id=$1;`,
    values: [id],
  })
    .then(({ rowCount }) => rowCount === 1)
    .then(async (success:boolean) => {
      if (!success) {
        return {
          success: false,
          totals: currentTotals,
        };
      }

      const patchedTotals:Totals = await patchExpensesTotals(
        accountId,
        currentTotals,
        year,
        month,
        week,
      );

      return {
        success: true,
        totals: patchedTotals,
      };
    });
}
