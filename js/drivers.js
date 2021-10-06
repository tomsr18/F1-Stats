"use strict";

const submit = document.querySelector("#submit");
const raceContainer = document.querySelector(".race");

let seasonName = document.querySelector(".seasonName");
let races = document.querySelector(".races");
let drivers = document.querySelector(".drivers");
let constructors = document.querySelector(".constructors");

let seasonWinner = document.querySelector(".driver-name-winner");
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

// Drivers standings info
function clearTable() {
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }
}

const getData = function (e) {
  let year = document.querySelector("#year").value;
  e.preventDefault();
  let request = new XMLHttpRequest();
  request.open("GET", `https://ergast.com/api/f1/${year}/driverStandings.json`);
  request.send();

  request.addEventListener("load", function () {
    let data = JSON.parse(this.responseText);
    let driverData = data.MRData.StandingsTable.StandingsLists[0];
    console.log(driverData);
    if (driverData) {
      // Getting season data
      seasonName.textContent = `F1 season of ${driverData.season}`;
      races.textContent = `${driverData.round} races`;
      drivers.textContent = `Drivers champion: ${driverData.DriverStandings[0].Driver.givenName} ${driverData.DriverStandings[0].Driver.familyName} (${driverData.DriverStandings[0].Constructors[0].name})`;
      // Getting first three places
      seasonWinner.textContent = `${driverData.DriverStandings[0].Driver.givenName} ${driverData.DriverStandings[0].Driver.familyName}`;
      secondPlace.textContent = `${driverData.DriverStandings[1].Driver.givenName} ${driverData.DriverStandings[1].Driver.familyName}`;
      thirdPlace.textContent = `${driverData.DriverStandings[2].Driver.givenName} ${driverData.DriverStandings[2].Driver.familyName}`;
      teamWinner.textContent = `(${driverData.DriverStandings[0].Constructors[0].name})`;
      teamSecond.textContent = `(${driverData.DriverStandings[1].Constructors[0].name})`;
      teamThird.textContent = `(${driverData.DriverStandings[2].Constructors[0].name})`;
      // Getting table
      clearTable();
      for (let i = 0; i < driverData.DriverStandings.length; i++) {
        let html = `
        <tbody>
          <tr>
            <td>#${driverData.DriverStandings[i].position}</td>
            <td>${driverData.DriverStandings[i].Driver.givenName} ${driverData.DriverStandings[i].Driver.familyName}</td>
            <td>${driverData.DriverStandings[i].Constructors[0].name}</td>
            <td>${driverData.DriverStandings[i].wins}</td>
            <td>${driverData.DriverStandings[i].points}</td>
            <td>${driverData.DriverStandings[i].Driver.nationality}</td>
            <td>${driverData.DriverStandings[i].Driver.dateOfBirth}</td>
          </tr>
          
        </tbody>`;
        table.insertAdjacentHTML("beforeend", html);
      }
      // Getting constructors title
      let request2 = new XMLHttpRequest();
      request2.open(
        "GET",
        `https://ergast.com/api/f1/${year}/constructorStandings.json`
      );
      request2.send();

      request2.addEventListener("load", function () {
        let data2 = JSON.parse(this.responseText);
        let constructorData = data2.MRData.StandingsTable.StandingsLists[0];
        constructors.textContent = `Constructors champion: ${constructorData.ConstructorStandings[0].Constructor.name} (${constructorData.ConstructorStandings[0].points} points)`;
      });
      raceContainer.classList.add("opacity");
    } else {
      errorMsg.classList.toggle("opacity");
    }
  });
};

submit.addEventListener("click", getData);
