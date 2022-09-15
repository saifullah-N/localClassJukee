
import React, { useEffect,useState } from 'react'
import axios from 'axios';
function RecordRow() {

    const [pieces, setPieces] = useState([
      {
        machID: "mach-1",
        report: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        machID: "mach-2",
        report: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        machID: "mach-3",
        report: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        machID: "mach-4",
        report: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        machID: "mach-5",
        report: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        machID: "mach-6",
        report: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    ]);

//  const getRecord=()=>{  
//   sse.addEventListener(`${machID}/report`, (e) => {
//     console.log(JSON.parse(e.data));
//    setPieces(JSON.parse(e.data));
//  });
//     sse.onerror = () => {
//       sse.close();
//     };
//     return () => {
//       sse.close();
//     }}
//     getRecord()
//   });
    const getUsers = async () => {
      const response = await axios.get("http://localhost:5000/report",);
      setPieces(response.data);
    };
useEffect(() => {
getUsers()
  });
return (
  pieces.map((piece)=>{ 
        <tr>
        <td >{piece.machID}</td>
     {
        piece.report.map((value)=>{  
            return <td key={Math.floor(Math.random() *5000).toString()}>{value}</td>
        })
        
    }
      </tr>}
  )
)
}

export default RecordRow