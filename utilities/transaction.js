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
        point: refUser.point + reward * parseFloat(process.env.REF_LEVEL_ONE),
      },
      { new: true }
    );
    if (refUser) {
      createTransaction(
        'Referral Reward',
        reward * parseFloat(process.env.REF_LEVEL_ONE),
        'Referral Reward',
        refUser._id,
        null
      );
      console.log('Generated Ref Lv.1 for: ', refUserUpdated._id)
    }
  }
  if (user.referral2) {
    const refUser2 = await User.findById(user.referral2)
    const refUser2Updated = await User.findByIdAndUpdate(
      user.referral2,
      {
        point: refUser2.point + reward * parseFloat(process.env.REF_LEVEL_TWO),
      },
      { new: true }
    );
    if (refUser2) {
      createTransaction(
        'Referral Reward',
        reward * parseFloat(process.env.REF_LEVEL_TWO),
        'Referral Reward',
        refUser2._id,
        null
      );
      console.log('Generated Ref Lv.2 for: ', refUser2Updated._id)
    }
  }
};

module.exports = {
  create: createTransaction,
  generateReferral: generateReferralForUser,
};
