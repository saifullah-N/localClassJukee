import React, { useEffect, useState } from 'react'

function Test() {
    const [piece,setpiece]=useState()
    const [test,setTest]=useState("ss")
    useEffect(()=>{
         const sse = new EventSource("http://localhost:5000/stream", {
           withCredentials: true,
         });
         function getRealtimeData(data) {
              setpiece(data)
         }
        //  sse.onmessage = (e) => getRealtimeData(JSON.parse(e.data));
         sse.addEventListener("mach-1/piece", (e) => {
          console.log(e.data)
           setTest(JSON.parse(e.data));
         });
         sse.onerror = () => {
           // error log here

           sse.close();
         };
         return () => {
           sse.close();
         };


    })
  return (
    <div>{piece}
    <p>{test}</p>
    </div>
    
  )
}

export default Test