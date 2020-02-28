const sleep = async (time) =>
	new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve()
			console.log('qweqwe');
		}, time);
	})


async function addFieldToMap(map, params) {

	const divIn = document.createElement('div');
	map.append(divIn);
	divIn.className = "empty";
	// await sleep(20)
	// make map adaptive to map size
	divIn.style.width = map.offsetWidth / params.widthSize - 2 + "px";
	// await sleep(30)
	divIn.style.height = map.offsetHeight / params.heightSize - 2 + "px";
	// await sleep(20)

	divIn.setAttribute("pos_id", `${params.heightCoordinate}_${params.widthCoordinate}${params.isEnemy ? 'enemy' : ''}`);
}


async function createBattleField(heightSize, widthSize) {

	let myBattleFieldArray = [];
	let enemyBattleFieldArray = [];

	const enemyMap = document.getElementById('battleField1');
	const myMap = document.getElementById('battleFieldBadCompany');


	const empty = 0;


	// Code for setting the grid for the fight with the divs
	let myArr = [];
	let enemyArr = [];

	for (let widthCoordinate = 1; widthCoordinate <= widthSize; widthCoordinate++) {
		myArr.push(empty);
		enemyArr.push(empty);
	}

	for (let heightCoordinate = 1; heightCoordinate <= heightSize; heightCoordinate++) {
		for (let widthCoordinate = 1; widthCoordinate <= widthSize; widthCoordinate++) {
			const fieldParams = {
				heightSize,
				widthSize,
				heightCoordinate,
				widthCoordinate,
				isEnemy: false
			}

			//map one
			await addFieldToMap(myMap, fieldParams)
			//map two
			fieldParams.isEnemy = true;
			await addFieldToMap(enemyMap, fieldParams)
		}
		//cheking
		if (myArr.length == widthSize) {
			myBattleFieldArray.push(myArr);
			enemyBattleFieldArray.push(enemyArr);
			widthCoordinate = 1;
		}
	}
	// code finished got battleFieldArray with matrix and divs with coordinates in id

}

createBattleField(10, 10);

function oneDeckPlacement(ev, myMap, oneCount) {

	myMap.addEventListener("click", function (event) {
		if (event.target.className != 'empty' || oneCount > 3) return;

		const div = event.target;

		div.className = "ship"
		oneCount++;
		return
	});

}

function fourDeckPlacement(ev, myMap, fourCount) {

	myMap.addEventListener("click", function (event) {
		if (event.target.className != 'empty' || fourCount == 1) return;

		const div = event.target;

		div.className = "ship"
		fourCount++;
	});

}

function manualPlacement() {

	const myMap = document.getElementById('battleFieldBadCompany');

	let oneCount = 0;
	let twoCount = 0;
	let threeCount = 0;
	let fourCount = 0;

	const butOneDeck = document.getElementById('button1');
	const butTwoDeck = document.getElementById('button2');
	const butThreeDeck = document.getElementById('button3');
	const butFourDeck = document.getElementById('button4');

	butOneDeck.addEventListener("click", (ev) => {
		oneDeckPlacement(ev, myMap, oneCount)
	});
	butTwoDeck.addEventListener("click", () => twoCount++);
	butThreeDeck.addEventListener("click", () => threeCount++);
	butFourDeck.addEventListener("click", (ev) => {
		fourDeckPlacement(ev, myMap, fourCount)
	});

	for (let i = 4; i > 0; i--) {
		const button = document.getElementById(`button${i}`);
		button.style.visibility = "visible"
		console.log(`button${i} показана, ставь ${i}-палубник`);
		// button.style.visibility = "hidden"
	}

}
manualPlacement();

function fireBack() {

	function getRandomClass() {
		if (Math.floor(Math.random() * Math.floor(2)) == 0) {
			return "killed"
		};
		return "miss";
	}

	function getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min; //The maximum does not turn on, the minimum turns on
	}

	let map = document.getElementById('battleFieldBadCompany');
	map.onclick = function (event) {
		if (event.target.className != 'empty') return;

		let div = document.getElementById(event.target.id);
		div.className = "ship"
	}

	let j = getRandomInt(1, 11);
	let k = getRandomInt(1, 11);

	let div = document.getElementById(j + "_" + k);

	if (div.className == "miss") fireBack();
	if (div.className == "empty") { div.className = "miss"; return };
	if (div.className == "wounded") setTimeout(fireBack, 100);
	if (div.className == "ship") div.className = "wounded"


	let map2 = document.getElementById('battleField1');
	map2.onclick = function (event) {
		if (event.target.className != 'empty') return;

		let div = document.getElementById(event.target.id);
		div.className = getRandomClass();

		setTimeout(fireBack, 700);
	}


}