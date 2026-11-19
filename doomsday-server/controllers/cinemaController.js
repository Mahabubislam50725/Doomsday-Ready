
const Cinema = require("../models/Cinema");

// POST /api/cinemas
const createCinema = async (req, res) => {
  try {
    const { name, bundleSizes } = req.body;
    if (!name || !bundleSizes)
      return res.status(400).json({ success: false, message: "Name and bundleSizes are required" });

    const cinema = await Cinema.create({ name, bundleSizes });
    return res.status(201).json({ success: true, message: "Cinema created successfully", data: cinema });
  } catch (error) {
    if (error.code === 11000)
      return res.status(400).json({ success: false, message: "A cinema with this name already exists" });
    if (error.name === "ValidationError")
      return res.status(400).json({ success: false, message: error.message });
    return res.status(500).json({ success: false, message: "Failed to create cinema", error: error.message });
  }
};

// GET /api/cinemas
const getCinemas = async (req, res) => {
  try {
    const cinemas = await Cinema.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: cinemas.length, data: cinemas });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch cinemas", error: error.message });
  }
};

// GET /api/cinemas/:id/booking?groupSize=N
// DP: find minimum number of bundles that sum exactly to groupSize
const getBookingQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const groupSize = parseInt(req.query.groupSize, 10);

    if (!groupSize || groupSize < 1 || groupSize > 10000)
      return res.status(400).json({ success: false, message: "groupSize must be between 1 and 10000" });

    const cinema = await Cinema.findById(id).lean();
    if (!cinema) return res.status(404).json({ success: false, message: "Cinema not found" });

    const sizes = cinema.bundleSizes;
    const INF = Infinity;

    // dp[i] = min bundles to make exactly i seats
    const dp = new Array(groupSize + 1).fill(INF);
    // choice[i] = which bundle size was used to reach i optimally
    const choice = new Array(groupSize + 1).fill(-1);
    dp[0] = 0;

    for (let i = 1; i <= groupSize; i++) {
      for (const size of sizes) {
        if (size <= i && dp[i - size] + 1 < dp[i]) {
          dp[i] = dp[i - size] + 1;
          choice[i] = size;
        }
      }
    }

    if (dp[groupSize] === INF) {
      return res.status(200).json({ success: true, data: { possible: false } });
    }

    // Reconstruct which bundles were used
    const bundleCount = {};
    let remaining = groupSize;
    while (remaining > 0) {
      const used = choice[remaining];
      bundleCount[used] = (bundleCount[used] || 0) + 1;
      remaining -= used;
    }

    const bundles = Object.entries(bundleCount).map(([size, count]) => ({
      size: Number(size),
      count,
    }));

    return res.status(200).json({
      success: true,
      data: {
        possible: true,
        totalBundles: dp[groupSize],
        bundles,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to get booking quote", error: error.message });
  }
};

module.exports = { createCinema, getCinemas, getBookingQuote };
