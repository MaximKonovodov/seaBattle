class BattleField {
	constructor(fieldSize) {
		this.oneDeckShipCount = 0;
		this.twoDeckShipCount = 0;
		this.threeDeckShipCount = 0;
		this.fourDeckShipCount = 0;

		this.battleFieldArray;

		this.fieldSize = fieldSize;

		this.direction = 'toRight';

		this.init()
	}

	init() {
		this.createMaps() //my and enemy's
		this.situateShips() // manual or random

		this.activatePlayButton()
	}

	createMaps() {
		const empty = 0;
		const map = document.getElementById('battleFieldBadCompany');
		const mapEnemy = document.getElementById('battleFieldBadCompanyEnemy');

		let arr = [];

		for (let widthCoordinate = 1; widthCoordinate <= this.fieldSize; widthCoordinate++) {
			arr.push(empty);
		}

		for (let heightCoordinate = 1; heightCoordinate <= this.fieldSize; heightCoordinate++) {
			for (let widthCoordinate = 1; widthCoordinate <= this.fieldSize; widthCoordinate++) {

				const fieldParams = {
					fieldSize: this.fieldSize,
					heightCoordinate,
					widthCoordinate,
					isEnemy: false
				}
				//map one
				this.addFieldToMap(map, fieldParams)
				//map two
				fieldParams.isEnemy = true;
				this.addFieldToMap(mapEnemy, fieldParams)

			}
		}
	}

	addFieldToMap(map, params) {
		const div = document.createElement('div');

		map.append(div);
		div.className = "empty";


		// make map adaptive to map size
		div.style.width = map.offsetWidth / params.fieldSize - 2 + "px";
		div.style.height = map.offsetHeight / params.fieldSize - 2 + "px";

		div.setAttribute("pos_id", `${params.heightCoordinate}_${params.widthCoordinate}_${params.isEnemy ? 'enemy' : ''}`);
	}

	situateShips() {
		// this.rundomSituate() //if rundomButton pushed 
		this.manualSituate() //if manualButton pushed
	}

	checkingTheCells(length, direction, firstCoord, secondCoord) {

		if (direction == "toDown") {
			//check null, where will be ship
			for (let y = 0; y < length; y++) {
				const divs = document.querySelector(`div.battleField div[pos_id='${firstCoord + y}_${secondCoord}_']`);
				if (divs == null) return false;
			}

			//check ships, wherever it is
			for (let x = -1; x < 2; x++) {
				for (let y = -1; y < length + 1; y++) {
					const divs = document.querySelector(`div.battleField div[pos_id='${firstCoord + y}_${secondCoord + x}_']`);
					if (divs !== null) {
						if (divs.className !== "empty") return false;
					}
				}
			};

		}

		if (direction == "toRight") {

			//check null, where will be ship
			for (let x = 0; x < length; x++) {
				const divs = document.querySelector(`div.battleField div[pos_id='${firstCoord}_${secondCoord + x}_']`);
				if (divs == null) return false;
			}

			//check ships, wherever it are
			for (let y = -1; y < 2; y++) {
				for (let x = -1; x < length + 1; x++) {
					const divs = document.querySelector(`div.battleField div[pos_id='${firstCoord + y}_${secondCoord + x}_']`);
					if (divs !== null) {
						if (divs.className !== "empty") return false;
					}
				}

			};
		}
	}

	addDecks(length, direction, firstCoord, secondCoord, isDraw) {

		if (isDraw == false) return (console.log("УПС! не нарисовалось"));

		//drawing horizontally
		if (direction == "toRight") {
			for (let i = 0; i < length; i++) {
				const divs = document.querySelector(`div.battleField div[pos_id='${firstCoord}_${secondCoord + i}_']`);

				divs.className = "ship"
			}
		}
		if (direction == "toDown") {
			//drawing vertically
			for (let i = 0; i < length; i++) {
				const divs = document.querySelector(`div.battleField div[pos_id='${firstCoord + i}_${secondCoord}_']`);

				divs.className = "ship"
			}
		}
	}

	drawHoverDecks(firstCoord, secondCoord, mouse, numberOfDecks) {

		let cells = []

		for (let i = 1; i < numberOfDecks + 1; i++) {
			cells.push(`div${i}`);
		}
		if (mouse == "over") {
			if (this.direction == "toRight") {
				for (let i = 0; i < numberOfDecks; i++) {
					cells[i] = document.querySelector(`div.battleField div[pos_id='${firstCoord}_${secondCoord + i}_']`);

					if (cells[i] == null) return false;
				}
				for (let i = 0; i < numberOfDecks; i++) {
					cells[i].style.background = "black";
					cells[i].style.opacity = ".7";
				}
			}

			if (this.direction == "toDown") {
				for (let i = 0; i < numberOfDecks; i++) {
					cells[i] = document.querySelector(`div.battleField div[pos_id='${firstCoord + i}_${secondCoord}_']`);

					if (cells[i] == null) return false;
				}
				for (let i = 0; i < numberOfDecks; i++) {
					cells[i].style.background = "black";
					cells[i].style.opacity = ".7";
				}
			}
		}

		if (mouse == "out") {
			if (this.direction == "toRight") {
				for (let i = 0; i < numberOfDecks; i++) {
					cells[i] = document.querySelector(`div.battleField div[pos_id='${firstCoord}_${secondCoord + i}_']`);

					if (cells[i] == null) return false;
				}
				for (let i = 0; i < numberOfDecks; i++) {
					cells[i].style.background = "";
					cells[i].style.opacity = "";
				}
			}

			if (this.direction == "toDown") {
				for (let i = 0; i < numberOfDecks; i++) {
					cells[i] = document.querySelector(`div.battleField div[pos_id='${firstCoord + i}_${secondCoord}_']`);

					if (cells[i] == null) return false;
				}
				for (let i = 0; i < numberOfDecks; i++) {
					cells[i].style.background = "";
					cells[i].style.opacity = "";
				}
			}
		}
	}


	oneDeckPlacement(ev, myMap) {
		myMap.addEventListener("click", (event) => {
			if (this.oneDeckShipCount == 4) return;
			if (event.target.className != 'empty' || this.oneDeckShipCount == 4) return;

			const div = event.target;
			const pos_ids = div.attributes.pos_id.value.split('_', 2);
			const firstCoord = +pos_ids[0];
			const secondCoord = +pos_ids[1];

			if (this.checkingTheCells(1, this.direction, firstCoord, secondCoord) == false) {
				return (console.log("не прошло в checkingTheCells"))
			} else {
				this.addDecks(1, this.direction, firstCoord, secondCoord);

			}

			this.oneDeckShipCount++;
		});

		myMap.addEventListener("mouseover", (event) => {
			if (this.oneDeckShipCount == 4) return;
			const div = event.target;

			div.style.background = "black";
			div.style.opacity = ".7";
		});

		myMap.addEventListener("mouseout", (event) => {
			const div = event.target;

			div.style.opacity = "";
			div.style.background = "";
		});
	}

	twoDeckPlacement(ev, myMap) {
		myMap.addEventListener("click", (event) => {
			if (event.target.className != 'empty' || this.twoDeckShipCount == 3) return;

			const div = event.target;
			const pos_ids = div.attributes.pos_id.value.split('_', 2);
			const firstCoord = +pos_ids[0];
			const secondCoord = +pos_ids[1];

			if (this.checkingTheCells(2, this.direction, firstCoord, secondCoord) == false) {
				return (console.log("не прошло в checkingTheCells"))
			} else {
				this.addDecks(2, this.direction, firstCoord, secondCoord);
			}

			this.twoDeckShipCount++;
		});

		myMap.addEventListener("mouseover", (event) => {
			if (this.twoDeckShipCount == 3) return;
			const numberOfDecks = 2;
			const mouse = "over"
			const div = event.target;
			const pos_ids = div.attributes.pos_id.value.split('_', 2);
			const firstCoord = +pos_ids[0];
			const secondCoord = +pos_ids[1];

			if (this.drawHoverDecks(firstCoord, secondCoord, mouse, numberOfDecks) == false) {
				return;
			} else {
				this.drawHoverDecks(firstCoord, secondCoord, mouse, numberOfDecks);
			}
		});

		myMap.addEventListener("mouseout", (event) => {
			const numberOfDecks = 2;
			const mouse = "out"
			const div = event.target;
			const pos_ids = div.attributes.pos_id.value.split('_', 2);
			const firstCoord = +pos_ids[0];
			const secondCoord = +pos_ids[1];

			if (this.drawHoverDecks(firstCoord, secondCoord, mouse, numberOfDecks) == false) {
				return;
			} else {
				this.drawHoverDecks(firstCoord, secondCoord, mouse, numberOfDecks);
			}
		});
	}

	threeDeckPlacement(ev, myMap) {
		myMap.addEventListener("click", (event) => {
			if (event.target.className != 'empty' || this.threeDeckShipCount == 2) return;

			const div = event.target;
			const pos_ids = div.attributes.pos_id.value.split('_', 2);
			const firstCoord = +pos_ids[0];
			const secondCoord = +pos_ids[1];

			if (this.checkingTheCells(3, this.direction, firstCoord, secondCoord) == false) {
				return (console.log("не прошло в checkingTheCells"))
			} else {
				this.addDecks(3, this.direction, firstCoord, secondCoord);
			}

			this.threeDeckShipCount++;
		});

		myMap.addEventListener("mouseover", (event) => {
			if (this.threeDeckShipCount == 2) return;
			const numberOfDecks = 3;
			const mouse = "over"
			const div = event.target;
			const pos_ids = div.attributes.pos_id.value.split('_', 2);
			const firstCoord = +pos_ids[0];
			const secondCoord = +pos_ids[1];

			if (this.drawHoverDecks(firstCoord, secondCoord, mouse, numberOfDecks) == false) {
				return;
			} else {
				this.drawHoverDecks(firstCoord, secondCoord, mouse, numberOfDecks);
			}
		});

		myMap.addEventListener("mouseout", (event) => {
			const numberOfDecks = 3;
			const mouse = "out"
			const div = event.target;
			const pos_ids = div.attributes.pos_id.value.split('_', 2);
			const firstCoord = +pos_ids[0];
			const secondCoord = +pos_ids[1];

			if (this.drawHoverDecks(firstCoord, secondCoord, mouse, numberOfDecks) == false) {
				return;
			} else {
				this.drawHoverDecks(firstCoord, secondCoord, mouse, numberOfDecks);
			}
		});
	}

	fourDeckPlacement(ev, myMap) {

		myMap.addEventListener("click", (event) => {

			if (event.target.className != 'empty' || this.fourDeckShipCount == 1) return;

			const div = event.target;
			const pos_ids = div.attributes.pos_id.value.split('_', 2);
			const firstCoord = +pos_ids[0];
			const secondCoord = +pos_ids[1];

			if (this.checkingTheCells(4, this.direction, firstCoord, secondCoord) == false) {
				return;
			} else {
				this.addDecks(4, this.direction, firstCoord, secondCoord);

			}

			this.fourDeckShipCount++;
		});

		myMap.addEventListener("mouseover", (event) => {
			if (this.fourDeckShipCount == 1) return;
			const numberOfDecks = 4;
			const mouse = "over"
			const div = event.target;
			const pos_ids = div.attributes.pos_id.value.split('_', 2);
			const firstCoord = +pos_ids[0];
			const secondCoord = +pos_ids[1];

			if (this.drawHoverDecks(firstCoord, secondCoord, mouse, numberOfDecks) == false) {
				return;
			} else {
				this.drawHoverDecks(firstCoord, secondCoord, mouse, numberOfDecks);
			}
		});

		myMap.addEventListener("mouseout", (event) => {
			const numberOfDecks = 4;
			const mouse = "out"
			const div = event.target;
			const pos_ids = div.attributes.pos_id.value.split('_', 2);
			const firstCoord = +pos_ids[0];
			const secondCoord = +pos_ids[1];

			if (this.drawHoverDecks(firstCoord, secondCoord, mouse, numberOfDecks) == false) {
				return;
			} else {
				this.drawHoverDecks(firstCoord, secondCoord, mouse, numberOfDecks);
			}
		});
	}

	manualSituate() {
		const myMap = document.getElementById('battleFieldBadCompany');

		const directionButton = document.getElementById('direction');

		const butOneDeck = document.getElementById('button1');
		const butTwoDeck = document.getElementById('button2');
		const butThreeDeck = document.getElementById('button3');
		const butFourDeck = document.getElementById('button4');

		directionButton.addEventListener("click", (ev) => {
			if (this.direction == "toRight") {
				this.direction = "toDown";
				return;
			}
			if (this.direction == "toDown") {
				this.direction = "toRight";
				return;
			}
		});

		butOneDeck.addEventListener("click", (ev) => {
			if (this.oneDeckShipCount == 4) return console.log("все однопалубники расставленны");
			this.oneDeckPlacement(ev, myMap)
		});
		butTwoDeck.addEventListener("click", (ev) => {
			if (this.twoDeckShipCount == 3) return console.log("все двупалубники расставленны");
			this.twoDeckPlacement(ev, myMap);
		});
		butThreeDeck.addEventListener("click", (ev) => {
			if (this.threeDeckShipCount == 2) return console.log("все трехпалубники расставленны");
			this.threeDeckPlacement(ev, myMap)
		});
		butFourDeck.addEventListener("click", (ev) => {
			if (this.fourDeckShipCount == 1) return console.log("все четырехпалубники расставленны");
			this.fourDeckPlacement(ev, myMap)
		});
	}

	fire() {
		function getRandomInt(min, max) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min)) + min; //The maximum does not turn on, the minimum turns on
		}

		function shoot() {

			const firstCoord = getRandomInt(1, 11);
			const secondCoord = getRandomInt(1, 11);

			const divShooted = document.querySelector(`div.battleField div[pos_id='${firstCoord}_${secondCoord}_']`);

			if (divShooted.className == "miss") return shoot();
			if (divShooted.className == "empty") { divShooted.className = "miss"; return };
			if (divShooted.className == "wounded") setTimeout(shoot, 500);
			if (divShooted.className == "ship") {
				divShooted.className = "wounded";
				return setTimeout(shoot, 500);
			}
		}

		const map2 = document.getElementById('battleFieldBadCompanyEnemy');

		map2.addEventListener("click", (ev) => {
			if (event.target.className != 'empty') return;

			setTimeout(shoot, 500);

			let div = event.target;
			const pos_ids = div.attributes.pos_id.value.split('_', 2);
			const firstCoord = +pos_ids[0];
			const secondCoord = +pos_ids[1];

			if (this.enemybattleFieldArray[firstCoord - 1][secondCoord - 1] == 1) {
				div.className = "wounded";
			} else {
				div.className = "miss";
			}
		});

	}

	randomArrForBattleField() {
		function getRandomInt(min, max) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min)) + min; //The maximum does not turn on, the minimum turns on
		}
		function getRandomCoordHorizontal(decks) {
			return [getRandomInt(0, 10), getRandomInt(0, 10 - decks)];
		}
		function getRandomCoordVertical(decks) {
			return [getRandomInt(0, 10 - decks), getRandomInt(0, 10)];
		}
		function checkingTheCells(decks, direction, firstCoord, secondCoord, battleFieldArray) {

			if (direction == 1) {
				//check ships, wherever it is, verticaly
				for (let x = -1; x < 2; x++) {
					for (let y = -1; y < decks + 1; y++) {
						if (battleFieldArray[firstCoord + y] == undefined) continue;
						if (battleFieldArray[firstCoord + y][secondCoord + x] == undefined) continue;
						if (battleFieldArray[firstCoord + y][secondCoord + x] == 1) return false;
					}
				};
			}

			if (direction == 0) {
				//check ships, wherever it is, horizontaly
				for (let y = -1; y < 2; y++) {
					for (let x = -1; x < decks + 1; x++) {
						if (battleFieldArray[firstCoord + y] == undefined) continue;
						if (battleFieldArray[firstCoord + y][secondCoord + x] == undefined) continue;
						if (battleFieldArray[firstCoord + y][secondCoord + x] == 1) return false;
					}
				};
			}
		}

		function changeBattleFieldArray(decks, position, battleFieldArray) {
			let [firstCoord0, secondCoord0] = getRandomCoordHorizontal(decks)
			let [firstCoord1, secondCoord1] = getRandomCoordVertical(decks)
			let direction = getRandomInt(0, 2)

			if (checkingTheCells(decks, direction, firstCoord0, secondCoord0, battleFieldArray) == false) {//check horizontal random coords
				return changeBattleFieldArray(decks, position, battleFieldArray);
			}
			if (checkingTheCells(decks, direction, firstCoord1, secondCoord1, battleFieldArray) == false) {//check vertical random coords
				return changeBattleFieldArray(decks, position, battleFieldArray);
			}
			if (direction == 0) {
				for (let i = 0; i < decks; i++) {
					battleFieldArray[firstCoord0][secondCoord0 + position] = 1;
					position++;
				}
			}
			if (direction == 1) {
				for (let i = 0; i < decks; i++) {
					battleFieldArray[firstCoord1 + position][secondCoord1] = 1;
					position++;
				}
			}
			return battleFieldArray;
		}
		function oneOfShips(decks, battleFieldArray) {
			let position = 0;
			for (let i = 1; i <= decks; i++) {
				if (decks == 1) {
					return changeBattleFieldArray(decks, position, battleFieldArray);
				}
				if (decks == 2) {
					return changeBattleFieldArray(decks, position, battleFieldArray);
				}
				if (decks == 3) {
					return changeBattleFieldArray(decks, position, battleFieldArray);
				}
				if (decks == 4) {
					return changeBattleFieldArray(decks, position, battleFieldArray);
				}
				position++;
			}
		}
		let battleFieldArray = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		];

		for (let i = 1; i <= 10; i++) {
			let decks;
			if (i == 1) decks = 4;
			if (i > 1 & i < 4) decks = 3;
			if (i > 3 & i < 7) decks = 2;
			if (i > 6 & i < 11) decks = 1;
			battleFieldArray = oneOfShips(decks, battleFieldArray)
		}

		return battleFieldArray;
	}

	activatePlayButton() {
		const playButton = document.getElementById('play');
		let turnedOn = 0;
		playButton.addEventListener("click", (event) => {
			if (turnedOn == 1) return console.log("игра уже играется")
			if (this.oneDeckShipCount == 4 & this.twoDeckShipCount == 3 & this.threeDeckShipCount == 2 & this.fourDeckShipCount == 1) {
				this.fire();
				this.enemysShips();
				turnedOn++;
			}
		});
	}

	enemysShips() {
		this.enemybattleFieldArray = this.randomArrForBattleField()
		console.log(this.enemybattleFieldArray);
	}
}

let play = new BattleField(10);


/**
 *
 * add map generation
 * add manual ships placement
 */