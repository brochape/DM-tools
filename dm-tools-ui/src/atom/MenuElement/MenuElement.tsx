import * as React from 'react';
import { FunctionComponent } from 'react';
import { PAGE } from '../../Globals';
import { useOvermind } from '../../overmind';

import './MenuElement.css';

interface IMenuElementProps {
  title: string;
  associatedComponent: PAGE;
}

export const MenuElement: FunctionComponent<IMenuElementProps> = (props) => {
  const { actions } = useOvermind();
  const { setPage } = actions;
  return (
    <div
      className={'menuElement'}
      onClick={() => setPage(props.associatedComponent)}
    >
      {props.title}
    </div>
  );
};
