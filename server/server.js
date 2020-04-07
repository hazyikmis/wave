const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Models
const { User } = require("./models/user");

// Middlewares
const { auth } = require("./middleware/auth");

app.get("/", (req, res) => {
  res.send("Hello World");
});

//============================
//        USERS
//============================

//if the users tries to post something, then this route helps
//us to check that if user authenticated to do so
app.get("/api/users/auth", auth, (req, res) => {
  res.status(200).json({
    //user: req.user
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    cart: req.user.cart,
    history: req.user.history,
  });
});

app.post("/api/users/register", (req, res) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({
      success: true,
      userdata: doc,
    });
  });
});

app.post("/api/users/login", (req, res) => {
  //1.find the email
  //2.check the password - hash
  //3.generate a token
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: "Auth failed, email not found!",
      });

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "Auth failed, password is not correct!",
        });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res
          .cookie("wave_auth", user.token)
          .status(200)
          .json({ loginSuccess: true });
      });
    });
  });
});

const port = process.env.SERVER_PORT || 3002;

app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});
