const express = require('express');
const checkLogged = require('../config/checkLogged');
// const User = require('../models/User');

const router  = express.Router();

router.get('/chat', checkLogged(), (req, res, next) => {
  res.render('chat', { user: req.user, auth: true });
});

router.get('/', checkLogged(), (req, res, next) => {
  if (checkLogged) {
    res.render('chat', { auth: true });
  } else {
    res.redirect('/auth/signup');
  }
});

module.exports = router;
