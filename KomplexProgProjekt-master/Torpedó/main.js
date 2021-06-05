var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,

	ships: [
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] }
	],

	fire: function(guess) {

		for(var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);

			// talált már-e?
			if ( ship.hits[index] === "hit" ) {
				view.displayMessage("Ezt a helyet már eltaláltad!");
				return true;
			} else if ( index >= 0 ) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");

				if ( this.isSunk(ship) ) {
					view.displayMessage("Elsüllyesztettél egy hajót!");
					this.shipsSunk++;
				}
				return true;
			}
			$('#tipp').focus();
		}
		view.displayMiss(guess);
		view.displayMessage("Mellé ment!");
		return false;
	},

	isSunk: function(ship) {
		for (var i = 0; i < this.shipLength; i++) {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
		$('#tipp').focus();
		return true;
	},

	generateShipLocations: function() {
		var locations;
		for (var i = 0; i < this.numShips; i++) {
		do {
				locations = this.generateShip();
		} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
	},

	generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;

		if (direction === 1) { // vízszintes
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
		} else { // függőleges
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];

		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},

	collision: function(locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}
};

var view = {
	displayMessage: function(msg) {
		var státusz = document.getElementById("státusz");
		státusz.innerHTML = msg;
	},
	displayHit: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},
	displayMiss: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}
};

var controller = {
	guesses: 0,

	processGuess: function(guess) {
		var location = parseGuess(guess);

		if (location) {
			this.guesses++;
			var hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
				view.displayMessage("Elsüllyesztetted a hajót " + this.guesses + " tippből!");
			}
		}
	}
};

function parseGuess(guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

	if (guess === null || guess.length !== 2) {
		alert("Kérlek egy betűt és esgy számot adj meg!");
	} else {
		var firstChar = guess.charAt(0);
		var row = alphabet.indexOf(firstChar);
		var column = guess.charAt(1);
		if (isNaN(row) || isNaN(column)) {
			alert("Sajnos ez nincs a táblán!");
		} else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
				alert("Túllőttél a táblán!");
		} else {
			return row + column;
		}
	}
	return null;
}

function handleFireButton() {
	var tipp = document.getElementById("tipp");
	var guess = tipp.value.toUpperCase();
	controller.processGuess(guess);
	tipp.value = "";
}

function handleKeyPress(e) {
	var tuzeles = document.getElementById("tuzeles");
	e = e || window.event;
	if (e.keyCode === 13) {
		tuzeles.click();
		return false;
	}
}

window.onload = init;

function init() {
	var tuzeles = document.getElementById("tuzeles");
	tuzeles.onclick = handleFireButton;
	// enter működjön
	var tipp = document.getElementById("tipp");
	tipp.onkeypress = handleKeyPress;
	// hajó elhelyezése
	model.generateShipLocations();
}