import React from "react";

class Transaction {
    constructor(date, lecturer) {
        this.date = date;
        this.lecturer = lecturer;
        this.values = new Map();
    }

    addParam(key, value) {
        this.values.set(key, value);
    }
}