import * as React from 'react';
import { FunctionComponent } from 'react';
import { MenuElement } from '../../atom/MenuElement/MenuElement';
import { PAGE } from '../../Globals';

import './SideMenu.css';

export const SideMenu: FunctionComponent = () => {
  return (
    <div className={'sideMenu'}>
      <MenuElement title={'Roll Dice'} associatedComponent={PAGE.ROLL_DICE} />
      <MenuElement
        title={'Character Sheets'}
        associatedComponent={PAGE.CHARACTER_SHEETS}
      />
    </div>
  );
};
