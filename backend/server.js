const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
const mongoose = require('mongoose');
const ideRoutes = require('./routes/ideRoutes');
const authRoutes = require('./routes/authRoutes');
const websocketHandler = require('./websocket/websocketHandler');
require('dotenv').config();
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


mongoose.connect('mongodb://localhost:27017/collaborativeIDE', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.use(cors());
app.use(express.json());
app.use(fileUpload());  
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', ideRoutes);
app.use('/api/auth', authRoutes);

wss.on('connection', websocketHandler);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});