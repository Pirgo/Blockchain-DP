import logo from './logo.svg';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Navigator from "./components/navigator"

function App() {
  return (
    <Router>

      <div className='rootContainer'>
        <Navigator />

      </div>

    </Router>
  );
}

export default App;
