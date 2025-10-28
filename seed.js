// backend/seed.js

const mongoose = require("mongoose");
const Booking = require("./Booking");

// 🔹 Local MongoDB URI
const MONGO_URI = "mongodb://127.0.0.1:27017/mgaconnect";

// 🔹 Data to insert
const seedData = [
  {
    name: "Mohammed Salimullah",
    flightNumber: "BG0444",
    flightTime: "12:05",
    depArr: "Departure",
    pax: 4,
    serviceType: "Premier",
    passengerType: "Corporate",
    corpBankName: "Brac",
    contact: "9172548344",
    email: "tawnidarmin@gmail.com",
    payment: "Cash",
    lounge: "Not Reqd",
    transport: "From Apt to Gulshan",
    luggage: "No",
    remarks: ""
  },
  {
    name: "Tawnid Salimullah",
    flightNumber: "BG0444",
    flightTime: "11:38",
    depArr: "Departure",
    pax: 3,
    serviceType: "Standard",
    passengerType: "Bank",
    corpBankName: "Brac Bank",
    contact: "9172548344",
    email: "tawnidarmin@gmail.com",
    payment: "Cash",
    lounge: "Yes",
    transport: "Not Reqd",
    luggage: "No",
    remarks: "Need one extra staff"
  }
];

// 🔹 Connect to MongoDB and insert data
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("✅ Connected to MongoDB for seeding");

    await Booking.deleteMany({});
    console.log("🗑️ Cleared old data");

    await Booking.insertMany(seedData);
    console.log("🌱 Seed data inserted successfully!");

    mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  })
  .catch((err) => {
    console.error("❌ Error seeding database:", err);
  });

