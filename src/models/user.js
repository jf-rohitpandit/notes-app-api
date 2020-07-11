const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');


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
  tokens:[{
    token:{
      type: String,
      required: true
    }
  }]
})


userSchema.virtual('tasks',{
  ref:"Task",
  localField: "_id",
  foreignField: "owner"
})

userSchema.methods.toJSON = function(){
  const user = this;

  const userObject = user.toObject();
  
  delete userObject.password;
  delete userObject.tokens;

  return userObject;
}


userSchema.methods.getAuthToken= async function(){
  const user = this;
  const token = jwt.sign({_id: user._id.toString()}, "thisismyproject");
  user.tokens = user.tokens.concat({token});
  user.save();
  return token;
}



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

userSchema.pre('remove', async function(next){
  const user = this;

  await Task.deleteMany({owner: user._id});
  next();
})

const User = mongoose.model("User", userSchema);

module.exports = User;
