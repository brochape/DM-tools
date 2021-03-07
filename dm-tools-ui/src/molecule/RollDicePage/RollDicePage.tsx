import * as React from 'react';
import { FunctionComponent, useEffect, useState } from 'react';
import { DiceRoll } from 'rpg-dice-roller';

export interface IAppProps {}

export const RollDicePage: FunctionComponent = () => {
  let [diceString, setDiceString] = useState<string>('');
  let [diceRollTotal, setDiceRollTotal] = useState<string>('');
  useEffect(() => {
    try {
      setDiceRollTotal('' + new DiceRoll(diceString).output);
    } catch (ex) {
      setDiceRollTotal('Invalid formula');
    }
  }, [diceString]);

  const inputChanged = (event) => {
    console.log(event);
    setDiceString(event.target.value);
  };
  return (
    <div className={'mainPage'}>
      <div className={'mainPageTitle'}>Roll dice</div>
      <input onChange={(evt) => inputChanged(evt)} value={diceString} />
      <div>{diceRollTotal}</div>
    </div>
  );
};
