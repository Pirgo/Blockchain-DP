import React, { Component } from "react";
import axios from "axios";

const PartialGradeDisplay = props => (
    <div className="row border align-items-center">
        <div className="col-2">
            <p>Lecturer: {props.currTrans.lecturerID}</p>
        </div>
        <div className="col-2">
            <p>Date: {props.currTrans.date}</p>
        </div>
        <div className="col-2">
            <p>Date of presence: {props.currTrans.dateClass}</p>
        </div>
        <div className="col-2">
            <p>Course: {props.currTrans.course}</p>
        </div>
        <div className="col-2">
            <p>Presence: {props.currTrans.presence}</p>
        </div>
    </div>
)

export default class StudentTransactions extends Component {
    constructor(props) {
        super(props)
        this.state = {
            studentId: "",
            keyDecryptString: "",
            transactions: [],
            types: [],
            choosenType: "",
            filterDict: {}
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

 
    transactions() {
        let transList = []; 
        switch (this.state.choosenType) {
            case "partial grade":
                transList = this.state.transactions.map(currTrans => {
                    return <PartialGradeDisplay currTrans={currTrans}/>;
                })
                break;
            case "final grade":
                transList = this.state.transactions.map(currTrans => {
                    return <PartialGradeDisplay currTrans={currTrans}/>;
                })
                break;
            case "presence":
                transList = this.state.transactions.map(currTrans => {
                    return <PartialGradeDisplay currTrans={currTrans}/>;
                })
                break;
            case "certificate":
                transList = this.state.transactions.map(currTrans => {
                    return <PartialGradeDisplay currTrans={currTrans}/>;
                })
                break;
            default:
                break;
        }
        if (transList.length > 0) {
            return transList
        }
        else {
            return (
                <>
                    <h1>Transactions</h1>
                </>
            )
        }
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
            let filterDictLocal = this.state.filterDict;
            filterDictLocal[key] = value;
            this.setState({ filterDict: filterDictLocal})  
        } else {
            let filterDictLocal = this.state.filterDict;
            delete filterDictLocal[key];
            this.setState({ filterDict: filterDictLocal})  
        }
        
        console.log(this.state.filterDict) 
    }

    dateFormat(date) {
        let newDate = date.split("-");
        let newDateInFormat = newDate[2] + "/" + newDate[1] + "/" + newDate[0];
        console.log(newDateInFormat);
        return newDateInFormat
    }


    filter() {
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
                            return <p>Filters</p>;
                    }
                })()}
            </div>
        )
    }
    
    buildBody() {
        const body = {"id": parseInt(this.state.studentId), "keyDecryptString": this.state.keyDecryptString, "type": this.state.choosenType, "filter": this.state.filterDict}
        return body;
    }

    getTransactions = () => {
        if(this.state.keyDecryptString !== "" && this.state.studentId !== "") {
            const body = this.buildBody();
            console.log(body);
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
                <div className="transaction-types">
                    {this.transactionTypes()}
                </div>
                <div>
                    <label>Student's id:</label>
                    <input type="text" name="studentId" value={this.state.studentId} onChange={ev => this.setState({studentId: ev.target.value})}/>
                    <br/>
                    <label>Student's key:</label>
                    <input type="text" name="keyDecryptString" value={this.state.keyDecryptString} onChange={ev => this.setState({keyDecryptString: ev.target.value})}/>
                    <br/>
                </div>
                <div id="filterMore">
                    {this.filter()}
                </div>
                <div>
                    <button value={this.state.loaded} onClick={this.getTransactions}>Send</button>
                    {this.transactions()}
                </div>
            </div>
        )
    }
}


