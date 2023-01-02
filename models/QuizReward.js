const mongoose = require('mongoose');

const quizRewardSchema = new mongoose.Schema({
  createdDate: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});


// fire a function before doc saved to db
// quizRewardSchema.pre('save', async function(next) {
//   const salt = await bcrypt.genSalt();
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// userSchema.set('toJSON', {
//   transform: function(doc, ret, opt) {
//       delete ret['password']
//       return ret
//   }
// })

const QuizReward = mongoose.model('quiz-reward', quizRewardSchema);

module.exports = QuizReward;