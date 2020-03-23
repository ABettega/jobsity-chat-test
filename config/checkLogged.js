const checkLogged = () => (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.render('index', { auth: false });
  return null;
};

module.exports = checkLogged;
