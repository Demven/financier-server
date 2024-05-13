export interface MonthTotals {
  total?: number;
  average?: number;
  1?: number|undefined,
  2?: number|undefined,
  3?: number|undefined,
  4?: number|undefined,
  [key:number]: YearTotals;
}

export interface YearTotals {
  total?: number;
  average?: number;
  1?: MonthTotals|undefined,
  2?: MonthTotals|undefined,
  3?: MonthTotals|undefined,
  4?: MonthTotals|undefined,
  5?: MonthTotals|undefined,
  6?: MonthTotals|undefined,
  7?: MonthTotals|undefined,
  8?: MonthTotals|undefined,
  9?: MonthTotals|undefined,
  10?: MonthTotals|undefined,
  11?: MonthTotals|undefined,
  12?: MonthTotals|undefined,
  [key:number]: YearTotals;
}

export default interface Totals {
  total?: number;
  yearAverage?: number;
  monthAverage?: number;
  weekAverage?: number;
  [key:number]: YearTotals;
}
