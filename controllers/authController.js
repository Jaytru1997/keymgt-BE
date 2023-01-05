const { promisify } = require("util"); //built in node module
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config();

const User = require("../models/userModel");
const { sendEmail } = require("../services/email");
const { asyncWrapper } = require("../utilities/async");
const AppError = require("../utilities/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode);
};

exports.register = asyncWrapper(async (req, res, next) => {
  // console.log(req.body);
  const message =
    "Your account has been successfully registered. You can login to the user dashboard by clicking the button below";

  const options = {
    title: "User Registration",
    email: req.body.email,
    subject: "New User SignUp",
    message,
    cta: "Log In",
    ctaLink: "#",
  };

  try {
    const user = await User.create({
      email: req.body.email,
      username: req.body.username,
      role: req.body.role,
      password: req.body.password,
      conpassword: req.body.conpassword,
    });
    await sendEmail(options);

    createSendToken(user, 201, res);
    res.json({
      user,
    });
    // return next(options);
  } catch (err) {
    console.log(err);
    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

exports.login = asyncWrapper(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new AppError("Please provide username and password!", 400));
  }

  const user = await User.findOne({ username }).select("+password");

  if (!user || !(await user.matchPassword(password, user.password))) {
    return next(new AppError("Invalid username or password!", 401));
  }

  // const token = signToken(user._id);

  createSendToken(user, 200, res);

  res.json({ user });
});

exports.protect = asyncWrapper(async (req, res, next) => {
  //get token from header
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // console.log(`token is ${token}`);

  if (!token) {
    // return next(new AppError("You are not logged in!", 401));
    res.json({
      error: {
        code: 401,
        message: "Sorry, you are not logged in",
      },
    });
  }

  //verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("User no longer exists!", 401));
  }

  //check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  //grant access to protected route
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action!", 403)
      );
    }
    next();
  };
};

exports.restrictUser = (categories, req, res, next) => {
  if (
    categories.includes(req.user.role) &&
    req.user._id.toString() !== req.params.id
  ) {
    return next(
      new AppError("You do not have permission to perform this action!", 403)
    );
  }
  // console.log(req.user.role);
  next();
};

exports.forgotPassword = asyncWrapper(async (req, res, next) => {
  //get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with that email address!", 404));
  }

  //generate random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //send it to user's email
  const resetURL = `https://${req.get("host")}/resetpassword/${resetToken}`;
  try {
    // await sendEmail({
    //   email: user.email,
    //   subject: "Your password reset token (valid for 10 minutes)",
    //   message,
    // });

    res.status(200).json({
      status: "success",
      data: { resetURL },
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

exports.resetPassword = asyncWrapper(async (req, res, next) => {
  //get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //make sure the token is not expired and there is a user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired!", 400));
  }

  //update changedPasswordAt property for the user
  user.password = req.body.password;
  user.conpassword = req.body.conpassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //Log the user in, send JWT
  createSendToken(user, 200, res);
  next();
});

exports.updatePassword = asyncWrapper(async (req, res, next) => {
  //get user from collection
  const user = await User.findById(req.user.id).select("+password");

  //check if posted current password is correct
  if (!(await user.matchPassword(req.body.currentPassword, user.password))) {
    return next(new AppError("Your current password is wrong!", 401));
  }

  //update password
  user.password = req.body.password;
  user.conpassword = req.body.conpassword;
  await user.save();

  //Log user in, send JWT
  createSendToken(user, 200, res);
  next();
});
