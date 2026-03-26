const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Mock database: In production, use MongoDB or PostgreSQL
// Key would be user wallet address or session ID
const userProgress = {};
// Helper to create a new user profile
const defaultTasks = () => ({
  followed: false,
  liked: false,
  retweeted: false,
  joined: false,
  followed_fb: false,
});

// Get tasks
app.get("/tasks", (req, res) => {
  const userId = req.query.userId || "anonymous";
  if (!userProgress[userId]) userProgress[userId] = defaultTasks();
  res.json(userProgress[userId]);
});

// Update task
app.post("/tasks", (req, res) => {
  const { taskName, userId = "anonymous" } = req.body;

  if (!userProgress[userId]) userProgress[userId] = defaultTasks();

  if (userProgress[userId].hasOwnProperty(taskName)) {
    userProgress[userId][taskName] = true;
  }

  res.json(userProgress[userId]);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
