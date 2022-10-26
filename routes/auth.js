const express = require('express');

const router = express.Router();
const passport = require('passport')
const auth = require('../controllers/auth')
const wrapAsync = require('../utils/wrapAsync')

router.route('/register')
  .get(auth.renderRegisterForm)
  .post(wrapAsync(auth.register))

router.route('/login')
  .get(auth.renderLoginForm)
  .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), auth.login)


router.get('/logout', auth.logout)

module.exports = router;