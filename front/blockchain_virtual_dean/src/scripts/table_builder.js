import React from "react";
import ReactDOM from 'react-dom';

class TableBuilder extends React.Component {

    constructor() {
        super();
        this.inside = document.getElementsByClassName('inside-content')[0];
    }

    BuildGrades(grades) {
        
        let insides = [];
        insides.push(React.createElement('tr', {key: 0}, [React.createElement('th', {key: 0}, 'Obecność'), React.createElement('th', {key: 1}, 'Data')]));
        // html_content.push(<tr><th>Obecność</th><th>Data</th></tr>);
        for(let i = 0; i < grades.length; i++) {
            insides.push(React.createElement('tr', {key: i+1}, [React.createElement('td', {key: 0}, grades[i].presence), React.createElement('td', {key: 1}, grades[i].dateClass)]));
        }

        const table = React.createElement('table', {}, insides);
        ReactDOM.render(
            table,
            this.inside
        );
    }
}

export default TableBuilder