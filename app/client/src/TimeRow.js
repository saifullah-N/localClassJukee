
import React, { useEffect, useState } from 'react'
import openSocket from 'socket.io-client';
// import { getMac, subscribeToTime } from './api'

var socket = openSocket("http://localhost:5000")


function TimeRow({machID,PushTimeData}) {
    
// function subscribeToTime(cb) {
//         socket.on(machID+"time", (time) => cb(time));
//         socket.emit(`subscribeToTime+${machID}`);}
const [time,setTime]=useState(0)
// useEffect(()=>{
//   subscribeToTime((time)=>{
//     //console.log('pieces :'+pieces);
//     // console.log('time :'+time);
//    setTime(time)
//     PushTimeData({ machID: machID, time: parseInt(time) }, parseInt((machID.slice(machID.length - 1))-1));
   
//   })
  
// })
  useEffect(() => {
    const sse = new EventSource("http://localhost:5000/stream", {
      withCredentials: true,
    });
    //  sse.onmessage = (e) => getRealtimeData(JSON.parse(e.data));
    sse.addEventListener(`${machID}/time`, (e) => {
    if(e.data != undefined && e.data != null)
     setTime(e.data)
        //  setTime(JSON.parse(e.data));}
     else setTime(0)
    });
    sse.onerror = () => {
      // error log here

      sse.close();
    };
    return () => {
      sse.close();
    };
  });
return (
  <tr>
          <td>{machID}</td>
          <td>{time}</td>
          <td>{"efficiency"}</td>
      </tr>
  )
}

export default TimeRow