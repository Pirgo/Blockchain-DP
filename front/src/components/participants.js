import { Component } from "react";
import axios from "axios";

export default class Participants extends Component {

    constructor(props) {
        super(props);
        this.state = {
            course: "",
            participants: []
        }
    }

    getCourses = () => {
        axios.get('http://localhost:3001/students/' + this.state.course)
            .then(response => {
                this.setState({participants: response.data});
            }).catch((error) => {
                console.log(error);
            })
    }

    partList(props) {
        const lecturers = props.participants.lecturers;
        const students = props.participants.students;
        console.log(lecturers);
        let buff = []
        const lecturersItems = lecturers.map((lect) =>
          <p>{lect}</p>
        );
        const studentsItems = students.map((std) =>
          <p>{std}</p>
        );
        buff.push(<h2>Lecturers</h2>);
        buff.push(lecturersItems);
        buff.push(<h2>Students</h2>);
        buff.push(studentsItems);
        return buff;
        return <h2>Lecturers</h2> + lecturersItems + <h2>Students</h2> + studentsItems;
      }

    seeParticipants() {
        console.log(this.state.participants);
        if(this.state.participants.lecturers || this.state.participants.students) {
            let partList =  <div><this.partList participants={this.state.participants}/></div>;
            return partList;
        } else {
            return (
                <div></div>
            )
        }
    }

    render() {
        return (
            <div className="container">
                <div>
                    <label>Course name:</label>
                    <input type="text" name="course" value={this.state.course} onChange={ev => this.setState({course: ev.target.value})}/>
                    <br/>
                </div>
                <button value={this.state.loaded} onClick={this.getCourses}>Get courses</button>
                <div>
                    {this.seeParticipants()}
                </div>
            </div>
        )
    }

}