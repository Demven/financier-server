import { query } from '../dal';
import Income from '../types/Income';

export async function findAllByAccountIdForYear (id:number, year:number):Promise<Income[]> {
  return query({
    name: `income-get-all-by-account-id-${id}-for-year-${year}`,
    text: 'SELECT * FROM income WHERE "accountId"=$1 AND "year"=$2;',
    values: [id, year],
  })
    .then(({ rows }) => rows as Income[]);
}
