import React, { Component } from "react";
import axios from "axios";

export default class AddTransaction extends Component {
    constructor(props) {
        super(props)
        this.state = {
            date: new Date().toLocaleDateString().replaceAll('.','/'),
            studentID: "",
            masterKeyString: "",
            lecturerId: "",
            verificationKeyString: "",
            types: [],
            choosenType: "",
            propertiesDict: {}
        }
    }

    componentDidMount() {
        axios.get("http://localhost:3001/transaction-types")
            .then(response => {
                this.setState({types: response.data})
            })
            .catch((error) => {
                console.log(error);
            })
    }

    transactionTypes() {
        return (
            <>
                {this.state.types.map((transType) => {
                    return (
                        <div key={transType}>
                            <label key={{transType} + 'label'}>{transType}</label>
                            <input type="radio" key={transType} name="transType" value={transType} onChange={ev => this.setState({choosenType: transType, filterDict: {}})}/>
                        </div>
                    )
                    })}
            </>
        )
    }

    setFilterParam(key, value) {
        if(value !== "undefined/undefined/" && value !== "") {
            let parametersLocal = this.state.parameters;
            parametersLocal[key] = value;
            this.setState({ parameters: parametersLocal})  
        } else {
            let parametersLocal = this.state.parameters;
            delete parametersLocal[key];
            this.setState({ parameters: parametersLocal})  
        }
        
        console.log(this.state.parameters) 
    }

    dateFormat(date) {
        let newDate = date.split("-");
        let newDateInFormat = newDate[2] + "/" + newDate[1] + "/" + newDate[0];
        console.log(newDateInFormat);
        return newDateInFormat
    }


    parameters() {
        return (
            <div>
                {(() => {
                    switch (this.state.choosenType) {
                        case 'partial grade':
                            return (
                                <div>
                                    <label>Grade value:</label>
                                    <input type="number" name="grade" onChange={(ev) => this.setFilterParam('grade', parseInt(ev.target.value))}/>
                                    <br/>
                                    <label>Course:</label>
                                    <input type="text" name="course" onChange={(ev) => this.setFilterParam('course', ev.target.value)}/>
                                    <br/>
                                    <label>Grade weight:</label>
                                    <input type="number" name="weight" onChange={(ev) => this.setFilterParam('weight', parseInt(ev.target.value))}/>
                                    <br/>
                                </div>
                            )
                            break;
                        case 'final grade':
                            return (
                                <div>
                                    <label>Grade value:</label>
                                    <input type="number" name="grade" onChange={(ev) => this.setFilterParam('grade', parseInt(ev.target.value))}/>
                                    <br/>
                                    <label>Course:</label>
                                    <input type="text" name="course" onChange={(ev) => this.setFilterParam('course', ev.target.value)}/>
                                    <br/>
                                </div>
                            )
                            break;
                        case 'certificate': 
                            return (
                                <div>
                                    <label>Certifier:</label>
                                    <input type="text" name="certifier" onChange={(ev)   => this.setFilterParam('certifier', ev.target.value)}/>
                                    <br/>
                                    <label>dateOfAward:</label>dateOfAward
                                    <input type="date" name="course" onChange={(ev) => this.setFilterParam('dateOfAward', this.dateFormat(ev.target.value))}/>
                                    <br/>
                                    <label>Info:</label>
                                    <input type="text" name="info" onChange={(ev) => this.setFilterParam('info', ev.target.value)}/>
                                    <br/>
                                    <label>Name of certificate:</label>
                                    <input type="text" name="nameOfCertificate" onChange={(ev) => this.setFilterParam('nameOfCertificate', ev.target.value)}/>
                                    <br/>
                                </div>
                            )
                            break;
                        case 'presence':
                            return (
                                <div>
                                    <label>Presence value:</label>
                                    <input type="text" name="presence" onChange={(ev)   => this.setFilterParam('presence', parseInt(ev.target.value))}/>
                                    <br/>
                                    <label>Course:</label>
                                    <input type="text" name="course" onChange={(ev) => this.setFilterParam('course', ev.target.value)}/>
                                    <br/>
                                    <label>Date class:</label>
                                    <input type="date" name="dateClass" onChange={(ev) => this.setFilterParam('dateClass', this.dateFormat(ev.target.value))}/>
                                    <br/>
                                </div>
                            )
                            break;
                        default:
                            return <p>Parameters</p>;
                    }
                })()}
            </div>
        )
    }
    
    buildBody() {
        const body = {"id": parseInt(this.state.lecturerId), "keyDecryptString": this.state.keyDecryptString, "type": this.state.choosenType, "filter": this.state.filterDict}
        return body;
    }

    getTransactions = () => {
        if(this.state.keyDecryptString !== "" && this.state.lecturerId !== "") {
            const body = this.buildBody();
            console.log(body);
            axios.post('http://localhost:3001/find-transactions-lecturer', body)
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
                <div className="transaction-types">
                    {this.transactionTypes()}
                </div>
                <div>
                    <label>Student id:</label>
                    <input type="text" name="studentID" value={this.state.studentID} onChange={ev => this.setState({studentID: ev.target.value})}/>
                    <br/>
                    <label>Lecturer encrypt key:</label>
                    <input type="text" name="masterKeyString" value={this.state.masterKeyString} onChange={ev => this.setState({masterKeyString: ev.target.value})}/>
                    <br/>
                    <label>Lecturer id:</label>
                    <input type="text" name="lecturerID" value={this.state.lecturerID} onChange={ev => this.setState({lecturerID: ev.target.value})}/>
                    <br/>
                    <label>Verification key:</label>
                    <input type="text" name="verificationKeyString" value={this.state.verificationKeyString} onChange={ev => this.setState({verificationKeyString: ev.target.value})}/>
                    <br/>
                </div>
                <div id="filterMore">
                    {this.parameters()}
                </div>
                <button value={this.state.loaded} onClick={this.getTransactions}>Send</button>
            </div>
        )
    }
}


