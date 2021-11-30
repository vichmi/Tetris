let board = [];
const sizeX = 10, sizeY = 24, cellSize = 25;
let score = 0, isGameOver = false;

for(let x=0;x<sizeX;x++) {
    board[x] = [];
	for(let y=0;y<sizeY;y++) {
        board[x][y] = 0;
    }
}

class Piece {

    constructor(tetromino, color) {
        this.tetromino = tetromino;
        this.tetrominoN = 0;
        this.currentTetromino = this.tetromino[this.tetrominoN];
        this.color = color;
        this.x = 4;
        this.y = -1;
		this.py = sizeY-1;
		this.placed = false;
		this.switched = false;
    }

    draw() {
		let shadow = this.shadow();
        for(let y=0;y<this.currentTetromino.length;y++) {
            for(let x=0;x<this.currentTetromino.length;x++) {
                if(this.currentTetromino[y][x]) {
                    context.fillStyle = this.color;
                    context.fillRect((this.x+x)*cellSize, (this.y+y)*cellSize, cellSize, cellSize);

					if(this.y + y != this.y + y+ shadow) {
						context.globalAlpha = 0.5;
						context.fillRect((this.x+x)*cellSize, (this.y+y+shadow)*cellSize, cellSize, cellSize);
						context.globalAlpha = 1;
					}
                }

            }
        }
    }

	shadow() {
        for(let i=1;i<sizeY;i++) {
			if(this.collision(0, i, this.currentTetromino)) {
				return i-1;
			}else{
				continue;
			}
		}
	}

	rotate() {
		let newPiece = this.tetromino[(this.tetrominoN+1)%this.tetromino.length];
		let offset = 0;

		if(this.collision(0, 0, newPiece)) {
			if(this.x > sizeX/2) {
				offset = -1
			}else{
				offset = 1;
			}
		}

		if(!this.collision(offset, 0, newPiece)) {
			this.x += offset;
			this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length;
			this.currentTetromino = this.tetromino[this.tetrominoN];
		}
	}

    moveHorizontal(n) {
		if(!this.collision(n, 0, this.currentTetromino)) {
        	this.x += n;
		}
    }

    moveDown() {
		if(!this.collision(0, 1, this.currentTetromino)) {
        	this.y++;
		}else{
			this.place();
			currentFigure = getLastPiece();
		}
    }

	collision(x, y, piece) {
		for(let i=0;i<piece.length;i++) {
			for(let j=0;j<piece.length;j++) {
				if(!piece[i][j]) continue;

				let newX = this.x + j + x;
				let newY = this.y + i + y;

				if(newX < 0 || newX >= sizeX || newY >= sizeY) return true;

				if(newY < 0) continue;

				if(board[newX][newY]) return true;
			}
		}

		return false;
	}

	place() {
		for(let i=0;i<this.currentTetromino.length;i++) {
			for(let j=0;j<this.currentTetromino[i].length;j++) {
				if(this.y + i < 0) {
					isGameOver = true;
				}
				if(this.currentTetromino[j][i]) {
					if(savedFigure) savedFigure.switched = false;
					board[this.x+i][this.y+j] = this.color;
				}
			}
		}

		let rows = 0;
		for(let y=0;y<sizeY;y++) {
			let full = true;
			for(let x=0;x<sizeX;x++) {
				full = full && board[x][y] != 0;
			}

			if(full) {
				rows++;
				for(let i=y;i>1;i--) {
					for(let x=0;x<sizeX;x++) {
						board[x][i] = board[x][i-1];
					}
				}

				for(let x=0;x<sizeX;x++) {
					board[x][0] = 0;
				}
			}
		}
		score += rows*5;
	}
}

const figures = [ [I, 'lightblue'], [J, 'blue'], [L, 'orange'], [O, 'yellow'], [S, 'green'], [Z, 'red'], [T, 'purple']];

function getRandomPiece() {
	let comingPieces = [];
	for(let i=0;i<20;i++) {
		let figure = figures[Math.floor(Math.random()*figures.length)];
		comingPieces[i] = new Piece(figure[0], figure[1])
	}
	
	return comingPieces;
}

let comingPieces = getRandomPiece();

function getLastPiece() {
	comingPieces.shift();
	if(comingPieces.length <= 6) {
		for(let i=7;i<20;i++) {
			let figure = figures[Math.floor(Math.random()*figures.length)];
			comingPieces.push(new Piece(figure[0], figure[1]));
		}
	}
	return comingPieces[0];
}