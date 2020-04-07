//this middleware just checks the logged user is admin or not!

const admin = (req, res, next) => {
  //we know that, in previous middleware(auth), user fetched from database and attached to the request object
  if (req.user.role === 0) {
    return res.send("You are not allowed to do that!. GET OUT NOW!");
  }
  next();
};

module.exports = { admin };
