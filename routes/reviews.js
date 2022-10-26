const express = require('express');


const { validateReview, isLoggedIn, isAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');


const wrapAsync = require('../utils/wrapAsync');
const router = express.Router({ mergeParams: true });

router.post('/', isLoggedIn, validateReview, wrapAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isAuthor, wrapAsync(reviews.deleteReview))

module.exports = router;