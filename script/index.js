let playerScore = 0;
let aiScore = 0;

function addClickListeners() {
	for (let cellElement of document.getElementsByClassName('cell')) {
		cellElement.addEventListener('click', playerTurn);
	}
}

function removeClickListeners() {
	for (let cellElement of document.getElementsByClassName('cell')) {
		cellElement.removeEventListener('click', playerTurn);
	}
}

function replayGame() {
	removeClickListeners();
	setTimeout(() => {
		document.body = document.createElement('body');
		setBoard();
	}, 2000);
}

function isEquality() {
	for (let cellElement of document.getElementsByClassName('cell')) {
		if (!cellElement.textContent.length) {
			return false;
		}
	}
	return true;
}

function checkVictory(sign) {
	const conditionsGain = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];
	for (let conditionGain of conditionsGain) {
		const cell1 = document.getElementById(`cell${conditionGain[0]}`);
		const cell2 = document.getElementById(`cell${conditionGain[1]}`);
		const cell3 = document.getElementById(`cell${conditionGain[2]}`);
		if (
			cell1.textContent === sign &&
			cell2.textContent === sign &&
			cell3.textContent === sign
		) {
			if (sign === 'O') {
				playerScore++;
				cell1.classList.add('roundVictory');
				cell2.classList.add('roundVictory');
				cell3.classList.add('roundVictory');
			} else if (sign === 'X') {
				aiScore++;
				cell1.classList.add('crossVictory');
				cell2.classList.add('crossVictory');
				cell3.classList.add('crossVictory');
			}
			replayGame();
			return;
		}
	}
	if (isEquality()) {
		for (let cellElement of document.getElementsByClassName('cell')) {
			cellElement.classList.add('equality');
		}
		replayGame();
		return;
	}
	nextTurn(sign === 'X' ? true : false, false);
}

function nextTurn(playerTurn, firstTurn) {
	if (playerTurn) {
		addClickListeners();
	} else {
		if (firstTurn) {
			iaTurn();
		} else {
			removeClickListeners();
			setTimeout(iaTurn, 1500);
		}
	}
}

function iaTurn() {
	let board = [];
	for (let cellElement of document.getElementsByClassName('cell')) {
		if (cellElement.textContent.length) {
			board.push(cellElement.textContent);
		} else {
			board.push(board.length);
		}
	}
	const sign = 'X';
	let best = minimax(board, sign);
	if ('index' in best) {
		const cellElement = document.getElementById(`cell${best.index}`);
		const signElement = document.createElement('span');
		signElement.setAttribute('class', 'sign');
		signElement.textContent = sign;
		cellElement.appendChild(signElement);
		checkVictory(sign);
	}
}

function playerTurn() {
	if (this.textContent.length) return;
	const sign = 'O';
	const signElement = document.createElement('span');
	signElement.setAttribute('class', 'sign');
	signElement.textContent = sign;
	this.appendChild(signElement);
	checkVictory(sign);
}

function setPopup() {
	const popupElement = document.createElement('div');
	popupElement.setAttribute('id', 'popup');
	const readyElement = document.createElement('div');
	readyElement.setAttribute('id', 'ready');
	readyElement.textContent = `Prêt ? ${playerScore} contre ${aiScore}`;
	const playerTurnElement = document.createElement('div');
	playerTurnElement.setAttribute('class', 'play');
	playerTurnElement.textContent = 'Commencer';
	const aiTurnElement = document.createElement('div');
	aiTurnElement.setAttribute('class', 'play');
	aiTurnElement.textContent = 'Souffrir';
	const initTurnElement = document.createElement('div');
	initTurnElement.setAttribute('class', 'play');
	initTurnElement.textContent = 'Revanche';
	popupElement.appendChild(readyElement);
	popupElement.appendChild(playerTurnElement);
	popupElement.appendChild(aiTurnElement);
	popupElement.appendChild(initTurnElement);
	document.body.appendChild(popupElement);
	playerTurnElement.addEventListener('click', () => {
		popupElement.remove();
		nextTurn(true, true);
	});
	aiTurnElement.addEventListener('click', () => {
		popupElement.remove();
		nextTurn(false, true);
	});
	initTurnElement.addEventListener('click', () => {
		playerScore = 0;
		aiScore = 0;
		popupElement.remove();
		setPopup();
	});
}

function setBoard() {
	for (let i = 0; i < 9; i++) {
		const cellElement = document.createElement('div');
		cellElement.setAttribute('id', `cell${i}`);
		cellElement.setAttribute('class', 'cell');
		document.body.appendChild(cellElement);
	}
	setPopup();
}

setBoard();
