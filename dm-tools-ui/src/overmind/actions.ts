import { Action, Context } from 'overmind';
import { PAGE } from './../Globals';
export const setPage: Action<PAGE> = (
  { state }: Context,
  value: PAGE
): void => {
  state.currentPage = value;
};
