const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

//like body-parser, if we have file in the request, formidable helps us to parse this file
const formidable = require("express-formidable");

//that's not enough, also config required, check below...
const cloudinary = require("cloudinary");

const app = express();
const mongoose = require("mongoose");

const async = require("async");

require("dotenv").config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static("client/build"));

cloudinary.config({
  cloud_name: process.env.CLOUDNRY_NAME,
  api_key: process.env.CLOUDNRY_API_KEY,
  api_secret: process.env.CLOUDNRY_API_SECRET,
});

// Models
const { User } = require("./models/user");
const { Brand } = require("./models/brand");
const { Wood } = require("./models/wood");
const { Product } = require("./models/product");
const { Payment } = require("./models/payment");
const { Site } = require("./models/site");

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

//req.body only contains {name:"...", lastname:"...", email:"..."}
app.post("/api/users/update_profile", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $set: req.body,
    },
    { new: true },
    (err, updUsr) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }
  );
});

//============================
//        CLOUDINARY IMAGE OPs
//============================

app.post("/api/users/uploadimage", auth, admin, formidable(), (req, res) => {
  //cloudinary.uploader.upload(file, callback, config)
  cloudinary.uploader.upload(
    req.files.file.path,
    (result) => {
      console.log(result);
      res.status(200).send({
        public_id: result.public_id,
        url: result.url,
      });
    },
    {
      public_id: `${Date.now()}`,
      resource_type: "auto",
    }
  );
});

app.get("/api/users/removeimage", auth, admin, (req, res) => {
  let public_id = req.query.public_id;

  cloudinary.v2.uploader.destroy(public_id, (error, result) => {
    //console.log("result:", result);
    //console.log("error:", error);
    //if (error) return res.status(500).json({ success: false });
    if (error) return res.json({ success: false, error });
    res.status(200).send("ok");
  });
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
      //console.log(products);
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

  findArgs["publish"] = true;

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

//============================
//        CART
//============================

app.post("/api/users/addToCart", auth, (req, res) => {
  User.findOne({ _id: req.user._id }, (err, userdoc) => {
    let exist = false;

    userdoc.cart.forEach((item) => {
      if (item.id == req.query.productId) {
        exist = true;
      }
    });

    if (exist) {
      /// increase (+1) the quantity of the item exist in the user.cart
      User.findOneAndUpdate(
        {
          _id: req.user._id,
          "cart.id": mongoose.Types.ObjectId(req.query.productId),
        },
        { $inc: { "cart.$.quantity": 1 } },
        { new: true },
        (err, docusr) => {
          if (err) return res.json({ success: false, err });
          res.status(200).json(docusr.cart);
        }
      );
    } else {
      /// add new item to user.cart (this also means that updating a user)
      User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: {
            cart: {
              id: mongoose.Types.ObjectId(req.query.productId),
              quantity: 1,
              date: Date.now(),
            },
          },
        },
        { new: true },
        (err, docusr) => {
          if (err) return res.json({ success: false, err });
          res.status(200).json(docusr.cart);
        }
      );
    }
  });
});

app.get("/api/users/removeFromCart", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { $pull: { cart: { id: mongoose.Types.ObjectId(req.query._id) } } },
    { new: true },
    (err, docusr) => {
      let cart = docusr.cart;
      let cartItemIdsArr = cart.map((item) => {
        return mongoose.Types.ObjectId(item.id);
      });

      //after deletion of one item from the cart, in order to render remaining items properly
      //we are querying the database
      Product.find({ _id: { $in: cartItemIdsArr } })
        .populate("brand")
        .populate("wood")
        .exec((err, cartDetail) => {
          return res.status(200).json({
            cartDetail,
            cart,
          });
        });
    }
  );
});

app.post("/api/users/successBuy", auth, (req, res) => {
  //some of the information about the products inside cartDetail will be stored inside the "history"
  //and this will be used when storing purchases into the database (inside the user document history field)
  //thats the reason why we gave the name "history"

  //the second thing: we have 2 parameters (cartDetail & paymentData) attached to the req.body as you see below
  let history = [];
  let transactionData = {};

  req.body.cartDetail.forEach((item) => {
    history.push({
      dateOfPurchase: Date.now(),
      name: item.name,
      brand: item.brand.name,
      id: item._id,
      price: item.price,
      quantity: item.quantity,
      paymentId: req.body.paymentData.paymentID,
    });
  });

  transactionData.user = {
    id: req.user._id,
    name: req.user.name,
    lastname: req.user.lastname,
    email: req.user.email,
  };

  transactionData.data = req.body.paymentData;

  transactionData.product = history;

  User.findOneAndUpdate(
    { _id: req.user._id },
    { $push: { history: history }, $set: { cart: [] } },
    { new: true },
    (err, user) => {
      if (err) return res.json({ success: false, err });

      const payment = new Payment(transactionData);
      payment.save((err, newPaymentDoc) => {
        if (err) return res.json({ success: false, err });

        let products = [];
        newPaymentDoc.product.forEach((item) => {
          products.push({ id: item.id, quantity: item.quantity });
        });

        //async.eachSeries(array, () => {/*update*/}, () => {/*what we gonna do after all updates*/})
        async.eachSeries(
          products,
          (item, callback) => {
            Product.update(
              { _id: item.id },
              { $inc: { sold: item.quantity } },
              { new: false },
              callback
            );
          },
          (err) => {
            if (err) return res.json({ success: false, err });
            res.status(200).json({
              success: true,
              //cart: []
              cart: user.cart, //user.cart is set to []
              cartDetail: [],
            });
          }
        );
      });
    }
  );
});

//============================
//        SITE
//============================

app.get("/api/site/site_data", (req, res) => {
  Site.find({}, (err, site) => {
    if (err) return res.status(400).send(err);
    //res.status(200).send(site[0].siteInfo[0]);  //returns direct first object
    res.status(200).send(site[0].siteInfo);
  });
});

app.post("/api/site/site_data", auth, admin, (req, res) => {
  Site.findOneAndUpdate(
    { name: "Site" },
    { $set: { siteInfo: req.body } },
    { new: true },
    (err, site) => {
      if (err) return res.json({ success: false, err });
      res.status(200).send({
        success: true,
        siteInfo: site.siteInfo,
      });
    }
  );
});

//DEFAULT:
if (process.env.NODE_ENV === "production") {
  //means that we are inside heroku deployment
  const path = require("path");
  //accept all routes/requests and send response back to client
  //if there is no match with the all routes above, all the rest falls here
  app.get("/*", () => (req, res) => {
    res.sendfile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});
