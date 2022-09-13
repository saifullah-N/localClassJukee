import React, { useEffect, useState } from "react";
// import openSocket from 'socket.io-client';
// import { getMac, subscribeTopieces } from './api'
// var socket = openSocket("http://localhost:5000")
// import sse from "./EventSource";
function PiecesRow({ machID, PushPeiceData }) {
  const [pieces, setPieces] = useState(0);
  // function subscribeTopieces(cb) {
  //     socket.on(machID+"pieces", (pieces) => cb(pieces));
  //     socket.emit(`subscribeTopieces+${machID}`);
  // }
  // useEffect(() => {
  //     subscribeTopieces((pieces) => {
  //         //console.log('pieces :'+pieces);
  //         // console.log('time :'+time);
  //         setPieces(pieces)
  //         PushPeiceData({ machID: machID, pieces: parseInt(pieces) }, parseInt((machID.slice(machID.length - 1)) - 1));

  //     })

  // })
  const sse = new EventSource("http://localhost:5000/stream", {
    withCredentials: true,
  });
  useEffect(() => {
    sse.addEventListener(`${machID}/piece`, (e) => {
      if (e.data != "undefined") setPieces(parseInt(JSON.parse(e.data)));
      else setPieces(0);
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
    <tr key={machID}>
      <td>{machID}</td>
      <td>{pieces}</td>
      <td>{"efficiency"}</td>
    </tr>
  );
}

export default PiecesRow;
