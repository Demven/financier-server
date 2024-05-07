export function formatNumber (total:number):number {
  return parseFloat(total.toFixed(2));
}

export function getAmount (item:any):number {
  return item?.shares
    ? formatNumber(item.shares * item.pricePerShare) || 0
    : item?.amount || 0;
}
