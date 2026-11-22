const CHEATS = true;

var squares = {}

var rightAnswerId = null

var hiddenSquareIds = []

var wrongAnswerCount = 0

var inWrongAnswerAnim = false

var table = {}

const endPopupGifs = [
	"https://media1.tenor.com/m/i5fhGSgFTmcAAAAd/mr-bean-thumbs-up.gif",
	"https://media1.tenor.com/m/BMHcUvhD7XUAAAAd/point-at-you-point.gif",
	"https://media1.tenor.com/m/gfhtNwY3zd4AAAAd/thumbs-up-good.gif",
	"https://media1.tenor.com/m/IA6ndFzlXecAAAAC/thumbs-up-gorilla.gif"
]

function endPopupButtonClick() {
	renderTable()
	startGame()

	hideEndPopup()
}

function showEndPopup() {
	const popupContainer = document.getElementById("end-popup-container")

	popupContainer.classList.remove("disabled")

	const popupGif = document.getElementById("end-popup-gif")
	const popupErrorCount = document.getElementById("end-popup-error-count")

	popupGif.src = endPopupGifs[Math.floor(Math.random() * endPopupGifs.length)]
	popupErrorCount.innerHTML = `Počet chyb: ${wrongAnswerCount}`
}

function hideEndPopup() {
	const popupContainer = document.getElementById("end-popup-container")

	popupContainer.classList.add("disabled")
}

async function loadTableJSON() {
	const request = await fetch("./table.json")

	const result = await request.json()

	return result.table
}

async function renderTable() {
	let tableElement = document.getElementById("table")
	tableElement.innerHTML = ""
	squares = {}

	rightAnswerId = null

	hiddenSquareIds = []
	roundsSinceWrongAnswer = -1

	for (const row of table) {
		for (const element of row) {
			if (element.name === "empty") {
				empty = element.len

				for (let i = 0; i < element.len; i++) {
					const emptySquare = document.createElement("div")
					emptySquare.className = "square-empty"

					tableElement.append(emptySquare)
				}

				continue
			}

			const square = document.createElement("div")
			square.className = "square hidden"
			square.atomicNumber = element.atomicNumber

			squares[element.atomicNumber] = {...element, element: square, hidden: true, enabled: true}

			if (selectedBlock !== "a" && element.block !== selectedBlock) {
				squares[element.atomicNumber].enabled = false;
				squares[element.atomicNumber].element.classList.add("disabled");
			}
			else {
				hiddenSquareIds.push(element.atomicNumber)
			}

			square.onclick = (event) => {
				const currentElement = event.target.closest(".square")
				const currentId = Number(currentElement.atomicNumber)
				const currentGuess = squares[currentId]

				if (!currentGuess.enabled || inWrongAnswerAnim || currentGuess.hidden === false || currentGuess.inAnim) return

				console.log(currentGuess)

				answer(currentId)
			}

			square.innerHTML = `
				<div class="square-short">
					${element.short}
				</div>
				<div class="square-title">
					${element.name}
				</div>
				<div class="square-number">
					${element.atomicNumber}
				</div>
			`

			tableElement.append(square)

		}
	}
}

function removeItem(array, itemToRemove) {
	const index = array.indexOf(itemToRemove);

	if (index !== -1) {
		array.splice(index, 1);
	}
}

function newElementToGuess() {
	rightAnswerId = hiddenSquareIds[Math.floor(Math.random() * hiddenSquareIds.length)]

	if (rightAnswerId && CHEATS) {
		console.log(rightAnswerId)
	}

	const currentElementShort = document.getElementById("current-element-short")
	const currentElementTitle = document.getElementById("current-element-title")

	console.log(rightAnswerId)

	currentElementShort.innerHTML = squares[rightAnswerId].short
	currentElementTitle.innerHTML = squares[rightAnswerId].name
}

async function answer(id) {
	const answerSquare = squares[id]

	if (id !== rightAnswerId) {
		await wrongAnswer(id)
	}
	else {
		rightAnswer(id)
		removeItem(hiddenSquareIds, id)

		if (hiddenSquareIds.length === 0) {
			showEndPopup()
		}
	}

	newElementToGuess()
}

function rightAnswer(id) {
	showSquare(id)
}

async function wrongAnswer(id) {
	wrongAnswerCount++
	inWrongAnswerAnim = true
	redSquareAnim(squares[id])
	await showHideAnim(rightAnswerId)
	inWrongAnswerAnim = false
}

async function showHideAnim(id) {
	squares[id].inAnim = true;

	showSquare(id)

	await sleep(1500)

	hideSquare(id)
	squares[id].inAnim = false;
}

function showSquare(id) {

	const currentSquare = squares[id]
	const currentElement = currentSquare.element

	currentElement.classList.remove("hidden")
	currentElement.classList.add("shown")
	
	currentElement.style.backgroundColor = currentSquare.color
}

function hideSquare(id) {

	const currentSquare = squares[id]
	const currentElement = currentSquare.element

	currentElement.classList.add("hidden")
	currentElement.classList.remove("shown")
	
	currentElement.style.backgroundColor = "lightgray"
}

function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

async function redSquareAnim(square) {
	if (square.inAnim) return

	const prevBackground = square.element.style.backgroundColor

	square.element.style.backgroundColor = 'lightcoral'
	square.inAnim = true

	await sleep(1500)

	square.element.style.backgroundColor = prevBackground

	square.inAnim = false
}

function startGame() {
	wrongAnswerCount = 0
	newElementToGuess()
}

function generateRantomElement() {
	const index = Math.floor(Math.random() * squares.length); 
}

var selectedBlockElement = null
var selectedBlock = null

async function blockButtonClick(element, block) {
	chooseBlock(element, block)
	await renderTable()
	startGame()
}

function chooseBlock(element, block) {
	if (selectedBlock === block) return

	element.classList.add("selected")

	console.log(element)

	if (selectedBlockElement) {
		selectedBlockElement.classList.remove("selected")
	}

	selectedBlockElement = element
	selectedBlock = block;
}

async function start() {
	chooseBlock(document.getElementById("default-block"), "a")

	table = await loadTableJSON()
	renderTable()

	startGame()
}

start()
