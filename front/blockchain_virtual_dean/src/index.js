import React from 'react';
import ReactDOM from 'react-dom';
import App, {AddFormRate, AddPresenceForm} from './scripts/input_forms.js';

const buttonAddRate = document.getElementsByClassName('nav-bar')[0];
const buttons = <div>
                    <button id="getRate">Oceny</button>
                    <button id="getPresence">Obecności</button>
                    <button id="getCertificate">Certyfikaty</button>
                    <button id="add">Dodaj</button>
                </div>

ReactDOM.render(
  buttons,
  buttonAddRate
)



