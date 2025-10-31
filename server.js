const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Helper functions to read/write bookings
function readBookings() {
  try {
    const data = fs.readFileSync("booking.json");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeBookings(data) {
  fs.writeFileSync("booking.json", JSON.stringify(data, null, 2));
}

// Get all bookings
app.get("/bookings", (req, res) => {
  const data = readBookings();
  res.json(data);
});

// Add new booking
app.post("/bookings", (req, res) => {
  const newBooking = {
    id: Date.now(),
    ...req.body,
    billAmount: "",
    serviceBy: "",
    status: "",
    action: ""
  };
  const data = readBookings();
  data.push(newBooking);
  writeBookings(data);
  res.json(newBooking);
});

// Get bookings by email (client-only)
app.get("/bookings/email/:email", (req, res) => {
  const email = req.params.email.toLowerCase();
  const data = readBookings();
  const clientBookings = data.filter(
    b => b.email && b.email.toLowerCase() === email
  );
  res.json(clientBookings);
});

// Update booking
const STAFF_KEY = "MGA2025"; // temporary staff access key
const nodemailer = require("nodemailer");

app.put("/bookings/:id", async (req, res) => {
  const bookingId = parseInt(req.params.id);
  const index = bookings.findIndex(b => b.id === bookingId);

  if (index === -1) {
    return res.status(404).json({ message: "Booking not found" });
  }

  // Update only allowed staff fields
  const allowedFields = ["billAmount", "serviceBy", "status", "action"];
  const updatedBooking = { ...bookings[index] };

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updatedBooking[field] = req.body[field];
    }
  }

  bookings[index] = updatedBooking;
  fs.writeFileSync("booking.json", JSON.stringify(bookings, null, 2));

  // 📧 If staff selected "Notify Client", send email
  if (req.body.action === "Notify Client") {
    const booking = bookings[index];
    await sendClientEmail(booking);
  }

  res.json(updatedBooking);
});

// Helper function to send email
async function sendClientEmail(booking) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "YOUR_EMAIL@gmail.com",       // replace with your Gmail
      pass: "YOUR_APP_PASSWORD"           // Gmail App Password (not your login password)
    },
  });

  const mailOptions = {
    from: `"MGA Connect" <YOUR_EMAIL@gmail.com>`,
    to: booking.email,
    subject: "MGA Connect – Service Confirmation",
    text: `Received your service request as ${booking.id} and confirming the service.\n\nThank you for choosing MGA Connect.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${booking.email}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
}

  // ✅ Allow updates only for staff fields
  const allowedFields = ["billAmount", "serviceBy", "status", "action"];
  const updatedBooking = { ...bookings[index] };

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updatedBooking[field] = req.body[field];
    }
  }

  bookings[index] = updatedBooking;
  fs.writeFileSync("booking.json", JSON.stringify(bookings, null, 2));
  res.json(updatedBooking);
});

// Delete booking
// ✅ Cancel booking (mark as cancelled safely)
// ✅ Cancel booking (mark as cancelled safely)
app.delete("/bookings/:id", (req, res) => {
  const bookingId = Number(req.params.id); // convert to number for comparison
  let bookings = [];

  try {
    // Read bookings from file
    const fileData = fs.readFileSync("booking.json", "utf8");
    bookings = JSON.parse(fileData);
  } catch (err) {
    console.log("⚠️ No booking.json found, starting with empty list");
  }

  // Find the booking by numeric match
  const index = bookings.findIndex(b => Number(b.id) === bookingId);

  if (index === -1) {
    console.log(`❌ Booking ${bookingId} not found`);
    console.log("Available IDs:", bookings.map(b => b.id)); // Debug info
    return res.status(404).json({ message: "Booking not found" });
  }

  // ✅ Mark as Cancelled (don’t delete)
  bookings[index].status = "Cancelled";

  try {
    fs.writeFileSync("booking.json", JSON.stringify(bookings, null, 2));
    console.log(`✅ Booking ${bookingId} marked as Cancelled.`);
    return res.json({
      message: `Booking ${bookingId} cancelled`,
      booking: bookings[index],
    });
  } catch (err) {
    console.error("❌ Error writing booking file:", err);
    return res.status(500).json({ message: "Server error while cancelling booking" });
  }
});
  // Find the booking by ID
  const index = bookings.findIndex(b => String(b.id) === String(bookingId));
  if (index === -1) {
    console.log(`❌ Booking ${bookingId} not found`);
    return res.status(404).json({ message: "Booking not found" });
  }

  // Mark as cancelled
  bookings[index].status = "Cancelled";

  try {
    fs.writeFileSync("booking.json", JSON.stringify(bookings, null, 2));
    console.log(`✅ Booking ${bookingId} marked as Cancelled.`);
    return res.json({
      message: `Booking ${bookingId} cancelled`,
      booking: bookings[index],
    });
  } catch (err) {
    console.error("❌ Error writing booking file:", err);
    return res
      .status(500)
      .json({ message: "Server error while cancelling booking" });
  }
});


