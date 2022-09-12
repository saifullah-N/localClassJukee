import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import './App.css';
import ReactHTMLTableToExcel from 'react-html-table-to-excel'
import Table from 'react-bootstrap/Table'
import {useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
import TimeRow from './TimeRow';
import PiecesRow from './PiecesRow';
import Graph from './Graph';
import _ from 'lodash';
import RecordRow from './RecordRow';
import openSocket from 'socket.io-client';
var socket = openSocket("http://localhost:5000")

const Dashboard = () => {
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [users, setUsers] = useState([]);
    const history = useNavigate();
    // axios.defaults.withCredentials = true;
    const [status ,setStatus] = useState()
    const location = useLocation()
    useEffect(() => {
        setStatus(location.state)
        status == "login" ? getUsers() : console.log(location.state)
        status == "login" ? refreshToken() : console.log(location.state)
}
    , []);

    const refreshToken = async () => {
        try {
            let data = JSON.parse(localStorage.getItem('user'))
            // console.log(data)
            const response = await axios.post('http://localhost:5000/token',{  refreshToken: data });
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
        } catch (error) {
            if (error.response) {
                history("/");
            }
        }
    }

    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.post('http://localhost:5000/token', { refreshToken: JSON.parse(localStorage.getItem('user')) });
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    const getUsers = async () => {
        const response = await axiosJWT.get('http://localhost:5000/users', {
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        setUsers(response.data);
    }
    var peiceData = []
    var DefaultPeicedata = [{ machID: 'mach-1', pieces: 0 }, { machID: 'mach-2', pieces: 0 }, { machID: 'mach-3', pieces: 0 }, { machID: 'mach-4', pieces: 0 }, { machID: 'mach-5', pieces: 0 }, { machID: 'mach-6', pieces: 0 }];
    var timeData = []
    var DefaultTimedata = [{ machID: 'mach-1', time: 0 }, { machID: 'mach-2', time: 0 }, { machID: 'mach-3', time: 0 }, { machID: 'mach-4', time: 0 }, { machID: 'mach-5', time: 0 }, { machID: 'mach-6', time: 0 }];

    const [graphDataTime, setGraphDataTime] = useState(DefaultTimedata)
    const [graphDatapieces, setGraphDatapieces] = useState(DefaultPeicedata)

    async function PushPeiceData(machineData, index) {
        peiceData[index] = machineData

    }
    async function PushTimeData(peicedata, index) {
        timeData[index] = peicedata

    }
    useEffect(() => {
        setInterval(() => {

            setGraphDataTime(timeData)
            if (graphDataTime.length == 0) {
                setGraphDataTime(DefaultTimedata)
            }
            setGraphDatapieces(peiceData)
            if (graphDatapieces.length == 0) {
                setGraphDatapieces(DefaultPeicedata)
            }

        }
            , 4000)


    }, [setGraphDatapieces, setGraphDataTime]);
    return (
        <div>
            <div className='row'>
            <div className='col-md-6'>
                <div className='part'>
                <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="download-table-xls-button btn btn-primary"
                    table="table-to-xls"
                    filename="timeEfficiency"
                    sheet="tablexls"
                    buttonText="Download as XLS" />
                <Table id="table-to-xls"
                    bordered
                >
                    <thead>
                        <tr>
                            <th>machine-id</th>
                            <th>time</th>
                            <th>efficiency</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TimeRow PushTimeData={PushTimeData} machID='mach-1'></TimeRow>
                        <TimeRow PushTimeData={PushTimeData} machID='mach-2'></TimeRow>
                        <TimeRow PushTimeData={PushTimeData} machID='mach-3'></TimeRow>
                        <TimeRow PushTimeData={PushTimeData} machID='mach-4'></TimeRow>
                        <TimeRow PushTimeData={PushTimeData} machID='mach-5'></TimeRow>
                        <TimeRow PushTimeData={PushTimeData} machID='mach-6'></TimeRow>
                    </tbody>
                </Table>
                </div>
                </div>
                <div className='col-md-6'>
                    <div className='part'>
                <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="download-table-xls-button btn btn-primary"
                    table="table-to-xls-pieces"
                    filename="peiceEfficiency"
                    sheet="tablexls"
                    buttonText="Download as XLS" />
                <Table id="table-to-xls-pieces"
                    bordered
                >
                    <thead>
                        <tr>
                            <th>machine-id</th>
                            <th>pieces</th>
                            <th>efficiency</th>
                        </tr>
                    </thead>
                    <tbody>
                        <PiecesRow PushPeiceData={PushPeiceData} machID='mach-1'></PiecesRow>
                        <PiecesRow PushPeiceData={PushPeiceData} machID='mach-2'></PiecesRow>
                        <PiecesRow PushPeiceData={PushPeiceData} machID='mach-3'></PiecesRow>
                        <PiecesRow PushPeiceData={PushPeiceData} machID='mach-4'></PiecesRow>
                        <PiecesRow PushPeiceData={PushPeiceData} machID='mach-5'></PiecesRow>
                        <PiecesRow PushPeiceData={PushPeiceData} machID='mach-6'></PiecesRow>
                    </tbody>
                </Table>
                </div>
                
                </div>
                </div>
            <div className='row'>
            <div className='col-md-6'>
                <div className='part'>
                    
                    <Graph graphData={graphDataTime} label="time"></Graph>
                    </div>
                    </div>
            
            <div className='col-md-6'>
                <div className='part'>
            <Graph graphData={graphDatapieces} label="pieces"></Graph>

                </div>
                </div>
                </div>
                <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="download-table-xls-button btn btn-primary"
                    table="table-to-xls-report"
                    filename="report"
                    sheet="tablexls"
                    buttonText="Download as XLS" />
                <Table id="table-to-xls-report"
                    bordered>
                    <thead>
                        <tr>
                            <th>mach-id</th>
                            <th>8:00-8:30</th>
                            <th>8:30-9:00</th>
                            <th>9:00-9:30</th>
                            <th>10:00-10:30</th>
                            <th>10:30-11:00</th>
                            <th>11:00-11:30</th>
                            <th>11:30-12:00</th>
                            <th>12:00-12:30</th>
                            <th>12:30-13:00</th>
                            <th>13:00-13:30</th>
                            <th>13:30-14:00</th>
                            <th>14:00-14:30</th>
                            <th>14:00-15:00</th>
                            <th>15:00-15:30</th>
                            <th>15:30-16:00</th>
                            <th>16:00-16:30</th>
                            <th>16:30-17:00</th>
                            <th>17:00-17:30</th>
                            <th>17:30-18:00</th>
                            <th>18:00-18:30</th>
                            <th>18:30-19:00</th>
                            <th>19:00-20:00</th>
                            <th>20:00-21:30</th>
                        </tr>
                    </thead>
                    <tbody>
                        <RecordRow machID="mach-1" />
                        <RecordRow machID="mach-2" />
                        <RecordRow machID="mach-3" />
                        <RecordRow machID="mach-4" />
                        <RecordRow machID="mach-5" />
                        <RecordRow machID="mach-6" />
                    </tbody>
                </Table>
           
        </div>
    );
}

export default Dashboard;
