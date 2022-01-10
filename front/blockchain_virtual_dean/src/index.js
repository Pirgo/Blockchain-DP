import React from 'react';
import ReactDOM from 'react-dom';
// import App, {AddFormRate, AddPresenceForm} from './scripts/input_forms.js';
import GetForms from './scripts/get_forms.js';
var getForms = new GetForms();

const buttonGet = document.getElementsByClassName('nav-bar')[0];
const buttonsGetHtml = <div>
                    <button id="getGrade">Oceny</button>
                    <button id="getPresence">Obecności</button>
                    <button id="getCertificate">Certyfikaty</button>
                    <button id="getFinalGrade">Oceny końcowe</button>
                </div>

const buttonPost = document.getElementsByClassName('nav-bar')[1];
const buttonsPostHtml = <div>
                    <button id="addGrade">Dodaj ocenę</button>
                    <button id="addPresence">Dodaj obecności</button>
                    <button id="addCertificate">Dodaj certyfikaty</button>
                    <button id="addFinalGrade">Dodaj oceny końcowe</button>
                </div>

ReactDOM.render(
  buttonsGetHtml,
  buttonGet
)
document.getElementById('getGrade').addEventListener('click', ()=>{
  getForms.GetGrades();
});
document.getElementById('getPresence').addEventListener('click', ()=>{
  getForms.GetPresences();
});

ReactDOM.render(
  buttonsPostHtml,
  buttonPost
)



