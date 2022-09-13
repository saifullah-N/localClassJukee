import React, { useEffect, useState } from "react";
import _ from "lodash"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { saveAs } from 'file-saver';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
function Graph({label}) {  
    const sse =new EventSource("http://localhost:5000/stream")
    function saveCanvas() {
        //save to png
        const canvasSave = document.getElementById(label);
        canvasSave.toBlob(function (blob) {
            saveAs(blob, `${label}.png`)
        })
    }

    const [data, setData] = useState({

        labels: ['mach-1', 'mach-2', 'mach-3', 'mach-4', 'mach-5', 'mach-6'],
        datasets: [
            {
                label: label,
                data: [0,0,0,0,0,0,0],
                backgroundColor: "rgba(255, 99, 132, 0.5)",
            }
        ],
    })

   const options = {
        responsive: true,
        animations:{
            from:1,
            to: 1,
        },
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: `Efficiency of Machines based on ${label}`,
            },
        },
    };

  function graphSetter(data){ 
        // const plotData = data;
        const labels = [
          "mach-1",
          "mach-2",
          "mach-3",
          "mach-4",
          "mach-5",
          "mach-6",
        ];

        // pieces.map((p) => {
        //     if (p === null || p === NaN)
        //         p = 0
        // })S
        const defineData = {

            labels: labels,
            datasets: [
                {
                    label: label,
                    data: data,
                    backgroundColor: "rgba(255, 99, 132, 0.5)",
                }
                // {
                //     label: "time",
                //     data: time,
                //     backgroundColor: "rgba(53, 162, 235, 0.5)",
                // },
            ],
        }
        setData(defineData)
    
}


  useEffect(() => {
    // console.log(sse.readyState)
    sse.addEventListener(`${label}Graph`, (e) => {
    console.log(JSON.parse(e.data));
        // console.log("event");
      if (e.data != undefined && e.data !== null)
        graphSetter((JSON.parse(e.data)));
        // graphSetter([1,2,3,4,5,6])
      else graphSetter([0,0,0,0,0,0]);
    });
    sse.onerror = () => {
      sse.close();
    };
  });

 
    return (
        <>

            <div style={{ margin: "auto auto" }}>
                <a onClick={saveCanvas} className="btn btn-primary">Download as PNG</a>
                <Bar options={options}  id={label} data={data} />
            </div>
        </>
    );
}

export default Graph;