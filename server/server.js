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
const { Brand } = require("./models/brand");
const { Wood } = require("./models/wood");

// Middlewares
const { auth } = require("./middleware/auth");
const { admin } = require("./middleware/admin");

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

app.get("/api/user/logout", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { token: "" },
    (err, userUpdated) => {
      //console.log(userUpdated);
      if (err) return res.json({ success: false, err });
      return res.status(200).send({ success: true });
    }
  );
});

//============================
//        BRAND
//============================

app.post("/api/product/brand", auth, admin, (req, res) => {
  const brand = new Brand(req.body);

  brand.save((err, newBrand) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({
      success: true,
      brand: newBrand,
    });
  });
});

app.get("/api/product/brands", (req, res) => {
  Brand.find({}, (err, brands) => {
    if (err) return res.status(400).send(err);
    res.status(200).send(brands);
  });
});

//============================
//        WOODS
//============================

app.post("/api/product/wood", auth, admin, (req, res) => {
  const wood = new Wood(req.body);

  wood.save((err, newWood) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({
      success: true,
      wood: newWood,
    });
  });
});

app.get("/api/product/woods", (req, res) => {
  Wood.find({}, (err, woods) => {
    if (err) return res.status(400).send(err);
    res.status(200).send(woods);
  });
});

const port = process.env.SERVER_PORT || 3002;

app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});
