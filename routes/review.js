const express = require('express');
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
// const { listingSchema } = require("../schema.js");
const Listing = require('../models/Listing.js');
const Review = require('../models/review.js');
const {validateReview, isLoggedIn, IsReviewAuthor} = require('../middleware.js')

const reviewController = require('../controllers/reviews.js');


router.post(
    "/:id/reviews",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.reviewPost)
  );
  


router.delete('/:reviewId', 
 isLoggedIn,
 IsReviewAuthor,
 wrapAsync(reviewController.destroyReview));

module.exports = router;