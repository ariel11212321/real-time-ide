import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Share2, Play, Copy } from 'lucide-react';

const Room = () => {
  const { roomId } = useParams();
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const ws = useRef(null);

  const connectWebSocket = useCallback(() => {
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

    ws.current.onclose = () => {
      console.log('WebSocket Disconnected');
      setTimeout(connectWebSocket, 1000);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [roomId]);

  useEffect(() => {
    const cleanup = connectWebSocket();

    axios.get(`http://localhost:3001/api/code/${roomId}`)
      .then(response => setCode(response.data.code))
      .catch(error => console.error('Error fetching code', error));

    return cleanup;
  }, [roomId, connectWebSocket]);

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'code_update', roomId, code: newCode }));
    }
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

  const shareUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Code Room: {roomId}</h1>
        <button
          onClick={shareUrl}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {copied ? <Copy className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
          {copied ? 'Copied!' : 'Share'}
        </button>
      </div>
      <div className="mb-4">
        <textarea
          className="w-full h-64 p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          value={code}
          onChange={handleCodeChange}
          placeholder="Enter your code here..."
        ></textarea>
      </div>
      <button
        className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors mb-4"
        onClick={runCode}
      >
        <Play className="w-4 h-4 mr-2" />
        Run Code
      </button>
      <div className="bg-gray-100 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Output:</h3>
        <pre className="whitespace-pre-wrap bg-white p-4 rounded border border-gray-200 text-sm">{output}</pre>
      </div>
    </div>
  );
};

export default Room;