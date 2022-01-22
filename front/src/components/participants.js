import { Component } from "react";
import axios from "axios";

export default class Participants extends Component {

    constructor(props) {
        super(props);
        this.state = {
            course: "",
            participants: [],
            participantsLoaded: "false"
        }
    }

    getCourses = () => {
        axios.get('http://localhost:3001/people/' + this.state.course)
            .then(response => {
                this.setState({participants: response.data});
                this.setState({participantsLoaded: "true"})
            }).catch((error) => {
                this.setState({participantsLoaded: error.response.data})
            })
    }

    partList(props) {
        const lecturers = props.participants.lecturers;
        const students = props.participants.students;
        console.log(lecturers);
        let buff = []
        const lecturersItems = lecturers.map((lect) =>
          <p key={lect}>{lect}</p>
        );
        const studentsItems = students.map((std) =>
          <p key={std}>{std}</p>
        );
        buff.push(<h2>Lecturers IDs</h2>);
        buff.push(lecturersItems);
        buff.push(<h2>Students IDs</h2>);
        buff.push(studentsItems);
        return buff;
      }

    seeParticipants() {
        console.log(this.state.participants);
        if(this.state.participantsLoaded === "true") {
            let partList =  <div><this.partList participants={this.state.participants}/></div>;
            return partList;
        } else if (this.state.participantsLoaded === "false" ){
            return (
                <div></div>
            )
        } else {
            return (
                <div><p>{this.state.participantsLoaded}</p></div>
            )
        }
    }

    render() {
        return (
            <div className="flex-container">
                <div>
                    <label>Course name:</label>
                    <input type="text" name="course" value={this.state.course} onChange={ev => this.setState({course: ev.target.value})}/>
                    <br/>
                </div>
                <button value={this.state.loaded} onClick={this.getCourses}>Get courses</button>
                <div className="courses-container">
                    {this.seeParticipants()}
                </div>
            </div>
        )
    }

}