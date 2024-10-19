const ideService = require('../services/ideService');

exports.joinRoom = async (req, res) => {
  const { roomId } = req.body;
  try {
    const room = await ideService.joinRoom(roomId);
    res.json({ success: true, roomId: room.roomId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getRoomCode = async (req, res) => {
  const { roomId } = req.params;
  try {
    const code = await ideService.getRoomCode(roomId);
    res.json({ success: true, code });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.runCode = async (req, res) => {
  const { roomId, code } = req.body;
  try {
    const output = await ideService.runCode(roomId, code);
    res.json({ success: true, output });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.uploadFile = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ success: false, error: 'No files were uploaded.' });
  }

  const file = req.files.file;
  const { roomId } = req.body;

  try {
    const result = await ideService.handleFileUpload(roomId, file);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const room = await ideService.createRoom();
    res.json({ success: true, roomId: room.roomId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
