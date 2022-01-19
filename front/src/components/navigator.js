import React, {Component} from "react";
import { Link } from "react-router-dom";

export default class Navigator extends Component {
    constructor() {
        super();
        this.state = {
            
        }
    }

    render() {
        return (
            <div>
                <div>
                    <h2><strong>Virtual Deanery</strong></h2>
                    <p><strong>Based on Blockchain</strong></p>
                </div>
                    <div className="container inner">
                        <nav>
                            <ul className="nav masthead-nav">
                                <li>
                                    <Link to="/getStudent">See transactions (Student)</Link>
                                </li>
                                <li>
                                    <Link to="/getLecturer">See transactions (Lecturer)</Link>
                                </li>
                                <li>
                                    <Link to="/addTransaction">Add transaction</Link>
                                </li>
                                <li>
                                    <Link to="/getCourses">Courses</Link>
                                </li>
                                <li>
                                    <Link to="/getParticipants">Participants</Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
            </div>
        );
    }
}