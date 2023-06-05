const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  eventsContainer = document.querySelector(".events"),
  modal = document.querySelector(".modal"),
  addEventCloseBtn = document.querySelector(".close ")

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

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

let eventsArr = [

];



async function getEventsByAPI() {
  await fetch("https://script.google.com/macros/s/AKfycbxtO4TBd_tfl69EY9YTO8ucAak4Ex8uSwqiDLQxw4SrH8unR81h1hovFBH6bSPH_BU/exec")
    .then(res => res.json())
    .then(events => eventsArr = events)
    initCalendar()
}
getEventsByAPI()


function initCalendar() {

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = months[month] + " " + year;

  let days = "";

  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date"><span>${prevDays - x + 1}</span></div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    let event = false;
    let obj = {}
    eventsArr.forEach((eventObj) => {
      if (
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
      ) {
        event = true;
        obj = eventObj
      }
    });
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      activeDay = i;
      updateEvents(i);
      if (event) {
        days += `<div class="day today active event"><span>${i}</span></div>`;
      } else {
        days += `<div class="day today active"><span>${i}</span></div>`;
      }
    } else {
      if (event) {
        days += `<div class="day event">
        <span>${i}</span>
        <span class="event-time">${obj?.events?.time}</span>
        <span class="event-title" style="background-color: ${obj?.styles?.color};">${obj.events.title}</span>
        </div>`;
      } else {
        days += `<div class="day "><span>${i}</span></div>`;
      }
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date"><span>${j}</span></div>`;
  }
  daysContainer.innerHTML = days;
  addListner();
}

function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

// initCalendar();

function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
    
      updateEvents(Number(e.target?.children[0]?.innerHTML));
      activeDay = Number(e.target?.children[0]?.innerHTML);
      days.forEach((day) => {
        day.classList.remove("active");
      });
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("prev-date") &&
              day.innerHTML === e.target?.children[0]?.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("next-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active");
      }
    });
  });
}

function updateEvents(date) {

  let events = "";
  eventsArr.forEach((event) => {
    if (
      date === event.day &&
      month + 1 === event.month &&
      year === event.year
    ) {
     console.log("cliked")
      modal.classList.add('active')
      events += `
      <div class="modal-body">
        <p class="event-title">${event.events.title}</p>
        <p class="event-time">${event.events.time}</p>
        <p class="event-date">${event.month}.${event.day}.${event.year}</p>
        <p class="event-descr">${event.events.descr}</p>
        <a href="${event.events.buttonHref}" class="event-button">button</a>
      </div>`;
    }
    console.log(`${date} + ${month} + ${year}  == ${event.day} + ${event.month} + ${event.year}`)

  });

  if (events === "") {
    events = `<div class="no-event">
            <h3>No Events</h3>
        </div>`;
  }
  eventsContainer.innerHTML = events;
}


function defineProperty() {
  var osccred = document.createElement("div");
  osccred.style.position = "absolute";
  osccred.style.bottom = "0";
  osccred.style.right = "0";
  osccred.style.fontSize = "10px";
  osccred.style.color = "#ccc";
  osccred.style.fontFamily = "sans-serif";
  osccred.style.padding = "5px";
  osccred.style.background = "#fff";
  osccred.style.borderTopLeftRadius = "5px";
  osccred.style.borderBottomRightRadius = "5px";
  osccred.style.boxShadow = "0 0 5px #ccc";
  document.body.appendChild(osccred);
}

defineProperty();

function convertTime(time) {
  let timeArr = time.split(":");
  let timeHour = timeArr[0];
  let timeMin = timeArr[1];
  let timeFormat = timeHour >= 12 ? "PM" : "AM";
  timeHour = timeHour % 12 || 12;
  time = timeHour + ":" + timeMin + " " + timeFormat;
  return time;
}

const modalClose = document.querySelector('.close')

modalClose.addEventListener('click', ()=>{
  modal.classList.remove('active')
  
})