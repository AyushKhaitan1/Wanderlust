const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");
const Booking = require("../models/booking.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const categories = [
  "trending",
  "rooms",
  "iconic cities",
  "mountains",
  "castles",
  "pools",
  "camping",
  "farms",
  "arctic",
  "domes",
  "boats",
];

const sampleReviewTexts = [
  {
    comment: "The views from this property were absolutely breathtaking! The place was spotless, tastefully styled, and the host gave wonderful local tips.",
    rating: 5,
  },
  {
    comment: "Had a peaceful and rejuvenating stay here. The high-speed WiFi worked seamlessly for remote work, and the bed was remarkably comfortable.",
    rating: 5,
  },
  {
    comment: "Lovely atmosphere and prime location close to major sights. Check-in was effortless with the digital lock. Highly recommend for travelers!",
    rating: 4,
  },
  {
    comment: "Exceeded all our expectations! The photos don't even do justice to how cozy and spacious the property feels in person. Will book again!",
    rating: 5,
  },
  {
    comment: "Clean, modern, and wonderfully situated. The host was incredibly responsive and the surroundings were tranquil. Truly a 5-star experience.",
    rating: 5,
  },
  {
    comment: "Wonderful getaway stay! Watching the morning sunrise with coffee on the balcony was unforgettable. Very close to great local cafes.",
    rating: 5,
  },
  {
    comment: "Everything was exactly as described. Pristine linens, hot shower with great pressure, and thoughtful amenities throughout. Felt like home!",
    rating: 5,
  },
  {
    comment: "Great value for the price. Very cozy vibe, fast check-in, and convenient parking right outside. Thank you for the wonderful hospitality!",
    rating: 4,
  },
];

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB for seeding");
}

const initDB = async () => {
  await Listing.deleteMany({});
  await Review.deleteMany({});
  await User.deleteMany({});
  await Booking.deleteMany({});

  // 1. Create Hosts
  const hostSarah = new User({ email: "sarah@wanderlust.com", username: "sarah_j", name: "Sarah Jenkins" });
  const registeredSarah = await User.register(hostSarah, "host123");

  const hostAlex = new User({ email: "alex@wanderlust.com", username: "alex_r", name: "Alex Rivera" });
  const registeredAlex = await User.register(hostAlex, "host123");

  const hostElena = new User({ email: "elena@wanderlust.com", username: "elena_r", name: "Elena Rostova" });
  const registeredElena = await User.register(hostElena, "host123");

  const adminUser = new User({ email: "admin@wanderlust.com", username: "wanderlust_admin", name: "Wanderlust Superhost" });
  const registeredAdmin = await User.register(adminUser, "admin123");

  // 2. Create Diverse Reviewer Profiles
  const travelerAlice = new User({ email: "alice@wanderlust.com", username: "alice_travels", name: "Alice Montgomery" });
  const regAlice = await User.register(travelerAlice, "traveler123");

  const travelerLiam = new User({ email: "liam@wanderlust.com", username: "liam_cooper", name: "Liam Cooper" });
  const regLiam = await User.register(travelerLiam, "traveler123");

  const travelerMaya = new User({ email: "maya@wanderlust.com", username: "maya_patel", name: "Maya Patel" });
  const regMaya = await User.register(travelerMaya, "traveler123");

  const travelerDaniel = new User({ email: "daniel@wanderlust.com", username: "daniel_v", name: "Daniel Vance" });
  const regDaniel = await User.register(travelerDaniel, "traveler123");

  const travelerSophia = new User({ email: "sophia@wanderlust.com", username: "sophia_c", name: "Sophia Chen" });
  const regSophia = await User.register(travelerSophia, "traveler123");

  const hosts = [registeredSarah, registeredAlex, registeredElena, registeredAdmin];
  const reviewers = [regAlice, regLiam, regMaya, regDaniel, regSophia, registeredSarah, registeredAlex];

  // 3. Populate each listing with 2 to 3 demo reviews
  const allCreatedListings = [];

  for (let i = 0; i < initData.data.length; i++) {
    const rawListing = initData.data[i];
    const assignedHost = hosts[i % hosts.length];

    // Determine 2 or 3 reviews for this listing
    const reviewCount = (i % 2 === 0) ? 3 : 2;
    const reviewIds = [];

    for (let r = 0; r < reviewCount; r++) {
      const reviewTemplate = sampleReviewTexts[(i * 3 + r) % sampleReviewTexts.length];
      const reviewer = reviewers[(i + r + 1) % reviewers.length];

      const reviewDate = new Date();
      reviewDate.setDate(reviewDate.getDate() - (r * 12 + (i % 15) + 1));

      const reviewDoc = new Review({
        comment: reviewTemplate.comment,
        rating: reviewTemplate.rating,
        author: reviewer._id,
        createdAt: reviewDate,
      });

      await reviewDoc.save();
      reviewIds.push(reviewDoc._id);
    }

    const listingDoc = new Listing({
      ...rawListing,
      owner: assignedHost._id,
      category: categories[i % categories.length],
      reviews: reviewIds,
    });

    const savedListing = await listingDoc.save();
    allCreatedListings.push(savedListing);
  }

  console.log(`Successfully seeded ${allCreatedListings.length} listings, each with 2-3 verified guest reviews!`);

  // 4. Create confirmed sample bookings for Alice
  const sampleBooking1 = new Booking({
    listing: allCreatedListings[0]._id,
    user: regAlice._id,
    checkin: new Date(Date.now() + 86400000 * 3),
    checkout: new Date(Date.now() + 86400000 * 7),
    nights: 4,
    guests: 2,
    totalPrice: allCreatedListings[0].price * 4 + 1350 + Math.round((allCreatedListings[0].price * 4 + 1350) * 0.18),
    paymentMethod: "Card",
    paymentStatus: "Paid",
  });
  await sampleBooking1.save();

  const sampleBooking2 = new Booking({
    listing: allCreatedListings[3]._id,
    user: regAlice._id,
    checkin: new Date(Date.now() + 86400000 * 14),
    checkout: new Date(Date.now() + 86400000 * 17),
    nights: 3,
    guests: 1,
    totalPrice: allCreatedListings[3].price * 3 + 1350 + Math.round((allCreatedListings[3].price * 3 + 1350) * 0.18),
    paymentMethod: "UPI",
    paymentStatus: "Paid",
  });
  await sampleBooking2.save();

  // 5. Add wishlist items
  regAlice.wishlist.push(allCreatedListings[1]._id);
  regAlice.wishlist.push(allCreatedListings[2]._id);
  regAlice.wishlist.push(allCreatedListings[5]._id);
  await regAlice.save();

  registeredAdmin.wishlist.push(allCreatedListings[0]._id);
  registeredAdmin.wishlist.push(allCreatedListings[4]._id);
  await registeredAdmin.save();

  console.log("Database successfully seeded with realistic bookings, wishlist stays, and 2-3 reviews per listing!");

  await mongoose.disconnect();
  console.log("Database connection closed");
  process.exit(0);
};

main()
  .then(() => initDB())
  .catch((err) => {
    console.error("Seeding error:", err);
    process.exit(1);
  });
