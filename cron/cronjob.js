const schedule = require('node-schedule');
const request = require('request');

const resetQuiz = () => {
  var options = {
    method: 'PUT',
    url: 'http://localhost:9000/user/reset-quiz?role=sysadmin',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    form: {
      email: 'jayandn1999@gmail.com',
    },
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
};

const updateStake = () => {
  var options = {
    method: 'PUT',
    url: 'http://localhost:9000/user/update-stake?role=sysadmin',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    form: {
      email: 'jayandn1999@gmail.com',
    },
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
};

const job = schedule.scheduleJob('0 0 * * *', function () {
  console.log('Reset Quiz everyday at 00:00');
  resetQuiz();
  updateStake();
});
