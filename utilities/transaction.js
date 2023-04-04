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
    const refUser = await User.findByIdAndUpdate(
      user.referral,
      {
        point: req.user.point + reward * 0.1,
      },
      { new: true }
    );
    if (refUser) {
      createTransaction(
        'Referral Reward',
        reward * 0.1,
        'Referral Reward',
        refUser._id,
        null
      );
    }
  }
  if (refUser.referral2) {
    const refUser2 = await User.findByIdAndUpdate(
      refUser.referral2,
      {
        point: req.user.point + reward * 0.05,
      },
      { new: true }
    );
    if (refUser2) {
      createTransaction(
        'Referral Reward',
        reward * 0.1,
        'Referral Reward',
        refUser2._id,
        null
      );
    }
  }
};

module.exports = {
  create: createTransaction,
  generateReferral: generateReferralForUser,
};
