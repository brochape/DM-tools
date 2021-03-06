import * as React from 'react';
import { FunctionComponent } from 'react';
import { MenuElement } from '../atom/MenuElement/MenuElement';

import './SideMenu.css';

export const SideMenu: FunctionComponent = () => {
  return (
    <div className={'sideMenu'}>
      <MenuElement title={'Roll Dice'} />
    </div>
  );
};
