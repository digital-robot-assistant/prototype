const currentTime = document.querySelector("h1"),
  content = document.querySelector(".content"),
  selectMenu = document.querySelectorAll("select"),
  setAlarmBtn = document.querySelector("button");

let alarmTime,
  isAlarmSet = false,
  ringtone = new Audio("./ringtone.mp3")

// Populate hour, minute, and AM/PM options
for (let i = 12; i > 0; i--) {
  i = i < 10 ? `0${i}` : i;
  let option = `<option value="${i}">${i}</option>`;
  selectMenu[0].firstElementChild.insertAdjacentHTML("afterend", option);
}

for (let i = 59; i >= 0; i--) {
  i = i < 10 ? `0${i}` : i;
  let option = `<option value="${i}">${i}</option>`;
  selectMenu[1].firstElementChild.insertAdjacentHTML("afterend", option);
}

for (let i = 2; i > 0; i--) {
  let ampm = i == 1 ? "AM" : "PM";
  let option = `<option value="${ampm}">${ampm}</option>`;
  selectMenu[2].firstElementChild.insertAdjacentHTML("afterend", option);
}

// Load saved alarm time and values from localStorage
window.addEventListener("load", () => {
  const savedAlarm = localStorage.getItem("alarmTime");
  const savedHour = localStorage.getItem("alarmHour");
  const savedMinute = localStorage.getItem("alarmMinute");
  const savedAMPM = localStorage.getItem("alarmAMPM");

  if (savedAlarm) {
    alarmTime = savedAlarm;
    isAlarmSet = true;
    content.classList.add("disable");
    setAlarmBtn.innerText = "Clear Alarm";
  }

  if (savedHour) selectMenu[0].value = savedHour;
  if (savedMinute) selectMenu[1].value = savedMinute;
  if (savedAMPM) selectMenu[2].value = savedAMPM;
});

// Update the clock and check alarm every second
setInterval(() => {
  let date = new Date(),
    h = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds(),
    ampm = "AM";

  if (h >= 12) {
    h = h - 12;
    ampm = "PM";
  }
  h = h == 0 ? (h = 12) : h;
  h = h < 10 ? "0" + h : h;
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;
  currentTime.innerText = `${h}:${m}:${s} ${ampm}`;

  // Check if alarm should ring
  if (alarmTime === `${h}:${m} ${ampm}`) {
    triggerAlarm();
  }
}, 1000);

// Function to trigger the alarm
function triggerAlarm() {
  ringtone.play();
  ringtone.loop = true;

}

// Set or clear the alarm
function setAlarm() {
  if (isAlarmSet) {
    alarmTime = "";
    ringtone.pause();
    ringtone.currentTime = 0;
    content.classList.remove("disable");
    setAlarmBtn.innerText = "Set Alarm";


    localStorage.removeItem("alarmTime");
    localStorage.removeItem("alarmHour");
    localStorage.removeItem("alarmMinute");
    localStorage.removeItem("alarmAMPM");
    return (isAlarmSet = false);
  }

  let time = `${selectMenu[0].value}:${selectMenu[1].value} ${selectMenu[2].value}`;
  if (
    time.includes("Hour") ||
    time.includes("Minute") ||
    time.includes("AM/PM")
  ) {
    return alert("Please, select a valid time to set Alarm!");
  }
  alarmTime = time;
  isAlarmSet = true;
  content.classList.add("disable");
  setAlarmBtn.innerText = "Clear Alarm";

  localStorage.setItem("alarmTime", alarmTime);
  localStorage.setItem("alarmHour", selectMenu[0].value);
  localStorage.setItem("alarmMinute", selectMenu[1].value);
  localStorage.setItem("alarmAMPM", selectMenu[2].value);
}

setAlarmBtn.addEventListener("click", setAlarm);
