import { Component } from "react";
import axios from "axios";

export default class Courses extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userId: "",
            courses: [],
            addedSuccesfully: "false"
        }
    }

    getCourses = () => {
        axios.get('http://localhost:3001/courses/' + this.state.userId)
            .then(response => {
                this.setState({courses: response.data});
                this.setState({addedSuccesfully: "true"})
            }).catch((error) => {
                this.setState({addedSuccesfully: error.response.data})
            })
    }

    coursesList(props) {
        const courses = props.courses;
        const coursesItems = courses.map((course) =>
          <p key={course}>{course}</p>
        );
        return coursesItems;
      }

    seeCourses() {
        if(this.state.courses.length > 0  && this.state.addedSuccesfully === "true") {
        let courseList =  <div><this.coursesList courses={this.state.courses}/></div>;
        return courseList;
        } else if (this.state.addedSuccesfully === "false") {
            return (
                <div></div>
            )
        } else {
            return (
                <div><p>{this.state.addedSuccesfully}</p></div>
            )
        }
    }

    render() {
        return (
            <div className="flex-container">
                <div>
                    <label>Student/Lecturer ID:</label>
                    <input type="text" name="userId" value={this.state.userId} onChange={ev => this.setState({userId: ev.target.value})}/>
                    <br/>
                </div>
                <button value={this.state.loaded} onClick={this.getCourses}>Get courses</button>
                <div className="courses-container">
                    <label>Courses assigned</label>
                    {this.seeCourses()}
                </div>
            </div>
        )
    }

}