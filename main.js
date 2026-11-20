async function loadTableJSON() {
	const request = await fetch("./table.json")

	const result = await request.json()

	return result.table
}

var squares = []

var currentSquare = null

function renderTable(table) {
	let tableElement = document.getElementById("table")

	let index = 0;

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
			square.index = index

			squares.push({...element, element: square, hidden: true})
			square.onclick = (event) => {
				const currentElement = event.target.closest(".square")
				const currentIndex = currentElement.index
				const currentGuess = squares[currentIndex]

				if (currentGuess.hidden == false) return

				console.log(currentGuess)

				if (currentIndex == currentSquare) {
					currentSquare = null

					currentGuess.hidden = false
					currentGuess.element.style.backgroundColor = currentGuess.color;
					currentGuess.element.classList.remove("hidden")
					currentGuess.element.classList.add("shown")
				}
			}

			index++


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

function generateRantomElement() {
	const index = Math.floor(Math.random() * squares.length); 
}

async function start() {
	const table = await loadTableJSON()

	renderTable(table)

	while (squares) {

	}
}

start()
