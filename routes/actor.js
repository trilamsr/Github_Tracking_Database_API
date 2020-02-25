var express = require('express');
var router = express.Router();

// Routes related to actor.
const actor_controller = require('../controllers/actors')

router.get('/', actor_controller.getAllActors)
router.get('/streak', actor_controller.getStreak)
router.get('/:id', actor_controller.getById)
router.post('/', actor_controller.addActor)
router.put('/', actor_controller.updateActor)


module.exports = router;