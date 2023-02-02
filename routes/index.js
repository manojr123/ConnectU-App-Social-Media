const express = require('express'); // Will not create new instance of express. If existing, same instance is returned

const router = express.Router();
const homeController = require('../controllers/home_controller');

console.log('Router loaded');

router.get('/',homeController.home);

module.exports = router;