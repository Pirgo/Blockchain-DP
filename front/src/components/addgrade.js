import React, { Component } from "react";
import axios from "axios";

export default class AddGrade extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date().toLocaleDateString().replaceAll('.','/'),
            studentID: "",
            masterKeyString: "",
            lecturerID: "",
            verificationKeyString: "",
            course: "",
            grade: "",
            weight: "",
            result: null
        }
    }

    sendGrade = () => {
        const body = {"date": this.state.date, "studentID": parseInt(this.state.studentID), "masterKeyString": this.state.masterKeyString,
                    "lecturerID": parseInt(this.state.lecturerID), "verificationKeyString": this.state.verificationKeyString,
                    "course": this.state.course, "grade": parseInt(this.state.grade), "weight": parseInt(this.state.weight)}
        
        axios.post('http://localhost:3001/transact-partialGrade', body)
                .then(response => {
                    this.setState({ transactions: response.data })
                    console.log(this.state.transactions)
                }).catch((error) => {
                    console.log(error);
                })
        axios.get('http://localhost:3001/mine-transactions')
    }

    render() {
        return (
            <div className="container">
                <div className="text-dark">
                    <label className="text-dark">Id studenta:</label>
                    <input type="text" name="studentID" value={this.state.studentID} onChange={ev => this.setState({studentID: ev.target.value})}/>
                    <br/>
                    <label className="text-dark">Klucz szyfrujący:</label>
                    <input type="text" name="masterKeyString" value={this.state.masterKeyString} onChange={ev => this.setState({masterKeyString: ev.target.value})}/>
                    <br/>
                    <label className="text-dark">Id wykładowcy:</label>
                    <input type="text" name="lecturerID" value={this.state.lecturerID} onChange={ev => this.setState({lecturerID: ev.target.value})}/>
                    <br/>
                    <label className="text-dark">Klucz weryfikacyjny:</label>
                    <input type="text" name="verificationKeyString" value={this.state.verificationKeyString} onChange={ev => this.setState({verificationKeyString: ev.target.value})}/>
                    <br/>
                    <label className="text-dark">Przedmiot:</label>
                    <input type="text" name="course" value={this.state.course} onChange={ev => this.setState({course: ev.target.value})}/>
                    <br/>
                    <label className="text-dark">Ocena:</label>
                    <input type="text" name="grade" value={this.state.grade} onChange={ev => this.setState({grade: ev.target.value})}/>
                    <br/>
                    <label className="text-dark">Waga:</label>
                    <input type="text" name="weight" value={this.state.weight} onChange={ev => this.setState({weight: ev.target.value})}/>
                    <br/>
                    <button className="text-dark" value={this.state.loaded} onClick={this.sendGrade}>Wyślij</button>
                
                </div>
            </div>
        )
    }
}