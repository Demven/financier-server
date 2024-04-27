export default interface Category {
  id: number;
  accountId: number;
  name: string;
  description?: string;
  colorId: number;
  createdAt: string;
  updatedAt: string;
}

export function validateCategory (category:Category):{ valid:boolean; error:string; } {
  const {
    accountId,
    name,
    colorId,
  } = category;

  let error = '';

  if (!accountId || typeof accountId !== 'number') {
    error = '"accountId" is required';
  }

  if (!name?.length) {
    error = '"name" is empty';
  }

  if (!colorId) {
    error = '"colorId" is required';
  }

  return {
    valid: !error,
    error,
  };
}
