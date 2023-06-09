const express = require('express');
const router = express.Router();
const passport = require('passport');
const usersController = require('../controllers/users_controller');

router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
router.post('/update/:id', passport.checkAuthentication, usersController.update);

router.get('/login', usersController.login);
router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);
router.post('/create', usersController.create);



// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate (
    'local',
    {failureRedirect : '/users/sign-in' },
    ),  usersController.createSession);

router.get('/sign-out',usersController.destroySession);

// /auth/google given by passport
router.get('/auth/google', passport.authenticate('google', {scope :['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRidirect: '/users/sign-in'}), usersController.createSession);

// /auth/github given by passport


module.exports = router; 