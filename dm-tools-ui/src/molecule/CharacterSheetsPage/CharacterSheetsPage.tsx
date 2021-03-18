import React, { useEffect, useState } from 'react';
import PDFViewer from 'pdf-viewer-reactjs';
import { FunctionComponent } from 'react';
import './CharacterSheetsPage.css';
import { useOvermind } from '../../overmind';

export const CharacterSheetsPage: FunctionComponent = () => {
    const { state, actions } = useOvermind();

    // const [chars, setChars] = useState<Map<string, string>>(new Map());
    const [currentSheet, setCurrentSheet] = useState<string>('');

    const displayCharSheet = (e: React.MouseEvent<HTMLElement>) => {
        const clickedChar = (e.target as HTMLButtonElement).textContent;
        if (clickedChar) {
            setCurrentSheet(state.characterSheets.get(clickedChar) || '');
        }
    };

    const charButtons: any[] = [];
    for (let pair of state.characterSheets) {
        var [key] = pair;
        charButtons.push(
            <button
                className={'charButton'}
                key={'char ' + key}
                onClick={displayCharSheet}
            >
                {key}
            </button>
        );
    }

    useEffect(() => {
        if (state.characterSheets.size === 0) {
            const locallySavedChars = window.localStorage.getItem(
                'DM-tool-chars'
            );
            let savedChars = new Map();
            if (locallySavedChars) {
                savedChars = JSON.parse(locallySavedChars);
            }
            console.log('Reset chars');
            actions.setCharSheets(savedChars);
        }
    }, []);

    const processPDF = () => {
        //Read File
        const selectedFile = (document?.getElementById(
            'pdfUploadButton'
        ) as HTMLInputElement).files;

        const charName = (document.getElementById(
            'charName'
        ) as HTMLInputElement).value;
        //Check File is not Empty
        if (selectedFile && selectedFile.length > 0) {
            // Select the very first file from list
            var fileToLoad = selectedFile[0];
            // FileReader function for read the file.
            var fileReader = new FileReader();
            var base64;
            // Onload of file read the file content
            fileReader.onload = function (fileLoadedEvent) {
                base64 = fileLoadedEvent?.target?.result;
                console.log('Before', state.characterSheets);
                actions.addCharSheet({
                    charName: charName,
                    charSheet: base64.replace(
                        'data:application/pdf;base64,',
                        ''
                    ),
                });
            };
            // Convert data to base64
            fileReader.readAsDataURL(fileToLoad);
        }
    };

    return (
        <div className={'mainPage'}>
            <div className={'charButtons'}>
                {charButtons}
                <input
                    id="pdfUploadButton"
                    type="file"
                    className={'charButton'}
                ></input>
                <input id={'charName'} type="text"></input>
                <button onClick={processPDF} className={'charButton'}>
                    +
                </button>
            </div>
            {currentSheet !== '' ? (
                <div className={'pdfViewer'}>
                    <PDFViewer
                        document={{
                            base64: currentSheet,
                        }}
                        scale={1.2}
                        scaleStep={0.5}
                        maxScale={5}
                        minScale={0.5}
                        hideRotation
                    />
                </div>
            ) : null}
        </div>
    );
};
