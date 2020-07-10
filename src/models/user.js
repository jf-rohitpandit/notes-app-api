const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
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
    unique: true,
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
})

userSchema.statics.findByCredientials = async (email, password)=>{
  const user = await User.findOne({email});

  if(!user){
    throw new Error('Unable to login!');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if(!isMatch){
    throw new Error('Unable to login!');
  }

  return user;
}


userSchema.pre('save', async function(next){
  const user = this;
  if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
})

const User = mongoose.model("User", userSchema);

module.exports = User;
