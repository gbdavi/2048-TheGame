function $(obj,index) {
	return document.querySelectorAll(obj)[index||0]
}

let gridStyleSize

//Menu e opções

let gameMenuPage = 1
let mainMenuPage = 0

const menu = {

	changeMainMenu(index) {
		if (index == '+') {
			mainMenuPage++
		}

		if (index == '-') {
			mainMenuPage--
		}

		if (typeof(index) == 'number') {
			mainMenuPage = index
		}

		if (mainMenuPage > 3 ) {
			mainMenuPage = 0
		}

		if ( mainMenuPage < 0 ) {
			mainMenuPage = 3
		}

		menu.gameMode(index)
	},

	gameMode(index) {
		let text
		let image

		switch ( mainMenuPage ){
			case 0:
				text = 'Classic - 4x4'
				image = './assets/Table-4.png'
				gridStyleSize = 4
				break

			case 1:
				text = 'Large - 5x5'
				image = './assets/Table-5.png'
				gridStyleSize = 5
				break

			case 2:
				text = 'Wide - 6x6'
				image = './assets/Table-6.png'
				gridStyleSize = 6
				break

			case 3:
				text = 'Huge - 8x8'
				image = './assets/Table-8.png'
				gridStyleSize = 8
				break
			default: break;
		}

		$('#main-menu .imgDescription').innerText = text

		if ( typeof(index) !== 'number' ) {

			let img = document.createElement('img')
			img.src = image
			img.style.marginLeft = index === '+' ? '-370px' : '370px'

			$('#main-menu .container > div:nth-child(1)').appendChild( img )

			menu.mainMenuAnimation(index)
		} else { $('#main-menu .container div > img',0).src = image }
	},

	mainMenuAnimation(direction) {
		if ( direction === '-' ) {
			$('#main-menu .container div > img',0).style.marginLeft='-370px'

		} else if ( direction === '+' ) {
			$('#main-menu .container div > img',0).style.marginLeft='370px'
		}

		
		setTimeout(()=>{ $('#main-menu .container div > img',1).style.marginLeft='0' },0)
		setTimeout(()=>{ $('#main-menu .container div > img',0).remove() },200)
	},

	borderBg() {
		if ( $('#borderLeft') == undefined || $('#borderRight') == undefined ) {

			let borderLeft = document.createElement('div')
			let borderRight = document.createElement('div')

			borderLeft.id='borderLeft'
			borderLeft.style.position='fixed'
			borderLeft.style.background='white'
			borderLeft.style.height='100%'
			borderLeft.style.top='0'
			borderLeft.style.left='0'
			borderLeft.style.zIndex='50'

			borderRight.id='borderRight'
			borderRight.style.background='white'
			borderRight.style.position='fixed'
			borderRight.style.height='100%'
			borderRight.style.top='0'
			borderRight.style.zIndex='50'

			document.body.appendChild( borderLeft )
			document.body.appendChild( borderRight )
		}

		let content = $('#game-content').getClientRects()[0]

		$('#borderLeft').style.width = content['left'] + 'px'

		$('#borderRight').style.width = content['left'] + 'px'
		$('#borderRight').style.left = ( content['left'] + content['width'] ) + 'px'
	},

	changeGameMenu(index,page,btn) {
		if (index == '+') {
			gameMenuPage++
		}

		if (index == '-') {
			gameMenuPage--
		}

		if (typeof(index) == 'number') {
			gameMenuPage = index
		}

		let playBtn = $('#how-to-play .play').style		
		gameMenuPage == 3 ? playBtn.visibility='visible' : playBtn.visibility='hidden'

		menu.howToPlay()
	},

	howToPlay(){
		let text
		let image
		let btn = document.querySelectorAll('#how-to-play .button-container img')

		switch (gameMenuPage){
			case 1:
				text = 'Swipe or press arrow keys to move the tiles in any direction (left, right, up, down)'
				image = './assets/How to Play-1.png'
				btn[0].classList.remove('visible')
				btn[1].classList.add('visible')
				
				$('#how-to-play .img').style='width: 350px;height: 350px;'
				break
			case 2:
				text = 'When two tiles with the same number join, they merge into one'
				image = './assets/How to Play-2.png'
				btn[0].classList.add('visible')
				btn[1].classList.add('visible')

				$('#how-to-play .img').style='width: 268px;height: 268px;'
				break
			case 3:
				text = 'Join the tile and get to the 2048 one!'
				image = './assets/How to Play-3.png'
				btn[0].classList.add('visible')
				btn[1].classList.remove('visible')

				$('#how-to-play .img').style='width: 268px;height: 268px;'
				break
			default: break;
		}

		$('#how-to-play .imgDescription').innerText = text
		$('#how-to-play .img').src = image
		$('#how-to-play .button-container div').innerText = gameMenuPage + '/3'
	}
}

