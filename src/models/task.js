const mongoose = require("mongoose");

const task = mongoose.model("Task", {
  description: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  done: {
    type: Boolean,
    trim: true,
    default: false,
  },
});

module.exports = task;
