const express = require('express');
const passport = require('passport');
const bcryptjs = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

const checkPassword = (pass) => {
  if (pass.length < 6) {
    return 'The password must have at least 6 characters!';
  }
  if (pass.match(/[A-Z]/) === null) {
    return 'The password must have at least one uppercase character!';
  }
  if (pass.match(/[a-z]/) === null) {
    return 'The password must have at least one lowercase character!';
  }
  if (pass.match(/[.!@#$%=()|><{}_\-&*+[\]\\/~^'`'":;,?]/) === null) {
    return 'The password must have at least one special character!';
  }
  if (pass.match(/[0-9]/) === null) {
    return 'The password must have at least one numeric character!';
  }
  return true;
};

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/chat',
  failureRedirect: '/',
  failureFlash: true,
  passReqToCallback: true,
}));

router.get('/signup', (req, res, next) => {
  res.render('index');
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if (username === '' || username === undefined) {
    res.render('index', { message: 'Username must be filled.' });
    return;
  }

  const passCheck = checkPassword(password);

  if (passCheck !== true) {
    res.render('index', { message: passCheck });
    return;
  }

  User.findOne({ username }, 'username', (err, user) => {
    if (user !== null) {
      res.render('index', { message: 'The username already exists!' });
      return;
    }

    const hash = bcryptjs.hashSync(password, bcryptjs.genSaltSync(parseInt(process.env.SALT, 10)));

    const newUser = new User({
      username,
      password: hash,
    });
    newUser.save()

    .then(() => {
      req.login(newUser, () => {
        res.render('chat', { user: newUser, auth: true });
      });
    })
    .catch(err => {
      if (err.code === 11000) {
        res.render('index', { message: 'The username already exists!' });
        return;
      }
      res.render('index', { message: 'Something went wrong' });
    })
  });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
