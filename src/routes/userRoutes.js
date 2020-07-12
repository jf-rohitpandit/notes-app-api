const express = require("express");
const multer = require("multer");
const sharp = require('sharp');
const User = require("../models/user");
const auth = require("../middleware/auth");
const {sendWelcomeEmail, sendDeleteEamil} = require('../emails/account');
const router = express.Router();

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredientials(
      req.body.email,
      req.body.password
    );
    const token = await user.getAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users", async (req, res) => {
  console.log(req.body);
  const user = new User(req.body);

  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.getAuthToken();


    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowUpdates = ["name", "age", "password", "email"];
  const isValid = updates.every((update) => allowUpdates.includes(update));
  const multer = require("multer");

  if (!isValid) {
    return res.status(400).send({ error: "Invalid fields" });
  }

  try {
    // const user = await User.findById(req.params.id);
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();

    // if (!user) {
    //   return res.status(404).send();
    // }
    res.send(req.user);
  } catch (e) {
    res.status(400).send();
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    sendDeleteEamil(req.user.email, req.user.name);
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(
        new Error("Upload a photo with any of the jpg, jpeg, png format")
      );
    }
    cb(undefined, true);
  },
});

router.post("/users/me/avtar",auth,upload.single("avtar"),async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
    req.user.avtar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/users/me/avtar", auth, async (req, res) => {
  req.user.avtar = undefined;
  await req.user.save();
  res.send();
});

router.get("/users/:id/avtar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avtar) {
      throw new Error();
    }

    res.set("content-type", "image/png");
    res.send(user.avtar);
  } catch (e) {
    res.status(400).send();
  }
});

module.exports = router;
