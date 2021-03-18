import React from 'react';
import { FunctionComponent } from 'react';
import { PAGE } from '../../Globals';
import { useOvermind } from '../../overmind';
import { CharacterSheetsPage } from '../CharacterSheetsPage/CharacterSheetsPage';
import { RollDicePage } from '../RollDicePage/RollDicePage';
import { VideoPage } from '../VideoPage/VideoPage';

import './MainPageContent.css';

export const MainPageContent: FunctionComponent = () => {
    const { state } = useOvermind();
    switch (state.currentPage) {
        case PAGE.ROLL_DICE:
            return <RollDicePage />;
        case PAGE.CHARACTER_SHEETS:
            return <CharacterSheetsPage />;
        case PAGE.VIDEO:
            return <VideoPage />;
    }
    return <div />;
};
