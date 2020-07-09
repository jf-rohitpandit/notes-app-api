const mongoose = require("mongoose");
const validator = require("validator");

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const User = mongoose.model("User", {
  name: {
    type: String,
    trim: true,
    required: true,
  },
  age: {
    type: Number,
    default: 0,
    required: true,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be positive");
      }
    },
  },
  email: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("password is included in password");
      }
    },
  },
});

// const me = new User({
//   name: "Rohit",
//   age: 21,
//   email: "   rohit@rOHITit.rohit     ",
//   password: "ramP",
// });

// me.save()
//   .then((res) => console.log(res))
//   .catch((error) => console.log(error));




const task = mongoose.model("Task", {
  description: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  done: {
    type: Boolean,
    trim: true,
    default: false
  },
});

const task1 = new task({
  description: "     home work",
  

});

task1
  .save()
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
