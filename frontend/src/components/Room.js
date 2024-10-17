import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Room = () => {
  const { roomId } = useParams();
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const ws = useRef(null);

  useEffect(() => {
    // Connect to WebSocket
    ws.current = new WebSocket(`ws://localhost:3001`);

    ws.current.onopen = () => {
      console.log('WebSocket Connected');
      ws.current.send(JSON.stringify({ type: 'join', roomId }));
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'code_update') {
        setCode(data.code);
      }
    };

    // Fetch initial code
    axios.get(`http://localhost:3001/api/code/${roomId}`)
      .then(response => setCode(response.data.code))
      .catch(error => console.error('Error fetching code', error));

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [roomId]);

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    ws.current.send(JSON.stringify({ type: 'code_update', roomId, code: newCode }));
  };

  const runCode = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/run', { roomId, code });
      setOutput(response.data.output);
    } catch (error) {
      console.error('Error running code', error);
      setOutput('Error running code');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Room: {roomId}</h2>
      <div className="mb-3">
        <textarea
          className="form-control"
          rows="10"
          value={code}
          onChange={handleCodeChange}
        ></textarea>
      </div>
      <button className="btn btn-primary mb-3" onClick={runCode}>Run Code</button>
      <div className="mb-3">
        <h3>Output:</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default Room;