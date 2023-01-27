const Transaction = require('../models/Transaction');
const User = require('../models/User');

const createTransaction = async function (
  name,
  amount,
  description,
  toUser,
  fromUser
) {
  const transaction = await Transaction.create({
    name,
    amount,
    description,
    status: 'success',
    toUser,
    fromUser,
  });
  return transaction;
};

const generateReferralForUser = async function (user, reward) {
  if (user.referral) {
    const user = await User.findByIdAndUpdate(
      user.referral,
      {
        point: req.user.point + reward * 0.1,
      },
      { new: true }
    );
    if (user) {
      createTransaction(
        'Referral Reward',
        reward * 0.1,
        'Referral Reward',
        user._id,
        null
      );
    }
  }
  if (user.referral2) {
    const user = await User.findByIdAndUpdate(
      user.referral2,
      {
        point: req.user.point + reward * 0.05,
      },
      { new: true }
    );
    if (user) {
      createTransaction(
        'Referral Reward',
        reward * 0.1,
        'Referral Reward',
        user._id,
        null
      );
    }
  }
};

module.exports = {
  create: createTransaction,
  generateReferral: generateReferralForUser,
};
