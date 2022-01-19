import { Component } from "react";
import axios from "axios";

export default class Courses extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userId: "",
            courses: []
        }
    }

    getCourses = () => {
        axios.get('http://localhost:3001/courses/' + this.state.userId)
            .then(response => {
                this.setState({courses: response.data});
            }).catch((error) => {
                console.log(error);
                this.setState({addedSuccesfully: error})
            })
    }

    coursesList(props) {
        const courses = props.courses;
        const coursesItems = courses.map((course) =>
          <p>{course}</p>
        );
        return coursesItems;
      }

    seeCourses() {
        if(this.state.courses.length > 0) {
        let courseList =  <div><this.coursesList courses={this.state.courses}/></div>;
        return courseList;
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
                    <label>Student or lecturer id:</label>
                    <input type="text" name="userId" value={this.state.userId} onChange={ev => this.setState({userId: ev.target.value})}/>
                    <br/>
                </div>
                <button value={this.state.loaded} onClick={this.getCourses}>Get courses</button>
                <div>
                    {this.seeCourses()}
                </div>
            </div>
        )
    }

}