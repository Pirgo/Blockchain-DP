import React, {Component} from "react";
import { Link } from "react-router-dom";

export default class Navigator extends Component {
    constructor() {
        super();
    }


    render() {
        return (
            <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
                <div className="collpase navbar-collapse">
                    <Link to="/" className="navbar-brand">Dziekanat</Link>
                    <ul className="navbar-nav">
                        <li className="navbar-item">
                            <Link to="/addGrade" className="nav-link">Dodaj ocenę</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/addFinalGrade/" className="nav-link">Dodaj ocenę końcową</Link>
                        </li>

                        
                        <li className="navbar-item">
                            <Link to="/addCertificate" className="nav-link">Dodaj certyfikat</Link>
                        </li>

                        <li className="navbar-item">
                            <Link to="/addPresence" className="nav-link">Dodaj obecność</Link>
                        </li>

                        <li className="navbar-item">
                            <Link to="/getStudent" className="nav-link">Zobacz oceny(student)</Link>
                        </li>

                        <li className="navbar-item">
                            <Link to="/getLecturer" className="nav-link">Zobacz oceny(wykładowca)</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}