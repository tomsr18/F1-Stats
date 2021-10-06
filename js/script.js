"use strict";

const submit = document.querySelector("#submit");
const raceContainer = document.querySelector(".race");

let grandPrixName = document.querySelector(".raceName");
let circuit = document.querySelector(".circuit");
let circuitMap = document.querySelector(".circuit-map");
let date = document.querySelector(".date");

let raceWinner = document.querySelector(".driver-name-winner");
let secondPlace = document.querySelector(".driver-name-second");
let thirdPlace = document.querySelector(".driver-name-third");
let teamWinner = document.querySelector(".team-winner");
let teamSecond = document.querySelector(".team-second");
let teamThird = document.querySelector(".team-third");

const table = document.querySelector(".zui-table");
let tableContent = document.querySelectorAll("tbody");

const errorMsg = document.querySelector(".container-floating");
const closeError = document.querySelector(".close");

// Burger menu
const screen = document.querySelector(".screen");
const navbar = document.querySelector(".navbar");
const burgerBtn = document.querySelector("#menu");
const closeBtn = document.querySelector("#close-menu");

function clearTable() {
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }
}

const getData = function (e) {
  let year = document.querySelector("#year").value;
  let race = document.querySelector("#race").value;
  e.preventDefault();
  let request = new XMLHttpRequest();
  request.open("GET", `https://ergast.com/api/f1/${year}/${race}/results.json`);
  request.send();

  request.addEventListener("load", function () {
    let data = JSON.parse(this.responseText);
    let raceData = data.MRData.RaceTable.Races[0];

    console.log(raceData);
    if (raceData) {
      // Getting race info

      // Getting a flag
      let request2 = new XMLHttpRequest();
      request2.open(
        "GET",
        `https://restcountries.com/v3.1/name/${
          raceData.Circuit.Location.country === "UK"
            ? "Britain"
            : raceData.Circuit.Location.country
        }`
      );
      request2.send();

      request2.addEventListener("load", function () {
        let [data] = JSON.parse(this.responseText);
        console.log(data);
        grandPrixName.textContent = `${raceData.raceName} ${data.flag}`;
      });
      let lat = raceData.Circuit.Location.lat;
      let long = raceData.Circuit.Location.long;

      circuit.textContent = raceData.Circuit.circuitName;
      date.textContent = `Date: ${new Date(raceData.date).toDateString()}`;
      circuitMap.src = `https://maps.google.com/maps?q=${lat}, ${long}&z=14&output=embed`;

      // Getting podium info

      raceWinner.textContent = `${raceData.Results[0].Driver.givenName} ${raceData.Results[0].Driver.familyName}`;
      secondPlace.textContent = `${raceData.Results[1].Driver.givenName} ${raceData.Results[1].Driver.familyName}`;
      thirdPlace.textContent = `${raceData.Results[2].Driver.givenName} ${raceData.Results[2].Driver.familyName}`;
      teamWinner.textContent = `(${raceData.Results[0].Constructor.name})`;
      teamSecond.textContent = `(${raceData.Results[1].Constructor.name})`;
      teamThird.textContent = `(${raceData.Results[2].Constructor.name})`;

      // Getting table
      clearTable();
      for (let i = 0; i < raceData.Results.length; i++) {
        let html = `
        <tbody>
          <tr>
            <td>#${raceData.Results[i].position}</td>
            <td>${raceData.Results[i].Driver.givenName} ${
          raceData.Results[i].Driver.familyName
        }</td>
            <td>${raceData.Results[i].Constructor.name}</td>
            <td>${raceData.Results[i].grid}</td>
            <td>${raceData.Results[i].points}</td>
            <td>${raceData.Results[i].laps}</td>
            <td>${
              raceData.Results[i].status === "Finished" ||
              raceData.Results[i].status.includes("Lap")
                ? "Finished"
                : "DNF"
            }</td>
            <td>${
              raceData.Results[i].Time != undefined
                ? raceData.Results[i].Time.time
                : raceData.Results[i].status
            }</td>
          </tr>
          
        </tbody>`;
        table.insertAdjacentHTML("beforeend", html);
      }
      raceContainer.classList.add("opacity");
    } else {
      console.error("Race does not exist");
      errorMsg.classList.toggle("opacity");
    }
  });
};

submit.addEventListener("click", getData);
closeError.addEventListener("click", function () {
  errorMsg.classList.toggle("opacity");
});

// Burger menu function
const openBurgerMenu = function () {
  screen.style.display = "block";
  navbar.style.display = "block";
  navbar.classList.toggle("opacity");
};

const closeBurgerMenu = function () {
  navbar.classList.toggle("opacity");
  screen.style.display = "none";
  navbar.style.display = "none";
};

burgerBtn.addEventListener("click", openBurgerMenu);
closeBtn.addEventListener("click", closeBurgerMenu);
screen.addEventListener("click", closeBurgerMenu);
