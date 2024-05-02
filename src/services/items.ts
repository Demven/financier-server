import Item from '../types/Item';
import GroupedItems from '../types/GroupedItems';

export function groupItemsByYearMonthWeek (items:Item[]):GroupedItems {
  let itemsGroupedByYearMonthWeek:any = {};

  items.forEach((item:Item) => {
    const { year, month, week } = item;

    itemsGroupedByYearMonthWeek[year] = itemsGroupedByYearMonthWeek[year]
      ? {
        ...itemsGroupedByYearMonthWeek[year],
        [month]: itemsGroupedByYearMonthWeek[year][month]
          ? {
            ...itemsGroupedByYearMonthWeek[year][month],
            [week]: itemsGroupedByYearMonthWeek[year][month][week]
              ? [
                ...itemsGroupedByYearMonthWeek[year][month][week],
                item,
              ]
              : [item],
          }
          : {
            [week]: [item],
          },
      }
      : {
        [month]: {
          [week]: [item],
        },
      }
  });

  return <GroupedItems>itemsGroupedByYearMonthWeek;
}
