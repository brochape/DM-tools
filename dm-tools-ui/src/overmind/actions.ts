import { Action, Context } from 'overmind';
import { PAGE } from './../Globals';
export const setPage: Action<PAGE> = (
    { state }: Context,
    value: PAGE
): void => {
    state.currentPage = value;
};

interface ICharSheetEntry {
    charName: string;
    charSheet: string;
}

export const addCharSheet: Action<ICharSheetEntry> = (
    { state }: Context,
    value: ICharSheetEntry
): void => {
    console.log('adding entry');
    state.characterSheets = new Map(state.characterSheets).set(
        value.charName,
        value.charSheet
    );
};

export const setCharSheets: Action<Map<string, string>> = (
    { state }: Context,
    value: Map<string, string>
): void => {
    state.characterSheets = value;
};
