
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const movieRoutes = require("./routes/movieRoutes");
const cinemaRoutes = require("./routes/cinemaRoutes");

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
}));
app.use(express.json());

app.use("/api/movies", movieRoutes);
app.use("/api/cinemas", cinemaRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Doomsday Ready API Server is Running!" });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};

startServer();