menu.howToPlay()
menu.changeMainMenu(0)


//Mobile Config

function detectMobile() { 
	if( navigator.userAgent.match(/Android/i)
	|| navigator.userAgent.match(/webOS/i)
	|| navigator.userAgent.match(/iPhone/i)
	|| navigator.userAgent.match(/iPad/i)
	|| navigator.userAgent.match(/iPod/i)
	|| navigator.userAgent.match(/BlackBerry/i)
	|| navigator.userAgent.match(/Windows Phone/i)
	){
		return true;
	} else {
		return false;
	}
}

if ( detectMobile() == true ) {
	$('#game-content').style= 'display: block; height: 100%; width: 30rem; background: #ffffff; position: fixed; top: 0; zoom: 2.1; margin-top: -20px; overflow: hidden !important; padding-bottom: 50px;'
}


//Storage
const Storage = {
	get(item){
		return JSON.parse(localStorage.getItem(item))
	},
	set(item, value){
		localStorage.setItem(item, JSON.stringify(value))
	}
}



// Utils
const utils = {
	start(size){
		gridStyleSize = size
		utils.setConfigs()
		table.bgUpdate()

		if (Storage.get('tableSize' + gridStyleSize)[0] == undefined) {
			utils.newTileGenerate()
			utils.newTileGenerate()
		} else {
			table.tilesUpdate()
		}

		utils.score()
		utils.highScore()
	},

	setConfigs() {
		//Config Storage
		try {
			Storage.get('tableSize' + gridStyleSize)[0]
		} catch(err){
			Storage.set('tableSize' + gridStyleSize,[])
			Storage.set('score' + gridStyleSize,[0])
		}

		try {
			Storage.get('score' + gridStyleSize)[0]
		} catch(err){
			Storage.set('tableSize' + gridStyleSize,[])
			Storage.set('score' + gridStyleSize,[0])
		}

		try {
			Storage.get('record' + gridStyleSize)[0]
		} catch(err){
			Storage.set('record' + gridStyleSize,[0])
		}
	},

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
			$('#game-content #table-game').appendChild(newTile)
		}
	},

	newRandomNumber(min,max) {
		return parseInt(Math.random() * (max + 1 - min) + 1)
	},

	score(sum) {
		let score = Number(Storage.get('score' + gridStyleSize))
		score += Number(sum) || 0
		Storage.set('score' + gridStyleSize,[score])
		document.querySelectorAll('.left-header .show-score p')[1].innerHTML = Storage.get('score' + gridStyleSize)
	},

	highScore(score) {
		if (score > Storage.get('record' + gridStyleSize)[0]) {
			Storage.set('record' + gridStyleSize,score)
		}
		document.querySelectorAll('.right-header .show-score p')[1].innerText = Storage.get('record' + gridStyleSize)
	}
}


