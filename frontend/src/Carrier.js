import React, {useEffect, useState} from 'react'
import {FormGroup, Label, FormText, Table, CustomInput} from 'reactstrap'
import {
  Switch,
  Route,
  useParams,
  Link
} from "react-router-dom";


function Carrier() {
  const { carrierId } = useParams();
  return (
    <div>
      <div>Carrier ID: {carrierId}</div>
      <button><Link to='/'>Go Back</Link></button>
    </div>
  );
}

export default Carrier;
