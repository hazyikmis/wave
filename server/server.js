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
const { Product } = require("./models/product");

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
    if (err) return res.json({ registerSuccess: false, err });
    res.status(200).json({
      registerSuccess: true,
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

app.get("/api/users/logout", auth, (req, res) => {
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
//        WOOD
//============================

app.post("/api/product/wood", auth, admin, (req, res) => {
  const wood = new Wood(req.body);

  wood.save((err, newWood) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({
      success: true,
      brand: newWood,
    });
  });
});

app.get("/api/product/woods", (req, res) => {
  Wood.find({}, (err, woods) => {
    if (err) return res.status(400).send(err);
    res.status(200).send(woods);
  });
});

//============================
//        PRODUCTS
//============================

app.post("/api/product/article", auth, admin, (req, res) => {
  const product = new Product(req.body);

  product.save((err, newProduct) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({
      success: true,
      product: newProduct,
    });
  });
});

//by arrival : /api/product/articles?sortBy=createdAt&order=desc&limit=4
//by most sell : /api/product/articles?sortBy=sold&order=desc&limit=4

app.get("/api/product/articles", (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 100;
  let skip = req.query.skip ? req.query.skip : 0;

  // Product.find({}, (err, products) => {
  //   if (err) return res.status(400).send(err);
  //   res.status(200).send(products);
  // });

  Product.find({})
    .populate("brand")
    .populate("wood")
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, products) => {
      if (err) return res.status(400).send(err);
      res.status(200).send(products);
    });
});

app.get("/api/product/articles_by_id", (req, res) => {
  let type = req.query.type;
  let items = req.query.id;

  if (type === "array") {
    let ids = req.query.id.split(",");
    items = [];
    items = ids.map((id) => {
      return mongoose.Types.ObjectId(id);
    });
  }

  //Product.find({ _id:{ $in: items } }).exec((err, products) => {
  Product.find({ _id: { $in: items } })
    .populate("brand")
    .populate("wood")
    .exec((err, products) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(products);
    });
});

app.post("/api/product/shop", (req, res) => {
  //when calling this route from client/Shop/index.js, we are sending "paramsData"
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  let order = req.body.order ? req.body.order : "desc";
  let orderBy = req.body.orderBy ? req.body.orderBy : "_id";

  let findArgs = {};
  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }
  console.log(findArgs);

  Product.find(findArgs)
    .populate("brand")
    .populate("wood")
    .sort([[orderBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, articles) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({
        size: articles.length,
        articles,
      });
    });
});

const port = process.env.SERVER_PORT || 3002;

app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});
