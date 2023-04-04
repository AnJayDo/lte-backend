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
    const refUser = await User.findById(user.referral)
    const refUserUpdated = await User.findByIdAndUpdate(
      user.referral,
      {
        point: refUser.point + reward * 0.1,
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
  if (user.referral2) {
    const refUser2 = await User.findById(user.referral2)
    const refUser2Updated = await User.findByIdAndUpdate(
      user.referral2,
      {
        point: refUser2.point + reward * 0.05,
      },
      { new: true }
    );
    if (refUser2) {
      createTransaction(
        'Referral Reward',
        reward * 0.05,
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
