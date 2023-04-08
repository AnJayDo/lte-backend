const mongoose = require('mongoose');
const User = require('./User')

const transactionSchema = new mongoose.Schema({
  name: {type: String, default: ''},
  amount: { type: Number, require: true },
  description: {type: String, default: ''},
  status: { type: String, default: 'open'},
  createdDate: { type: Date, default: Date.now },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: User },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: User },
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

const Transaction = mongoose.model('transaction', transactionSchema);

module.exports = Transaction;