

let gridStyleSize = 5

const gridStyleRow = "repeat(" + gridStyleSize + ", 1fr)"
const gridStyleColumn = "repeat(" + gridStyleSize + ", 1fr)"


document.querySelector('#bg-game').style.gridTemplateRows = gridStyleRow
document.querySelector('#bg-game').style.gridTemplateColumns = gridStyleColumn


//Storage
const Storage = {
	get(item){
		return JSON.parse(localStorage.getItem(item))
	},
	set(item, value){
		localStorage.setItem(item, JSON.stringify(value))
	}
}


//Config Storage
try {
	Storage.get('tableSize' + gridStyleSize)[0]
} catch(err){
	Storage.set('tableSize' + gridStyleSize,[])
	Storage.set('score' + gridStyleSize,[0])
}

try {
	Storage.get('score' + gridStyleSize)[0]
} catch (err){
	Storage.set('tableSize' + gridStyleSize,[])
	Storage.set('score' + gridStyleSize,[0])
}

try {
	Storage.get('record' + gridStyleSize)[0]
} catch(err){
	Storage.set('record' + gridStyleSize,[0])
}


// Utils
const utils = {
	tileLocate() {
		return document.querySelectorAll('#table-game div')
	},

	tilePosition() {
		return Storage.get('tableSize' + gridStyleSize)
	},

	tilesId() {
		let arr = []
		for (var i = 0; i < utils.tileLocate().length; i++) {
			arr.push(utils.tileLocate()[i].id)
		}
		return arr
	},

	getStyle(id_1, id_2, text) {
		let tileRect = utils.getExactPosition(id_1,id_2)
		let textLength = Number(String(text).length)

		let top = tileRect["top"]
		let right = tileRect["right"]
		let bottom = tileRect["bottom"]
		let left = tileRect["left"]
		let width = tileRect["width"]
		let height = tileRect["height"]
		let fontSize = textLength <= 2 ? 168/gridStyleSize : ((width / textLength ) +5)

		let $transition = "transition: .1s linear;"
		let $width = "width:" + width + "px;"
		let $height = "height:" + height + "px;"
		let $fontSize = "font-size:" + fontSize + "px;"
		let $inset = "inset:" + top + "px " + right + "px " + bottom + "px " + left + "px;"

		return $transition + $width + $height + $fontSize + $inset
	},

	getExactPosition(x,y) {
		//Vai separar o local que vai cortar para fazer as linhas
		let arr = [0]
		for (var i = 1; i < gridStyleSize; i++) {
		    arr.push(gridStyleSize*i)
		}

		//Vai setar as posições existentes
		let positions = []
		for (var i = 0; i < gridStyleSize*gridStyleSize; i++) {
			positions.push(i)
		}

		//Vai definir onde começa uma nova linha criando assim um novo item
		let rows = []
		for (var i = 0; i < arr.length; i++) {
			let row = positions.slice(arr[i],arr[i+1])
			rows.push( row )
		}

		return document.querySelectorAll('#bg-game div')[ rows[x-1][y-1] ].getClientRects()[0]
	},


	newRandomNumber(min,max){
		return parseInt(Math.random() * (max + 1 - min) + 1)
	},

	newTileGenerate() {
		if (Storage.get('tableSize' + gridStyleSize).length < gridStyleSize*gridStyleSize) {
			let array = Storage.get('tableSize' + gridStyleSize)
			let row,column

			do {
				row = utils.newRandomNumber( 1 , gridStyleSize )
				column = utils.newRandomNumber( 1 , gridStyleSize )
			} while (utils.tilesId().indexOf(String(row) + String(column)) != -1)

			let value = utils.newRandomNumber(1,20) == 1 ? 4 : 2

			array.push({x: row, y: column, value: value})

			Storage.set('tableSize' + gridStyleSize,array) 

			let newClass = value
			let newId = String(row) + String(column)

			let newTile = table.addElement(newClass,newId,value)
			document.querySelector('.game-content #table-game').appendChild(newTile)
		}
	},

	newRandomNumber(min,max) {
		return parseInt(Math.random() * (max + 1 - min) + 1)
	},

	newRandomTile() {
		return utils.newRandomNumber(1,4)
	},

	score(sum) {
		let score = Number(Storage.get('score' + gridStyleSize))
		score += Number(sum)
		Storage.set('score' + gridStyleSize,[score])
		document.querySelectorAll('.left-header .show-score p')[1].innerHTML = Storage.get('score' + gridStyleSize)
	},

	highScore(score) {
		if (score > Storage.get('record' + gridStyleSize)[0]) {
			Storage.set('record' + gridStyleSize,score)
		}
		document.querySelectorAll('.right-header .show-score p')[1].innerText = Storage.get('record' + gridStyleSize)
		//Colocar na tela "Pontuação recorde!"
	}
}


