const tasks = [
  { action: "followed", nextId: "likeTask", url: "https://x.com/fifaworldc26" },
  {
    action: "liked",
    nextId: "retweetTask",
    url: "https://x.com/fifaworldc26/status/2024518300470776044?s=20",
  },
  {
    action: "retweeted",
    nextId: "postTask",
    url: "https://x.com/fifaworldc26/status/2024518300470776044?s=20",
  },
  { action: "joined", nextId: "claimTask", url: "https://t.me/fwcup26" },
];

let completedCount = 0;
// Generate a simple session ID if one doesn't exist to separate users
const userId =
  localStorage.getItem("airdrop_user_id") ||
  Math.random().toString(36).substring(7);
localStorage.setItem("airdrop_user_id", userId);

// Use relative URL when served from the same origin, or fallback for local dev
const API_BASE_URL = window.location.hostname === "localhost"
  ? "http://localhost:5000"
  : "";
const totalTasks = tasks.length;

function updateProgress() {
  const percent = Math.round((completedCount / totalTasks) * 100);
  document.getElementById("progressText").innerText =
    `${completedCount}/${totalTasks} steps completed`;
  document.getElementById("progressPercent").innerText = `${percent}%`;
}

function markTaskComplete(button, taskConfig) {
  button.innerText = "Completed";
  button.style.backgroundColor = "#28a745";
  button.disabled = true;

  completedCount++;
  updateProgress();

  if (taskConfig.nextId) {
    const nextTask = document.getElementById(taskConfig.nextId);
    if (nextTask) nextTask.classList.remove("locked");
  }
}

async function completeTask(action) {
  if (action === "claim") {
    alert(
      "Congratulations !!! Completed!!!\n\nYou have Successfully Secured Your Spot\nDon't Forget To Submit Your Sol Wallet In The Comment Section",
    );
    return;
  }

  // Find the task configuration based on the action
  const taskIndex = tasks.findIndex((t) => t.action === action);
  if (taskIndex === -1) return;

  const taskConfig = tasks[taskIndex];

  // Find button by looking for the one that calls this specific action
  const button = document.querySelector(
    `button[onclick="completeTask('${action}')"]`,
  );

  if (button.disabled) return;

  if (taskConfig.url) {
    window.open(taskConfig.url, "_blank", "noopener,noreferrer");
  }

  // Simulate network request/processing
  button.innerText = "Verifying...";
  button.disabled = true;

  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskName: action, userId: userId }),
    });

    if (!response.ok) throw new Error("Server error");

    const updatedTasks = await response.json();
    console.log("Sync successful:", updatedTasks);

    markTaskComplete(button, taskConfig);
  } catch (error) {
    console.warn("Backend unavailable, completing task locally:", error.message);
    // Complete the task client-side even if the backend is unreachable
    markTaskComplete(button, taskConfig);
  }
}

// Initialize progress on load
updateProgress();
