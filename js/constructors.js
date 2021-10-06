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
let pointsWinner = document.querySelector(".points-winner");
let pointsSecond = document.querySelector(".points-second");
let pointsThird = document.querySelector(".points-third");

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
  request.open(
    "GET",
    `https://ergast.com/api/f1/${year}/constructorStandings.json`
  );
  request.send();

  request.addEventListener("load", function () {
    let data = JSON.parse(this.responseText);
    let constructorsData = data.MRData.StandingsTable.StandingsLists[0];
    console.log(constructorsData);
    if (constructorsData) {
      // Getting season data
      seasonName.textContent = `F1 season of ${constructorsData.season}`;
      races.textContent = `${constructorsData.round} races`;
      constructors.textContent = `Constructors champion: ${constructorsData.ConstructorStandings[0].Constructor.name} (${constructorsData.ConstructorStandings[0].points} points)`;
      // Getting first three places
      seasonWinner.textContent = `${constructorsData.ConstructorStandings[0].Constructor.name}`;
      secondPlace.textContent = `${constructorsData.ConstructorStandings[1].Constructor.name}`;
      thirdPlace.textContent = `${constructorsData.ConstructorStandings[2].Constructor.name}`;
      pointsWinner.textContent = `(${constructorsData.ConstructorStandings[0].points} points)`;
      pointsSecond.textContent = `(${constructorsData.ConstructorStandings[1].points} points)`;
      pointsThird.textContent = `(${constructorsData.ConstructorStandings[2].points} points)`;
      // Getting table
      clearTable();
      for (let i = 0; i < constructorsData.ConstructorStandings.length; i++) {
        let html = `
        <tbody>
          <tr>
            <td>#${constructorsData.ConstructorStandings[i].position}</td>
            <td>${constructorsData.ConstructorStandings[i].Constructor.name}</td>
            <td>${constructorsData.ConstructorStandings[i].wins}</td>
            <td>${constructorsData.ConstructorStandings[i].points}</td>
            <td>${constructorsData.ConstructorStandings[i].Constructor.nationality}</td>
          </tr>
          
        </tbody>`;
        table.insertAdjacentHTML("beforeend", html);
      }
      // Getting drivers title
      let request2 = new XMLHttpRequest();
      request2.open(
        "GET",
        `https://ergast.com/api/f1/${year}/driverStandings.json`
      );
      request2.send();

      request2.addEventListener("load", function () {
        let data2 = JSON.parse(this.responseText);
        let driversData = data2.MRData.StandingsTable.StandingsLists[0];
        console.log(driversData);
        drivers.textContent = `Drivers champion: ${driversData.DriverStandings[0].Driver.givenName} ${driversData.DriverStandings[0].Driver.familyName} (${driversData.DriverStandings[0].Constructors[0].name})`;
      });
      raceContainer.classList.add("opacity");
    } else {
      errorMsg.classList.toggle("opacity");
    }
  });
};

submit.addEventListener("click", getData);
