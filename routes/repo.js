var express = require('express');
var router = express.Router();
const repo_controller = require('../controllers/repos')

// Routes related to repo

router.get('/', repo_controller.getAllRepos)
router.get('/:id', repo_controller.getById)
router.post('/', repo_controller.addRepo)

module.exports = router;