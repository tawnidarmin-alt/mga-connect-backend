require("dotenv").config();
const mongoose = require("mongoose");
const Booking = require("./BookingModel");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

async function populateBookingCodes() {
  try {
    const bookings = await Booking.find({ bookingCode: { $in: [null, ""] } });
    console.log(`Found ${bookings.length} bookings without bookingCode.`);

    for (let b of bookings) {
      const today = new Date();
      const dateCode = today.toISOString().slice(0, 10).replace(/-/g, "");
      const idCode = Math.floor(Math.random() * 1000);
      const bookingCode = `MGA-${dateCode}-${idCode}`;

      b.bookingCode = bookingCode;
      await b.save();
      console.log(`Updated booking ${b._id} with bookingCode ${bookingCode}`);
    }

    console.log("✅ All missing bookingCodes populated.");
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
    mongoose.disconnect();
  }
}

populateBookingCodes();

