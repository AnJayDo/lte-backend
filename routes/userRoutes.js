const { Router } = require('express');
const userController = require('../controllers/userController');
const { checkUser } = require('../middleware/authMiddleware');

const router = Router();

router.get('/me', checkUser, userController.me_get);

router.get('/transactions', checkUser, userController.transactions_get);

router.put('/gainpoint', checkUser, userController.gainpointByToken_put);

router.get('/all', userController.alluser_get);

router.put('/reset-quiz', userController.resetQuiz_put);
router.put('/update-stake', userController.updateStake_put);

router.put('/reset-default-password', userController.resetToDefaultPassword_put);

router.get('/email/:email', userController.userByEmail_get)

router.put('/id/:id', checkUser, userController.updateUserWithIdByToken_put);

//Stake
router.get('/stake', checkUser, userController.stakeByToken_get);
router.post('/stake', checkUser, userController.stakeByToken_post);
router.put('/stake', checkUser, userController.withdrawStake_put)

//Referral
router.put('/referral', checkUser, userController.generateReferral_put)

module.exports = router;