 const sse = new EventSource("http://localhost:5000/stream", {
  withCredentials: true,
});
export default sse;

