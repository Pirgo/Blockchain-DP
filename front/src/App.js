import logo from './logo.svg';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Navigator from "./components/navigator"
import StudentTransactions from "./components/studenttransactions"

function App() {
  return (
    <Router>

      <div className='container'>
        <Navigator />
        <br/>
        <Routes>
          <Route path="/getStudent" element={<StudentTransactions />} />
        </Routes>
        
      </div>

    </Router>
  );
}

export default App;
