
const mongoose = require("mongoose");
const Movie = require("../models/Movie");

// Checks if there is a path from startId -> targetId through prerequisites
const hasDependencyPath = async (startId, targetId, visited = new Set()) => {
  const cur = startId.toString();
  const dest = targetId.toString();
  if (cur === dest) return true;
  if (visited.has(cur)) return false;
  visited.add(cur);
  const movie = await Movie.findById(cur).select("prerequisites").lean();
  if (!movie) return false;
  for (const pid of movie.prerequisites) {
    if (await hasDependencyPath(pid, dest, visited)) return true;
  }
  return false;
};

// Validate & check circular deps for a given movie id + proposed prerequisites
const validatePrerequisites = async (movieId, prerequisites) => {
  if (!Array.isArray(prerequisites))
    return { error: 400, message: "Prerequisites must be an array" };

  for (const pid of prerequisites) {
    if (!mongoose.Types.ObjectId.isValid(pid))
      return { error: 400, message: "Invalid prerequisite movie ID" };
  }

  const uniqueIds = [...new Set(prerequisites.map((p) => p.toString()))];
  if (uniqueIds.length !== prerequisites.length)
    return { error: 400, message: "Duplicate prerequisites are not allowed" };

  const existingCount = await Movie.countDocuments({ _id: { $in: uniqueIds } });
  if (existingCount !== uniqueIds.length)
    return { error: 400, message: "One or more prerequisite movies do not exist" };

  for (const pid of uniqueIds) {
    if (movieId && (await hasDependencyPath(pid, movieId)))
      return { error: 409, code: "CIRCULAR_DEPENDENCY", message: "This update creates a circular dependency" };
  }

  return null;
};

// POST /api/movies
const createMovie = async (req, res) => {
  try {
    const { title, releaseYear, runtime, prerequisites = [], watched } = req.body;

    if (!title || releaseYear === undefined || runtime === undefined)
      return res.status(400).json({ success: false, message: "Title, release year and runtime are required" });

    if (prerequisites.length > 0) {
      const validationError = await validatePrerequisites(null, prerequisites);
      if (validationError) {
        return res.status(validationError.error).json({
          success: false,
          error: validationError.code,
          message: validationError.message,
        });
      }
    }

    const movie = await Movie.create({ title, releaseYear, runtime, prerequisites, watched: watched ?? false });
    return res.status(201).json({ success: true, message: "Movie created successfully", data: movie });
  } catch (error) {
    if (error.code === 11000)
      return res.status(400).json({ success: false, message: "A movie with this title already exists" });
    if (error.name === "ValidationError" || error.name === "CastError")
      return res.status(400).json({ success: false, message: error.message });
    return res.status(500).json({ success: false, message: "Failed to create movie", error: error.message });
  }
};

// GET /api/movies
const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find()
      .populate("prerequisites", "title releaseYear runtime watched")
      .sort({ releaseYear: 1 });
    return res.status(200).json({ success: true, count: movies.length, data: movies });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch movies", error: error.message });
  }
};

// PATCH /api/movies/:id
const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid movie ID" });

    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).json({ success: false, message: "Movie not found" });

    const { title, releaseYear, runtime, prerequisites, watched } = req.body;

    if (prerequisites !== undefined) {
      const validationError = await validatePrerequisites(id, prerequisites);
      if (validationError) {
        return res.status(validationError.error).json({
          success: false,
          error: validationError.code,
          message: validationError.message,
        });
      }
      movie.prerequisites = prerequisites;
    }

    if (title !== undefined) movie.title = title;
    if (releaseYear !== undefined) movie.releaseYear = releaseYear;
    if (runtime !== undefined) movie.runtime = runtime;
    if (watched !== undefined) movie.watched = watched;

    await movie.save();
    return res.status(200).json({ success: true, message: "Movie updated successfully", data: movie });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError" || error.code === 11000)
      return res.status(400).json({ success: false, message: error.message });
    return res.status(500).json({ success: false, message: "Failed to update movie", error: error.message });
  }
};

// GET /api/movies/:id/rewatch-order
// Topological sort (Kahn's algorithm) of all transitive prerequisites
const getRewatchOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid movie ID" });

    const target = await Movie.findById(id).lean();
    if (!target) return res.status(404).json({ success: false, message: "Movie not found" });

    // BFS to collect all transitive prerequisite nodes
    const allMovies = await Movie.find().select("_id title releaseYear runtime watched prerequisites").lean();
    const movieMap = {};
    for (const m of allMovies) movieMap[m._id.toString()] = m;

    // Collect all nodes reachable from target (excluding target itself)
    const nodeIds = new Set();
    const queue = [...target.prerequisites.map((p) => p.toString())];
    while (queue.length) {
      const cur = queue.shift();
      if (nodeIds.has(cur)) continue;
      nodeIds.add(cur);
      const m = movieMap[cur];
      if (m) for (const p of m.prerequisites) queue.push(p.toString());
    }

    if (nodeIds.size === 0) {
      return res.status(200).json({
        success: true,
        data: { order: [], watchedCount: 0, unwatchedRuntime: 0 },
      });
    }

    // Build in-degree map restricted to nodeIds
    const inDegree = {};
    const adjList = {};
    for (const nid of nodeIds) {
      inDegree[nid] = 0;
      adjList[nid] = [];
    }

    for (const nid of nodeIds) {
      const m = movieMap[nid];
      for (const p of m.prerequisites) {
        const pid = p.toString();
        if (nodeIds.has(pid)) {
          adjList[pid].push(nid);
          inDegree[nid]++;
        }
      }
    }

    // Kahn's topological sort
    const topoQueue = [];
    for (const nid of nodeIds) {
      if (inDegree[nid] === 0) topoQueue.push(nid);
    }

    const order = [];
    while (topoQueue.length) {
      const cur = topoQueue.shift();
      order.push(movieMap[cur]);
      for (const neighbor of adjList[cur]) {
        inDegree[neighbor]--;
        if (inDegree[neighbor] === 0) topoQueue.push(neighbor);
      }
    }

    const watchedCount = order.filter((m) => m.watched).length;
    const unwatchedRuntime = order.filter((m) => !m.watched).reduce((sum, m) => sum + m.runtime, 0);

    return res.status(200).json({
      success: true,
      data: {
        order: order.map(({ _id, title, releaseYear, runtime, watched }) => ({ _id, title, releaseYear, runtime, watched })),
        watchedCount,
        unwatchedRuntime,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to get rewatch order", error: error.message });
  }
};

module.exports = { createMovie, getMovies, updateMovie, getRewatchOrder };
