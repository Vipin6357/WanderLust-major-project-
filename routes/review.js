const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
// const review = require("../models/review.js");
// const Listing = require("../models/listing.js");

const { isLoggedIn, validateReview, isReviewAuthor, } = require("../middleware.js");

//require reviewController
const reviewController = require("../controllers/reviews.js");

//POST review route
router.post("/",  isLoggedIn, validateReview, wrapAsync (reviewController.createReview));

// Delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;