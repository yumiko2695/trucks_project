import logo from './logo.svg';
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
    <Switch>
  <Route path="/carrier/:carrierId" >
    <Carrier />
    </Route>
          <Route exact path="/">
          <div className="App">
            <div>Put Header Here</div>
            <DataTable />
          </div>
          </Route>

        </Switch>

    </Router>
  );
}

export default App;
