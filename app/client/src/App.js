import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Navbar from "./Navbar";
import Register from "./Register";
import Test from "./Test";
import TimeRow from "./TimeRow";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <>
              <Navbar /> <Dashboard />
            </>
          }
        />
        <Route
          path="test"
          element={
            <TimeRow  machID="mach-1"></TimeRow>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;





// import React from 'react'
// import './App.css'
// // import UserService from "../services/user.service";
// import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
// import Login from './Login'
// import SignUp from './SignUp'
// import Home from './Home'
// import authService  from './services/auth.service'
// import {useState ,useEffect} from 'react'
// function App() {
//   const [isAUth,setIsAUth] = useState(false)
//   useEffect(() =>{
//      authService.getUserBoard().then((response) =>{
// setIsAUth(response.auth)
//      }
//      )

//   })
//   function registerID(email ,password) {

//     authService.register(email, password).then((response)=>{
// setIsAUth(response.auth)
//  return isAUth ? <Navigate to='/' ><Home></Home></Navigate> : <Navigate to='/options'></Navigate>
//     })
//   }
//     function loginID(email, password) {

//       authService.login(email, password).then((response) => {
//         //?? console.log(response.auth);
//         setIsAUth(response.auth)
//         return isAUth ? <Navigate to='/' ><Home></Home></Navigate> : <Navigate to='/options'></Navigate>
//       })     


//   }
//   return (
//     <Router>
//       <Routes>
//         <Route path="/sign-in" element={<Login loginID={loginID} />} />
//         <Route path="/sign-up" element={<SignUp registerID={registerID} />} />
//         <Route path="/options" element={
//           <div className="App">
//             <nav className="navbar navbar-expand-lg navbar-light fixed-top">
//               <div className="container">
//                 <Link className="navbar-brand" to={'/options'}>
//                   Welcome to Dashboard
//                 </Link>
//                 <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
//                   <ul className="navbar-nav ml-auto">
//                     <li className="nav-item">
//                       <Link className="nav-link" to={'/sign-in'}>
//                         Sign in
//                       </Link>
//                     </li>
//                     <li className="nav-item">
//                       <Link className="nav-link" to={'/sign-up'}>
//                         Sign up
//                       </Link>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//             </nav>

//             <div className="outer">
//               <div className="inner">
//                 <Routes>
//                   {/* <Route exact path="/" element={<Login />} /> */}
//                   <Route path="/sign-in" element={<Login loginID={loginID} />} />
//                   <Route path="/sign-up" element={<SignUp registerID={registerID} />} />
//                 </Routes>
//               </div>
//             </div>
//           </div>} />
//         <Route path="/" element={isAUth ? <Home /> : <Navigate to='/options'></Navigate>}/> 
//         <Route path="/sign-in" element={isAUth ? <Home /> : <Navigate to='/options'></Navigate>} />
//         <Route path="/sign-up" element={isAUth ? <Home /> : <Navigate to='/options'></Navigate>} />
//         </Routes>
//     </Router>
//   )
// }

// export default App

//?old comments
//   var peiceData = []
//   var DefaultPeicedata = [{ machID: 'mach-1', pieces: 0 }, { machID: 'mach-2', pieces: 0 }, { machID: 'mach-3', pieces: 0 }, { machID: 'mach-4', pieces: 0 }, { machID: 'mach-5', pieces: 0 }, { machID: 'mach-6', pieces: 0}];
//   var timeData = []
//   var DefaultTimedata = [{ machID: 'mach-1', time: 0 }, { machID: 'mach-2', time: 0 }, { machID: 'mach-3', time: 0 }, { machID: 'mach-4',  time: 0 }, { machID: 'mach-5',  time: 0 }, { machID: 'mach-6',  time: 0 }];

//   const [graphDataTime, setGraphDataTime] =useState(DefaultTimedata)
//   const [graphDatapieces, setGraphDatapieces] = useState(DefaultPeicedata)

//   async function PushPeiceData(machineData,index){
//    peiceData[index] = machineData

// }
//   async function PushTimeData(peicedata, index) {
//     timeData[index] = peicedata

//   }
// useEffect(() => {
//   setInterval(() => {

//   setGraphDataTime(timeData)
//     if (graphDataTime.length == 0) {
//       setGraphDataTime(DefaultTimedata)
//     }
//     setGraphDatapieces(peiceData)
//     if (graphDatapieces.length == 0) {
//       setGraphDatapieces(DefaultPeicedata)
//     }

//   }
//   ,4000)
  

//   },[setGraphDatapieces,setGraphDataTime]);
//   return (
//     <>
// <Router>
//       <ReactHTMLTableToExcel
//         id="test-table-xls-button"
//         className="download-table-xls-button"
//         table="table-to-xls"
//         filename="timeEfficiency"
//         sheet="tablexls"
//         buttonText="Download as XLS" />
//       <Table id="table-to-xls"
//       bordered
//       variant='dark'
//       >
//         <thead>
//         <tr>
//           <th>machine-id</th>
//           <th>time</th>
//           <th>efficiency</th>
//         </tr>
//         </thead>
//         <tbody>
//         <TimeRow PushTimeData={PushTimeData}   machID='mach-1'></TimeRow>
//         <TimeRow PushTimeData={PushTimeData}   machID='mach-2'></TimeRow>
//         <TimeRow PushTimeData={PushTimeData}   machID='mach-3'></TimeRow>
//         <TimeRow PushTimeData={PushTimeData}   machID='mach-4'></TimeRow>
//         <TimeRow PushTimeData={PushTimeData}   machID='mach-5'></TimeRow>
//         <TimeRow PushTimeData={PushTimeData}   machID='mach-6'></TimeRow>
//         </tbody>
//       </Table>  
//       <ReactHTMLTableToExcel
//         id="test-table-xls-button"
//         className="download-table-xls-button"
//         table="table-to-xls-pieces"
//         filename="peiceEfficiency"
//         sheet="tablexls"
//         buttonText="Download as XLS" />
//       <Table id="table-to-xls-pieces"
//         bordered
//         variant='dark'
//       >
//         <thead>
//           <tr>
//             <th>machine-id</th>
//             <th>pieces</th>
//             <th>efficiency</th>
//           </tr>
//         </thead>
//         <tbody>
//           <piecesRow PushPeiceData={PushPeiceData} machID='mach-1'></piecesRow>
//           <piecesRow PushPeiceData={PushPeiceData} machID='mach-2'></piecesRow>
//           <piecesRow PushPeiceData={PushPeiceData} machID='mach-3'></piecesRow>
//           <piecesRow PushPeiceData={PushPeiceData} machID='mach-4'></piecesRow>
//           <piecesRow PushPeiceData={PushPeiceData} machID='mach-5'></piecesRow>
//           <piecesRow PushPeiceData={PushPeiceData} machID='mach-6'></piecesRow>
//         </tbody>
//       </Table>
//      <ReactHTMLTableToExcel
//         id="test-table-xls-button"
//         className="download-table-xls-button"
//         table="table-to-xls-report"
//         filename="report"
//         sheet="tablexls"
//         buttonText="Download as XLS" />
//       <Table id="table-to-xls-report" 
//       bordered
//       variant='dark'>
//           <thead>
//             <tr>
//               <th>mach-id</th>
//               <th>8:00-8:30</th>
//               <th>8:30-9:00</th>
//               <th>9:00-9:30</th>
//               <th>10:00-10:30</th>
//               <th>10:30-11:00</th>
//               <th>11:00-11:30</th>
//               <th>11:30-12:00</th>
//               <th>12:00-12:30</th>
//               <th>12:30-13:00</th>
//               <th>13:00-13:30</th>
//               <th>13:30-14:00</th> 
//               <th>14:00-14:30</th>
//               <th>14:00-15:00</th>
//               <th>15:00-15:30</th>
//               <th>15:30-16:00</th>
//               <th>16:00-16:30</th>
//               <th>16:30-17:00</th>
//               <th>17:00-17:30</th>
//               <th>17:30-18:00</th>
//               <th>18:00-18:30</th>
//               <th>18:30-19:00</th>
//               <th>19:00-20:00</th>
//               <th>20:00-21:30</th>
//             </tr>
//           </thead>
//           <tbody>
//            <RecordRow machID="mach-1"/>
//           <RecordRow machID="mach-2" />
//           <RecordRow machID="mach-3" />
//           <RecordRow machID="mach-4" />
//           <RecordRow machID="mach-5" /> 
//           <RecordRow machID="mach-6" />
//             </tbody>
//           </Table>
//         <Graph graphData={graphDatapieces} label="pieces"></Graph>
//         <Graph graphData={graphDataTime} label="time"></Graph>
