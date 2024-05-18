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
    name,
    colorId,
  } = category;

  let error = '';

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
