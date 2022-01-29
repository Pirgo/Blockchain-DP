import React, { Component } from "react";
import axios from "axios";

export default class AddTransaction extends Component {
    constructor(props) {
        super(props)
        this.state = {
            date: new Date().toLocaleDateString().replaceAll('.','/'),
            studentID: "",
            masterKeyString: "",
            lecturerID: "",
            verificationKeyString: "",
            types: [],
            choosenType: "",
            parameters: {},
            addedSuccesfully: "false"
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
    }

    dateFormat(date) {
        let newDate = date.split("-");
        let newDateInFormat = newDate[2] + "/" + newDate[1] + "/" + newDate[0];
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
                                    <label>Course:</label>
                                    <input type="text" name="course" onChange={(ev) => this.setFilterParam('course', ev.target.value)}/>
                                    <br/>
                                    <label>Grade value:</label>
                                    <input type="number" name="grade" onChange={(ev) => this.setFilterParam('grade', parseInt(ev.target.value))}/>
                                    <br/>
                                    <label>Grade weight:</label>
                                    <input type="number" name="weight" onChange={(ev) => this.setFilterParam('weight', parseInt(ev.target.value))}/>
                                    <br/>
                                </div>
                            )
                        case 'final grade':
                            return (
                                <div>
                                    <label>Course:</label>
                                    <input type="text" name="course" onChange={(ev) => this.setFilterParam('course', ev.target.value)}/>
                                    <br/>
                                    <label>Grade value:</label>
                                    <input type="number" name="grade" onChange={(ev) => this.setFilterParam('grade', parseInt(ev.target.value))}/>
                                    <br/>
                                </div>
                            )
                        case 'certificate': 
                            return (
                                <div>
                                    <label>Certifier:</label>
                                    <input type="text" name="certifier" onChange={(ev)   => this.setFilterParam('certifier', ev.target.value)}/>
                                    <br/>
                                    <label>Certificate name:</label>
                                    <input type="text" name="nameOfCertificate" onChange={(ev) => this.setFilterParam('nameOfCertificate', ev.target.value)}/>
                                    <br/>
                                    <label>Info:</label>
                                    <input type="text" name="info" onChange={(ev) => this.setFilterParam('info', ev.target.value)}/>
                                    <br/>
                                    <label>Date award:</label>
                                    <input type="date" name="course" onChange={(ev) => this.setFilterParam('dateOfAward', this.dateFormat(ev.target.value))}/>
                                    <br/>
                                </div>
                            )
                        case 'presence':
                            return (
                                <div>
                                    <label>Course:</label>
                                    <input type="text" name="course" onChange={(ev) => this.setFilterParam('course', ev.target.value)}/>
                                    <br/>
                                    <label>Presence value:</label>
                                    <input type="text" name="presence" onChange={(ev)   => this.setFilterParam('presence', parseInt(ev.target.value))}/>
                                    <br/>
                                    <label>Date class:</label>
                                    <input type="date" name="dateClass" onChange={(ev) => this.setFilterParam('dateClass', this.dateFormat(ev.target.value))}/>
                                    <br/>
                                </div>
                            )
                        default:
                            return <p></p>;
                    }
                })()}
            </div>
        )
    }
    
    buildBody() {
        let body = {"date": this.state.date, "studentID": parseInt(this.state.studentID), "type": this.state.choosenType, "masterKeyString": this.state.masterKeyString, "lecturerID": parseInt(this.state.lecturerID), "verificationKeyString": this.state.verificationKeyString}
        for (const [key, value] of Object.entries(this.state.parameters)) {
            body[key] = value;
        }
        return body;
    }

    addTransaction = () => {
        const body = this.buildBody();
        axios.post('http://localhost:3001/transact', body)
            .then(response => {
                axios.get('http://localhost:3001/mine-transactions');
                this.setState({addedSuccesfully: "true"})
            }).catch((error) => {
                this.setState({addedSuccesfully: error.response.data})
                console.log(this.state.addedSuccesfully);
            })
    }

    response() {
        if (this.state.addedSuccesfully === "true")
            return (
                <div><h3 style = {{color : "lightgreen"}}>Transaction added succesfully</h3></div>
            )
        else if (this.state.addedSuccesfully === "false")
            return (
                <div></div>
            )
        else
            return (
                <div><h3 style = {{color : "#d92c2cbf"}}>Transaction not added successfully: {this.state.addedSuccesfully}</h3></div>
            )
    }

    render() {
        return (
            <div className="flex-container">
                <div className="transaction-types">
                    {this.transactionTypes()}
                </div>
                <div>
                    <label>Student ID:</label>
                    <input type="text" name="studentID" value={this.state.studentID} onChange={ev => this.setState({studentID: ev.target.value})}/>
                    <br/>
                    <label>Lecturer key(encrypt):</label>
                    <input type="text" name="masterKeyString" value={this.state.masterKeyString} onChange={ev => this.setState({masterKeyString: ev.target.value})}/>
                    <br/>
                    <label>Lecturer ID:</label>
                    <input type="text" name="lecturerID" value={this.state.lecturerID} onChange={ev => this.setState({lecturerID: ev.target.value})}/>
                    <br/>
                    <label>Verification key:</label>
                    <input type="text" name="verificationKeyString" value={this.state.verificationKeyString} onChange={ev => this.setState({verificationKeyString: ev.target.value})}/>
                    <br/>
                </div>
                <div id="filterMore">
                    {this.parameters()}
                </div>
                <button value={this.state.loaded} onClick={this.addTransaction}>Send</button>
                <div>
                    {this.response()}
                </div>
            </div>
        )
    }
}


