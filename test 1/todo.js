const input = document.querySelector("input");
const addButton = document.querySelector(".add-button");
const todosHtml = document.querySelector(".todos");
const emptyImage = document.querySelector(".empty-image");
let todosJson = JSON.parse(localStorage.getItem("todos")) || [];
const deleteAllButton = document.querySelector(".delete-all");
const filters = document.querySelectorAll(".filter");
let filter = "";

showTodos();

function getTodoHtml(todo, index) {
  if (filter && filter != todo.status) {
    return "";
  }
  let checked = todo.status == "completed" ? "checked" : "";
  return /* html */ `
    <li class="todo">
      <label for="${index}">
        <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked}>
        <span class="checkB"class="${checked}">${todo.name}</span>
      </label>
      <button class="delete-btn" data-index="${index}" onclick="remove(this)"><i class="fa fa-times"></i></button>
    </li>
  `;
}

function showTodos() {
  if (todosJson.length == 0) {
    todosHtml.innerHTML = "";
    emptyImage.style.display = "block";
  } else {
    todosHtml.innerHTML = todosJson.map(getTodoHtml).join("");
    emptyImage.style.display = "none";
  }
}

function addTodo(todo) {
  input.value = "";
  todosJson.unshift({ name: todo, status: "pending" });
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

input.addEventListener("keyup", (e) => {
  let todo = input.value.trim();
  if (!todo || e.key != "Enter") {
    return;
  }
  addTodo(todo);
});

addButton.addEventListener("click", () => {
  let todo = input.value.trim();
  if (!todo) {
    return;
  }
  addTodo(todo);
});

function updateStatus(todo) {
  let todoName = todo.parentElement.lastElementChild;
  if (todo.checked) {
    todoName.classList.add("checked");
    todosJson[todo.id].status = "completed";
  } else {
    todoName.classList.remove("checked");
    todosJson[todo.id].status = "pending";
  }
  localStorage.setItem("todos", JSON.stringify(todosJson));
}

function remove(todo) {
  let confirmDel = confirm("Are you sure you do you want to remove this?");
  if (!confirmDel) {
    return;
  }
  const index = todo.dataset.index;
  todosJson.splice(index, 1);
  showTodos();
  localStorage.setItem("todos", JSON.stringify(todosJson));
}

filters.forEach(function (el) {
  el.addEventListener("click", (e) => {
    if (el.classList.contains("active")) {
      el.classList.remove("active");
      filter = "";
    } else {
      filters.forEach((tag) => tag.classList.remove("active"));
      el.classList.add("active");
      filter = e.target.dataset.filter;
    }
    showTodos();
  });
});

deleteAllButton.addEventListener("click", () => {
  let confirmDel = confirm("Are you sure you want to delete all of this?");
  if (!confirmDel) {
    return;
  }
  todosJson = [];
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
});
// =============   alarm in bg ===================================================

let ringtone = new Audio("./ringtone.mp3"); // Ensure this path is correct

function getLocalTimeComponents() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();

  // Determine AM or PM suffix
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Format hours and minutes to always be two digits
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');

  // Return hour, minute, and AM/PM separately
  return {
      hour: formattedHours,
      minute: formattedMinutes,
      ampm: ampm
  };
}

// Function to trigger the alarm
function triggerAlarm() {
    ringtone.loop = true; // Set to loop
    ringtone.play().catch(error => {
        console.error("Error playing sound:", error);
    });
}

// Function to check the alarm
function checkAlarm() {
    const timeComponents = getLocalTimeComponents();

    let Lhours = localStorage.getItem("alarmHour");
    let Lminutes = localStorage.getItem("alarmMinute");
    let Lampm = localStorage.getItem("alarmAMPM");

    console.log("Current Time:", timeComponents.hour, timeComponents.minute, timeComponents.ampm);
    console.log("Stored Alarm Time:", Lhours, Lminutes, Lampm);

    if (Lhours === timeComponents.hour &&
        Lminutes === timeComponents.minute &&
        Lampm === timeComponents.ampm) {
        console.log("Alarm Triggered!");
        triggerAlarm();
    } else {
        console.log("No Alarm Triggered.");
    }
}

// Check the alarm every second (1000 milliseconds)
setInterval(checkAlarm, 1000); // Check every second
