import React, { Component } from "react";
import axios from "axios";

const TransListDisplay = props => (
    <div className="row border align-items-center">
        <div className="col-3">
            <p>Wykładowca: {props.currTrans.lecturerI}</p>
        </div>
        <div className="col-3">
            <p>Obecność: {props.currTrans.presence}</p>
        </div>
        <div className="col-3">
            <p>Przedmiot: {props.currTrans.course}</p>
        </div>
        <div className="col-3">
            <p>Data obecności: {props.currTrans.dateClass}</p>
        </div>
    </div>
)

export default class StudentTransactions extends Component {
    constructor(props) {
        super(props)
        this.state = {
            studentId: "",
            keyDecryptString: "",
            type: "",
            transactions: []
        }
    }

 
    transactions() {
        const transList = this.state.transactions.map(currTrans => {
            return <TransListDisplay currTrans={currTrans}/>;
        })
        if (transList.length > 0) {
            return transList
        }
        else {
            return (
                <>
                    <h1>Brak danych do wyświetlenia</h1>
                </>
            )
        }
    }
    
    getTransactions = () => {
        if(this.state.keyDecryptString !== "" && this.state.type !== "" && this.state.studentId !== "") {

            const body = {"id": parseInt(this.state.studentId), "keyDecryptString": this.state.keyDecryptString, "type": this.state.type}
            axios.post('http://localhost:3001/find-transactions-student', body)
                .then(response => {
                    this.setState({ transactions: response.data })
                    console.log(this.state.transactions)
                }).catch((error) => {
                    console.log(error);
                })
        }
    }

    render() {
        return (
            <div className="container">
                <div>
                    <label>Id studenta:</label>
                    <input type="text" name="studentId" value={this.state.studentId} onChange={ev => this.setState({studentId: ev.target.value})}/>
                    <br/>
                    <label>Klucz studenta:</label>
                    <input type="text" name="keyDecryptString" value={this.state.keyDecryptString} onChange={ev => this.setState({keyDecryptString: ev.target.value})}/>
                    <br/>
                    <label>Typ transakcji:</label>
                    <input type="text" name="type" value={this.state.type} onChange={ev => this.setState({type: ev.target.value})}/>
                    <br/>
                    <button value={this.state.loaded} onClick={this.getTransactions}>Wyślij</button>
                </div>
                <div>
                    {this.transactions()}
                </div>
            </div>
        )
    }
}


