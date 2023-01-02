const bcrypt = require('bcrypt');

const { GAIN_POINT, APY_DAY } = require('../constants');

const QuizReward = require('../models/QuizReward');
const Stake = require('../models/Stake');
const User = require('../models/User');

const userByEmail_get = async (req, res) => {
  try {
    if (!req.params)
      return res.status(404).json({ error: "Don't have form data...!" });

    const { email } = req.params;

    // check duplicate users
    const checkexisting = await User.findOne({ email });
    if (!checkexisting)
      return res.status(422).json({ message: 'User does not exists...!' });

    res.status(201).json({
      status: 200,
      message: 'Get user by email successfully.',
      user: checkexisting,
    });
  } catch (error) {
    res.status(500).json({ message: 'Cannot get user by email.' });
  }
};

const me_get = async (req, res) => {
  try {
    if (!req.user)
      return res.status(422).json({ message: 'User does not exists...!' });

    res
      .status(201)
      .json({ status: 200, message: 'Get user successfully.', user: req.user });
  } catch (error) {
    res.status(500).json({ message: 'Cannot get user.' });
  }
};

const alluser_get = async (req, res) => {
  const users = await User.find();
  res
    .status(200)
    .json({ status: 200, message: 'Get all user successfully.', users });
};

const resetQuiz_put = async (req, res) => {
  if (!req.query || req.query.role !== 'sysadmin')
    res.status(200).json({ status: 200, message: 'Failed' });
  const result = await User.updateMany(null, { todayQuiz: false });
  const users = await User.find();
  res
    .status(200)
    .json({
      status: 200,
      message: 'Get all user successfully.',
      result,
      users,
    });
};

const resetToDefaultPassword_put = async (req, res) => {
  console.log(req.body);
  const salt = await bcrypt.genSalt();
  const password = await bcrypt.hash('12341234', salt);
  const user = await User.findOneAndUpdate(
    { email: req.body.email },
    { password }
  );
  res.status(200).json({
    status: 200,
    message: `Reset password of ${req.body.email} successfully.`,
    user,
  });
};

const gainpointByToken_put = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: 'User does not exists...!' });

    const { _id: id } = req.user;

    // check duplicate users
    const user = await User.findById(id);
    if (!user)
      return res.status(422).json({ message: 'User does not exists...!' });

    if (user.todayQuiz)
      return res
        .status(200)
        .json({ status: 200, message: 'You take the quiz today...!' });

    const result = await User.findByIdAndUpdate(
      id,
      {
        point: user.point ? user.point + GAIN_POINT : GAIN_POINT,
        todayQuiz: true,
      },
      { new: true }
    );
    if (!result)
      return res
        .status(422)
        .json({ message: 'Cannot update the exist user...!' });

    const reward = await QuizReward.create({ userId: result._id });

    res.status(201).json({ status: true, user: result, reward });
  } catch (error) {
    res.status(500).json({ message: 'Cannot get user.' });
  }
};

const stakeByToken_get = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ error: 'User does not exists...!' });

    const { _id: id } = req.user;

    const stake = await Stake.findOne({userId: id, status: 'open'});

    res.status(201).json({ status: true, stake });
  } catch (error) {
    res.status(500).json({ message: 'Cannot get user.' });
  }
}

const stakeByToken_post = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ error: 'User does not exists...!' });

    const { _id: id } = req.user;

    const stake = await Stake.findOne({userId: id, status: 'open'});

    if(stake) {
      const result = await Stake.findByIdAndUpdate(stake._id, {
        initAmount: stake.initAmount + req.body.quantity,
        amount: stake.amount + req.body.quantity,
        updatedDate: new Date()
      }, {new: true})
      if(!result) return res.status(500).json({ error: 'Cannot stake more' });
      const user = await User.findByIdAndUpdate(id, {
        point: req.user.point - req.body.quantity
      }, {new: true})
      return res.status(201).json({ status: true, user, stake: result });
    }

    const result = await Stake.create({
      initAmount: req.body.quantity,
      amount: req.body.quantity,
      userId: id,
    })
    if(!result) return res.status(500).json({ error: 'Cannot stake more' });
    const user = await User.findByIdAndUpdate(id, {
      point: req.user.point - req.body.quantity
    }, {new: true})

    res.status(201).json({ status: true, stake: result, user });
  } catch (error) {
    res.status(500).json({ message: 'Cannot get user.' });
  }
}

const withdrawStake_put = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ error: 'User does not exists...!' });

    const { _id: id } = req.user;

    const stake = await Stake.findOne({userId: id, status: 'open'});

    if(stake) {
      const result = await Stake.findByIdAndUpdate(stake._id, {
        status: 'closed',
        updatedDate: new Date()
      }, {new: true})
      if(!result) return res.status(500).json({ error: 'Cannot stake more' });
      const user = await User.findByIdAndUpdate(id, {
        point: req.user.point + stake.amount
      }, {new: true})
      return res.status(201).json({ status: true, user, stake: result });
    }
  } catch (error) {
    res.status(500).json({ message: 'Cannot get user.' });
  }
}

const updateUserWithIdByToken_put = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: 'User does not exists...!' });

    const { id } = req.params;

    // check duplicate users
    const user = await User.findById(id);
    if (!user)
      return res.status(422).json({ message: 'User does not exists...!' });

    const result = await User.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!result)
      return res
        .status(422)
        .json({ message: 'Cannot update the exist user...!' });

    res.status(201).json({ status: true, user: result });
  } catch (error) {
    res.status(500).json({ message: 'Cannot get user.' });
  }
};


const updateStake_put = async (req, res) => {
  if (!req.query || req.query.role !== 'sysadmin')
    res.status(200).json({ status: 200, message: 'Failed' });
  const stakes = await Stake.find({ status: 'open' });

  stakes.forEach(stake => {
    // if(stake.updatedDate.getTime() - (new Date()).getTime() >= 86400000) {
      stake.amount = stake.amount*APY_DAY;
      stake.save();
    // }
  })

  const result = await Stake.find({ status: 'open' });

  res
    .status(200)
    .json({
      status: 200,
      message: 'Get all stakes successfully.',
      result,
    });
};

module.exports = {
  alluser_get,
  resetQuiz_put,
  resetToDefaultPassword_put,
  userByEmail_get,
  me_get,
  gainpointByToken_put,
  updateUserWithIdByToken_put,
  stakeByToken_get,
  stakeByToken_post,
  withdrawStake_put,
  updateStake_put
};
