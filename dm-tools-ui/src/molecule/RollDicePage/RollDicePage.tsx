import * as React from 'react';
import { FunctionComponent, useEffect, useState } from 'react';
import { DiceRoll } from 'rpg-dice-roller';
import './RollDicePage.css';

export interface IAppProps {}

export const RollDicePage: FunctionComponent = () => {
    let [diceString, setDiceString] = useState<string>('');
    let [diceRollTotal, setDiceRollTotal] = useState<string>('');
    let [diceRollDetail, setDiceRollDetail] = useState<string>('');
    useEffect(() => {
        try {
            const formulaOutput = ('' + new DiceRoll(diceString).output).split(
                ' = '
            );
            setDiceRollDetail(formulaOutput[0].split(': ')[1]);
            setDiceRollTotal(formulaOutput[1]);
        } catch (ex) {
            setDiceRollDetail('Invalid formula');
            setDiceRollTotal('0');
        }
    }, [diceString]);

    const inputChanged = (event) => {
        console.log(event);
        setDiceString(event.target.value);
    };
    return (
        <div className={'mainPage'}>
            <div className={'mainPageTitle'}>Roll dice</div>
            <div className={'formulaInputGroup'}>
                <input
                    className={'formulaInput'}
                    id={'formula'}
                    onChange={(evt) => inputChanged(evt)}
                    value={diceString}
                    placeholder="Dice Formula"
                />
                <label htmlFor={'formula'} className={'formulaInputLabel'}>
                    Dice formula
                </label>
            </div>
            <div className="formulaResultDetail">{diceRollDetail}</div>
            <div className="formulaResultTotal">{diceRollTotal}</div>
        </div>
    );
};
