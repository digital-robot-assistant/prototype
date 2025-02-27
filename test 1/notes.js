const addbox = document.querySelector(".add-box"),
  popupBox = document.querySelector(".popup-box"),
  popupTitle = document.querySelector("header p"),
  closeIcon = popupBox.querySelector("header i"),
  titleTag = popupBox.querySelector("input"),
  descTag = popupBox.querySelector("textarea"),
  addBtn = popupBox.querySelector("button");

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false,
  updateId;

addbox.addEventListener("click", () => {
  titleTag.focus();
  popupBox.classList.add("show");
});

closeIcon.addEventListener("click", () => {
  isUpdate = false;
  titleTag.value = "";
  descTag.value = "";
  addBtn.innerHTML = "add note";
  popupTitle.innerHTML = "add a new note";

  popupBox.classList.remove("show");
});

function showNotes() {
  document.querySelectorAll(".note").forEach((note) => note.remove());
  notes.forEach((note, index) => {
    let liTag = `
 <li class="note">
        <div class="details">
          <p>${note.title}</p>
          <span
            >${note.description}</span>
        </div>
        <div class="bottom-content">
          <span>${note.Date}</span>
          <div class="settings">
            <i onclick='showMenu(this)' class="uil uil-ellipsis-h" style="opcity:0;" ></i>
            <ul class="menu">
              <li onclick="updateNote(${index},'${note.title}','${note.description}')"><i class="uil uil-pen"></i>edit</li>
              <li onclick="deleteNote(${index})" ><i class="uil uil-trash"></i>delete</li>
            </ul>
          </div>
        </div>
      </li>
`;
    addbox.insertAdjacentHTML("afterend", liTag);
  });
}

//show menu
function showMenu(elem) {
  elem.parentElement.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}
//deleting note using setting

function deleteNote(noteId) {
  let confirmDel = confirm("Are you sure you want to delete this note?");
  if (!confirmDel) {
    return;
  }
  notes.splice(noteId, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  showNotes();
}

//updating note using setting
function updateNote(noteId, title, desc) {
  isUpdate = true;
  updateId = noteId;
  addbox.click();
  titleTag.value = title;
  descTag.value = desc;
  addBtn.innerHTML = "Update note";
  popupTitle.innerHTML = "Update a note";
  console.log(noteId, title, desc);
}

//showing edit note
showNotes();
addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let noteTitle = titleTag.value,
    noteDecs = descTag.value;

  if (noteTitle || noteDecs) {
    // getting current date
    let dateObj = new Date(),
      month = months[dateObj.getMonth()],
      day = dateObj.getDate(),
      year = dateObj.getFullYear();

    // adding info
    let noteInfo = {
      title: noteTitle,
      description: noteDecs,
      Date: `${month} ${day}, ${year}`,
    };
    if (!isUpdate) {
      notes.push(noteInfo); //add new notes
    } else {
      isUpdate = false;
      notes[updateId] = noteInfo; //updating notes
    }
    // save to local storege
    localStorage.setItem("notes", JSON.stringify(notes));
    closeIcon.click();
    showNotes();
  }
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
