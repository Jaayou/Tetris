const cvs = document.querySelector(".cvs");
const ctx = cvs.getContext('2d');

const ROW = 20;
const COL = 10;
const SQ = 30;
const VACANT = 'white';

const PIECES = [
    [Z, "red"],
    [S, "lightgreen"],
    [T, "yellow"],
    [O, "skyblue"],
    [L, "purple"],
    [I, "cyan"],
    [J, "orange"]
];

let tetromino1;
let gameOver = false;
let board = [];
let score = 0;
let dropStart = Date.now();

class Tetromino {
    tetromino;
    color;
    tetrominoNo = 0;
    activeTetromino;

    constructor(tetromino, color) {
        this.tetromino = tetromino;
        this.color = color;
        this.activeTetromino = this.tetromino[this.tetrominoNo];
        this.x = 3;
        this.y = -2;
    }
}

Tetromino.prototype.draw = function () {
    this.fill(this.color);
}

Tetromino.prototype.unDraw = function () {
    this.fill('white');
}

Tetromino.prototype.fill = function (color) {
    for (var r = 0; r < this.activeTetromino.length; r++) {
        for (var c = 0; c < this.activeTetromino.length; c++) {
            if (this.activeTetromino[r][c]) {
                drawSqaure(this.x + c, this.y + r, color);
            }
        }
    }
}

Tetromino.prototype.moveDown = function () {
    if (!this.collision(0, 1, this.activeTetromino)) {
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        this.lock();
        tetromino1 = newTetromino();
    }
}

Tetromino.prototype.moveLeft = function () {
    if (!this.collision(-1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x--;
        this.draw();
    }
}

Tetromino.prototype.moveRight = function () {
    if (!this.collision(1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x++;
        this.draw();
    }
}

Tetromino.prototype.rotate = function () {
    let nextPattern = this.tetromino[(this.tetrominoNo + 1) % this.tetromino.length];
    let kick = 0;

    if (this.collision(0, 0, nextPattern)) {
        if (this.x > COL / 2) {
            kick = -1;
        } else {
            kick = 1;
        }
    }

    if (!this.collision(kick, 0, nextPattern)) {
        this.unDraw();
        this.x += kick;
        this.tetrominoNo = (this.tetrominoNo + 1) % this.tetromino.length;
        this.activeTetromino = this.tetromino[this.tetrominoNo];
        this.draw();
    }
}

Tetromino.prototype.collision = function (x, y, tetromino) {
    for (var r = 0; r < tetromino.length; r++) {
        for (var c = 0; c < tetromino.length; c++) {
            if (!tetromino[r][c]) { continue };

            var newX = this.x + c + x;
            var newY = this.y + r + y;
            if (newX < 0 || newX >= COL || newY >= ROW) {
                return true;
            }

            if (newY < 0) { continue; }

            if (board[newY][newX] != VACANT) {
                return true;
            }
        }
    }
    return false;
}

Tetromino.prototype.lock = function () {
    for (var r = 0; r < this.activeTetromino.length; r++) {
        for (var c = 0; c < this.activeTetromino.length; c++) {
            if (!this.activeTetromino[r][c]) { continue; }

            if (this.y + r < 0) {
                alert("Game Over");
                gameOver = true;
                break;
            }
            console.log(this.y, r, this.x, c);
            board[this.y + r][this.x + c] = this.color;
        }
    }

    for (var r = 0; r < ROW; r++) {
        isRowFull = true;
        for (var c = 0; c < COL; c++) {
            isRowFull = isRowFull && (board[r][c] != VACANT)
        }

        if (isRowFull) {
            for (var y = r; y > 1; y--) {
                for (var c = 0; c < COL; c++) {
                    board[y][c] = board[y - 1][c]
                        ;
                }
            }
            for (var c = 0; c < COL; c++) {
                board[0][c] = VACANT;
            }
            score += 10;
        }
    }
    drawBoard();
    document.querySelector('.score').innerText = score;
}

function createBoard() {
    for (var r = 0; r < ROW; r++) {
        board[r] = [];
        for (var c = 0; c < COL; c++) {
            board[r][c] = VACANT;
        }
    }
}

function drawBoard() {
    for (var r = 0; r < 20; r++) {
        for (var c = 0; c < 40; c++) {
            drawSqaure(c, r, board[r][c]);
        }
    }
}

function drawSqaure(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * SQ, y * SQ, SQ, SQ);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

function newTetromino() {
    let randomTetromino = Math.floor(Math.random() * PIECES.length);
    return new Tetromino(PIECES[randomTetromino][0], PIECES[randomTetromino][1]);
}

function drop() {
    if (Date.now() - dropStart > 1000) {
        tetromino1.moveDown();
        dropStart = Date.now();
    }

    if (!gameOver) {
        requestAnimationFrame(drop);
    }
}

createBoard();
drawBoard();
tetromino1 = newTetromino();
tetromino1.draw();
drop();

document.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'ArrowDown':
            tetromino1.moveDown();
            dropStart = Date.now();
            break;
        case 'ArrowLeft':
            tetromino1.moveLeft();
            dropStart = Date.now();
            break;
        case 'ArrowRight':
            tetromino1.moveRight();
            dropStart = Date.now();
            break;
        case 'ArrowUp':
            tetromino1.rotate();
            dropStart = Date.now();
        default:
            break;
    }
})

