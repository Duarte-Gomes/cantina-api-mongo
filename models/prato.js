const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pratoSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: false
    },
    content: {
      type: String,
      required: false
    },
    category: {
      type: String,
      required: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Prato', pratoSchema);
