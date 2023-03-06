const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization || req.headers.authorizations;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESSS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(400);
        throw new Error("user is not authorized!");
      }
      req.user = decoded.user;
    });
  }
  next();
});

module.exports = validateToken;
