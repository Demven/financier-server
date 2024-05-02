import { query } from '../dal';
import Expense from '../types/Expense';

export async function findAllByAccountIdForYear (id:number, year:number):Promise<Expense[]> {
  return query({
    name: `expense-get-all-by-account-id-${id}-for-year-${year}`,
    text: 'SELECT * FROM expense WHERE "accountId"=$1 AND "year"=$2;',
    values: [id, year],
  })
    .then(({ rows }) => rows as Expense[]);
}
