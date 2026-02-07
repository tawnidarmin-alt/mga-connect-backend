require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const Booking = require("./BookingModel");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

// ------------------------
// MongoDB Connection
// ------------------------
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ------------------------
// Email Transporter
// ------------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// ------------------------
// Mock SMS Sender (console-based for now)
// ------------------------
const sendSMS = async (to, message) => {
  console.log(`📩 Mock SMS sent to ${to}: ${message}`);
};

// ------------------------
// Routes
// ------------------------

// ------------------------
// Routes
// ------------------------

// Create Booking
app.post("/bookings", async (req, res) => {
  try {
    const bookingData = req.body;
    const today = new Date();
    const dateCode = today.toISOString().slice(0, 10).replace(/-/g, "");
    const idCode = Math.floor(Math.random() * 1000);
    const bookingCode = `MGA-${dateCode}-${idCode}`;

    const newBooking = new Booking({ ...bookingData, bookingCode });
    await newBooking.save();
    res.json(newBooking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating booking" });
  }
});

// Get All Bookings
app.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// Update Booking Fields
app.put("/bookings/:id", async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating booking" });
  }
});

// ------------------------
// Notify Client (email + mock SMS)
app.post("/bookings/notify/:bookingCode", async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { bookingCode: req.params.bookingCode },
      { status: "Notified", action: "Notified" },
      { new: true }
    );

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const cancelLink = `${process.env.PUBLIC_BASE_URL}/cancel/${booking.bookingCode}`;
    // Prepare email text
   // Construct full email content
const emailText = `
Dear ${booking.name},

Your booking has been confirmed. Here are the details:

Booking Code: ${booking.bookingCode}
Flight: ${booking.flightNumber}
Date: ${booking.flightDate} at ${booking.flightTime}
Arrival/Departure: ${booking.arrivalDeparture}
Passengers: ${booking.numberOfPassenger}
Category: ${booking.passengerCategory}
Corporate/Bank Name: ${booking.corporateBankName}
Service Type: ${booking.serviceType}
Luggage: ${booking.numberOfLuggage}
Lounge: ${booking.lounge}
Transport: ${booking.transport}
Hotel: ${booking.hotel}
Payment: ${booking.payment}
Other Requirement: ${booking.otherRequirement}

You can cancel your booking here: ${cancelLink}
`;

// Send email using the full content
await transporter.sendMail({
  from: process.env.GMAIL_USER,
  to: booking.email,
  subject: `Confirmation for Booking ${booking.bookingCode}`,
  text: emailText, // <-- make sure you use emailText here
});

    // Mock SMS
    await sendSMS(
      booking.contactNumber,
      `Dear ${booking.name}, your booking (${booking.bookingCode}) has been updated. Cancel here: ${cancelLink}`
    );

    console.log(`Client notified for booking ${booking.bookingCode}`);
    res.json({ message: "Client notified", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error notifying client" });
  }
});

// ------------------------
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));


