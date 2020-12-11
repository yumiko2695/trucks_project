import logo from './tracks.png';
import './App.css';
import React from 'react'
import DataTable from'./Table'
import Carrier from './Carrier'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {
  return (
  <Router>
    <div className="Header">
              <img src={logo}/>
              <h1>Tracks for Trucks Carrier Data</h1>
            </div>
    <Switch>
  <Route path="/carrier/:carrierId" >
    <Carrier />
    </Route>
          <Route exact path="/">
          <div className="App">
            <DataTable />
          </div>
          </Route>

        </Switch>

    </Router>
  );
}

export default App;
