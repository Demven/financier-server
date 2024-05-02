import Expense from '../types/Expense';
import GroupedItems from '../types/GroupedItems';

export function groupItemsByYearMonthWeek (expenses:Expense[]):GroupedItems {
  let expensesGroupedByYearMonthWeek:any = {};

  expenses.forEach((expense:Expense) => {
    const { year, month, week } = expense;

    expensesGroupedByYearMonthWeek[year] = expensesGroupedByYearMonthWeek[year]
      ? {
        ...expensesGroupedByYearMonthWeek[year],
        [month]: expensesGroupedByYearMonthWeek[year][month]
          ? {
            ...expensesGroupedByYearMonthWeek[year][month],
            [week]: expensesGroupedByYearMonthWeek[year][month][week]
              ? [
                ...expensesGroupedByYearMonthWeek[year][month][week],
                expense,
              ]
              : [expense],
          }
          : {
            [week]: [expense],
          },
      }
      : {
        [month]: {
          [week]: [expense],
        },
      }
  });

  return <GroupedItems>expensesGroupedByYearMonthWeek;
}
