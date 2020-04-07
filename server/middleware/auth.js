const { User } = require("./../models/user");

const auth = (req, res, next) => {
  //check the token is ok
  let token = req.cookies.wave_auth;

  console.log(token);

  User.findByToken(token, (err, user) => {
    if (err) throw err;

    if (!user) return res.json({ isAuth: false, error: true });

    //if everything is ok, then attach token & user to the req object
    req.token = token;
    req.user = user;

    next();
  });
};

module.exports = { auth };
