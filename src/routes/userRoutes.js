const express = require("express");
const User = require("../models/user");
const auth = require('../middleware/auth');
const router = express.Router();


router.post('/users/login', async (req, res)=>{
  try{
    const user = await User.findByCredientials(req.body.email, req.body.password);
    const token = await user.getAuthToken();
    res.send({user, token});
  }catch(e){
    res.status(400).send(e)
  }
})

router.post('/users/logout', auth, async (req, res)=>{
  try{
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
    await req.user.save();
    res.send();
  }catch(e){
    res.status(500).send();
  }
})

router.post('/users/logoutAll', auth, async (req, res)=>{
  try{
    req.user.tokens = [];
    await req.user.save();
    res.send();
  }catch(e){
    res.status(500).send();
  }
})

router.post("/users", async (req, res) => {
  console.log(req.body);
  const user = new User(req.body);

  try {

    await user.save();
    const token = await user.getAuthToken();

    res.status(201).send({user, token});
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/users/me",auth, async (req, res) => {
  res.send(req.user);
});



router.patch("/users/me",auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowUpdates = ["name", "age", "password", "email"];
  const isValid = updates.every((update) => allowUpdates.includes(update));

  if (!isValid) {
    return res.status(400).send({ error: "Invalid fields" });
  }

  try {

    // const user = await User.findById(req.params.id);
    updates.forEach(update=> req.user[update]= req.body[update]);
    await req.user.save();


    // if (!user) {
    //   return res.status(404).send();
    // }
    res.send(req.user);
  } catch (e) {
    res.status(400).send();
  }
});

router.delete("/users/me",auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
