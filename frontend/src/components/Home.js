import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Code, Users, Zap } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'

export default function Home() {
  const [roomId, setRoomId] = useState('')
  const navigate = useNavigate();


  const handleJoinRoom = async () => {
    if (roomId) {
      try {
        const response = await axios.post('http://localhost:3001/api/join', { roomId })
        if (response.data.success) {
          navigate(`/room/${roomId}`)
        }
      } catch (error) {
        console.error('Error joining room', error)
        alert('Failed to join room. Please try again.')
      }
    } else {
      alert('Please enter a room ID')
    }
  }

  const handleCreateRoom = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/create')
      if (response.data.success) {
        navigate(`/room/${response.data.roomId}`)
      }
    } catch (error) {
      console.error('Error creating room', error)
      alert('Failed to create room. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to Collaborative IDE</h1>
          <p className="text-xl text-gray-600 mb-8">Join a room or create a new one to start coding together!</p>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter Room ID"
                className="border rounded py-2 px-4 mr-2"
              />
              <button onClick={handleJoinRoom} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Join Room
              </button>
            </div>
            <div>
              <button onClick={handleCreateRoom} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                Create Room
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <Code className="mx-auto mb-4 text-4xl text-blue-500" />
            <h2 className="text-xl font-semibold mb-2">Real-time Collaboration</h2>
            <p className="text-gray-600">Code together in real-time with your team members.</p>
          </div>
          <div className="text-center">
            <Users className="mx-auto mb-4 text-4xl text-green-500" />
            <h2 className="text-xl font-semibold mb-2">Multiple Languages</h2>
            <p className="text-gray-600">Support for various programming languages and frameworks.</p>
          </div>
          <div className="text-center">
            <Zap className="mx-auto mb-4 text-4xl text-yellow-500" />
            <h2 className="text-xl font-semibold mb-2">Instant Execution</h2>
            <p className="text-gray-600">Run your code instantly and see the results in real-time.</p>
          </div>
        </div>
      </main>

  
      <footer className="bg-gray-800 text-white p-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 Collaborative IDE. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}