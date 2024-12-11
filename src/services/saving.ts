import { query } from '../dal';
import { getSavingsTotals, patchSavingsTotals } from './savingsTotals';
import Saving from '../types/Saving';
import Totals from '../types/Totals';

export function findOneById (accountId:number, id:number):Promise<Saving> {
  return query({
    name: `saving-get-one-by-id-${id}-for-account-id-${accountId}`,
    text: 'SELECT * FROM "saving" WHERE "accountId"=$1 AND "id"=$2;',
    values: [accountId, id],
  })
    .then(({ rows }) => rows[0] as Saving);
}

export async function findAllByAccountIdForYear (id:number, year:number):Promise<Saving[]> {
  return query({
    name: `saving-get-all-by-account-id-${id}-for-year-${year}`,
    text: 'SELECT * FROM "saving" WHERE "accountId"=$1 AND "year"=$2;',
    values: [id, year],
  })
    .then(({ rows }) => rows as Saving[]);
}

export async function findAllByAccountIdForWeek (accountId:number, year:number, month:number, week:number):Promise<Saving[]> {
  return query({
    name: `saving-get-all-by-account-id-${accountId}-for-week-${year}-${month}-${week}`,
    text: 'SELECT * FROM saving WHERE "accountId"=$1 AND "year"=$2 AND "month"=$3 AND "week"=$4;',
    values: [accountId, year, month, week],
  })
    .then(({ rows }) => rows as Saving[]);
}

export async function findSavingsAmountsByAccountId (accountId:number):Promise<Saving[]> {
  return query({
    name: `saving-get-amounts-by-account-id-${accountId}`,
    text: 'SELECT "year","month","week","amount" FROM "saving" WHERE "accountId"=$1 ORDER BY "year";',
    values: [accountId],
  })
    .then(({ rows }) => rows as Saving[]);
}

export async function addSaving (accountId:number, saving:Saving):Promise<{ success:boolean; saving:Saving|undefined; totals:Totals; }> {
  const {
    name,
    dateString,
    year,
    month,
    week,
    amount,
  } = saving;

  const currentTotals:Totals = await getSavingsTotals(accountId);

  return query({
    name: 'saving-add',
    text: `INSERT INTO "saving" ("accountId","name","dateString","year","month","week","amount","createdAt","updatedAt")
           VALUES ($1,$2,$3,$4,$5,$6,$7,now(),now())
           RETURNING *;`,
    values: [accountId, name, dateString, year, month, week, amount],
  })
    .then(({ rows: [saving] }) => saving as Saving)
    .then(async (saving:Saving) => {
      if (!saving) {
        return {
          success: false,
          saving: undefined,
          totals: currentTotals,
        };
      }

      const patchedTotals:Totals = await patchSavingsTotals(
        accountId,
        currentTotals,
        year,
        month,
        week,
      );

      return {
        success: true,
        saving,
        totals: patchedTotals,
      };
    });
}

export async function updateSaving (accountId:number, saving:Saving):Promise<{ success:boolean; totals:Totals; }> {
  const {
    id,
    name,
    dateString,
    year,
    month,
    week,
    amount,
  } = saving;

  const currentTotals:Totals = await getSavingsTotals(accountId);
  const currentSaving:Saving = await findOneById(accountId, id);

  return query({
    name: 'saving-update',
    text: `UPDATE "saving"
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

      const patchedTotals:Totals = await patchSavingsTotals(
        accountId,
        currentTotals,
        year,
        month,
        week,
        currentSaving,
      );

      return {
        success: true,
        totals: patchedTotals,
      };
    });
}

export async function deleteSaving (accountId:number, id:number):Promise<{ success:boolean; totals:Totals; }> {
  const { year, month, week }:Saving = await findOneById(accountId, id);

  const currentTotals:Totals = await getSavingsTotals(accountId);

  return query({
    name: 'saving-delete',
    text: `DELETE FROM "saving"
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

      const patchedTotals:Totals = await patchSavingsTotals(
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
