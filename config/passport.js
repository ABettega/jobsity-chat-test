const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcryptjs = require('bcryptjs');

const User = require('../models/User');

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id)
    .then((user) => {
      cb(null, user);
    })
    .catch(err => cb(err));
});

passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({ username })
    .then((user) => {
      if (!user || !user.password || !bcryptjs.compareSync(password, user.password)) {
        return next(null, false, { message: 'Incorrect username or password!' });
      }
      return next(null, user);
    })
    .catch(err => next(err));
}));

module.exports = passport;
