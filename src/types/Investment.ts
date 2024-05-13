export default interface Investment {
  id: number;
  accountId: number;
  name: string;
  dateString: string;
  year: number;
  month: number;
  week: number;
  ticker: string;
  shares: number;
  pricePerShare: number;
  createdAt: string;
  updatedAt: string;
}

export function validateInvestment (investment:Investment):{ valid:boolean; error:string; } {
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

  let error = '';

  if (!name?.length) {
    error = '"name" is empty';
  }

  if (!dateString?.length || dateString.split('-').length !== 3) {
    error = '"dateString" is invalid';
  }

  if (typeof year !== 'number' || String(year).length !== 4) {
    error = '"year" is invalid';
  }

  if (typeof month !== 'number' || ![1,2,3,4,5,6,7,8,9,10,11,12].includes(month)) {
    error = '"month" is invalid';
  }

  if (typeof week !== 'number' || ![1,2,3,4].includes(week)) {
    error = '"week" is invalid';
  }

  if (!ticker?.length) {
    error = '"ticker" is empty';
  }

  if (typeof shares !== 'number' && shares <= 0) {
    error = '"shares" is invalid';
  }

  if (typeof pricePerShare !== 'number' && pricePerShare <= 0) {
    error = '"pricePerShare" is invalid';
  }

  return {
    valid: !error,
    error,
  };
}
