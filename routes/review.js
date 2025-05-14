const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isAuthor } = require("../middleware.js");

const reviewControler = require("../controllers/review.js")
router.post(
  "/",isLoggedIn,validateReview,
  wrapAsync(reviewControler.createReview)
);

router.delete(
  "/:reviewId",isLoggedIn,isAuthor,
  wrapAsync(reviewControler.destroyReview)
);
module.exports = router;
