import Expense from './Expense';
import Saving from './Saving';
import Investment from './Investment';
import Income from './Income';

type Week = Array<Expense|Saving|Investment|Income>;

interface Month {
  1?: Week|undefined,
  2?: Week|undefined,
  3?: Week|undefined,
  4?: Week|undefined,
}

export default interface GroupedItems {
  1?: Month|undefined,
  2?: Month|undefined,
  3?: Month|undefined,
  4?: Month|undefined,
  5?: Month|undefined,
  6?: Month|undefined,
  7?: Month|undefined,
  8?: Month|undefined,
  9?: Month|undefined,
  10?: Month|undefined,
  11?: Month|undefined,
  12?: Month|undefined,
}
