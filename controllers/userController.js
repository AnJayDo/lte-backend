const bcrypt = require('bcrypt');

const { GAIN_POINT } = require('../constants');

const QuizReward = require('../models/QuizReward');
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

module.exports = {
  alluser_get,
  resetQuiz_put,
  resetToDefaultPassword_put,
  userByEmail_get,
  me_get,
  gainpointByToken_put,
};
