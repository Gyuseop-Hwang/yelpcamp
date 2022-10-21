const express = require('express');

const router = express.Router();
const passport = require('passport')
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync')

router.get('/register', (req, res) => {
  res.render('auth/register')
})

router.post('/register', wrapAsync(async (req, res) => {
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
}))

router.get('/login', (req, res) => {
  res.render('auth/login')
})
// 'local', 'google', 'twitter' 등 전략
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), (req, res) => {

  req.flash('success', "Welcome to yelp-camp");
  const redirectUrl = req.session.returnTo || '/campgrounds'
  delete req.session.returnTo
  res.redirect(redirectUrl)
})

router.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    req.flash('success', 'Goodbye')
    res.redirect('/campgrounds');
  });
})

module.exports = router;