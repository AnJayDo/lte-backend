const { GAIN_POINT } = require("../constants");
const User = require("../models/User");
const QuizReward = require("../models/QuizReward")

const gainpoint_put = async (req, res) => {
  if (!req.query)
    return res.status(404).json({ error: "Don't have form data...!" });

  const { id } = req.query;

  // check duplicate users
  const user = await User.findById(id);
  if (!user)
    return res.status(422).json({ message: 'User does not exists...!' });
  
  if (user.todayQuiz)  
    return res
      .status(200)
      .json({status: 200, message: 'You take the quiz today...!' });
  
  const result = await User.findByIdAndUpdate(id, {
    point: user.point ? user.point + GAIN_POINT : GAIN_POINT,
    todayQuiz: true,
  }, {new: true});

  if (!result)
    return res
      .status(422)
      .json({ message: 'Cannot update the exist user...!' });

  const reward = await QuizReward.create({userId: result._id});

  res.status(201).json({ status: true, user: result, reward });
};

module.exports = { gainpoint_put };