window.addEventListener('resize', () => {
	for (var i = 0; i < utils.tileLocate().length; i++) {
		let tile = utils.tileLocate()[i]
		let style = utils.getStyle(tile.id[0],tile.id[1],tile.innerText)
		console.log(style)
		let arr = style.split(';')
		tile.style = arr[1] + "; " + arr[2] + ";" + arr[3] + ";" + arr[4] + ";"
	}	
})


//Game-input
let awaitDelay = false
let checkPositionChange

window.addEventListener('keydown', e =>  {
	if (awaitDelay == false) {
		switch(e.key){
			case 'ArrowUp':
				checkPositionChange = utils.tilesId()
				tiles.findTilesByAxis('top')
				break;
			case 'ArrowDown':
				checkPositionChange = utils.tilesId()
				tiles.findTilesByAxis('bottom')
				break;
			case 'ArrowLeft':
				checkPositionChange = utils.tilesId()
				tiles.findTilesByAxis('left')
				break;
			case 'ArrowRight':
				checkPositionChange = utils.tilesId()
				tiles.findTilesByAxis('right')
				break;
			default: break;
		}

		awaitDelay = true
		setTimeout( () => {awaitDelay = false},90)
	}
})



const tiles = {
	findTilesByAxis(moveTo){
		for (var axlePosition = 0; axlePosition < gridStyleSize; axlePosition++) {
			for (var i = 0; i < utils.tileLocate().length; i++){
				if (moveTo == 'top') {
					if (utils.tileLocate()[i].id[0] == axlePosition + 1){
						if ( tiles.colisionRequest(utils.tileLocate()[i],moveTo) ) {
							i = 0
						}
					}
				}
				
				if (moveTo == 'bottom') {
					if (utils.tileLocate()[i].id[0] == gridStyleSize - axlePosition){
						if ( tiles.colisionRequest(utils.tileLocate()[i],moveTo) ) {
							i = 0
						}
					}
				}

				if (moveTo == 'left') {
					if (utils.tileLocate()[i].id[1] == axlePosition + 1){		
						if ( tiles.colisionRequest(utils.tileLocate()[i],moveTo) ) {
							i = 0
						}
					}
				}

				if (moveTo == 'right') {
					if (utils.tileLocate()[i].id[1] == gridStyleSize - axlePosition){
						if ( tiles.colisionRequest(utils.tileLocate()[i],moveTo) ) {
							i = 0
						}
					}
				}
			}
		}

		table.savePositions()

		if (String(checkPositionChange) != String(utils.tilesId())) {
			utils.newTileGenerate()
		}
		else {
			if (utils.tilesId().length == gridStyleSize*gridStyleSize) {
				console.log('Voce Perdeu!')
			}
		}
		utils.highScore(Storage.get('score' + gridStyleSize))
	},

	colisionRequest(tile,moveTo){
		for (var selected = 0; selected < gridStyleSize; selected++) {
			if (moveTo == 'top') {
				const similarTile = utils.tilesId().indexOf(String(selected + 1) + String(tile.id[1]))
				if (similarTile == -1 || utils.tileLocate()[similarTile] == tile) {
					tile.id = String(selected + 1) + String(tile.id[1])					
					tile.style = utils.getStyle(tile.id[0],tile.id[1], tile.innerText)
					break
				}
				if (utils.tileLocate()[similarTile] != tile && utils.tileLocate()[similarTile].innerText == tile.innerText) {
					const tileFollowed = utils.tilesId().indexOf(String(selected + 2) + String(tile.id[1]))
					if ( tileFollowed == -1 || utils.tileLocate()[tileFollowed] == tile) {
						tile.classList.remove('tile' + tile.innerText)
						tile.innerText *= 2
						tile.classList.add('tile' + tile.innerText)
						tile.id = utils.tileLocate()[similarTile].id
						utils.tileLocate()[similarTile].remove()
						utils.score(tile.innerText)
						
						tile.style = utils.getStyle(tile.id[0],tile.id[1], tile.innerText)
						return true
					}
				}
			}
			
			if (moveTo == 'bottom') {
				const similarTile = utils.tilesId().indexOf(String(gridStyleSize - selected) + String(tile.id[1]))
				if (similarTile == -1 || utils.tileLocate()[similarTile] == tile) {
					tile.id = String(gridStyleSize - selected) + String(tile.id[1])					
					tile.style = utils.getStyle(tile.id[0],tile.id[1], tile.innerText)
					break
				}
				if (utils.tileLocate()[similarTile] != tile && utils.tileLocate()[similarTile].innerText == tile.innerText) {
					const tileFollowed = utils.tilesId().indexOf(String(gridStyleSize - selected - 1) + String(tile.id[1]))
					if ( tileFollowed == -1 || utils.tileLocate()[tileFollowed] == tile) {
						tile.classList.remove('tile' + tile.innerText)
						tile.innerText *= 2
						tile.classList.add('tile' + tile.innerText)
						tile.id = utils.tileLocate()[similarTile].id
						utils.tileLocate()[similarTile].remove()
						utils.score(tile.innerText)
						
						tile.style = utils.getStyle(tile.id[0],tile.id[1], tile.innerText)
						return true
					}
				}
			}

			if (moveTo == 'left') {
				const similarTile = utils.tilesId().indexOf(String(tile.id[0]) + String(selected + 1))
				if (similarTile == -1 || utils.tileLocate()[similarTile] == tile) {
					tile.id = String(tile.id[0]) + String(selected + 1)
					tile.style = utils.getStyle(tile.id[0],tile.id[1], tile.innerText)
					break
				}
				if (utils.tileLocate()[similarTile] != tile && utils.tileLocate()[similarTile].innerText == tile.innerText) {
					const tileFollowed = utils.tilesId().indexOf(String(tile.id[0]) + String(selected + 2))
					if ( tileFollowed == -1 || utils.tileLocate()[tileFollowed] == tile) {
						tile.classList.remove('tile' + tile.innerText)
						tile.innerText *= 2
						tile.classList.add('tile' + tile.innerText)
						tile.id = utils.tileLocate()[similarTile].id
						utils.tileLocate()[similarTile].remove()
						utils.score(tile.innerText)
						
						tile.style = utils.getStyle(tile.id[0],tile.id[1], tile.innerText)
						return true
					}
				}
			}

			if (moveTo == 'right') {
				const similarTile = utils.tilesId().indexOf(String(tile.id[0]) + String(gridStyleSize - selected))
				if (similarTile == -1 || utils.tileLocate()[similarTile] == tile) {
					tile.id = String(tile.id[0]) + String(gridStyleSize - selected)
					tile.style = utils.getStyle(tile.id[0],tile.id[1], tile.innerText)
					break
				}
				if (utils.tileLocate()[similarTile] != tile && utils.tileLocate()[similarTile].innerText == tile.innerText) {
					const tileFollowed = utils.tilesId().indexOf(String(tile.id[0]) + String(gridStyleSize - selected - 1))
					if ( tileFollowed == -1 || utils.tileLocate()[tileFollowed] == tile) {
						tile.classList.remove('tile' + tile.innerText)
						tile.innerText *= 2
						tile.classList.add('tile' + tile.innerText)
						tile.id = utils.tileLocate()[similarTile].id
						utils.tileLocate()[similarTile].remove()
						utils.score(tile.innerText)

						tile.style = utils.getStyle(tile.id[0],tile.id[1], tile.innerText)
						return true
					}
				}
			}	
		}
	}
}



