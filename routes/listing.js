const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfigs.js") 
const upload = multer({storage })

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    upload.single('listing[image]'),
    validateListing,
     wrapAsync(listingController.createListings));
   
 router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.newListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateForm)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListings));

// Index route
//router.get("/",wrapAsync(listingController.index));
// New Route
//Show route
//router.get("/:id",wrapAsync(listingController.newListing));

// create Route
//router.post("/",validateListing,wrapAsync(listingController.createListings));
// Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);
// Update route
// router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateForm)
//);
// Delete route
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListings)
// );

module.exports = router;
