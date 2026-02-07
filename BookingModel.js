const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingCode: { type: String, default: "" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String },
    arrivalDeparture: { type: String },
    corporateBankName: { type: String },
    numberOfPassenger: { type: Number },
    passengerCategory: { type: String },
    flightNumber: { type: String },
    flightDate: { type: String },
    flightTime: { type: String },
    numberOfLuggage: { type: Number },
    serviceType: { type: String },
    lounge: { type: String },
    transport: { type: String },
    hotel: { type: String },
    payment: { type: String },
    otherRequirement: { type: String },
    status: { type: String, default: "Pending" },
    serviceBy: { type: String },
    action: { type: String, default: "" },
    cardNumber: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);