const table = {
	//Função de criar background -- NOVO --	
	bgUpdate() {
		for (var i = 0; i < gridStyleSize*gridStyleSize; i++) {
			document.querySelector('.game-content #bg-game').appendChild(table.addElement())
		}
	},

	//Função de adicionar todos os tiles -- NOVO --
	tilesUpdate() {
		for (var i = 0; i < utils.tilePosition().length; i++) {

			let $class = utils.tilePosition()[i].value
			let $id = String( utils.tilePosition()[i].x ) + String( utils.tilePosition()[i].y )
			let $text = utils.tilePosition()[i].value

			let tile = table.addElement( $class , $id , $text )

			document.querySelector('.game-content #table-game').appendChild(tile)
		}
	},

	addElement(newClass, newId, newText) {
		let element = document.createElement('div')
		element.classList.add('grid-box')
		if (newClass == undefined) {
			return element
		}

		element.classList.add( 'tile' + newClass )
		element.id = newId
		element.innerText = newText
		element.style =  utils.getStyle(element.id[0],element.id[1],newText)

		return element
	},

	savePositions(){
		let array = []
		for (var i = 0; i < utils.tileLocate().length; i++) {
			const row =	Number(utils.tileLocate()[i].id[0])
			const column = Number(utils.tileLocate()[i].id[1])
			const value = Number(utils.tileLocate()[i].innerText)

			array.push({x: row, y: column, value: value})
		}
		Storage.set('tableSize' + gridStyleSize, array)
	}
}

