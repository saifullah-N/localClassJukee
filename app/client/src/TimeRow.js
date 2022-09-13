import React, { useEffect, useState } from "react";
const sse = new EventSource("http://localhost:5000/stream", {
  withCredentials: true,
});

function TimeRow({ machID, PushTimeData }) {
  const [time, setTime] = useState(0);
  useEffect(() => {
    sse.addEventListener(`${machID}/time`, (e) => {
      if (e.data != "undefined" && e.data !== null)
        setTime(parseInt(JSON.parse(e.data)));
      else setTime(0);
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
  );
}

export default TimeRow;
