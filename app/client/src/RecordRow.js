
import React, { useEffect,useState } from 'react'
import openSocket from 'socket.io-client';
var socket = openSocket("http://localhost:5000")

function RecordRow({machID}) {

    // function getRecord(cb) {
    //     socket.on("getRecord"+machID, (record) => cb(record));
    //     socket.emit(`subscribeToRecord+${machID}`);
    // }
    const[time, setTime] = useState([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
    function   getRecord(record){
       if(record.length != 0) {
        setTime(record)}
        setTime([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0,0,0,0])
    }
  useEffect(() => {
    const sse = new EventSource("http://localhost:5000/stream", {
      withCredentials: true,
    });
    //  sse.onmessage = (e) => getRealtimeData(JSON.parse(e.data));
    sse.addEventListener(`${machID}/record`, (e) => {
      getRecord(JSON.parse(e.data));
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
        <td key={machID}>{machID}</td>
     {

        time.map((value)=>{
            // console.log(value)   
            return <td key={Math.floor(Math.random() *5000).toString()}>{value}</td>
        })
        
    }
      </tr>
  )
}

export default RecordRow