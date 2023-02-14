const express = require('express'); // Will not create new instance of express. If existing, same instance is returned

const router = express.Router();
const homeController = require('../controllers/home_controller');

console.log('Router loaded');

router.get('/',homeController.home);
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));

// for any further routes, access from here
// router.use('/routerName', require('./routerfile'));


module.exports = router;