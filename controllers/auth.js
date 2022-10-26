const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
  res.render('auth/register')
}

module.exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    // console.log(registeredUser)
    req.login(registeredUser, function (err) {
      if (err) return next(err);
      req.flash('success', "Welcome to yelp-camp")
      res.redirect('/campgrounds')
    });
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/register');
  }
}

module.exports.renderLoginForm = (req, res) => {
  res.render('auth/login')
}

module.exports.login = (req, res) => {
  req.flash('success', "Welcome to yelp-camp");
  const redirectUrl = req.session.returnTo || '/campgrounds'
  delete req.session.returnTo
  res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    req.flash('success', 'Goodbye')
    res.redirect('/campgrounds');
  });
}