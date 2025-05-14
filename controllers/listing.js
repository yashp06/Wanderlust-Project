const Listing = require("../models/listing");

module.exports.index = async (req, res, next) => {
  let allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.newListing = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exit!");
    return res.redirect("/listings");
  }
  console.log(listing);

  res.render("listings/show.ejs", { listing });
};

module.exports.createListings = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename
 // console.log(url,"",filename);
  
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url,filename}
  await newListing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exit!");
    return res.redirect("/listings");
  }

  let orginalImageUrl = listing.image.url
  orginalImageUrl = orginalImageUrl.replace("/upload" , "/upload/w_250")
  res.render("listings/edit.ejs", { listing,orginalImageUrl });
};

module.exports.updateForm = async (req, res,next) => {
  let { id } = req.params;
  let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(typeof req.file !== "undefined"){ 
  let url = req.file.path;
  let filename = req.file.filename
  listing.image ={url,filename}
  await listing.save()
  }
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListings = async (req, res, next) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", " Listing Delete");
  res.redirect("/listings");
};
