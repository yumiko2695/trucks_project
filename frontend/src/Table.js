import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Carrier from './Carrier'
import {FormGroup, Label, FormText, Table, CustomInput} from 'reactstrap'
import {
  Switch,
  Route,
  Link
} from "react-router-dom";
var DatePicker = require("reactstrap-date-picker");

function DataTable(props) {
  const [data, setData] = useState([])
  const [organizedData, setOrganizedData] = useState([])
  const [groupedTableData, setGroupedTableData] = useState([])
  const [startDate, setStateDate] = useState(new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString())
  const [endDate, setEndDate] = useState(new Date().toISOString())
  const [sortVal, setSortVal] = useState('')

  async function getData() {
    const data = await axios.get('/api/shipments')
    setData([...data.data])
  }
  function initialSort() {
    let copy = [...data]
    let d = new Date()
    d.setDate(d.getDate()-70)
    copy = copy.filter(shipment =>
      new Date(shipment.end_time) > d).sort(function(a,b) {
        return a.carrier_company_id - b.carrier_company_id
      })
      console.log(copy)
    setOrganizedData(copy)
  }
  function changeEndRange(v) {
    let copy = [...data]
    copy = copy.filter(shipment =>
      (new Date(startDate) < new Date(shipment.end_time) && new Date(shipment.end_time) < new Date(endDate))
    ).sort(function(a,b) {
      return a.carrier_company_id - b.carrier_company_id
    })
    setOrganizedData(copy)
  }
  function changeStartRange() {
    let copy = [...data]
    copy = copy.filter(shipment =>
      (new Date(startDate) < new Date(shipment.end_time) && new Date(shipment.end_time) < new Date(endDate))
    ).sort(function(a,b) {
      return a.carrier_company_id - b.carrier_company_id
    })
    setOrganizedData(copy)
  }
  function groupedDataCalc() {
    let obj = {}
    let copy = [...organizedData]
    for(let i=0; i<copy.length; i++) {
      //Intensity Factor = avg(total CO2 / weight (kg) / distance) * 1000
      let intensity = (copy[i].total_co2_emitted / copy[i].weight / copy[i].travelled_distance)*1000
      intensity = intensity.toFixed(2)
      if(obj[copy[i].carrier_company_id]) {
        obj[copy[i].carrier_company_id].push({...copy[i], intensity: intensity})
      } else {
        obj[copy[i].carrier_company_id] = [{...copy[i], intensity: intensity}]
      }
    }
    let arr = []
    for(let key in obj) {
      let totalDistance = 0;
      let totalWeight = 0;
      let totalIntensity = 0;
      let totalCO2 = 0;
      obj[key].map(char => {
        totalDistance += Number(char.travelled_distance)
        totalIntensity += Number(char.intensity)
        totalWeight += Number(char.weight)
        totalCO2 += Number(char.total_co2_emitted)
      })
      totalDistance = totalDistance.toFixed(2)
      let averageWeight = totalWeight / (obj[key].length)
      averageWeight = averageWeight.toFixed(2)
      let averageIntensity = totalIntensity / (obj[key].length)
      averageIntensity = averageIntensity.toFixed(2)
      let averageCO2 = totalCO2 / (obj[key].length)
      averageCO2 = averageCO2.toFixed(2)
      arr.push({carrier_company_id: key, totalDistance: totalDistance, averageCO2: averageCO2, averageIntensity: averageIntensity, averageWeight: averageWeight})
    }
    setGroupedTableData(arr);
  }

  function handleClick(event) {
    console.log(event.target.value)
    console.log('current', event.currentTarget.value)
      if(event.target.value === 'totalDistanceDescending') {
        setGroupedTableData([...groupedTableData].sort((a,b) => b.totalDistance - a.totalDistance))
      } else if(event.target.value === 'averageCO2Descending') {
        setGroupedTableData([...groupedTableData].sort((a,b) => b.averageCO2 - a.averageCO2))
      } else if(event.target.value === 'averageWeightDescending') {
        setGroupedTableData([...groupedTableData].sort((a,b) => b.averageWeight - a.averageWeight))
      } else if(event.target.value === 'carrierDescending') {
        setGroupedTableData([...groupedTableData].sort((a,b) => b.carrier_company_id - a.carrier_company_id))
      } else if(event.target.value === 'averageIntensityDescending') {
        setGroupedTableData([...groupedTableData].sort((a,b) => b.averageIntensity - a.averageIntensity))
      } else if(event.target.value === 'totalDistanceAscending') {
        setGroupedTableData([...groupedTableData].sort((a,b) => a.totalDistance - b.totalDistance))
      } else if(event.target.value === 'averageCO2Ascending') {
        setGroupedTableData([...groupedTableData].sort((a,b) => a.averageCO2 - b.averageCO2))
      } else if(event.target.value === 'averageWeightAscending') {
        setGroupedTableData([...groupedTableData].sort((a,b) => a.averageWeight - b.averageWeight))
      } else if(event.target.value === 'carrierAscending') {
        setGroupedTableData([...groupedTableData].sort((a,b) => a.carrier_company_id - b.carrier_company_id))
      } else if(event.target.value === 'averageIntensityAscending') {
        setGroupedTableData([...groupedTableData].sort((a,b) => a.averageIntensity - b.averageIntensity))
      }
  }

  useEffect(() => {
      getData()
  }, [])

  useEffect(() => {
    initialSort()
  }, [data])

  useEffect(() => {
    changeEndRange()
  }, [endDate])

  useEffect(() => {
    changeStartRange()
  }, [startDate])

  useEffect(() => {
    groupedDataCalc()
  }, [organizedData])


  return (
    <div className="Table">
      <div className="datePicker">
      <FormGroup>
        <Label>Start Date</Label>
        <DatePicker id= "start-datepicker" value={startDate} onChange= {(v,f) => setStateDate(v)} showClearButton={false}  />
        {/* <CustomInput style={  {backgroundColor: '#9bc2db',
  borderWidth: '1px',
  borderColor: 'black'}}/> */}
      </FormGroup>
      <FormGroup>
        <Label>End Date</Label>
        <DatePicker id="end-datepicker" value={endDate} onChange={(v,f) => setEndDate(v)}  showClearButton={false} showTodayButton={true}/>
      </FormGroup>
      </div>
      <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>Carrier Name <div><button onClick={handleClick} value='carrierAscending'>v</button><button onClick={handleClick} value='carrierDescending'>^</button></div></th>
          <th>Total Distance <div><button onClick={handleClick} value='totalDistanceAscending'>v</button><button onClick={handleClick} value='totalDistanceDescending'>^</button></div></th>
          <th>Average CO2 Emissions <div><button onClick={handleClick} value='averageCO2Ascending'>v</button><button onClick={handleClick}value='averageCO2Descending'>^</button></div></th>
          <th>Average Weight <div><button onClick={handleClick} value='averageWeightAscending'>v</button><button onClick={handleClick} value='averageWeightDescending'>^</button></div></th>
          <th>Average Intensity<div><button onClick={handleClick} value='averageIntensityAscending'>v</button><button onClick={handleClick}value='averageIntensityDescending'>^</button></div></th>
        </tr>
        {groupedTableData ? groupedTableData.map((row, index) => {
          return (
          <tr key={index}>
          <td>{index}</td>
          <td><Link to={`/carrier/${row.carrier_company_id}`}>{row.carrier_company_id}</Link></td>
          <td>{row.totalDistance}</td>
          <td>{row.averageCO2}</td>
          <td>{row.averageWeight}</td>
          <td>{row.averageIntensity}</td>
        </tr>
        )
      }) : <div></div>
        }

      </thead>
      </Table>
    </div>
  );
}

export default DataTable;
