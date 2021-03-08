import { PAGE } from './../Globals';
export const state = {
    title: 'My App',
    currentPage: PAGE.ROLL_DICE,
    characterSheets: new Map<string, string>(),
};