table.bgUpdate()
document.querySelectorAll('.left-header .show-score p')[1].innerHTML = Storage.get('score' + gridStyleSize)
utils.highScore()



/*

------ Parte com bug (mover para esquerda) -------
[{"x":5,"y":1,"value":2048},{"x":5,"y":2,"value":128},{"x":4,"y":1,"value":16},{"x":4,"y":2,"value":4},{"x":5,"y":3,"value":4},{"x":3,"y":1,"value":4},{"x":4,"y":3,"value":2},{"x":5,"y":4,"value":4},{"x":4,"y":4,"value":2},{"x":2,"y":2,"value":2}]

A: Acho que quando outro tile se soma, a quantidade de tiles muda, e o seletor de tiles não começa a contar do zero, fazendo assim ele não se mecher

*/

/*

------ Parte com bug (mover para esquerda) ------

Ele soma duas vezes (apareceu quando eu "resolvi" o bug de cima resetando o 'i' do for)

[{"x":5,"y":1,"value":2048},{"x":5,"y":2,"value":1024},{"x":5,"y":3,"value":64},{"x":5,"y":4,"value":64},{"x":4,"y":4,"value":16},{"x":5,"y":5,"value":32},{"x":4,"y":3,"value":4},{"x":3,"y":3,"value":2},{"x":4,"y":2,"value":2},{"x":4,"y":5,"value":4},{"x":3,"y":5,"value":2},{"x":4,"y":1,"value":2},{"x":3,"y":4,"value":2}]

A: Talves dê para fazer um "notSum" apontando para não somar com o tile q está do lado

*/

//https://css-tricks.com/how-do-you-do-max-font-size-in-css/


/*
[{ "x":4,"y":4,"value":2},{"x":3,"y":3,"value":2},{"x":4,"y":3,"value":2}]

[{"x":4,"y":4,"value":1024},{"x":4,"y":3,"value":512},{"x":4,"y":2,"value":128},{"x":4,"y":1,"value":32},{"x":3,"y":1,"value":16},{"x":2,"y":1,"value":8},{"x":1,"y":1,"value":2},{"x":3,"y":2,"value":4},{"x":2,"y":2,"value":2}]

[{ x: 2, y: 3, value: 2 }]
[{"x":2,"y":3,"value":2}]
*/


/*
function startBot() {
	setInterval(() => {
		tiles.findTilesByAxis('bottom')
	} ,91)
	setTimeout(() =>{
		setInterval(()=>{
			tiles.findTilesByAxis('right')
		},91)
	},90)
}
startBot()
setInterval(() =>{for (var i = 0; i < 20; i++) {utils.newTileGenerate()}}, 7000)
*/