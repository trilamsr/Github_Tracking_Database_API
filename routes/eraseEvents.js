var express = require('express');
var router = express.Router();
const event_controller = require('../controllers/events')

// Route related to delete events
router.delete('/', event_controller.eraseEvents)

module.exports = router;