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
                        <h3 className="masthead-brand">Wirtualny dziekanat</h3>
                        <nav>
                            <ul className="nav masthead-nav">
                                <li>
                                    <Link to="/addTransaction">Add transaction</Link>
                                </li>
                                <li>
                                    <Link to="/getStudent">See transactions as student</Link>
                                </li>
                                <li>
                                    <Link to="/getLecturer">See transactions as lecturer</Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
            </div>
        );
    }
}