const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

module.exports.createBooking = async (req, res) => {
  const { id } = req.params;
  const { checkin, checkout, nights, guests, totalPrice, paymentMethod } = req.body;

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  const newBooking = new Booking({
    listing: id,
    user: req.user._id,
    checkin: new Date(checkin),
    checkout: new Date(checkout),
    nights: parseInt(nights) || 1,
    guests: parseInt(guests) || 1,
    totalPrice: parseFloat(totalPrice) || listing.price,
    paymentMethod: paymentMethod || "Card",
    paymentStatus: "Paid",
  });

  await newBooking.save();

  req.flash("success", `🎉 Booking confirmed for "${listing.title}"! Have a wonderful trip.`);
  res.redirect("/profile");
};

module.exports.cancelBooking = async (req, res) => {
  const { id } = req.params;
  const booking = await Booking.findById(id);

  if (!booking) {
    req.flash("error", "Booking not found!");
    return res.redirect("/profile");
  }

  if (!booking.user.equals(req.user._id)) {
    req.flash("error", "You do not have permission to cancel this booking!");
    return res.redirect("/profile");
  }

  await Booking.findByIdAndDelete(id);
  req.flash("success", "Booking cancelled successfully. Refund initiated to original payment method.");
  res.redirect("/profile");
};

module.exports.toggleWishlist = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ success: false, message: "Please log in to save to your wishlist." });
  }

  const { id } = req.params;
  const user = await User.findById(req.user._id);

  const index = user.wishlist.indexOf(id);
  let isSaved = false;

  if (index === -1) {
    user.wishlist.push(id);
    isSaved = true;
  } else {
    user.wishlist.splice(index, 1);
    isSaved = false;
  }

  await user.save();
  return res.json({ success: true, isSaved, message: isSaved ? "Saved to your Wishlist!" : "Removed from Wishlist" });
};

module.exports.renderProfile = async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  const bookings = await Booking.find({ user: req.user._id })
    .populate("listing")
    .sort({ createdAt: -1 });

  const hostedListings = await Listing.find({ owner: req.user._id });

  const activeTab = req.query.tab || "bookings";

  res.render("users/profile.ejs", {
    profileUser: user,
    bookings,
    wishlist: user.wishlist || [],
    hostedListings,
    activeTab,
  });
};
