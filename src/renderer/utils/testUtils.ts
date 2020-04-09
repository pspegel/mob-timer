import { Action } from 'redux';

export const callReducerRecursively = <S, T extends Action>(
  reducer: (state: S, action: T) => any,
  state: S,
  action: T,
  numTimes: number
): S[] => {
  const res = [];
  for (let i = 0; i < numTimes; i++) {
    res.push(reducer(res[i - 1] || state, action));
  }
  return res;
};
