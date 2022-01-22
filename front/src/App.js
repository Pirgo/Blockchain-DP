import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Navigator from "./components/navigator"
import StudentTransactions from "./components/studenttransactions"
import LecturerTransactions from './components/lecturertransactions';
import AddTransaction from './components/addtransaction';
import Courses from './components/courses';
import Participants from './components/participants';
import MainSite from './components/mainsite';

function App() {
  
  return (
    <Router>

      <div className='container'>
        <Navigator />
          <Routes>
            <Route path="/" element={<MainSite />} />
            <Route path="/getCourses" element={<Courses />} />
            <Route path="/getParticipants" element={<Participants />} />
            <Route path="/getStudent" element={<StudentTransactions />} />
            <Route path="/getLecturer" element={<LecturerTransactions />} />
            <Route path="/addTransaction" element={<AddTransaction />} />
          </Routes>
      </div>

    </Router>
  );
}

export default App;
