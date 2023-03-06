const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//@desc register a user
//@route POST /api/users/register
//@access public

// mongoose methods always returns a promise
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw new Error("All fields are mandatory!");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("user already registered");
  }
  //hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("hashed password", hashedPassword);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  console.log(`the created user : ${user}`);
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    throw new Error("user data not valid");
  }
});

//@desc login a user
//@route POST /api/users/login
//@access public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error("all fields are mandatory");
  }
  const user = await User.findOne({ email });
  //compare password with hashed password ,
  if (user && (await bcrypt.compare(password, user.password))) {
    // we will provide an access token in the response
    // generation of jwt for the user
    const accessToken = jwt.sign(
      {
        // the data included in the jwt payload
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      //secret key to used to sign to the token
      process.env.ACCESSS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("user not found!");
  }
});

//@desc get current user info
//@route GET /api/users/current
//@access private

const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
};
