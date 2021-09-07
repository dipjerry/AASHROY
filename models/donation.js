const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const donationSchema = new Schema({
  item: {
    type: String,
    required: true,
  },
//   imageUrl: {
//     type: String,
//     required: true,
//   },
//   content: {
//     type: String,
//     required: true,
//   },
// //   donator: {
//     type: Schema.Types.ObjectId,
//     ref: 'Users',
//     required: true,
//   },
},
{
  timestamps: true,
});

module.exports = mongoose.model('Donation', donationSchema);
