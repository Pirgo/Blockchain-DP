import React, { Component } from "react";
import axios from 'axios';

export default class StudentTransactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactions: []
        }
    }

    componentDidMount() {
        const body = { }
        axios.post('http://192.168.0.66:3001/mine-transactions', body)
            .then(response => {
                this.setState({ transactions: response.data })
            })
    }

    render() {
        return (
            <>
                <div className="container">
                    <h2>asd</h2>
                    <ul>
                        <li>ASD</li>
                    </ul>
                </div>
            </>
        )
    }
}