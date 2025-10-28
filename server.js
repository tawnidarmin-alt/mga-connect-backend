const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

let bookings = [];
try {
  const data = fs.readFileSync("booking.json");
  bookings = JSON.parse(data);
} catch (err) {
  console.log("No booking.json found, starting with empty bookings");
}

app.get("/bookings", (req, res) => res.json(bookings));

app.post("/bookings", (req, res) => {
  const newBooking = { 
    id: Date.now(),
    ...req.body,
    billAmount: "",
    serviceBy: "",
    status: "",
    action: ""
  };
  bookings.push(newBooking);
  fs.writeFileSync("booking.json", JSON.stringify(bookings, null, 2));
  console.log("New Booking Received:", newBooking);
  res.status(201).json(newBooking);
});

app.put("/bookings/:id", (req, res) => {
  const bookingId = parseInt(req.params.id);
  const index = bookings.findIndex(b => b.id === bookingId);
  if (index === -1) return res.status(404).json({ message: "Booking not found" });
  bookings[index] = { ...bookings[index], ...req.body };
  fs.writeFileSync("booking.json", JSON.stringify(bookings, null, 2));
  res.json(bookings[index]);
});

app.delete("/bookings/:id", (req, res) => {
  const bookingId = parseInt(req.params.id);
  const index = bookings.findIndex(b => b.id === bookingId);
  if (index === -1) return res.status(404).json({ message: "Booking not found" });
  const deletedBooking = bookings.splice(index, 1)[0];
  fs.writeFileSync("booking.json", JSON.stringify(bookings, null, 2));
  res.json(deletedBooking);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
