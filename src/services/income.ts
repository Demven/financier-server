import { query } from '../dal';
import { getIncomesTotals, patchIncomesTotals } from './incomesTotals';
import Income from '../types/Income';
import Totals from '../types/Totals';

export function findOneById (accountId:number, id:number):Promise<Income> {
  return query({
    name: `income-get-one-by-id-${id}-for-account-id-${accountId}`,
    text: 'SELECT * FROM "income" WHERE "accountId"=$1 AND "id"=$2;',
    values: [accountId, id],
  })
    .then(({ rows }) => rows[0] as Income);
}

export async function findAllByAccountIdForYear (accountId:number, year:number):Promise<Income[]> {
  return query({
    name: `income-get-all-by-account-id-${accountId}-for-year-${year}`,
    text: 'SELECT * FROM "income" WHERE "accountId"=$1 AND "year"=$2;',
    values: [accountId, year],
  })
    .then(({ rows }) => rows as Income[]);
}

export async function findAllByAccountIdForWeek (accountId:number, year:number, month:number, week:number):Promise<Income[]> {
  return query({
    name: `income-get-all-by-account-id-${accountId}-for-week-${year}-${month}-${week}`,
    text: 'SELECT * FROM income WHERE "accountId"=$1 AND "year"=$2 AND "month"=$3 AND "week"=$4;',
    values: [accountId, year, month, week],
  })
    .then(({ rows }) => rows as Income[]);
}

export async function findIncomesAmountsByAccountId (accountId:number):Promise<Income[]> {
  return query({
    name: `income-get-amounts-by-account-id-${accountId}`,
    text: 'SELECT "year","month","week","amount" FROM "income" WHERE "accountId"=$1 ORDER BY "year";',
    values: [accountId],
  })
    .then(({ rows }) => rows as Income[]);
}

export async function addIncome (accountId:number, income:Income):Promise<{ success:boolean; income:Income|undefined; totals:Totals; }> {
  const {
    name,
    dateString,
    year,
    month,
    week,
    amount,
  } = income;

  const currentTotals:Totals = await getIncomesTotals(accountId);

  return query({
    name: 'income-add',
    text: `INSERT INTO "income" ("accountId","name","dateString","year","month","week","amount","createdAt","updatedAt")
           VALUES ($1,$2,$3,$4,$5,$6,$7,now(),now())
           RETURNING *;`,
    values: [accountId, name, dateString, year, month, week, amount],
  })
    .then(({ rows: [income] }) => income as Income)
    .then(async (income:Income) => {
      if (!income) {
        return {
          success: false,
          income: undefined,
          totals: currentTotals,
        };
      }

      const patchedTotals:Totals = await patchIncomesTotals(
        accountId,
        currentTotals,
        year,
        month,
        week,
      );

      return {
        success: true,
        income,
        totals: patchedTotals,
      };
    });
}

export async function updateIncome (accountId:number, income:Income):Promise<{ success:boolean; totals:Totals; }> {
  const {
    id,
    name,
    dateString,
    year,
    month,
    week,
    amount,
  } = income;

  const currentTotals:Totals = await getIncomesTotals(accountId);
  const currentIncome:Income = await findOneById(accountId, id);

  return query({
    name: 'income-update',
    text: `UPDATE "income"
           SET "accountId"=$2,
               "name"=$3,
               "dateString"=$4,
               "year"=$5,
               "month"=$6,
               "week"=$7,
               "amount"=$8,
               "updatedAt"=now()
           WHERE id=$1;`,
    values: [id, accountId, name, dateString, year, month, week, amount],
  })
    .then(({ rowCount }) => rowCount === 1)
    .then(async (success:boolean) => {
      if (!success) {
        return {
          success: false,
          totals: currentTotals,
        };
      }

      const patchedTotals:Totals = await patchIncomesTotals(
        accountId,
        currentTotals,
        year,
        month,
        week,
        currentIncome,
      );

      return {
        success: true,
        totals: patchedTotals,
      };
    });
}

export async function deleteIncome (accountId:number, id:number):Promise<{ success:boolean; totals:Totals; }> {
  const { year, month, week }:Income = await findOneById(accountId, id);

  const currentTotals:Totals = await getIncomesTotals(accountId);

  return query({
    name: 'income-delete',
    text: `DELETE FROM "income"
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

      const patchedTotals:Totals = await patchIncomesTotals(
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
