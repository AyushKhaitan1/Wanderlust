const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const { category, search } = req.query;
  let filter = {};

  if (category) {
    filter.category = category.toLowerCase();
  }

  if (search && search.trim() !== "") {
    const regex = new RegExp(search.trim(), "i");
    filter.$or = [
      { title: regex },
      { location: regex },
      { country: regex },
    ];
  }

  const allListings = await Listing.find(filter);
  res.render("listings/index.ejs", {
    allListings,
    selectedCategory: category || "",
    searchQuery: search || "",
  });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "The listing you requested does not exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  const listingData = { ...req.body.listing };

  if (listingData.image && typeof listingData.image === "string") {
    listingData.image = {
      filename: "listingimage",
      url: listingData.image.trim(),
    };
  } else if (!listingData.image || !listingData.image.url) {
    delete listingData.image;
  }

  const newListing = new Listing(listingData);
  newListing.owner = req.user._id;
  await newListing.save();

  req.flash("success", "New Listing Created!");
  res.redirect(`/listings/${newListing._id}`);
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "The listing you requested does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listingData = { ...req.body.listing };

  if (listingData.image && typeof listingData.image === "string") {
    listingData.image = {
      filename: "listingimage",
      url: listingData.image.trim(),
    };
  } else if (!listingData.image || !listingData.image.url) {
    delete listingData.image;
  }

  const updatedListing = await Listing.findByIdAndUpdate(id, listingData, {
    new: true,
  });

  req.flash("success", "Listing Updated Successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted Successfully!");
  res.redirect("/listings");
};
