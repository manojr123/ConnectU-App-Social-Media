const express = require('express');
const router = express.Router();
const passport = require('passport');

const friendsController = require('../controllers/friends_controller');

router.post('/add/:id',passport.checkAuthentication, friendsController.add);
router.get('/accept/:id',passport.checkAuthentication, friendsController.accept);
router.get('/delete/:id',passport.checkAuthentication, friendsController.destroy);

router.get('/requests',passport.checkAuthentication, friendsController.requests);
router.get('/destroy/:id',passport.checkAuthentication, friendsController.destroy);

module.exports = router;