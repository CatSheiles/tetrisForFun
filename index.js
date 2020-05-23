document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button');
    const width = 10;
    let nextRandom = 0;
    let timerId;
    let score = 0;
    let colors = [ //assigned in order l,z,t,o,i
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ]
   
   // let squaresRemoved = 0; ???not sure if i need this

//drawing tetrominos onto the grid forEach method see googleSheetsWorksheet
const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
]

const zTetromino = [
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1],
]

const tTetromino = [
    [1, width, width+1, width*2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1]
]

const oTetromino = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
]

const iTetromino = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
]

const theTetrominos = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

let currentPosition = 4;
let currentRotation = 0;

//randomly select a Tetromino and drawer its first rotation
//mathfloor rounds down to the nearest integer
let random = Math.floor(Math.random()*theTetrominos.length);

let current = theTetrominos[random][0];

//drawer the tetromino
function draw (){
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino');
        //color of tetros
        squares[currentPosition + index].style.backgroundColor = colors[random];
    })
}

//undraw the tetromino to start again
function undraw(){
    current.forEach(index =>{
        squares[currentPosition + index].classList.remove('tetromino');
        //color of tetros
        squares[currentPosition + index].style.backgroundColor = ''
    })
}

//make the tetromino move down every second 
//timerId = setInterval(moveDown, 1000);

//assign functions to keyCodes when tetros moving left37-right39
function control(e) {
    if (e.keyCode === 37){
        moveLeft()
    }else if (e.keyCode === 38){
        rotate()
    }else if (e.keyCode === 39){
        moveRight()
    }else if (e.keyCode === 40){
        moveDown()
    }
}
document.addEventListener('keyup', control);

//move down function
function moveDown(){
    undraw();
        currentPosition +=width;
        draw();
        //add freeze function so that it checks after tetros move
        freeze();
    
}

//freeze & stop tetros going over bottom of grid
function freeze(){
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
        current.forEach(index => squares[currentPosition + index].classList.add('taken'));
        //start a new tetro falling
        random = nextRandom;
        nextRandom = Math.floor(Math.random() * theTetrominos.length);
        current = theTetrominos[random][currentRotation];
        currentPosition = 4
        draw();
        displayShape();
        addScore();
        gameOver();
    }
}

//move the tertomino left, unless is at the edge or there is a blockage
function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);

    if(!isAtLeftEdge) currentPosition -=1;

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
    currentPosition +=1
    }
}
   draw();

//move tetros right unless is at the edge or there is a blockage
function moveRight() {
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === 0);

    if(!isAtRightEdge) currentPosition +=1;

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
    currentPosition -=1;
    }
}
   draw();

//rotate tetros unless is at the edge or there is a blockage
function rotate() {
    undraw();
    currentRotation ++
    if(currentRotation === current.length){ //if current rotation gets to 4, make it go back to 0
        currentRotation = 0
    }
    current = theTetrominos[random][currentRotation]
    draw();
}
 
//show up next tetro in mini-grid
const displaySquares = document.querySelectorAll('.mini-grid div');
const displayWidth = 4
const displayIndex = 0


//the tetros without rotations
const upNextTetrominos = [
    [1, displayWidth+1, displayWidth*2+1, 2], //ltetros
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //ztetros
    [1, displayWidth, displayWidth+1, displayWidth*2], //ttetros
    [0, 1, displayWidth, displayWidth+1], //otetros,
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //itetros
]

//display the shape in the mini-grid display
function displayShape(){
    //remove any trace of a tetro from the whole mini-grid
    displaySquares.forEach(square => {
        squares.classList.remove('tetromino');
        square.style.backgroundColor = '';
    })
upNextTetrominos[nextRandom].forEach( index => {
    displaySquares[displayIndex + index].classList.add('tetromino');
    displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
    }) 
}

//add functionality to the button
startBtn.addEventListener('click', () => {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }else {
        draw();
        timerId = setInterval(moveDown, 1000);
        nextRandom = Math.floor(Math.random()+ theTetrominos.length);
        displayShape();
    }
})
//splice-remove something in array concat-merge2 & append child-adding to a grid

//add score
function addScore(){
    for(let i=0; i < 199; i+=width){
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

        if(row.every(index => squares[index].classList.contains('taken'))){
            score +=10;
            scoreDisplay.innerHTML = score;
            row.forEach(index => {
                squares[index].classList.remove('taken');
                squares[index].classList.remove('tetromino');
                squares[index].style.backgroundColor = '';
            })
            const squaresRemoved = squares.splice(i, width);
            squares = squaresRemoved.concat(squares);
            squares.forEach(cell => grid.appendChild(cell));
        }

    }
}
//defining game over
function gameOver(){
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        scoreDisplay.innerHTML = "end";
        clearInterval(timerId);
    }
}



draw();

})


