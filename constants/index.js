const INIT_USER = {
  email: '',
  name: '',
  avatar: '',
  point: 0,
  wallet: '',
  google: '',
  todayQuiz: false,
  referralUrl: '',
  referral: null,
  referral2: null,
};

const GAIN_POINT = 10;

const APY_YEAR = 3;

const APY_DAY =  1.003014431;

const APY_5_MINUTES = 1.000010451;

module.exports = { INIT_USER, GAIN_POINT, APY_DAY, APY_5_MINUTES };
