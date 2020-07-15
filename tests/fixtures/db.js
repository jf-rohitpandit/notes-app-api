const { request } = require("express");

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "User One",
  email: "user@one.com",
  password: "useruserone",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: "User Two",
  email: "user@Two.com",
  password: "useruserTwo",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    },
  ],
};


const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'test one',
    done: false,
    owner: userOne._id

}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'test Two',
    done: true,
    owner: userOne._id

}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'test three',
    done: false,
    owner: userTwo._id

}


const setupDatabase = async () =>{

  await User.deleteMany();
  await Task.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
}

module.exports ={
    userOne,
    userOneId,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}