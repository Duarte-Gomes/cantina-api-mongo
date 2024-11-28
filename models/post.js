const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
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
    },
    active: {
      type: String,
      required: false
    },
    creator: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
