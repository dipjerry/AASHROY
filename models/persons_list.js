const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const homelessSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  cordinate: {
    type: String,
    required: true,
  },
},
{
  timestamps: true,
});

module.exports = mongoose.model('Peoples', homelessSchema);
