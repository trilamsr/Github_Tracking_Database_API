var express = require('express');
var router = express.Router();
const event_controller = require('../controllers/events')

// Routes related to event

router.get('/', event_controller.getAllEvents)
router.get('/:id', event_controller.getById)
router.get('/actors/:id', event_controller.getByActor)
router.post('/', event_controller.addEvent)


module.exports = router;