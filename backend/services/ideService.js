const Room = require('../models/Room');
const User = require('../models/User');
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

exports.joinRoom = async (roomId, userId, username) => {
  let room = await Room.findOne({ roomId });
  if (!room) {
    room = new Room({ roomId });
    await room.save();
  }

  let user = await User.findOne({ userId });
  if (!user) {
    user = new User({ userId, username });
    await user.save();
  }

  return room;
};

exports.getRoomCode = async (roomId) => {
  const room = await Room.findOne({ roomId });
  return room ? room.code : '';
};

exports.updateRoomCode = async (roomId, newCode) => {
  await Room.findOneAndUpdate({ roomId }, { code: newCode, updatedAt: Date.now() });
};

exports.runCode = async (roomId, code) => {
  const room = await Room.findOne({ roomId });
  if (!room) throw new Error('Room not found');

  const fileName = `temp_${roomId}.js`;
  const filePath = path.join(__dirname, '..', 'temp', fileName);

  await fs.writeFile(filePath, code);

  return new Promise((resolve, reject) => {
    exec(`node ${filePath}`, (error, stdout, stderr) => {
      fs.unlink(filePath).catch(console.error);  // Clean up temp file
      if (error) {
        reject(error);
      } else {
        resolve(stdout || stderr);
      }
    });
  });
};

exports.handleFileUpload = async (roomId, file) => {
  const uploadPath = path.join(__dirname, '..', 'uploads', file.name);
  await file.mv(uploadPath);

  const fileContent = await fs.readFile(uploadPath, 'utf8');
  await this.updateRoomCode(roomId, fileContent);

  return { success: true, message: 'File uploaded and code updated.' };
};