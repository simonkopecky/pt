async function loadTableJSON() {
	const request = await fetch("./table.json")

	const result = await request.json()

	return result.table
}

function renderTable(table) {
	let tableElement = document.getElementById("table")

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
			square.className = "square"

			square.innerHTML = `
				<div class="square-short">
					${element.short}
				</div>
				<div class="square-title">
					${element.name}
				</div>
			`

			tableElement.append(square)

		}
	}
}

async function start() {
	const table = await loadTableJSON()

	renderTable(table)
}

start()
