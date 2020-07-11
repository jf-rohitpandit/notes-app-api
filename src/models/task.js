const mongoose = require("mongoose");


const taskSchema = new mongoose.Schema({
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
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
},{
  timestamps: true
})

const task = mongoose.model("Task",taskSchema );

module.exports = task;
