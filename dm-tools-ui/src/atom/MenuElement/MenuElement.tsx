import * as React from 'react';
import { FunctionComponent } from 'react';

import './MenuElement.css';

interface IMenuElementProps {
  title: string;
}

export const MenuElement: FunctionComponent<IMenuElementProps> = (props) => {
  return <div className={'menuElement'}>{props.title}</div>;
};
