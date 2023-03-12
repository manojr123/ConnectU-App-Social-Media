const express = require('express'); // Will not create new instance of express. If existing, same instance is returned

const router = express.Router();
const homeController = require('../controllers/home_controller');

console.log('Router loaded');

router.get('/',homeController.home);
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));
router.use('/likes', require('./likes'));
router.use('/friends', require('./friends'));
router.use('/messages', require('./messages'));

router.use('/api', require('./api'));

// for any further routes, access from here
// router.use('/routerName', require('./routerfile'));


module.exports = router;