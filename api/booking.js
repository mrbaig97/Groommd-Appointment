const express = require("express");
const router = express.Router();
const bookingController = require("./controllers/booking"); // Adjust the path as needed

// Define the route for creating a booking
router.post("/create-booking", bookingController.createBooking);

// Define the route for getting availability
router.post("/get-availability", bookingController.getAvailability);

module.exports = router;
