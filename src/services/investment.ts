import { query } from '../dal';
import Investment from '../types/Investment';

export async function findAllByAccountIdForYear (id:number, year:number):Promise<Investment[]> {
  return query({
    name: `investment-get-all-by-account-id-${id}-for-year-${year}`,
    text: 'SELECT * FROM investment WHERE "accountId"=$1 AND "year"=$2;',
    values: [id, year],
  })
    .then(({ rows }) => rows as Investment[]);
}