window.addEventListener('resize', () => {
	for (var i = 0; i < utils.tileLocate().length; i++) {
		let tile = utils.tileLocate()[i]
		let style = utils.getStyle(tile.id[0],tile.id[1],tile.innerText)
		let arr = style.split(';')
		tile.style = arr[1] + "; " + arr[2] + ";" + arr[3] + ";" + arr[4] + ";"
	}

	menu.borderBg()	
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
	findTilesByAxis(moveTo,test){
		let notSum = []
		for (var axlePosition = 0; axlePosition < gridStyleSize; axlePosition++) {
			for (var i = 0; i < utils.tileLocate().length; i++){
				if (moveTo == 'top') {
					if (utils.tileLocate()[i].id[0] == axlePosition + 1){
						let colision = tiles.colisionRequest(utils.tileLocate()[i],moveTo,notSum,test)
						if ( colision != undefined && test != true ) {
							i = 0
							notSum.push(colision)
						}
						if ( colision == 'Has a valid move' ) {
							return 'Has a valid move'
						}
					}
				}
				
				if (moveTo == 'bottom') {
					if (utils.tileLocate()[i].id[0] == gridStyleSize - axlePosition){
						let colision = tiles.colisionRequest(utils.tileLocate()[i],moveTo,notSum,test)
						if ( colision != undefined && test != true ) {
							i = 0
							notSum.push(colision)
						}
						if ( colision == 'Has a valid move' ) {
							return 'Has a valid move'
						}
					}
				}

				if (moveTo == 'left') {
					if (utils.tileLocate()[i].id[1] == axlePosition + 1){		
						let colision = tiles.colisionRequest(utils.tileLocate()[i],moveTo,notSum,test)
						if ( colision != undefined && test != true ) {
							i = 0
							notSum.push(colision)
						}
						if ( colision == 'Has a valid move' ) {
							return 'Has a valid move'
						}
					}
				}

				if (moveTo == 'right') {
					if (utils.tileLocate()[i].id[1] == gridStyleSize - axlePosition){
						let colision = tiles.colisionRequest(utils.tileLocate()[i],moveTo,notSum,test)
						if ( colision != undefined && test != true ) {
							i = 0
							notSum.push(colision)
						}
						if ( colision == 'Has a valid move' ) {
							return 'Has a valid move'
						}
					}
				}
			}
		}

		table.savePositions()

		if (String(checkPositionChange) != String(utils.tilesId())) {
			utils.newTileGenerate()
		}

		if (utils.tilesId().length == gridStyleSize*gridStyleSize && test != true ) {
			let f_move = tiles.findTilesByAxis('top',true)
			let s_move = tiles.findTilesByAxis('bottom',true)
			let t_move = tiles.findTilesByAxis('left',true)
			let ft_move = tiles.findTilesByAxis('right',true)

			if ( f_move == 'Has a valid move' || s_move == 'Has a valid move' || t_move == 'Has a valid move' || ft_move == 'Has a valid move' ) {
				console.log('Has a valid move')
			} else {
				console.log('Voce Perdeu!')
			}
		}

		utils.highScore(Storage.get('score' + gridStyleSize))
	},

	colisionRequest(tile,moveTo,notSum,test){
		for (var selected = 0; selected < gridStyleSize; selected++) {
			if (moveTo == 'top') {
				const similarTile = utils.tilesId().indexOf(String(selected + 1) + String(tile.id[1]))
				if (similarTile == -1 || utils.tileLocate()[similarTile] == tile) {
					tile.id = String(selected + 1) + String(tile.id[1])					
					tile.style = utils.getStyle(tile.id[0],tile.id[1], tile.innerText)
					break
				}
				if (utils.tileLocate()[similarTile] != tile && utils.tileLocate()[similarTile].innerText == tile.innerText && notSum.indexOf( utils.tileLocate()[similarTile].id ) == -1 ) {
					const tileFollowed = utils.tilesId().indexOf(String(selected + 2) + String(tile.id[1]))
					if ( tileFollowed == -1 || utils.tileLocate()[tileFollowed] == tile) {
						if ( test == true ) {
							return 'Has a valid move'
						}
						tile.classList.remove('tile' + tile.innerText)
						tile.innerText *= 2
						tile.classList.add('tile' + tile.innerText)
						tile.id = utils.tileLocate()[similarTile].id
						utils.tileLocate()[similarTile].remove()
						utils.score(tile.innerText)
						
						tile.style = utils.getStyle(tile.id[0],tile.id[1], tile.innerText)
						return tile.id
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
				if (utils.tileLocate()[similarTile] != tile && utils.tileLocate()[similarTile].innerText == tile.innerText && notSum.indexOf( utils.tileLocate()[similarTile].id ) == -1 ) {
					const tileFollowed = utils.tilesId().indexOf(String(gridStyleSize - selected - 1) + String(tile.id[1]))
					if ( tileFollowed == -1 || utils.tileLocate()[tileFollowed] == tile) {
						if ( test == true ) {
							return 'Has a valid move'
						}
						tile.classList.remove('tile' + tile.innerText)
						tile.innerText *= 2
						tile.classList.add('tile' + tile.innerText)
						tile.id = utils.tileLocate()[similarTile].id
						utils.tileLocate()[similarTile].remove()
						utils.score(tile.innerText)
						
						tile.style = utils.getStyle(tile.id[0],tile.id[1], tile.innerText)
						return tile.id
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

				if ( utils.tileLocate()[similarTile] != tile && utils.tileLocate()[similarTile].innerText == tile.innerText && notSum.indexOf( utils.tileLocate()[similarTile].id ) == -1 ) {
					const tileFollowed = utils.tilesId().indexOf(String(tile.id[0]) + String(selected + 2))
					if ( tileFollowed == -1 || utils.tileLocate()[tileFollowed] == tile) {
						if ( test == true ) {
							return 'Has a valid move'
						}
						tile.classList.remove('tile' + tile.innerText)
						tile.innerText *= 2
						tile.classList.add('tile' + tile.innerText)
						tile.id = utils.tileLocate()[similarTile].id
						utils.tileLocate()[similarTile].remove()
						utils.score(tile.innerText)
						
						tile.style = utils.getStyle(tile.id[0],tile.id[1], tile.innerText)
						return tile.id
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
				if (utils.tileLocate()[similarTile] != tile && utils.tileLocate()[similarTile].innerText == tile.innerText && notSum.indexOf( utils.tileLocate()[similarTile].id ) == -1 ) {
					const tileFollowed = utils.tilesId().indexOf(String(tile.id[0]) + String(gridStyleSize - selected - 1))
					if ( tileFollowed == -1 || utils.tileLocate()[tileFollowed] == tile) {
						if ( test == true ) {
							return 'Has a valid move'
						}
						tile.classList.remove('tile' + tile.innerText)
						tile.innerText *= 2
						tile.classList.add('tile' + tile.innerText)
						tile.id = utils.tileLocate()[similarTile].id
						utils.tileLocate()[similarTile].remove()
						utils.score(tile.innerText)

						tile.style = utils.getStyle(tile.id[0],tile.id[1], tile.innerText)
						return tile.id
					}
				}
			}	
		}
	}
}



const table = {
	toggle(obj,extraClass) {
		let div = $(obj)
		let classes = div.classList.toString().split(' ')

		if (extraClass != undefined) {
			if ( classes.indexOf(extraClass != -1 ) ) {
				div.classList.remove(extraClass)
			} else {
				div.classList.add(extraClass)
			}
		}

		if ( classes.indexOf('visible') != -1 ) {
			div.classList.remove('show')
			setTimeout(()=>{
				div.classList.remove('visible')
			},500)
		}

		if ( classes.indexOf('visible') == -1 ) {
			div.classList.add('visible')
			div.classList.add('show')
		}	
	},

	bgUpdate() {
		const gridStyleRow = "repeat(" + gridStyleSize + ", 1fr)"
		const gridStyleColumn = "repeat(" + gridStyleSize + ", 1fr)"

		$('#table-game').innerHTML = ''
		$('#bg-game').innerHTML = ''
		$('#bg-game').style.gridTemplateRows = gridStyleRow
		$('#bg-game').style.gridTemplateColumns = gridStyleColumn

		for (var i = 0; i < gridStyleSize*gridStyleSize; i++) {
			$('#game-content #bg-game').appendChild(table.addElement())
		}
	},

	tilesUpdate() {
		for (var i = 0; i < utils.tilePosition().length; i++) {

			let $class = utils.tilePosition()[i].value
			let $id = String( utils.tilePosition()[i].x ) + String( utils.tilePosition()[i].y )
			let $text = utils.tilePosition()[i].value

			let tile = table.addElement( $class , $id , $text )

			$('#game-content #table-game').appendChild(tile)
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

//table.bgUpdate()
//document.querySelectorAll('.left-header .show-score p')[1].innerHTML = Storage.get('score' + gridStyleSize)
//utils.highScore()

table.toggle('#main-menu')
menu.borderBg()


/*
onclick="table.toggle('#game-menu');table.toggle('#game');"
	
*/


//https://css-tricks.com/how-do-you-do-max-font-size-in-css/


/*
[{"x":4,"y":4,"value":2048},{"x":4,"y":3,"value":1024},{"x":4,"y":2,"value":256},{"x":4,"y":1,"value":128},{"x":3,"y":1,"value":16},{"x":2,"y":1,"value":4},{"x":3,"y":2,"value":4},{"x":2,"y":4,"value":2}]
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

/*function startBot() {
	setInterval(() => {
		tiles.findTilesByAxis('top')
	} ,273)

	setTimeout(() =>{
		setInterval(()=>{
			tiles.findTilesByAxis('left')
		},273)
	},91)

	setTimeout(() =>{
		setInterval(()=>{
			tiles.findTilesByAxis('bottom')
		},273)
	},182)

	setTimeout(() =>{
		setInterval(()=>{
			tiles.findTilesByAxis('right')
		},273)
	},273)
}
startBot()*/
