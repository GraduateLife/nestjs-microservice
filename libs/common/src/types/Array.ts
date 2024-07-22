export const ArrayGroupBy = <G>(
  arr: G[],
  groupPattern: (i: G) => number | string | symbol,
): Record<string, G[]> => {
  const Res = {};
  arr.forEach((item) => {
    const key = groupPattern(item);

    if (!Res[key]) {
      Res[key] = [item];
    } else if (Res[key]) {
      Res[key].push(item);
    }
  });
  return Res;
};

export const ArrayIsSubset = <T>(
  target: T[],
  referTo: T[],
  mode: 'loose' | 'strict',
) => {
  if (mode === 'strict') {
    return target.every((ai) => referTo.includes(ai));
  }
  return referTo.some((ai) => target.includes(ai));
};

export const ArrayWildCard = (pattern: RegExp, arr: string[]) => {
  return arr.filter((item) => pattern.test(item));
};
