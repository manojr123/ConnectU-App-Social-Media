const express = require('express');
const router = express.Router();
const passport = require('passport');

const messagesController = require('../controllers/messages_controller');

router.get('/load',passport.checkAuthentication, messagesController.load);

module.exports = router;