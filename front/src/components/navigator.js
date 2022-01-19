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
            <div className="masthead clearfix">
                    <div className="container inner">
                        <h3 className="masthead-brand">Blockchain deanery</h3>
                        <nav>
                            <ul className="nav masthead-nav">
                                <li>
                                    <Link to="/addTransaction">Add transaction</Link>
                                </li>
                                <li>
                                    <Link to="/getStudent">Transactions as student</Link>
                                </li>
                                <li>
                                    <Link to="/getLecturer">Transactions as lecturer</Link>
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