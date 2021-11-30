let currentFigure = getLastPiece();
let savedFigure, lastIndex = -1;

function draw() {
    if(isGameOver) {
        context.font = '50px Arial';
        context.fillText(`Game Over, press space to restart`, canvas.width/2 - context.measureText(`Game Over, press space to restart`).width/2, canvas.height/2);
        context.fillText(`Score: ${score}`, canvas.width/2 - context.measureText(`Score: ${score}`).width/2, canvas.height/2+50);
        return;
    }
    context.lineWidth = 5;
    context.strokeRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.translate(canvas.width/2-150, 0);

    currentFigure.draw();
    context.lineWidth = 1.5;
    for(let x=0;x<sizeX;x++) {
        for(let y=0;y<sizeY;y++) {
            if(board[x][y]) {
                context.fillStyle = board[x][y];
                context.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
            }
            context.strokeRect(x*cellSize, y*cellSize, cellSize, cellSize);
        }
    }

    for(let i=1;i<=5;i++) {
        for(let y=0;y<comingPieces[i].currentTetromino.length;y++) {
            for(let x=0;x<comingPieces[i].currentTetromino.length;x++) {
                if(comingPieces[i].currentTetromino[y][x]) {
                    context.fillStyle = comingPieces[i].color;
                    context.fillRect(300+x*cellSize,(y*cellSize)+100*(i-1)+50, cellSize, cellSize);
                    context.strokeRect(300+x*cellSize,(y*cellSize)+100*(i-1)+50, cellSize, cellSize);
                }
            }
        }
    }

    if(savedFigure) {
        for(let y=0;y<savedFigure.tetromino[0].length;y++) {
            for(let x=0;x<savedFigure.tetromino[0].length;x++) {
                if(savedFigure.tetromino[0][y][x]) {
                    context.fillStyle = savedFigure.color;
                    context.fillRect(x*cellSize-150,(y*cellSize)+100, cellSize, cellSize);
                    context.strokeRect(x*cellSize-150,(y*cellSize)+100, cellSize, cellSize);
                }
            }
        }
    }
    context.font = '30px Arial';
    context.fillStyle = 'black';
    context.fillText(`Score: ${score}`, -225, canvas.height-25);
    context.restore();
}

let updates = 0, stop = false;
function update() {
    updates++;
    if(updates%30 == 0 && !stop) {
        currentFigure.moveDown();
    }
}

function keypress(k) {
    if(isGameOver) return
    if(k == 'a') {
        currentFigure.moveHorizontal(-1);
    }
    if(k == 'd') {
        currentFigure.moveHorizontal(1);
    }
    if(k == 's') {
        currentFigure.moveDown();
    }
    if(k == 'w') {
        currentFigure.rotate();
    }
}

function keydown(k) {
    if(k == ' ' && isGameOver) {
        for(let x=0;x<sizeX;x++) {
            board[x] = [];
            for(let y=0;y<sizeY;y++) {
                board[x][y] = 0;
            }
        }
        score = 0;
        isGameOver = false;
    }
    if(isGameOver) return
    if(k == 'c') {
        if(!savedFigure) {
            savedFigure = currentFigure;
            savedFigure.switched = true;
            currentFigure = getLastPiece();
        }

        if(!savedFigure.switched) {
            let savedTetromino = savedFigure;
            savedFigure = currentFigure;
            savedFigure.switched = true;
            currentFigure = new Piece(savedTetromino.tetromino, savedTetromino.color);
        }
    }
}