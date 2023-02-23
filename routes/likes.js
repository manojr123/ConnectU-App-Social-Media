const express = require('express'); // Will not create new instance of express. If existing, same instance is returned

const router = express.Router();

const likesController = require('../controllers/likes_controller');

router.post('/toggle', likesController.toggleLike);

module.exports = router;