const mongoose = require('mongoose');

const stakeSchema = new mongoose.Schema({
  initAmount: { type: Number, require: true },
  amount: { type: Number, require: true },
  status: { type: String, default: 'open'},
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
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

const Stake = mongoose.model('stake', stakeSchema);

module.exports = Stake;