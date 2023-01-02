const { Router } = require('express');
const userController = require('../controllers/userController');
const { checkUser } = require('../middleware/authMiddleware');

const router = Router();

router.get('/me', checkUser, userController.me_get);

router.put('/gainpoint', checkUser, userController.gainpointByToken_put);

router.get('/all', userController.alluser_get);

router.put('/reset-quiz', userController.resetQuiz_put);

router.put('/reset-default-password', userController.resetToDefaultPassword_put);

router.get('/email/:email', userController.userByEmail_get)

router.put('/id/:id', checkUser, userController.updateUserWithIdByToken_put);

module.exports = router;