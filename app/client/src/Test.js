import React, { useEffect, useState } from 'react'
// import sse from './EventSource';
function Test() {
    const [piece,setpiece]=useState()
    const [test,setTest]=useState("ss")
   useEffect(() => {
     const sse = new EventSource("http://localhost:5000/stream", {
       withCredentials: true,
     });
     function getRealtimeData(data) {
      console.log("day",data)
      setTest(data)
       // process the data here,
       // then pass it to state to be rendered
     }
     sse.onmessage = (e) => {getRealtimeData(JSON.parse(e.data))
     console.log("called")}
     sse.onerror = () => {
       // error log here

       sse.close();
     };
     return () => {
       sse.close();
     }},[]);
  return (
    <div>{piece}
    <p>{test}</p>
    </div>
    
  )
}

export default Test