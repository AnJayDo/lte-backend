const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

router.post('/signup', authController.signup_post);
router.post('/google/signup', authController.signupGoogle_post);
router.post('/metamask/signup', authController.signupMetamask_post);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);

module.exports = router;