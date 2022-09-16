
import React, { useEffect,useState } from 'react'
import axios from 'axios';
function RecordRow({machID}) {

    const [pieces, setPieces] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
useEffect(() => {
  async function getReport(){
let data =await axios.post(`http://localhost:5000/report/${machID}`)
if(data.data!=null && data.data!=undefined)
  setPieces(data.data)
else{
  setPieces([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
}
}
getReport()
  });
return (

        <tr>
        <td >{machID}</td>
     {
        pieces.map((value)=>{  
            return <td key={Math.floor(Math.random() *5000).toString()}>{value}</td>
        })
        
    }
      </tr>

)
}

export default RecordRow