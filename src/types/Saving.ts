export default interface Saving {
  id: number;
  accountId: number;
  name: string;
  dateString: string;
  year: number;
  month: number;
  week: number;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export function validateSaving (saving:Saving):{ valid:boolean; error:string; } {
  const {
    name,
    dateString,
    year,
    month,
    week,
    amount,
  } = saving;

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

  if (typeof amount !== 'number') {
    error = '"amount" is invalid';
  }

  return {
    valid: !error,
    error,
  };
}
