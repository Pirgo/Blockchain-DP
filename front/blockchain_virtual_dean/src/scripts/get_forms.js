import React from "react";
import TableBuilder from "./table_builder.js"

class GetForms extends React.Component {
    constructor() {
        super();
        this.transactions = [];
        this.builder = new TableBuilder();
    }

    GetGrades() {

        const apiUrl = "http://localhost:3001/transactions-partialGrade"
        fetch(apiUrl, {
                method: 'GET'
            })
            .then((response) => response.json())
            .then((data) => console.log(data));

    }

    async GetPresences() {
        const apiUrl = "http://localhost:3001/transactions";
        await fetch(apiUrl)
            .then(res => res.json())
            .then(
                (result) => {
                    this.transactions = result;
                }
            );
        this.builder.BuildGrades(this.transactions);

    }
}

export default GetForms