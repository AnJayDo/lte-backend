const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { INIT_USER } = require('../constants');

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    if(!err.message.includes('referral')) {
      // console.log(err);
      Object.values(err.errors).forEach(({ properties }) => {
        // console.log(val);
        // console.log(properties);
        errors[properties.path] = properties.message;
      });
    }
  }

  return errors;
};

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  console.log('Generate token:', process.env.JWT_SECRET);
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

module.exports.signup_post = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.create({ ...INIT_USER, name, email, password });
    const token = createToken(user._id);
    res.status(201).json({ user: user, jwt: token });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.signupGoogle_post = async (req, res) => {
  try {
    const sessionUser = req.body.user;

    const checkUser = await User.findOne({email: sessionUser.email});

    if(checkUser) {
      if(checkUser.google !== sessionUser.email) return res.status(200).json({ status: 200, error: "You signed up with this email before." });
  
      if(checkUser.google === sessionUser.email) {
        const token = createToken(checkUser._id);
        return res.status(201).json({ user: checkUser, jwt: token });
      }
    }

    const user = await User.create({ ...INIT_USER, name: sessionUser.name, email: sessionUser.email, password: sessionUser.email, avatar: sessionUser.image, google: sessionUser.email });
    const token = createToken(user._id);
    res.status(201).json({ user: user, jwt: token });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.signupMetamask_post = async (req, res) => {
  try {
    let checkUser = await User.findOne({wallet: req.body.wallet});

    if(checkUser) {
      const token = createToken(checkUser._id);
      return res.status(201).json({ user: checkUser, jwt: token });
    }

    const newUser = { ...INIT_USER, name: req.body.wallet, email: req.body.wallet+'@learntoearn.work', password: req.body.wallet, wallet: req.body.wallet };

    if(req.body.referral) {
      const refUser = await User.findOne({referralUrl: req.body.referral});
      newUser.referral = refUser._id;
      if(refUser.referral) newUser.referral2 = refUser.referral;
    }

    const user = await User.create(newUser);
    const token = createToken(user._id);
    res.status(201).json({ user: user, jwt: token });
  } catch (err) {
    const errors = handleErrors(err);
    if(errors.email.includes('registered')) {
      let checkUser = await User.findOne({wallet: req.body.wallet});
      if(checkUser) {
        const token = createToken(checkUser._id);
        return res.status(201).json({ user: checkUser, jwt: token });
      }
    }
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    const token = createToken(user._id);
    res.status(200).json({ user: user, jwt: token });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
};
