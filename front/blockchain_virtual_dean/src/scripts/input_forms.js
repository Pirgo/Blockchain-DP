import React from "react";
import ReactDOM from 'react-dom';

function AddRate() {
    return (
        <form>
            <label>Enter id of student:
                <input type="text" />
            </label>

            <label>Enter course name:
                <input type="text" />
            </label>

            <label>Enter value of grade:
                <input type="number" />
            </label>

            <label>Enter weight of grade:
                <input type="number" />
            </label>
        </form>
    )
}

function AddFormRate() {
    ReactDOM.render(
      <AddRate />,
      document.getElementsByClassName('inside-content')[0]
    )
}

function AddPresence() {
    return (
        <form>
            <label>Enter id of student:
                <input type="text" />
            </label>

            <label>Enter date of presence:
                <input type="date" />
            </label>

            <label>Enter course name:
                <input type="text" />
            </label>

            <label>Enter value of presence:
                <input type="checkbox" />
            </label>
        </form>
    )
}

function AddPresenceForm() {
    ReactDOM.render(
      <AddPresence />,
      document.getElementsByClassName('inside-content')[0]
    )
}

export {AddFormRate, AddPresenceForm}