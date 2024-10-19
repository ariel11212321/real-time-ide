const express = require('express');
const router = express.Router();
const ideController = require('../controllers/ideController');

router.post('/join', ideController.joinRoom);
router.get('/code/:roomId', ideController.getRoomCode);
router.post('/run', ideController.runCode);
router.post('/upload', ideController.uploadFile);
router.post('/create', ideController.createRoom);


module.exports = router;