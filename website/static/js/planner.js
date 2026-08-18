const STORAGE_KEY = "plannerTasks";
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const taskForm = document.getElementById("task-form");
const tasksContainer = document.getElementById("tasks-container");
const daySelect = document.getElementById("day-select");
const taskInput = document.getElementById("task-input");

function loadTasks() {
  try {
    const storedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return storedTasks && typeof storedTasks === "object" ? storedTasks : {};
  } catch (_error) {
    return {};
  }
}

const tasksByDay = loadTasks();

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksByDay));
}

function renderTasks() {
  tasksContainer.replaceChildren();

  DAYS.forEach((day) => {
    const tasks = Array.isArray(tasksByDay[day]) ? tasksByDay[day] : [];
    if (!tasks.length) return;

    const section = document.createElement("section");
    section.className = "day-section";

    const heading = document.createElement("h2");
    heading.textContent = day;

    const list = document.createElement("ul");
    tasks.forEach((task, index) => {
      const item = document.createElement("li");
      const taskText = document.createElement("span");
      const deleteButton = document.createElement("button");

      taskText.textContent = String(task);
      deleteButton.className = "delete-task";
      deleteButton.type = "button";
      deleteButton.textContent = "×";
      deleteButton.setAttribute("aria-label", `Delete ${task}`);
      deleteButton.addEventListener("click", () => {
        tasksByDay[day].splice(index, 1);
        if (!tasksByDay[day].length) delete tasksByDay[day];
        saveTasks();
        renderTasks();
      });

      item.append(taskText, deleteButton);
      list.appendChild(item);
    });

    section.append(heading, list);
    tasksContainer.appendChild(section);
  });
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const day = daySelect.value;
  const task = taskInput.value.trim();
  if (!day || !task) return;

  if (!Array.isArray(tasksByDay[day])) tasksByDay[day] = [];
  tasksByDay[day].push(task);
  saveTasks();
  renderTasks();
  taskInput.value = "";
  taskInput.focus();
});

const pomodoro = document.getElementById("pomodoro");
const timeDisplay = document.getElementById("pomodoro-time");
const startStopButton = document.getElementById("start-stop");
const resetButton = document.getElementById("reset");

let secondsRemaining = 25 * 60;
let timerId = null;
let dragOffset = null;

function renderTime() {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  timeDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function stopTimer() {
  window.clearInterval(timerId);
  timerId = null;
  startStopButton.textContent = "Start";
}

function toggleTimer() {
  if (timerId) {
    stopTimer();
    return;
  }

  startStopButton.textContent = "Pause";
  timerId = window.setInterval(() => {
    secondsRemaining -= 1;
    renderTime();

    if (secondsRemaining <= 0) {
      stopTimer();
      window.alert("Pomodoro complete! Take a break.");
    }
  }, 1000);
}

function resetTimer() {
  stopTimer();
  secondsRemaining = 25 * 60;
  renderTime();
}

function movePomodoro(clientX, clientY) {
  const maxX = window.innerWidth - pomodoro.offsetWidth;
  const maxY = window.innerHeight - pomodoro.offsetHeight;
  const left = Math.max(0, Math.min(clientX - dragOffset.x, maxX));
  const top = Math.max(0, Math.min(clientY - dragOffset.y, maxY));

  pomodoro.style.left = `${left}px`;
  pomodoro.style.top = `${top}px`;
  pomodoro.style.right = "auto";
  pomodoro.style.bottom = "auto";
}

pomodoro.addEventListener("pointerdown", (event) => {
  if (event.target.closest("button")) return;

  const bounds = pomodoro.getBoundingClientRect();
  dragOffset = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
  pomodoro.classList.add("dragging");
  pomodoro.setPointerCapture(event.pointerId);
});

pomodoro.addEventListener("pointermove", (event) => {
  if (!dragOffset) return;
  movePomodoro(event.clientX, event.clientY);
});

pomodoro.addEventListener("pointerup", (event) => {
  dragOffset = null;
  pomodoro.classList.remove("dragging");
  pomodoro.releasePointerCapture(event.pointerId);
});

startStopButton.addEventListener("click", toggleTimer);
resetButton.addEventListener("click", resetTimer);

renderTasks();
renderTime();
