import { query } from '../dal';
import { getInvestmentsTotals, patchInvestmentsTotals } from './investmentsTotals';
import Investment from '../types/Investment';
import Totals from '../types/Totals';

export function findOneById (accountId:number, id:number):Promise<Investment> {
  return query({
    name: `investment-get-one-by-id-${id}-for-account-id-${accountId}`,
    text: 'SELECT * FROM "investment" WHERE "accountId"=$1 AND "id"=$2;',
    values: [accountId, id],
  })
    .then(({ rows }) => rows[0] as Investment);
}

export async function findAllByAccountIdForYear (id:number, year:number):Promise<Investment[]> {
  return query({
    name: `investment-get-all-by-account-id-${id}-for-year-${year}`,
    text: 'SELECT * FROM "investment" WHERE "accountId"=$1 AND "year"=$2;',
    values: [id, year],
  })
    .then(({ rows }) => rows as Investment[]);
}

export async function findAllByAccountIdForWeek (accountId:number, year:number, month:number, week:number):Promise<Investment[]> {
  return query({
    name: `investment-get-all-by-account-id-${accountId}-for-week-${year}-${month}-${week}`,
    text: 'SELECT * FROM "investment" WHERE "accountId"=$1 AND "year"=$2 AND "month"=$3 AND "week"=$4;',
    values: [accountId, year, month, week],
  })
    .then(({ rows }) => rows as Investment[]);
}

export async function findInvestmentsAmountsByAccountId (accountId:number):Promise<Investment[]> {
  return query({
    name: `investment-get-amounts-by-account-id-${accountId}`,
    text: 'SELECT "year","month","week","shares","pricePerShare" FROM "investment" WHERE "accountId"=$1 ORDER BY "year";',
    values: [accountId],
  })
    .then(({ rows }) => rows as Investment[]);
}

export async function addInvestment (accountId:number, investment:Investment):Promise<{ success:boolean; investment:Investment|undefined; totals:Totals; }> {
  const {
    name,
    dateString,
    year,
    month,
    week,
    ticker,
    shares,
    pricePerShare,
  } = investment;

  const currentTotals:Totals = await getInvestmentsTotals(accountId);

  return query({
    name: 'investment-add',
    text: `INSERT INTO "investment" ("accountId","name","dateString","year","month","week","ticker","shares","pricePerShare","createdAt","updatedAt")
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,now(),now())
           RETURNING *;`,
    values: [accountId, name, dateString, year, month, week, ticker, shares, pricePerShare],
  })
    .then(({ rows: [investment] }) => investment as Investment)
    .then(async (investment:Investment) => {
      if (!investment) {
        return {
          success: false,
          investment: undefined,
          totals: currentTotals,
        };
      }

      const patchedTotals:Totals = await patchInvestmentsTotals(
        accountId,
        currentTotals,
        year,
        month,
        week,
      );

      return {
        success: true,
        investment,
        totals: patchedTotals,
      };
    });
}

export async function updateInvestment (accountId:number, investment:Investment):Promise<{ success:boolean; totals:Totals; }> {
  const {
    id,
    name,
    dateString,
    year,
    month,
    week,
    ticker,
    shares,
    pricePerShare,
  } = investment;

  const currentTotals:Totals = await getInvestmentsTotals(accountId);
  const currentInvestment:Investment = await findOneById(accountId, id);

  return query({
    name: 'investment-update',
    text: `UPDATE "investment"
           SET "accountId"=$2,
               "name"=$3,
               "dateString"=$4,
               "year"=$5,
               "month"=$6,
               "week"=$7,
               "ticker"=$8,
               "shares"=$9,
               "pricePerShare"=$10,
               "updatedAt"=now()
           WHERE id=$1;`,
    values: [id, accountId, name, dateString, year, month, week, ticker, shares, pricePerShare],
  })
    .then(({ rowCount }) => rowCount === 1)
    .then(async (success:boolean) => {
      if (!success) {
        return {
          success: false,
          totals: currentTotals,
        };
      }

      const patchedTotals:Totals = await patchInvestmentsTotals(
        accountId,
        currentTotals,
        year,
        month,
        week,
        currentInvestment,
      );

      return {
        success: true,
        totals: patchedTotals,
      };
    });
}

export async function deleteInvestment (accountId:number, id:number):Promise<{ success:boolean; totals:Totals; }> {
  const { year, month, week }:Investment = await findOneById(accountId, id);

  const currentTotals:Totals = await getInvestmentsTotals(accountId);

  return query({
    name: `investment-delete-for-account-${accountId}`,
    text: `DELETE FROM "investment"
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

      const patchedTotals:Totals = await patchInvestmentsTotals(
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

export function deleteAllInvestmentsForAccount (accountId:number):Promise<number> {
  return query({
    name: `investment-delete-all-for-account-${accountId}`,
    text: `DELETE FROM "investment"
           WHERE "accountId"=$1;`,
    values: [accountId],
  })
    .then(({ rowCount }) => rowCount);
}
