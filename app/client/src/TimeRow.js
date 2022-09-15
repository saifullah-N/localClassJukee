import React, { useEffect, useState } from "react";
// import sse from "./EventSource.js"
const sse = new EventSource("http://localhost:5000/stream", {
  withCredentials: true,
});

function TimeRow({ machID }) {
  const [time, setTime] = useState(0);
  const getTime = () => {

     sse.addEventListener(`${machID}/time`, (e) => {
      if (e.data != "undefined" && e.data !== null) {
         setTime(parseInt(JSON.parse(e.data)));
      } else setTime(0);
    });
    sse.onerror = () => {
      // error log here

      sse.close();
    };
    return () => {
      sse.close();
    };
  };
  useEffect(() => {
    getTime()
  });
  return (
    <tr>
      <td>{machID}</td>
      <td>{time}</td>
      <td>{"efficiency"}</td>
    </tr>
  );
}

export default TimeRow;
