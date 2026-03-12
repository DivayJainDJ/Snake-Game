const board = document.querySelector('.board');
const startButton=document.querySelector('.btn-start')
const modal=document.querySelector('.modal')
const startGameModal=document.querySelector(".start-game")
const gameOverModal=document.querySelector(".game-over")
const restartButton=document.querySelector(".btn-restart")
const pauseButton = document.querySelector('.btn-pause');
const highscoreElement=document.querySelector("#high-score")
const scoreElement=document.querySelector("#score")
const timeElement=document.querySelector("#time")

const blockHeight = 50;
const blockWidth = 50;

let highscore=localStorage.getItem("highscore");
let score=0;
let time=`00-00`;

highscoreElement.innerText=highscore;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);
let intervalId = null;
let timerIntervalId=null;
let isPaused = false;
let food={x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)}

const blocks = [];
let snake = [{ x: 1, y: 3 }];
let directions = 'right';

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement('div');
    block.classList.add("block");
    board.appendChild(block);
    blocks[`${row}-${col}`] = block;
  }
}

function render() {
  blocks[`${food.x}-${food.y}`].classList.add("food")

  let head = null;

  if (directions === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } 
  else if (directions === "right") {           
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } 
  else if (directions === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  } 
  else if (directions === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  }

  
  // Check for self-collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
        clearInterval(intervalId);
        clearInterval(timerIntervalId);
        modal.style.display = "flex";
        startGameModal.style.display = "none";
        gameOverModal.style.display = "flex";
        return;
    }
  }

  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    clearInterval(intervalId);
    clearInterval(timerIntervalId);
    modal.style.display="flex";
    startGameModal.style.display="none";
    gameOverModal.style.display="flex";
    return;
  }

  if(head.x==food.x&&head.y==food.y){
    blocks[`${food.x}-${food.y}`].classList.remove("food")
    food={x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)}
    blocks[`${food.x}-${food.y}`].classList.add("food")
    snake.unshift(head);
    score+=10;
    scoreElement.innerText=score;

    if(score>highscore){
      highscore=score;
      localStorage.setItem("highscore",highscore.toString())
    }
  }
 
  const tail = snake.pop();
  blocks[`${tail.x}-${tail.y}`].classList.remove("fill");
  snake.unshift(head);
  blocks[`${head.x}-${head.y}`].classList.add("fill");
}


startButton.addEventListener("click",()=>{
  modal.style.display="none";
  intervalId=setInterval(()=>{render()},150)
  timerIntervalId=setInterval(()=>{
    let [min,sec]=time.split("-").map(Number);
    if(sec==59){
      min+=1;
      sec=0;
    }
    else{
      sec+=1;
    }
    time=`${min}-${sec}`
    timeElement.innerText=time;
  },1000)
})

restartButton.addEventListener("click",restartGame);

function restartGame(){
  blocks[`${food.x}-${food.y}`].classList.remove("food")
  snake.forEach(segment => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
  });

  score=0;
  time=`00-00`;

  scoreElement.innerText=score;
  timeElement.innerText=time;
  highscoreElement.innerText=highscore;

  modal.style.display="none";
  directions="down";
  snake = [{ x: 1, y: 3 }];
  food={x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)}
  
  // Clear old intervals and start new ones
  clearInterval(intervalId);
  clearInterval(timerIntervalId);
  intervalId=setInterval(()=>{render()},150)
  timerIntervalId=setInterval(()=>{
    let [min,sec]=time.split("-").map(Number);
    if(sec==59){
      min+=1;
      sec=0;
    }
    else{
      sec+=1;
    }
    time=`${min}-${sec}`
    timeElement.innerText=time;
  },1000)
}



addEventListener("keydown", (event) => {
  if (event.key == "ArrowUp" && directions !== 'down') {
    directions = "up";
  } 
  else if (event.key == "ArrowDown" && directions !== 'up') {
    directions = "down";
  }
  else if (event.key == "ArrowRight" && directions !== 'left') {
    directions = "right";
  }
  else if (event.key == "ArrowLeft" && directions !== 'right') {
    directions = "left";
  }
});

pauseButton.addEventListener('click', togglePause);

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(intervalId);
        clearInterval(timerIntervalId);
        pauseButton.innerText = 'Resume';
    } else {
        pauseButton.innerText = 'Pause';
        intervalId = setInterval(() => { render(); }, 150);
        timerIntervalId = setInterval(() => {
            let [min, sec] = time.split("-").map(Number);
            if (sec == 59) {
                min += 1;
                sec = 0;
            } else {
                sec += 1;
            }
            time = `${min.toString().padStart(2, '0')}-${sec.toString().padStart(2, '0')}`;
            timeElement.innerText = time;
        }, 1000);
    }
}
