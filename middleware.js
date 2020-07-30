const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./user");

// authentication middleware
exports.setUser = async (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, "secretcode");
      const user = await User.findById(decoded.userId);
      if (!user) {
        res.clearCookie("token");
      } else {
        res.locals.user = user;
      }
    } catch (e) {
      console.error(e);
      res.clearCookie("token");
    }
  }
  next();
}

// use this middleware wherever you require an authenticated user
exports.requireUser = (req, res, next) => {
  if (!res.locals.user) {
    return res.redirect("/login");
  }
  next();
};