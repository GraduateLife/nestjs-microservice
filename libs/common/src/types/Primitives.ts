export const isLiteral = (val: any): val is string | boolean | number => {
  if (
    typeof val === 'string' ||
    typeof val === 'number' ||
    typeof val === 'boolean'
  )
    return true;
  return false;
};
