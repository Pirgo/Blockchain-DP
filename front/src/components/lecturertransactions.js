import React, { Component } from "react";
import axios from "axios";

const PresenceDisplay = props => (
    <div className="row border align-items-center">
        <div className="col-2">
            <p>studentID: {props.currTrans.studentID}</p>
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

const PartialGradeDisplay = props => (
    <div className="row border align-items-center">
        <div className="col-2">
            <p>studentID: {props.currTrans.studentID}</p>
        </div>
        <div className="col-2">
            <p>Date: {props.currTrans.date}</p>
        </div>
        <div className="col-2">
            <p>Course: {props.currTrans.course}</p>
        </div>
        <div className="col-2">
            <p>Grade value: {props.currTrans.grade}</p>
        </div>
        <div className="col-2">
            <p>Grade weight: {props.currTrans.weight}</p>
        </div>
    </div>
)

const FinalGradeDisplay = props => (
    <div className="row border align-items-center">
        <div className="col-2">
            <p>studentID: {props.currTrans.studentID}</p>
        </div>
        <div className="col-2">
            <p>Date: {props.currTrans.date}</p>
        </div>
        <div className="col-2">
            <p>Course: {props.currTrans.course}</p>
        </div>
        <div className="col-2">
            <p>Grade value: {props.currTrans.grade}</p>
        </div>
    </div>
)

const CertificateDisplay = props => (
    <div className="row border align-items-center">
        <div className="col-2">
            <p>Student: {props.currTrans.studentID}</p>
        </div>
        <div className="col-2">
            <p>Date: {props.currTrans.date}</p>
        </div>
        <div className="col-2">
            <p>Certifier: {props.currTrans.certifier}</p>
        </div>
        <div className="col-2">
            <p>Date of award: {props.currTrans.dateOfAward}</p>
        </div>
        <div className="col-2">
            <p>Name of certificate: {props.currTrans.nameOfCertificate}</p>
        </div>
        <div className="col-2">
            <p>Info: {props.currTrans.info}</p>
        </div>
    </div>
)

export default class LecturerTransactions extends Component {
    constructor(props) {
        super(props)
        this.state = {
            lecturerId: "",
            keyDecryptString: "",
            transactions: [],
            types: [],
            choosenType: "",
            filterDict: {},
            transactionLoaded: "false"
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
        if(this.state.transactionLoaded === "true") {
            let transList = []; 
            switch (this.state.choosenType) {
                case "partial grade":
                    transList = this.state.transactions.map(currTrans => {
                        return <PartialGradeDisplay currTrans={currTrans}/>;
                    })
                    break;
                case "final grade":
                    transList = this.state.transactions.map(currTrans => {
                        return <FinalGradeDisplay currTrans={currTrans}/>;
                    })
                    break;
                case "presence":
                    transList = this.state.transactions.map(currTrans => {
                        return <PresenceDisplay currTrans={currTrans}/>;
                    })
                    break;
                case "certificate":
                    transList = this.state.transactions.map(currTrans => {
                        return <CertificateDisplay currTrans={currTrans}/>;
                    })
                    break;
                default:
                    break;
            }
            return transList;
        } else if (this.state.transactionLoaded === "false") {
            return (
                <div></div>
            )
        } else {
            return (
                <div><p>{this.state.transactionLoaded}</p></div>
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
                            <input type="radio" key={transType} name="transType" value={transType} onChange={ev => this.setState({choosenType: transType, filterDict: {}, transactionLoaded: "false"})}/>
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
    }

    dateFormat(date) {
        let newDate = date.split("-");
        let newDateInFormat = newDate[2] + "/" + newDate[1] + "/" + newDate[0];
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
                                    <label>Student ID:</label>
                                    <input type="number" name="studentId" onChange={(ev) => this.setFilterParam('studentID', parseInt(ev.target.value))}/>
                                    <br/>
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
                                    <label>Student ID:</label>
                                    <input type="number" name="studentId" onChange={(ev) => this.setFilterParam('studentID', parseInt(ev.target.value))}/>
                                    <br/>
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
                                    <label>Student ID:</label>
                                    <input type="number" name="studentId" onChange={(ev) => this.setFilterParam('studentID', parseInt(ev.target.value))}/>
                                    <br/>
                                    <label>Certifier:</label>
                                    <input type="text" name="certifier" onChange={(ev)   => this.setFilterParam('certifier', ev.target.value)}/>
                                    <br/>
                                    <label>Certificate name:</label>
                                    <input type="text" name="nameOfCertificate" onChange={(ev) => this.setFilterParam('nameOfCertificate', ev.target.value)}/>
                                    <br/>
                                    <label>Date award:</label>
                                    <input type="date" name="course" onChange={(ev) => this.setFilterParam('dateOfAward', this.dateFormat(ev.target.value))}/>
                                    <br/>
                                </div>
                            )
                        case 'presence':
                            return (
                                <div>
                                    <label>Student ID:</label>
                                    <input type="number" name="studentId" onChange={(ev) => this.setFilterParam('studentID', parseInt(ev.target.value))}/>
                                    <br/>
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
                            return <p>Filters</p>;
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
            axios.post('http://localhost:3001/find-transactions-lecturer', body)
                .then(response => {
                    this.setState({ transactions: response.data })
                    this.setState({ transactionLoaded: "true" });
                }).catch((error) => {
                    this.setState({ transactionLoaded: error.response.data})
                })
        }
    }

    render() {
        return (
            <div className="flex-container">
                <div className="transaction-types">
                    {this.transactionTypes()}
                </div>
                <div>
                    <label>Lecturer ID:</label>
                    <input type="text" name="lecturerId" value={this.state.lecturerId} onChange={ev => this.setState({lecturerId: ev.target.value})}/>
                    <br/>
                    <label>Lecturer key:</label>
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


