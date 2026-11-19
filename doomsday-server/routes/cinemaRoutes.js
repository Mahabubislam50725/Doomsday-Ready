
const express = require("express");
const router = express.Router();
const { createCinema, getCinemas, getBookingQuote } = require("../controllers/cinemaController");

router.post("/", createCinema);
router.get("/", getCinemas);
router.get("/:id/booking", getBookingQuote);

module.exports = router;
