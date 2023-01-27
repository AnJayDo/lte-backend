const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  shortUrl: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
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

const Referral = mongoose.model('referral', referralSchema);

module.exports = Referral;