import { formatNumber, getAmount } from './amount';
import Totals, { MonthTotals, YearTotals } from '../types/Totals';
import Item from '../types/Item';

export function patchTotalsForWeekItems ({
  currentTotals,
  items,
  year,
  month,
  week,
}:{ currentTotals:any, items:Item[], year:number, month:number, week:number }
):Totals {
  const previousWeekValue: number = currentTotals?.[year]?.[month]?.[week] || 0;
  const newWeekTotal = items.reduce((total, item) => total + getAmount(item), 0);
  const weekDifference = newWeekTotal - previousWeekValue;

  const patchedTotals: Totals = calculateAllYearsTotals({
    ...currentTotals,
    [year]: calculateYearTotals({
      ...(currentTotals?.[year] || {}),
      [month]: calculateMonthTotals({
        ...(currentTotals?.[year]?.[month] || {}),
        total: (currentTotals?.[year]?.[month]?.total || 0) + weekDifference,
        average: formatNumber(((currentTotals?.[year]?.[month]?.average || 0) / 4) + (weekDifference / 4)),
        [week]: newWeekTotal,
      }),
    })
  });

  // delete empty week
  if (!newWeekTotal) {
    delete patchedTotals[year][month][week];
  }

  // delete empty month
  if (!patchedTotals[year][month].total) {
    delete patchedTotals[year][month];
  }

  // delete empty year
  if (!patchedTotals[year].total) {
    delete patchedTotals[year];
  }

  return patchedTotals;
}

export function calculateTotalsForItems (items:Item[]):Totals {
  const yearsTotals = items.reduce((totalsForYears:any, item:Item) => {
    const { year, month, week } = item;
    const amount = getAmount(item);

    totalsForYears[year] = totalsForYears[year]
      ? calculateYearTotals({
        ...totalsForYears[year],
        [month]: totalsForYears[year][month]
          ? calculateMonthTotals({
            ...totalsForYears[year][month],
            [week]: totalsForYears[year][month][week]
              ? totalsForYears[year][month][week] + amount
              : amount
          })
          : calculateMonthTotals({
            total: amount,
            average: formatNumber(amount / 4),
            [week]: amount
          })
      })
      : calculateYearTotals({
        [month]: calculateMonthTotals({
          total: amount,
          average: formatNumber(amount / 4),
          [week]: amount,
        }),
      });

    return totalsForYears;
  }, {});

  return calculateAllYearsTotals(yearsTotals);
}

function calculateAllYearsTotals (totals:any):Totals {
  const yearsKeys = Object
    .keys(totals)
    .map(Number)
    .filter(Boolean);
  const { total, average } = yearsKeys.reduce(({ total, average }:{ total:number; average:number }, year:number) => {
    return {
      total: total + totals[year].total,
      average: average + totals[year].average,
    };
  }, { total: 0, average: 0 });

  const monthAverage = average / yearsKeys.length;

  return {
    ...totals,
    total: formatNumber(total),
    yearAverage: formatNumber(total / yearsKeys.length),
    monthAverage: formatNumber(monthAverage),
    weekAverage: formatNumber(monthAverage / 4),
  };
}

function calculateYearTotals (year:any):YearTotals {
  const total = (year[1]?.total || 0)
    + (year[2]?.total || 0)
    + (year[3]?.total || 0)
    + (year[4]?.total || 0)
    + (year[5]?.total || 0)
    + (year[6]?.total || 0)
    + (year[7]?.total || 0)
    + (year[8]?.total || 0)
    + (year[9]?.total || 0)
    + (year[10]?.total || 0)
    + (year[11]?.total || 0)
    + (year[12]?.total || 0);
  const monthsNumber = Object
    .keys(year)
    .map(Number)
    .filter(Boolean)
    .length;
  const average = formatNumber(total / monthsNumber);

  return {
    ...year,
    total: formatNumber(total),
    average,
  };
}

function calculateMonthTotals (month:any):MonthTotals {
  const total = (month[1] || 0)
    + (month[2] || 0)
    + (month[3] || 0)
    + (month[4] || 0);
  const average = formatNumber(total / 4);

  return {
    ...month,
    total: formatNumber(total),
    average,
  };
}
