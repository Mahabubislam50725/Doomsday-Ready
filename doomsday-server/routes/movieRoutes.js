
const express = require("express");
const router = express.Router();
const { createMovie, getMovies, updateMovie, getRewatchOrder } = require("../controllers/movieController");

router.post("/", createMovie);
router.get("/", getMovies);
router.patch("/:id", updateMovie);
router.get("/:id/rewatch-order", getRewatchOrder);

module.exports = router;
