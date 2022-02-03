// Works the best, slight pause between speed ups
// Issue when 2 powerpellets are eaten - fixed with adjusting powerpellet distances and timer
// randomly timed fruit in middle to reset grid (currently spawns every 45s)
const width = 28
let grid = document.querySelector('.grid')
const scoreDisplay = document.getElementById('score')
const highscoreDisplay = document.getElementById('highscore')
const messageDisplay = document.getElementById('message')
const startBtn = document.getElementById('start-btn')
const restartBtn = document.getElementById('restart-btn')
const blinkyStartSpeed = 200
const pinkyStartSpeed = 400
const inkyStartSpeed = 300
const clydeStartSpeed = 500
const ghostStartSpeeds = [blinkyStartSpeed, pinkyStartSpeed, inkyStartSpeed, clydeStartSpeed]

let start = 0
let restart = 0
let squares = []
let score = 0
let highscore = 0
let direction = 0
let intervalTime = 300
let timer = setInterval(move, intervalTime)
let prevDirection = 0
let gameOver = 0

let constantTimer = 0
let constantIncrease = 5000 // every 5 sec
let speedChange = 0.95

// let alreadyEaten = 0

let unScareTimer = 7000 // 7 sec

// let timeleft = 10
let countdownTimer = document.getElementById("countdown-timer")
let countdownTimer2 = document.getElementById("countdown-timer2")

let fruitTimer = 45000 // generate fruit every 45s

let savedGrid = ''
let savedSquares = []
let boxLoss = document.getElementById('box-loss')
boxLoss.style.display = "none"
let boxWin = document.getElementById('box-win')
boxWin.style.display = "none"

let fruitPoints = 50

let pacmanPrevIndex = 0
let ghostPoints = 0
let rewardedPoints = 0


// 0 - pacdots
// 1 - wall
// 2 - ghost lair
// 3 - powerpellets
// 4 - empty

// 5 - all black (corners and a few other all black spaces on the outer rim)
// 6 - bottom border
// 7 - right border
// 8 - left border
// 9 - top border

const layout = [
    5,6,6,6,6,6,6,6,6,6,6,6,6,5,5,6,6,6,6,6,6,6,6,6,6,6,6,5,
    7,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,8,
    7,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,8,
    7,3,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,3,8,
    7,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,8,
    7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,
    7,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,8,
    7,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,8,
    7,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,8,
    5,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,5,
    5,1,1,1,1,1,0,1,1,4,4,4,4,4,4,4,4,4,4,1,1,0,1,1,1,1,1,5,
    5,1,1,1,1,1,0,1,1,4,1,1,1,2,2,1,1,1,4,1,1,0,1,1,1,1,1,5,
    6,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,6,
    4,4,4,4,4,4,0,0,0,4,1,2,2,2,2,2,2,1,4,0,0,0,4,4,4,4,4,4,
    9,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,9,
    5,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,5,
    5,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,5,
    7,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,8,
    7,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,8,
    7,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,8,
    7,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,8,
    5,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,5,
    5,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,5,
    7,3,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,3,8,
    7,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,8,
    7,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,8,
    7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,
    5,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,5
]

function move(ghost) {
    if (start === 1) {

        if (
            (squares[pacmanCurrentIndex + direction].classList.contains('wall') && direction == 1 && pacmanCurrentIndex != 391) ||
            (squares[pacmanCurrentIndex + direction].classList.contains('wall') && direction == -1 && pacmanCurrentIndex != 364) ||
            (squares[pacmanCurrentIndex + direction].classList.contains('wall') && direction == width) ||
            (squares[pacmanCurrentIndex + direction].classList.contains('wall') && direction == -width) || 
            (squares[pacmanCurrentIndex + direction].classList.contains('ghost-lair') && direction == 1) ||
            (squares[pacmanCurrentIndex + direction].classList.contains('ghost-lair') && direction == -1) ||
            (squares[pacmanCurrentIndex + direction].classList.contains('ghost-lair') && direction == width) ||
            (squares[pacmanCurrentIndex + direction].classList.contains('ghost-lair') && direction == -width)
             ) {
                direction = 0
                clearInterval(timer)

        }

        squares[pacmanCurrentIndex].classList.remove('pacman')
        squares[pacmanCurrentIndex].classList.add('empty')

        if (pacmanCurrentIndex != pacmanPrevIndex) {
            pacmanPrevIndex = pacmanCurrentIndex
        }

        if (pacmanCurrentIndex == 391 && direction == 1) {
            pacmanCurrentIndex = 364
        }
        else if (pacmanCurrentIndex == 364 && direction == -1) {
            pacmanCurrentIndex = 391
        } 
        else {
            pacmanCurrentIndex += direction
        }

        pacDotEaten()
        powerPelletEaten()
        ghostEaten()
        fruitEaten()

        if (squares[pacmanCurrentIndex].classList.contains('empty')) {
            squares[pacmanCurrentIndex].classList.remove('empty')
            clearInterval(timer)
            timer = setInterval(move, intervalTime)
        }
        else if (squares[pacmanCurrentIndex].classList.contains('pac-dot')) {
            squares[pacmanCurrentIndex].classList.remove('pac-dot')
            clearInterval(timer)
            timer = setInterval(move, intervalTime)
        }
        else if (squares[pacmanCurrentIndex].classList.contains('power-pellet')) {
            squares[pacmanCurrentIndex].classList.remove('power-pellet')
            clearInterval(timer)
            timer = setInterval(move, intervalTime)
        }
        else if (squares[pacmanCurrentIndex].classList.contains('ghost-lair')) {
            squares[pacmanCurrentIndex].classList.remove('ghost-lair')
            clearInterval(timer)
            timer = setInterval(move, intervalTime)
        }
        squares[pacmanCurrentIndex].classList.add('pacman')
        checkForWin()
        checkForGameOver(ghost)
    }
}

// 0 - pacdots
// 1 - wall
// 2 - ghost lair
// 3 - powerpellets
// 4 - empty

//create board
function createBoard() {
    for (let i = 0; i < layout.length; i++) {
        //create a square 
        const square = document.createElement('div')
        //put square in grid 
        grid.appendChild(square)
        //put square in squares array
        squares.push(square)

        if (layout[i] === 0) {
            squares[i].classList.add('pac-dot')
        } else if (layout[i] === 1) {
            squares[i].classList.add('wall')

            // 3 borders
            if (layout[i - width] != 1 && layout[i - width] < 5 &&
                layout[i + 1] != 1 && layout[i + 1] < 5 && 
                layout[i + width] != 1 && layout[i + width] < 5) {
                    squares[i].classList.add('border-top-right-bottom')
            }
            else if (layout[i + 1] != 1 && layout[i + 1] < 5 && 
                layout[i + width] != 1 && layout[i + width] < 5 && 
                layout[i - 1] != 1 && layout[i - 1] < 5) {
                    squares[i].classList.add('border-right-bottom-left')
            }
            else if (layout[i + width] != 1 && layout[i + width] < 5 && 
                layout[i - 1] != 1 && layout[i - 1] < 5 && 
                layout[i - width] != 1 && layout[i - width] < 5) {
                    squares[i].classList.add('border-bottom-left-top')
            }
            else if (layout[i - 1] != 1 && layout[i - 1] < 5 && 
                layout[i - width] != 1 && layout[i - width] < 5 &&
                layout[i + 1] != 1 && layout[i + 1] < 5) {
                    squares[i].classList.add('border-left-top-right')
            }

            // 2 borders
            else if (layout[i - width] != 1 && layout[i - width] < 5 &&
                layout[i + 1] != 1 && layout[i + 1] < 5) {
                    squares[i].classList.add('border-top-right')
            }
            else if (layout[i + width] != 1 && layout[i + width] < 5 && 
                layout[i + 1] != 1 && layout[i + 1] < 5) {
                    squares[i].classList.add('border-bottom-right')
            }
            else if (layout[i - width] != 1 && layout[i - width] < 5 &&
                layout[i - 1] != 1 && layout[i - 1] < 5) {
                    squares[i].classList.add('border-top-left')
            }
            else if (layout[i + width] != 1 && layout[i + width] < 5 && 
                layout[i - 1] != 1 && layout[i - 1] < 5) {
                    squares[i].classList.add('border-bottom-left')
            }
            else if (layout[i - width] != 1 && layout[i - width] < 5 &&
                layout[i + width] != 1 && layout[i + width] < 5) {
                    squares[i].classList.add('border-top-bottom')
            }
            else if (layout[i - 1] != 1 && layout[i - 1] < 5 &&
                layout[i + 1] != 1 && layout[i + 1] < 5) {
                    squares[i].classList.add('border-left-right')
            }

            // 1 border
            else if (layout[i - width] != 1 && layout[i - width] < 5) {
                squares[i].classList.add('border-top')
            }
            else if (layout[i + 1] != 1 && layout[i + 1] < 5) {
                squares[i].classList.add('border-right')
            }
            else if (layout[i + width] != 1 && layout[i + width] < 5) {
                squares[i].classList.add('border-bottom')
            }
            else if (layout[i - 1] != 1 && layout[i - 1] < 5) {
                squares[i].classList.add('border-left')
            }
            
        } else if (layout[i] === 2) {
            squares[i].classList.add('ghost-lair')
        } else if (layout[i] === 3) {
            squares[i].classList.add('power-pellet')
        } else if (layout[i] === 4) {
            squares[i].classList.add('empty')
        } 

        //outside game border
        else if (layout[i] === 5) {
            squares[i].classList.add('wall')
        }
        else if (layout[i] === 6) {
            squares[i].classList.add('wall')
            squares[i].classList.add('border-bottom')
        }
        else if (layout[i] === 7) {
            squares[i].classList.add('wall')
            squares[i].classList.add('border-right')
        }
        else if (layout[i] === 8) {
            squares[i].classList.add('wall')
            squares[i].classList.add('border-left')
        }
        else if (layout[i] === 9) {
            squares[i].classList.add('wall')
            squares[i].classList.add('border-top')
        }
    }
}
createBoard()

let fruitIndex = 489
function makeFruit() {
    fruit = setInterval(function() {
        squares[fruitIndex].classList.remove('empty')
        squares[fruitIndex].classList.add('fruit')
    }, fruitTimer)
}

function fruitEaten() {
    if (squares[pacmanCurrentIndex].classList.contains('fruit')) {
        fruitPoints += 50
        squares[pacmanCurrentIndex].classList.remove('fruit')
        squares[pacmanCurrentIndex].classList.add('empty')
        grid.innerHTML = ''
        squares = []
        createBoard()
        score += fruitPoints //100
        scoreDisplay.innerHTML = score
        clearInterval(fruit)
        makeFruit()
    }
}

startBtn.addEventListener('click', function() {
    start = 1
    ghosts.forEach(ghost => startGhost(ghost))
    document.addEventListener('keydown', control)
    ghosts.forEach(ghost => speedUp(ghost))
    makeFruit()
    startBtn.classList.remove('active')
    startBtn.classList.add('hidden')
    restartBtn.classList.remove('hidden')
    restartBtn.classList.add('active')
})

function speedUp(ghost) {
    // ghost.timerId = ghost.timerId*speedChange
    if (!ghost.isScared && gameOver === 0) {
        // clearInterval(ghost.constantTimer)
        // console.log('in speed up', ghost.speed)
        ghost.constantTimer = setInterval(function() {speedUpTimer(ghost, ghost.speed, direction)}, constantIncrease)
    }
    else if (gameOver === 1) {
        clearInterval(ghost.constantTimer)
        clearInterval(ghost.timerId)
    }
}

function speedUpTimer(ghost, ghostSpeed, direction) {
    if (gameOver === 1) {
        clearInterval(ghost.constantTimer)
        clearInterval(ghost.timerId)
        // console.log('A')
    }
    else if (ghost.isScared) {
        clearInterval(ghost.constantTimer)
        // console.log('B')
    }
    else {
        clearInterval(ghost.timerId)
        clearInterval(ghost.constantTimer)
        ghost.speed = ghostSpeed*speedChange
        speedUp(ghost)
        direction = ghost.savedDirection
        ghost.timerId = setInterval(function() {ghostMovement(ghost, ghost.speed, direction)}, ghost.speed)
        // console.log(ghost.className, ghost.speed)
        // console.log('C')
    }

}

restartBtn.addEventListener('click', function() {
    messageDisplay.innerHTML = ""
    score = 0
    scoreDisplay.innerHTML = '00'
    squares[pacmanCurrentIndex].classList.remove('pacman')
    ghosts.forEach(ghost => {
        squares[ghost.currentIndex].classList.remove(ghost.className)
        squares[ghost.currentIndex].classList.remove('ghost')
        if (ghost.isScared) {
            squares[ghost.currentIndex].classList.remove('scared-ghost')
        }
        clearInterval(ghost.constantTimer)
        clearInterval(ghost.timerId)
    })

    for (let i = 0; i < ghostStartSpeeds.length; i++) {
        ghosts[i].speed = ghostStartSpeeds[i]
        // console.log('restarted speeds', ghosts[i].speed)
    }
    makeFruit()
    // console.log('restarted')

    //remove old classes
    grid.innerHTML = ''
    squares = []
    createBoard()

    gameOver = 0
    start = 1
    pacmanCurrentIndex = 490
    squares[pacmanCurrentIndex].classList.add('pacman')
    ghosts.forEach(ghost => {
        ghost.currentIndex = ghost.startIndex
        squares[ghost.currentIndex].classList.add(ghost.className)
        squares[ghost.currentIndex].classList.add('ghost')
    })

    ghosts.forEach(ghost => startGhost(ghost))

    ghosts.forEach(ghost => speedUp(ghost))

    document.addEventListener('keydown', control)
})

// down - 40
// up key - 38
// left - 37
// right - 39

//starting position of pacman 
let pacmanCurrentIndex = 490
squares[pacmanCurrentIndex].classList.add('pacman')

var lastEvent
function control(e, ghost) {
    squares[pacmanCurrentIndex].classList.remove('pacman')

    if (lastEvent && lastEvent.keyCode == e.keyCode) {
        squares[pacmanCurrentIndex].classList.add('pacman')
    }
    else {
        lastEvent = e

        //Version 2
        switch(e.keyCode) {
            case 40:
            // console.log('pressed down')
            direction = width
            move(ghost)
            break

            case 38:
            // console.log('pressed up')
            direction = -width
            move(ghost)
            break

            case 37: 
            // console.log('pressed left')
            direction = -1
            move(ghost)
            break

            case 39:
            // console.log('pressed right')
            direction = 1
            move(ghost)
            break
        }
    }
}

function pacDotEaten() {
    if (squares[pacmanCurrentIndex].classList.contains('pac-dot')) {
        // squares[pacmanCurrentIndex].classList.remove('pac-dot')
        // squares[pacmanCurrentIndex].classList.add('empty')
        score++
        scoreDisplay.innerHTML = score
    }
}

function powerPelletEaten() {
    //if square pacman is in contains a power pellet
    if (squares[pacmanCurrentIndex].classList.contains('power-pellet')) {
        //remove power pellet class
        // squares[pacmanCurrentIndex].classList.remove('power-pellet')
        // squares[pacmanCurrentIndex].classList.add('empty')
        //add a score of 10
        score +=10
        scoreDisplay.innerHTML = score


        countdownTimer.classList.remove('hidden')
        countdownTimer2.classList.remove('hidden')
        countdownTimer.classList.add('active')
        countdownTimer2.classList.add('active')

        let timeleft = unScareTimer / 1000
        let timeleft2 = unScareTimer / 1000
        countdownTimer.textContent = timeleft
        countdownTimer2.textContent = timeleft2
        let downloadTimer = setInterval(function() {
            timeleft -= 1
            timeleft2 -= 1
            if (timeleft == 0) {
                countdownTimer.textContent = 'Times Up!'
                countdownTimer2.textContent = 'Times Up!'
            }
            else {
                countdownTimer.textContent = timeleft
                countdownTimer2.textContent = timeleft2
            }
            if (timeleft <= -1) {
                clearInterval(downloadTimer)
                countdownTimer.classList.remove('active')
                countdownTimer2.classList.remove('active')
                countdownTimer.classList.add('hidden')
                countdownTimer2.classList.add('hidden')
            }
        }, 1000)

        ghosts.forEach(ghost => clearInterval(ghost.timerId))
        ghosts.forEach(ghost => clearInterval(ghost.constantTimer))

        //change each of the four ghosts to isScared
        ghosts.forEach(ghost => ghost.isScared = true)
        ghosts.forEach(ghost => squares[ghost.currentIndex].classList.add('scared-ghost'))
        ghosts.forEach(ghost => ghost.savedSpeed = ghost.speed)
        ghosts.forEach(ghost => ghost.speed = ghost.slowSpeed)
        ghosts.forEach(ghost => ghost.timerId = setInterval(function() {ghostMovement(ghost, ghost.slowSpeed, direction)}, ghost.slowSpeed))

        //use setTimeout to unscare ghosts after certain amount of time
        // alreadyEaten = 1  
        setTimeout(unScareGhosts, unScareTimer)

    }
}


function ghostEaten() {

    
    if ((squares[pacmanCurrentIndex].classList.contains('ghost') && 
        squares[pacmanCurrentIndex].classList.contains('scared-ghost'))) { //||
        // pacmanPrevIndex == ghosts[j].prevIndex) {

            for (let j = 0; j < ghosts.length; j++) {
                if (ghosts[j].currentIndex == pacmanCurrentIndex) {
                    clearInterval(ghosts[j].timerId)
                    ghosts[j].prevIndex = 0
                    ghostPoints += 100
                    // console.log('1',ghostPoints)
                    score += ghostPoints
                    scoreDisplay.innerHTML = score
                    rewardedPoints = 1

                    squares[ghosts[j].currentIndex].classList.remove(ghosts[j].className, 'ghost', 'scared-ghost')
                    ghosts[j].currentIndex = ghosts[j].startIndex
                    squares[ghosts[j].currentIndex].classList.add(ghosts[j].className, 'ghost')
                    ghosts[j].isScared = false
                    startGhost(ghosts[j])


                    // for (let i = 0; i < ghosts.length; i++) {
                    //     if (ghosts[i].currentIndex == pacmanCurrentIndex) {
                    //         squares[ghosts[i].currentIndex].classList.remove(ghosts[i].className, 'ghost', 'scared-ghost')
                    //         ghosts[i].currentIndex = ghosts[i].startIndex
                    //         squares[ghosts[i].currentIndex].classList.add(ghosts[i].className, 'ghost')
                    //         ghosts[i].isScared = false
                    //         clearInterval(ghosts[i].timerId)
                    //         startGhost(ghosts[i])
                        
                    //     }
                    // }
                }
            }
            
    }

    for (let j = 0; j < ghosts.length; j++) {
        if ((pacmanPrevIndex == ghosts[j].prevIndex) && rewardedPoints == 0 && isScared) {
            clearInterval(ghosts[j].timerId)
            ghosts[j].prevIndex = 0
            ghostPoints += 100
            // console.log('2',ghostPoints)
            score += ghostPoints
            scoreDisplay.innerHTML = score

            squares[ghosts[j].currentIndex].classList.remove(ghosts[j].className, 'ghost', 'scared-ghost')
            ghosts[j].currentIndex = ghosts[j].startIndex
            squares[ghosts[j].currentIndex].classList.add(ghosts[j].className, 'ghost')
            ghosts[j].isScared = false
            startGhost(ghosts[j])

            // for (let i = 0; i < ghosts.length; i++) {
            //     if (ghosts[i].currentIndex == pacmanCurrentIndex) {
            //         squares[ghosts[i].currentIndex].classList.remove(ghosts[i].className, 'ghost', 'scared-ghost')
            //         ghosts[i].currentIndex = ghosts[i].startIndex
            //         squares[ghosts[i].currentIndex].classList.add(ghosts[i].className, 'ghost')
            //         ghosts[i].isScared = false
            //         clearInterval(ghosts[i].timerId)
            //         startGhost(ghosts[i])
                
            //     }
            // }

        }
    } 
    rewardedPoints = 0  
}

// function pacmanCaught(ghost) {
//     if (squares[ghost.currentIndex].classList.contains('pacman') && 
//         !squares[ghost.currentIndex].classList.contains('scared-ghost')) {

//             ghosts.forEach(ghost => clearInterval(ghost.timerId))

//             direction = 0
//             gameOver = 1

//             if (score > highscore) {
//                 highscore = score
//                 highscoreDisplay.innerHTML = highscore
//             }

//             clearInterval(fruit)
//             savedGrid = grid.innerHTML
//             // savedSquares = squares
//             grid.innerHTML = ''
//             grid.classList.add('hidden')
//             savedSquares = squares
//             squares = []
//             boxLoss.style.display = "block"
//             let gif = setInterval(function() {
//                 boxLoss.style.display = "none"
//                 // squares = savedSquares
//                 grid.innerHTML = savedGrid
//                 grid.classList.remove('hidden')
//                 // grid.classList.add('active')
//                 squares = savedSquares
//                 savedSquares = []
//                 clearInterval(gif)
//             }, 3500)

//             fruitPoints = 0

//             //remove eventlistener from our control function
//             document.removeEventListener('keydown', control)
//             //tell user the game is over   
//             messageDisplay.innerHTML = 'YOU LOST'
//             clearInterval(timer)
//             // clearInterval(constantTimer)

//             // startBtn.classList.remove('active')
//             // startBtn.classList.add('hidden')
//             restartBtn.classList.remove('hidden')
//             restartBtn.classList.add('active')
//             start = 0
//     }
// }

function unScareGhosts() {
    if (gameOver === 1) {
        ghosts.forEach(ghost => ghost.isScared = false)
        // ghosts.forEach(ghost => squares[ghost.currentIndex].classList.remove('scared-ghost'))
        ghosts.forEach(ghost => clearInterval(ghost.timerId))
        ghosts.forEach(ghost => clearInterval(ghost.constantTimer))
    }
    // else if (alreadyEaten === 1) {
    //     ghosts.forEach(ghost => clearInterval(ghost.timerId))
    //     ghosts.forEach(ghost => ghost.timerId = setInterval(function() {ghostMovement(ghost, ghost.speed, direction)}, ghost.speed))
    //     ghosts.forEach(ghost => ghost.speed = ghost.savedSpeed)
    //     // ghosts.forEach(ghost => squares[ghost.currentIndex].classList.remove('scared-ghost'))
    // }
    else {
        // if (alreadyEaten === 1) {
        //     ghosts.forEach(ghost => ghost.isScared = false)
        //     ghosts.forEach(ghost => squares[ghost.currentIndex].classList.remove('scared-ghost'))
        // }
        ghosts.forEach(ghost => ghost.isScared = false)
        ghosts.forEach(ghost => squares[ghost.currentIndex].classList.remove('scared-ghost'))
        ghosts.forEach(ghost => clearInterval(ghost.timerId))
        ghosts.forEach(ghost => ghost.timerId = setInterval(function() {ghostMovement(ghost, ghost.speed, direction)}, ghost.speed))
        ghosts.forEach(ghost => ghost.speed = ghost.savedSpeed)
        // console.log('after',ghosts[0].speed)
    }
    ghosts.forEach(ghost => ghost.savedSpeed = 0)
    ghosts.forEach(ghost => speedUp(ghost))
    // alreadyEaten = 0
    ghostPoints = 0
    
}

class Ghost {
    constructor(className, startIndex, speed) {
        this.className = className
        this.startIndex = startIndex
        this.speed = speed
        this.currentIndex = startIndex
        this.isScared = false
        this.timerId = NaN
        this.slowSpeed = 1000
        this.savedSpeed = 0
        this.constantTimer = 0
        this.savedDirection = 0
        this.prevIndex = 0
    }
}

const ghosts = [
    new Ghost('blinky', 349, blinkyStartSpeed),
    new Ghost('pinky', 377, pinkyStartSpeed),
    new Ghost('inky', 350, inkyStartSpeed),
    new Ghost('clyde', 378, clydeStartSpeed)
]

//draw my ghosts onto my grid
ghosts.forEach(ghost => {
    squares[ghost.currentIndex].classList.add(ghost.className)
    squares[ghost.currentIndex].classList.add('ghost')
})

//move the ghosts
function ghostMovement(ghost, changingSpeed, direction) {
    //all our code    
    prevDirection = -direction 
    //Phase 1
    // if ((ghost.currentIndex == ghost.startIndex) || 
    //     (ghost.currentIndex == ghost.startIndex - width) ||
    //     ((ghost.currentIndex == ghost.startIndex - 2*width) && !squares[ghost.currentIndex + direction].classList.contains('wall'))) {
    //         direction = -width
    //         //remove any ghost
    //         squares[ghost.currentIndex].classList.remove(ghost.className)
    //         squares[ghost.currentIndex].classList.remove('ghost', 'scared-ghost')
    //         // //add direction to current Index
    //         ghost.currentIndex += direction
    //         // //add ghost class
    //         squares[ghost.currentIndex].classList.add(ghost.className)  
    //         squares[ghost.currentIndex].classList.add('ghost')  
    //         //if the ghost is currently scared 
    //         if (ghost.isScared) {
    //             squares[ghost.currentIndex].classList.add('scared-ghost')
    //         }
    // }


    if (((ghost.currentIndex == ghost.startIndex)) && ((ghost.className == 'blinky') || (ghost.className == 'inky'))) {
        direction = -width
        ghost.prevIndex = ghost.currentIndex
        //remove any ghost
        squares[ghost.currentIndex].classList.remove(ghost.className)
        squares[ghost.currentIndex].classList.remove('ghost', 'scared-ghost')
        // //add direction to current Index
        ghost.currentIndex += direction
        // //add ghost class
        squares[ghost.currentIndex].classList.add(ghost.className)  
        squares[ghost.currentIndex].classList.add('ghost')  
        //if the ghost is currently scared 
        if (ghost.isScared) {
            squares[ghost.currentIndex].classList.add('scared-ghost')
        }
    }
    else if (((ghost.currentIndex == ghost.startIndex) || (ghost.currentIndex == ghost.startIndex - width)) && ((ghost.className != 'blinky') || (ghost.className != 'inky'))) {
        direction = -width
        ghost.prevIndex = ghost.currentIndex
        //remove any ghost
        squares[ghost.currentIndex].classList.remove(ghost.className)
        squares[ghost.currentIndex].classList.remove('ghost', 'scared-ghost')
        // //add direction to current Index
        ghost.currentIndex += direction
        // //add ghost class
        squares[ghost.currentIndex].classList.add(ghost.className)  
        squares[ghost.currentIndex].classList.add('ghost')  
        //if the ghost is currently scared 
        if (ghost.isScared) {
            squares[ghost.currentIndex].classList.add('scared-ghost')
        }
    }




    //Phase 2
    else {
        clearInterval(ghost.timerId)
        const directions = [-1, +1, -width, +width]

        ghost.timerId = setInterval(function() {
            //all our code
            ghost.prevIndex = ghost.currentIndex
            //if the next square does NOT contain a wall and does not contain a ghost
            direction = ghost.savedDirection
            prevDirection = -direction
            //for tunneling
            if (ghost.currentIndex == 391 && direction == 1) {
                squares[ghost.currentIndex].classList.remove(ghost.className)
                squares[ghost.currentIndex].classList.remove('ghost', 'scared-ghost')

                ghost.currentIndex = 364

                squares[ghost.currentIndex].classList.add(ghost.className)  
                squares[ghost.currentIndex].classList.add('ghost')  
            }
            //for tunneling
            else if (ghost.currentIndex == 364 && direction == -1) {
                squares[ghost.currentIndex].classList.remove(ghost.className)
                squares[ghost.currentIndex].classList.remove('ghost', 'scared-ghost')

                ghost.currentIndex = 391

                squares[ghost.currentIndex].classList.add(ghost.className)  
                squares[ghost.currentIndex].classList.add('ghost')
            }

            //for most cases
            else {
                updatedDirections = []
                for (let i = 0; i < directions.length; i++) {
                    if (directions[i] != prevDirection &&
                        (squares[ghost.currentIndex + directions[i]].classList.contains('empty') ||
                        squares[ghost.currentIndex + directions[i]].classList.contains('pac-dot') ||
                        squares[ghost.currentIndex + directions[i]].classList.contains('power-pellet') || 
                        squares[ghost.currentIndex + directions[i]].classList.contains('pacman') ||
                        squares[ghost.currentIndex + directions[i]].classList.contains('fruit')) &&
                        !squares[ghost.currentIndex + directions[i]].classList.contains('ghost')) {
                            updatedDirections.push(directions[i])
                    }
                }
                // console.log('prev',ghost.className,prevDirection)
                // console.log(updatedDirections.length)

                if (updatedDirections.length === 0) {
                    direction = prevDirection
                }
                else {
                    direction = updatedDirections[Math.floor(Math.random() * updatedDirections.length)]
                    // console.log('Set')
                }


                
                // console.log('chosen',direction)
                // console.log(" ")
                if (squares[ghost.currentIndex + direction].classList.contains('ghost')) {
                    direction = prevDirection
                }

                //####### For moving ghost ###########
                if (gameOver == 0) {
                    //remove any ghost
                    squares[ghost.currentIndex].classList.remove(ghost.className)
                    squares[ghost.currentIndex].classList.remove('ghost', 'scared-ghost')
                    // //add direction to current Index
                    // ghostEaten()
                    if (!ghost.isScared) {
                        checkForGameOver(ghost)
                        // pacmanCaught(ghost) ********
                    }
                    // else if (ghost.isScared) {
                    //     ghostEaten()
                    // }
                    
                    if (ghost.currentIndex != ghost.startIndex) {
                        // pacmanCaught(ghost)
                        ghost.currentIndex += direction
                        // pacmanCaught(ghost)
                        if (!ghost.isScared) {
                            checkForGameOver(ghost)
                            // pacmanCaught(ghost) ********
                        }
                        // else if (ghost.isScared) {
                        //     ghostEaten()
                        // }
                        // //add ghost class
                        if (ghost.currentIndex != pacmanCurrentIndex) {
                            squares[ghost.currentIndex].classList.add(ghost.className)  
                            squares[ghost.currentIndex].classList.add('ghost')
                        }
                        
                        
                        if (ghost.isScared) {
                            ghostEaten()
                        }
                        // ghostEaten()
                        //###################################
                    }
                    
                }
                
            }

            //if the ghost is currently scared 
            if (ghost.isScared) {
                squares[ghost.currentIndex].classList.add('scared-ghost')
                // clearInterval(ghost.timerId)
            }
            
            ghost.savedDirection = direction

        }, changingSpeed )            
    }

}

function startGhost(ghost) {
    let direction = -width   //cannot remove    
    ghost.timerId = setInterval(function() {ghostMovement(ghost, ghost.speed, direction)}, ghost.speed)
}


//check for game over
function checkForGameOver(ghost) {
    //if the square pacman is in contains a ghost AND the square does NOT contain a scared ghost 
    if ((squares[pacmanCurrentIndex].classList.contains('ghost') && 
        !squares[pacmanCurrentIndex].classList.contains('scared-ghost')) || 
        (squares[ghost.currentIndex].classList.contains('pacman') && 
        !squares[ghost.currentIndex].classList.contains('scared-ghost'))) {
            //for each ghost - we need to stop it moving
            ghosts.forEach(ghost => clearInterval(ghost.timerId))
        
            direction = 0
            gameOver = 1

            if (score > highscore) {
                highscore = score
                highscoreDisplay.innerHTML = highscore
            }

            savedGrid = grid.innerHTML
            grid.innerHTML = ''
            grid.classList.add('hidden')
            savedSquares = squares
            squares = []
            boxLoss.style.display = "block"
            let gif = setInterval(function() {
                boxLoss.style.display = "none"
                // squares = savedSquares
                grid.innerHTML = savedGrid
                grid.classList.remove('hidden')
                // grid.classList.add('active')
                squares = savedSquares
                savedSquares = []
                clearInterval(gif)
                restartBtn.classList.remove('hidden')
                restartBtn.classList.add('active')
            }, 3500)

            fruitPoints = 0

            //remove eventlistener from our control function
            document.removeEventListener('keydown', control)
            //tell user the game is over   
            messageDisplay.innerHTML = 'YOU LOST'
            clearInterval(timer)
            clearInterval(fruit)
            // clearInterval(constantTimer)

            restartBtn.classList.remove('active')
            restartBtn.classList.add('hidden')
            // startBtn.classList.remove('active')
            // startBtn.classList.add('hidden')
            // restartBtn.classList.remove('hidden')
            // restartBtn.classList.add('active')
            start = 0
    }
}


//check for win
function checkForWin() {
    let checker = 0
    for (let i = 0; i < squares.length; i++) {
        if (squares[i].classList.contains('pac-dot') || squares[i].classList.contains('power-pellet')){
            checker = 1
        }
    }
    if (checker == 0){ //(score > 274) {
        //stop each ghost
        ghosts.forEach(ghost => clearInterval(ghost.timerId))

        direction = 0
        gameOver = 1

        if (score > highscore) {
            highscore = score
            highscoreDisplay.innerHTML = highscore
        }

        savedGrid = grid.innerHTML
        grid.innerHTML = ''
        grid.classList.add('hidden')
        savedSquares = squares
        squares = []
        boxWin.style.display = "block"
        let gif = setInterval(function() {
            boxWin.style.display = "none"
            // squares = savedSquares
            grid.innerHTML = savedGrid
            grid.classList.remove('hidden')
            // grid.classList.add('active')
            squares = savedSquares
            savedSquares = []
            clearInterval(gif)
            restartBtn.classList.remove('hidden')
            restartBtn.classList.add('active')
        }, 3500)

        //remove eventlistener from our control function
        document.removeEventListener('keydown', control)
        //tell user the game is over   
        messageDisplay.innerHTML = 'YOU WON!'
        clearInterval(timer)
        clearInterval(fruit)
        // clearInterval(constantTimer)

        restartBtn.classList.remove('active')
        restartBtn.classList.add('hidden')
        // startBtn.classList.remove('active')
        // startBtn.classList.add('hidden')
        // restartBtn.classList.remove('hidden')
        // restartBtn.classList.add('active')
        start = 0
    }
}

























































// //Does not work, working version commented out at bottom

// const width = 28
// let grid = document.querySelector('.grid')
// const scoreDisplay = document.getElementById('score')
// const highscoreDisplay = document.getElementById('highscore')
// const messageDisplay = document.getElementById('message')
// const startBtn = document.getElementById('start-btn')
// const restartBtn = document.getElementById('restart-btn')
// const blinkyStartSpeed = 200
// const pinkyStartSpeed = 400
// const inkyStartSpeed = 300
// const clydeStartSpeed = 500
// const ghostStartSpeeds = [blinkyStartSpeed, pinkyStartSpeed, inkyStartSpeed, clydeStartSpeed]

// let start = 0
// let restart = 0
// let squares = []
// let score = 0
// let highscore = 0
// let direction = 0
// let intervalTime = 300
// let timer = setInterval(move, intervalTime)
// // let pacmanArr = [490] //can probably delete
// let prevDirection = 0
// let gameOver = 0

// let constantTimer = 0
// let constantIncrease = 3000
// let speedChange = 0.9

// let alreadyEaten = 0

// // 0 - pacdots
// // 1 - wall
// // 2 - ghost lair
// // 3 - powerpellets
// // 4 - empty

// // 5 - all black (corners and a few other all black spaces on the outer rim)
// // 6 - bottom border
// // 7 - right border
// // 8 - left border
// // 9 - top border

// const layout = [
//     5,6,6,6,6,6,6,6,6,6,6,6,6,5,5,6,6,6,6,6,6,6,6,6,6,6,6,5,
//     7,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,8,
//     7,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,8,
//     7,3,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,3,8,
//     7,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,8,
//     7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,
//     7,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,8,
//     7,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,8,
//     7,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,8,
//     5,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,5,
//     5,1,1,1,1,1,0,1,1,4,4,4,4,4,4,4,4,4,4,1,1,0,1,1,1,1,1,5,
//     5,1,1,1,1,1,0,1,1,4,1,1,1,2,2,1,1,1,4,1,1,0,1,1,1,1,1,5,
//     6,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,6,
//     4,4,4,4,4,4,0,0,0,4,1,2,2,2,2,2,2,1,4,0,0,0,4,4,4,4,4,4,
//     9,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,9,
//     5,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,5,
//     5,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,5,
//     7,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,8,
//     7,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,8,
//     7,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,8,
//     7,3,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,3,8,
//     5,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,5,
//     5,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,5,
//     7,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,8,
//     7,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,8,
//     7,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,8,
//     7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,
//     5,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,5
// ]

// function move() {
//     if (start === 1) {

//         if (
//             (squares[pacmanCurrentIndex + direction].classList.contains('wall') && direction == 1 && pacmanCurrentIndex != 391) ||
//             (squares[pacmanCurrentIndex + direction].classList.contains('wall') && direction == -1 && pacmanCurrentIndex != 364) ||
//             (squares[pacmanCurrentIndex + direction].classList.contains('wall') && direction == width) ||
//             (squares[pacmanCurrentIndex + direction].classList.contains('wall') && direction == -width) || 
//             (squares[pacmanCurrentIndex + direction].classList.contains('ghost-lair') && direction == 1) ||
//             (squares[pacmanCurrentIndex + direction].classList.contains('ghost-lair') && direction == -1) ||
//             (squares[pacmanCurrentIndex + direction].classList.contains('ghost-lair') && direction == width) ||
//             (squares[pacmanCurrentIndex + direction].classList.contains('ghost-lair') && direction == -width)
//              ) {
//                 direction = 0
//                 clearInterval(timer)

//         }

//         squares[pacmanCurrentIndex].classList.remove('pacman')
//         squares[pacmanCurrentIndex].classList.add('empty')

//         if (pacmanCurrentIndex == 391 && direction == 1) {
//             pacmanCurrentIndex = 364
//         }
//         else if (pacmanCurrentIndex == 364 && direction == -1) {
//             pacmanCurrentIndex = 391
//         } 
//         else {
//             pacmanCurrentIndex += direction
//         }

//         pacDotEaten()
//         powerPelletEaten()
//         ghostEaten()

//         if (squares[pacmanCurrentIndex].classList.contains('empty')) {
//             squares[pacmanCurrentIndex].classList.remove('empty')
//             clearInterval(timer)
//             timer = setInterval(move, intervalTime)
//         }
//         else if (squares[pacmanCurrentIndex].classList.contains('pac-dot')) {
//             squares[pacmanCurrentIndex].classList.remove('pac-dot')
//             clearInterval(timer)
//             timer = setInterval(move, intervalTime)
//         }
//         else if (squares[pacmanCurrentIndex].classList.contains('power-pellet')) {
//             squares[pacmanCurrentIndex].classList.remove('power-pellet')
//             clearInterval(timer)
//             timer = setInterval(move, intervalTime)
//         }
//         else if (squares[pacmanCurrentIndex].classList.contains('ghost-lair')) {
//             squares[pacmanCurrentIndex].classList.remove('ghost-lair')
//             clearInterval(timer)
//             timer = setInterval(move, intervalTime)
//         }
//         squares[pacmanCurrentIndex].classList.add('pacman')
//         checkForWin()
//         checkForGameOver()
//     }
// }

// // 0 - pacdots
// // 1 - wall
// // 2 - ghost lair
// // 3 - powerpellets
// // 4 - empty

// //create board
// function createBoard() {
//     for (let i = 0; i < layout.length; i++) {
//         //create a square 
//         const square = document.createElement('div')
//         //put square in grid 
//         grid.appendChild(square)
//         //put square in squares array
//         squares.push(square)

//         if (layout[i] === 0) {
//             squares[i].classList.add('pac-dot')
//         } else if (layout[i] === 1) {
//             squares[i].classList.add('wall')

//             // 3 borders
//             if (layout[i - width] != 1 && layout[i - width] < 5 &&
//                 layout[i + 1] != 1 && layout[i + 1] < 5 && 
//                 layout[i + width] != 1 && layout[i + width] < 5) {
//                     squares[i].classList.add('border-top-right-bottom')
//             }
//             else if (layout[i + 1] != 1 && layout[i + 1] < 5 && 
//                 layout[i + width] != 1 && layout[i + width] < 5 && 
//                 layout[i - 1] != 1 && layout[i - 1] < 5) {
//                     squares[i].classList.add('border-right-bottom-left')
//             }
//             else if (layout[i + width] != 1 && layout[i + width] < 5 && 
//                 layout[i - 1] != 1 && layout[i - 1] < 5 && 
//                 layout[i - width] != 1 && layout[i - width] < 5) {
//                     squares[i].classList.add('border-bottom-left-top')
//             }
//             else if (layout[i - 1] != 1 && layout[i - 1] < 5 && 
//                 layout[i - width] != 1 && layout[i - width] < 5 &&
//                 layout[i + 1] != 1 && layout[i + 1] < 5) {
//                     squares[i].classList.add('border-left-top-right')
//             }

//             // 2 borders
//             else if (layout[i - width] != 1 && layout[i - width] < 5 &&
//                 layout[i + 1] != 1 && layout[i + 1] < 5) {
//                     squares[i].classList.add('border-top-right')
//             }
//             else if (layout[i + width] != 1 && layout[i + width] < 5 && 
//                 layout[i + 1] != 1 && layout[i + 1] < 5) {
//                     squares[i].classList.add('border-bottom-right')
//             }
//             else if (layout[i - width] != 1 && layout[i - width] < 5 &&
//                 layout[i - 1] != 1 && layout[i - 1] < 5) {
//                     squares[i].classList.add('border-top-left')
//             }
//             else if (layout[i + width] != 1 && layout[i + width] < 5 && 
//                 layout[i - 1] != 1 && layout[i - 1] < 5) {
//                     squares[i].classList.add('border-bottom-left')
//             }
//             else if (layout[i - width] != 1 && layout[i - width] < 5 &&
//                 layout[i + width] != 1 && layout[i + width] < 5) {
//                     squares[i].classList.add('border-top-bottom')
//             }
//             else if (layout[i - 1] != 1 && layout[i - 1] < 5 &&
//                 layout[i + 1] != 1 && layout[i + 1] < 5) {
//                     squares[i].classList.add('border-left-right')
//             }

//             // 1 border
//             else if (layout[i - width] != 1 && layout[i - width] < 5) {
//                 squares[i].classList.add('border-top')
//             }
//             else if (layout[i + 1] != 1 && layout[i + 1] < 5) {
//                 squares[i].classList.add('border-right')
//             }
//             else if (layout[i + width] != 1 && layout[i + width] < 5) {
//                 squares[i].classList.add('border-bottom')
//             }
//             else if (layout[i - 1] != 1 && layout[i - 1] < 5) {
//                 squares[i].classList.add('border-left')
//             }
            
//         } else if (layout[i] === 2) {
//             squares[i].classList.add('ghost-lair')
//         } else if (layout[i] === 3) {
//             squares[i].classList.add('power-pellet')
//         } else if (layout[i] === 4) {
//             squares[i].classList.add('empty')
//         } 

//         //outside game border
//         else if (layout[i] === 5) {
//             squares[i].classList.add('wall')
//         }
//         else if (layout[i] === 6) {
//             squares[i].classList.add('wall')
//             squares[i].classList.add('border-bottom')
//         }
//         else if (layout[i] === 7) {
//             squares[i].classList.add('wall')
//             squares[i].classList.add('border-right')
//         }
//         else if (layout[i] === 8) {
//             squares[i].classList.add('wall')
//             squares[i].classList.add('border-left')
//         }
//         else if (layout[i] === 9) {
//             squares[i].classList.add('wall')
//             squares[i].classList.add('border-top')
//         }
//     }
// }
// createBoard()





// // on every speed increase, the direction changes

// startBtn.addEventListener('click', function() {
//     start = 1
//     ghosts.forEach(ghost => startGhost(ghost))
//     document.addEventListener('keydown', control)
//     ghosts.forEach(ghost => speedUp(ghost))
// })

// function speedUp(ghost) {
//     // ghost.timerId = ghost.timerId*speedChange
//     if (!ghost.isScared && gameOver === 0) {
//         // clearInterval(ghost.constantTimer)
//         // console.log('in speed up', ghost.speed)
//         ghost.constantTimer = setInterval(function() {speedUpTimer(ghost)}, constantIncrease)
//     }
//     else if (gameOver === 1) {
//         clearInterval(ghost.constantTimer)
//         clearInterval(ghost.timerId)
//     }
// }

// function speedUpTimer(ghost) {
//     if (gameOver === 1) {
//         clearInterval(ghost.constantTimer)
//         clearInterval(ghost.timerId)
//         // console.log('A')
//     }
//     else if (ghost.isScared) {
//         clearInterval(ghost.constantTimer)
//         // console.log('B')
//     }
//     else {
//         clearInterval(ghost.timerId)
//         clearInterval(ghost.constantTimer)
//         ghost.speed = ghostSpeed*speedChange
//         speedUp(ghost)
//         ghost.timerId = setInterval(function() {ghostMovement(ghost, ghost.speed)}, ghost.speed)
//         // console.log(ghost.className, ghost.speed)
//         console.log('C')
//     }

// }








// restartBtn.addEventListener('click', function() {
//     messageDisplay.innerHTML = ""
//     score = 0
//     scoreDisplay.innerHTML = '00'
//     squares[pacmanCurrentIndex].classList.remove('pacman')
//     ghosts.forEach(ghost => {
//         squares[ghost.currentIndex].classList.remove(ghost.className)
//         squares[ghost.currentIndex].classList.remove('ghost')
//         if (ghost.isScared) {
//             squares[ghost.currentIndex].classList.remove('scared-ghost')
//         }
//         clearInterval(ghost.constantTimer)
//         clearInterval(ghost.timerId)
//     })

//     for (let i = 0; i < ghostStartSpeeds.length; i++) {
//         ghosts[i].speed = ghostStartSpeeds[i]
//         // console.log('restarted speeds', ghosts[i].speed)
//     }
//     // console.log('restarted')












//     //remove old classes
//     grid.innerHTML = ''
//     squares = []
//     createBoard()

//     gameOver = 0
//     start = 1
//     pacmanCurrentIndex = 490
//     squares[pacmanCurrentIndex].classList.add('pacman')
//     ghosts.forEach(ghost => {
//         ghost.currentIndex = ghost.startIndex
//         squares[ghost.currentIndex].classList.add(ghost.className)
//         squares[ghost.currentIndex].classList.add('ghost')
//     })

//     ghosts.forEach(ghost => startGhost(ghost))

//     ghosts.forEach(ghost => speedUp(ghost))

//     document.addEventListener('keydown', control)
// })

// // down - 40
// // up key - 38
// // left - 37
// // right - 39

// //starting position of pacman 
// let pacmanCurrentIndex = 490
// squares[pacmanCurrentIndex].classList.add('pacman')

// var lastEvent
// function control(e) {
//     squares[pacmanCurrentIndex].classList.remove('pacman')

//     if (lastEvent && lastEvent.keyCode == e.keyCode) {
//         squares[pacmanCurrentIndex].classList.add('pacman')
//     }
//     else {
//         lastEvent = e

//         //Version 2
//         switch(e.keyCode) {
//             case 40:
//             // console.log('pressed down')
//             direction = width
//             move()
//             break

//             case 38:
//             // console.log('pressed up')
//             direction = -width
//             move()
//             break

//             case 37: 
//             // console.log('pressed left')
//             direction = -1
//             move()
//             break

//             case 39:
//             // console.log('pressed right')
//             direction = 1
//             move()
//             break
//         }
//     }
// }

// // document.addEventListener('keydown', control)


// function pacDotEaten() {
//     if (squares[pacmanCurrentIndex].classList.contains('pac-dot')) {
//         // squares[pacmanCurrentIndex].classList.remove('pac-dot')
//         // squares[pacmanCurrentIndex].classList.add('empty')
//         score++
//         scoreDisplay.innerHTML = score
//     }
// }

// function powerPelletEaten() {
//     //if square pacman is in contains a power pellet
//     if (squares[pacmanCurrentIndex].classList.contains('power-pellet')) {
//         //remove power pellet class
//         // squares[pacmanCurrentIndex].classList.remove('power-pellet')
//         // squares[pacmanCurrentIndex].classList.add('empty')
//         //add a score of 10
//         score +=10
//         scoreDisplay.innerHTML = score

//         ghosts.forEach(ghost => clearInterval(ghost.timerId))
//         ghosts.forEach(ghost => clearInterval(ghost.constantTimer))

//         //change each of the four ghosts to isScared
//         ghosts.forEach(ghost => ghost.isScared = true)
//         ghosts.forEach(ghost => squares[ghost.currentIndex].classList.add('scared-ghost'))
//         // ghosts change color but do not start moving right away ################


//         // console.log('before',ghosts[0].speed)
//         // ghosts.forEach(ghost => ghost.speed = 3000)

//         // ghosts.forEach(ghost => clearInterval(ghost.timerId))
//         // ghosts.forEach(ghost => clearInterval(ghost.constantTimer))
//         ghosts.forEach(ghost => ghost.savedSpeed = ghost.speed)
//         ghosts.forEach(ghost => ghost.speed = ghost.slowSpeed)
//         ghosts.forEach(ghost => ghost.timerId = setInterval(function() {ghostMovement(ghost, ghost.slowSpeed)}, ghost.slowSpeed))


//         //use setTimeout to unscare ghosts after 10 seconds
//         alreadyEaten = 1  
//         setTimeout(unScareGhosts, 10000)  
//     }
// }

// function ghostEaten() {
//     if (squares[pacmanCurrentIndex].classList.contains('ghost') && 
//         squares[pacmanCurrentIndex].classList.contains('scared-ghost')) {
//             score +=100
//             scoreDisplay.innerHTML = score
//             for (let i = 0; i < ghosts.length; i++) {
//                 if (ghosts[i].currentIndex == pacmanCurrentIndex) {
//                     squares[ghosts[i].currentIndex].classList.remove(ghosts[i].className, 'ghost', 'scared-ghost')
//                     ghosts[i].currentIndex = ghosts[i].startIndex
//                     squares[ghosts[i].currentIndex].classList.add(ghosts[i].className, 'ghost')
//                     ghosts[i].isScared = false
//                     clearInterval(ghosts[i].timerId)
//                     startGhost(ghosts[i])

//                 }
//             }
//     }
// }

// function pacmanCaught(ghost) {
//     if (squares[ghost.currentIndex].classList.contains('pacman') && 
//         !squares[ghost.currentIndex].classList.contains('scared-ghost')) {

//             ghosts.forEach(ghost => clearInterval(ghost.timerId))


//             ghosts.forEach(ghost => ghost.direction = 0)


//             direction = 0
//             gameOver = 1

//             if (score > highscore) {
//                 highscore = score
//                 highscoreDisplay.innerHTML = highscore
//             }

//             //remove eventlistener from our control function
//             document.removeEventListener('keydown', control)
//             //tell user the game is over   
//             messageDisplay.innerHTML = 'YOU LOST'
//             clearInterval(timer)
//             // clearInterval(constantTimer)

//             startBtn.classList.remove('active')
//             startBtn.classList.add('hidden')
//             restartBtn.classList.remove('hidden')
//             restartBtn.classList.add('active')
//             start = 0
//     }
// }




// function unScareGhosts() {
//     if (gameOver === 1) {
//         ghosts.forEach(ghost => ghost.isScared = false)
//         // ghosts.forEach(ghost => squares[ghost.currentIndex].classList.remove('scared-ghost'))
//         ghosts.forEach(ghost => clearInterval(ghost.timerId))
//         ghosts.forEach(ghost => clearInterval(ghost.constantTimer))
//     }
//     // else if (alreadyEaten === 1) {
//     //     ghosts.forEach(ghost => clearInterval(ghost.timerId))
//     //     ghosts.forEach(ghost => ghost.timerId = setInterval(function() {ghostMovement(ghost, ghost.speed, direction)}, ghost.speed))
//     //     ghosts.forEach(ghost => ghost.speed = ghost.savedSpeed)
//     //     // ghosts.forEach(ghost => squares[ghost.currentIndex].classList.remove('scared-ghost'))
//     // }
//     else {
//         if (alreadyEaten === 1) {
//             ghosts.forEach(ghost => ghost.isScared = false)
//             ghosts.forEach(ghost => squares[ghost.currentIndex].classList.remove('scared-ghost'))
//         }
//         ghosts.forEach(ghost => clearInterval(ghost.timerId))
//         ghosts.forEach(ghost => ghost.timerId = setInterval(function() {ghostMovement(ghost, ghost.speed)}, ghost.speed))
//         ghosts.forEach(ghost => ghost.speed = ghost.savedSpeed)
//         // console.log('after',ghosts[0].speed)
//     }
//     ghosts.forEach(ghost => ghost.savedSpeed = 0)
//     ghosts.forEach(ghost => speedUp(ghost))
//     alreadyEaten = 0
    
// }


// class Ghost {
//     constructor(className, startIndex, speed) {
//         this.className = className
//         this.startIndex = startIndex
//         this.speed = speed
//         this.currentIndex = startIndex
//         this.isScared = false
//         this.timerId = NaN
//         this.slowSpeed = 1000
//         this.savedSpeed = 0
//         this.constantTimer = 0
//         this.direction = 0
//     }
// }

// const ghosts = [
//     new Ghost('blinky', 349, blinkyStartSpeed),
//     new Ghost('pinky', 377, pinkyStartSpeed),
//     new Ghost('inky', 350, inkyStartSpeed),
//     new Ghost('clyde', 378, clydeStartSpeed)
// ]

// //draw my ghosts onto my grid
// ghosts.forEach(ghost => {
//     squares[ghost.currentIndex].classList.add(ghost.className)
//     squares[ghost.currentIndex].classList.add('ghost')
// })

// //move the ghosts
// // ghosts.forEach(ghost => startGhost(ghost))




// function ghostMovement(ghost, changingSpeed) {
//     //all our code
//     // let direction = -width   //cannot remove 
//     console.log(ghost.className, ghost.direction)  
//     prevDirection = -ghost.direction 
//     // prevDirection = -direction 

//     //Phase 1
//     if ((ghost.currentIndex == ghost.startIndex) || 
//         (ghost.currentIndex == ghost.startIndex - width) ||
//         ((ghost.currentIndex == ghost.startIndex - 2*width) && !squares[ghost.currentIndex + ghost.direction].classList.contains('wall'))) {
//             ghost.direction = -width
//             // direction = -width
//             //remove any ghost
//             squares[ghost.currentIndex].classList.remove(ghost.className)
//             squares[ghost.currentIndex].classList.remove('ghost', 'scared-ghost')
//             // //add direction to current Index
//             ghost.currentIndex += ghost.direction
//             // ghost.currentIndex += direction
//             // //add ghost class
//             squares[ghost.currentIndex].classList.add(ghost.className)  
//             squares[ghost.currentIndex].classList.add('ghost')  
//             //if the ghost is currently scared 
//             if (ghost.isScared) {
//                 squares[ghost.currentIndex].classList.add('scared-ghost')
//             }
//     }

//     //Phase 2
//     else {
//         clearInterval(ghost.timerId)
//         const directions = [-1, +1, -width, +width]

//         // //check boxes around currentindex
//         // prevDirection = -direction
//         // let updatedDirections = []
//         // for (let i = 0; i < directions.length; i++) {
//         //     if (directions[i] != prevDirection &&
//         //         (squares[ghost.currentIndex + directions[i]].classList.contains('empty') ||
//         //         squares[ghost.currentIndex + directions[i]].classList.contains('pac-dot') ||
//         //         squares[ghost.currentIndex + directions[i]].classList.contains('power-pellet') || 
//         //         squares[ghost.currentIndex + directions[i]].classList.contains('pacman')) &&
//         //         !squares[ghost.currentIndex + directions[i]].classList.contains('ghost')) {
//         //             updatedDirections.push(directions[i])
//         //     }
//         // }
        
//         // direction = updatedDirections[Math.floor(Math.random() * updatedDirections.length)]
        
//         ghost.timerId = setInterval(function() {
//             //all our code
//             //if the next square does NOT contain a wall and does not contain a ghost
//             prevDirection = -ghost.direction
//             // prevDirection = -direction
//             //for tunneling
//             if (ghost.currentIndex == 391 && direction == 1) {
//                 squares[ghost.currentIndex].classList.remove(ghost.className)
//                 squares[ghost.currentIndex].classList.remove('ghost', 'scared-ghost')

//                 ghost.currentIndex = 364

//                 squares[ghost.currentIndex].classList.add(ghost.className)  
//                 squares[ghost.currentIndex].classList.add('ghost')  
//             }
//             //for tunneling
//             else if (ghost.currentIndex == 364 && direction == -1) {
//                 squares[ghost.currentIndex].classList.remove(ghost.className)
//                 squares[ghost.currentIndex].classList.remove('ghost', 'scared-ghost')

//                 ghost.currentIndex = 391

//                 squares[ghost.currentIndex].classList.add(ghost.className)  
//                 squares[ghost.currentIndex].classList.add('ghost')
//             }

//             //for most cases
//             else {
//                 updatedDirections = []
//                 for (let i = 0; i < directions.length; i++) {
//                     if (directions[i] != prevDirection &&
//                         (squares[ghost.currentIndex + directions[i]].classList.contains('empty') ||
//                         squares[ghost.currentIndex + directions[i]].classList.contains('pac-dot') ||
//                         squares[ghost.currentIndex + directions[i]].classList.contains('power-pellet') || 
//                         squares[ghost.currentIndex + directions[i]].classList.contains('pacman')) &&
//                         !squares[ghost.currentIndex + directions[i]].classList.contains('ghost')) {
//                             updatedDirections.push(directions[i])
//                     }
//                 }
//                 // console.log('prev',ghost.className,prevDirection)
//                 // console.log(updatedDirections.length)

//                 if (updatedDirections.length === 0) {
//                     ghost.direction = prevDirection
//                     // direction = prevDirection
//                 }
//                 else {
//                     direction = updatedDirections[Math.floor(Math.random() * updatedDirections.length)]
//                 }


                
//                 // console.log('chosen',direction)
//                 // console.log(" ")
//                 // if (squares[ghost.currentIndex + direction].classList.contains('ghost')) {
//                 if (squares[ghost.currentIndex + ghost.direction].classList.contains('ghost')) {
//                     ghost.direction = prevDirection
//                     // direction = prevDirection
//                 }

//                 //####### For moving ghost ###########
//                 //remove any ghost
//                 squares[ghost.currentIndex].classList.remove(ghost.className)
//                 squares[ghost.currentIndex].classList.remove('ghost', 'scared-ghost')
//                 // //add direction to current Index
//                 // ghostEaten()
//                 if (!ghost.isScared) {
//                     pacmanCaught(ghost)
//                 }
//                 // pacmanCaught(ghost)
//                 ghost.currentIndex += ghost.direction
//                 // ghost.currentIndex += direction
//                 // pacmanCaught(ghost)
//                 if (!ghost.isScared) {
//                     pacmanCaught(ghost)
//                 }
                
//                 // //add ghost class
//                 squares[ghost.currentIndex].classList.add(ghost.className)  
//                 squares[ghost.currentIndex].classList.add('ghost')  
//                 //###################################
//             }

//             //if the ghost is currently scared 
//             if (ghost.isScared) {
//                 squares[ghost.currentIndex].classList.add('scared-ghost')
//                 // clearInterval(ghost.timerId)
//             }

//         }, changingSpeed )            
//     }

// }

// function startGhost(ghost) {
//     // ghost.direction = -width
//     // let direction = -width   //cannot remove    
//     ghost.timerId = setInterval(function() {ghostMovement(ghost, ghost.speed)}, ghost.speed)
// }


// //check for game over
// function checkForGameOver() {
//     //if the square pacman is in contains a ghost AND the square does NOT contain a scared ghost 
//     if (
//         squares[pacmanCurrentIndex].classList.contains('ghost') && 
//         !squares[pacmanCurrentIndex].classList.contains('scared-ghost')) {
//             //for each ghost - we need to stop it moving
//             ghosts.forEach(ghost => clearInterval(ghost.timerId))


//             ghosts.forEach(ghost => ghost.direction = 0)


//             direction = 0
//             gameOver = 1

//             if (score > highscore) {
//                 highscore = score
//                 highscoreDisplay.innerHTML = highscore
//             }

//             //remove eventlistener from our control function
//             document.removeEventListener('keydown', control)
//             //tell user the game is over   
//             messageDisplay.innerHTML = 'YOU LOST'
//             clearInterval(timer)
//             // clearInterval(constantTimer)

//             startBtn.classList.remove('active')
//             startBtn.classList.add('hidden')
//             restartBtn.classList.remove('hidden')
//             restartBtn.classList.add('active')
//             start = 0
//     }
// }

// //check for win
// function checkForWin() {
//     let checker = 0
//     for (let i = 0; i < squares.length; i++) {
//         if (squares[i].classList.contains('pac-dot') || squares[i].classList.contains('power-pellet')){
//             checker = 1
//         }
//     }
//     if (checker == 0){ //(score > 274) {
//         //stop each ghost
//         ghosts.forEach(ghost => clearInterval(ghost.timerId))


//         ghosts.forEach(ghost => ghost.direction = 0)


//         direction = 0
//         gameOver = 1

//         if (score > highscore) {
//             highscore = score
//             highscoreDisplay.innerHTML = highscore
//         }

//         //remove eventlistener from our control function
//         document.removeEventListener('keydown', control)
//         //tell user the game is over   
//         messageDisplay.innerHTML = 'YOU WON!'
//         clearInterval(timer)
//         // clearInterval(constantTimer)

//         startBtn.classList.remove('active')
//         startBtn.classList.add('hidden')
//         restartBtn.classList.remove('hidden')
//         restartBtn.classList.add('active')
//         start = 0
//     }
// }









// //Original layout
// // 0 - pacdots
// // 1 - wall
// // 2 - ghost lair
// // 3 - powerpellets
// // 4 - empty

// const layout = [
//     1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
//     1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
//     1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
//     1,3,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,3,1,
//     1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
//     1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
//     1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
//     1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
//     1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
//     1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,
//     1,1,1,1,1,1,0,1,1,4,4,4,4,4,4,4,4,4,4,1,1,0,1,1,1,1,1,1,
//     1,1,1,1,1,1,0,1,1,4,1,1,1,2,2,1,1,1,4,1,1,0,1,1,1,1,1,1,
//     1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
//     4,4,4,4,4,4,0,0,0,4,1,2,2,2,2,2,2,1,4,0,0,0,4,4,4,4,4,4,
//     1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
//     1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
//     1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
//     1,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,1,
//     1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
//     1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
//     1,3,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,3,1,
//     1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
//     1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
//     1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1,
//     1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
//     1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
//     1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
//     1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
// ]














































































// //This works but the ghosts change direction every 5s
// const width = 28
// let grid = document.querySelector('.grid')
// const scoreDisplay = document.getElementById('score')
// const highscoreDisplay = document.getElementById('highscore')
// const messageDisplay = document.getElementById('message')
// const startBtn = document.getElementById('start-btn')
// const restartBtn = document.getElementById('restart-btn')
// const blinkyStartSpeed = 200
// const pinkyStartSpeed = 400
// const inkyStartSpeed = 300
// const clydeStartSpeed = 500
// const ghostStartSpeeds = [blinkyStartSpeed, pinkyStartSpeed, inkyStartSpeed, clydeStartSpeed]

// let start = 0
// let restart = 0
// let squares = []
// let score = 0
// let highscore = 0
// let direction = 0
// let intervalTime = 300
// let timer = setInterval(move, intervalTime)
// // let pacmanArr = [490] //can probably delete
// let prevDirection = 0
// let gameOver = 0

// let constantTimer = 0
// let constantIncrease = 3000
// let speedChange = 0.9

// let alreadyEaten = 0

// // 0 - pacdots
// // 1 - wall
// // 2 - ghost lair
// // 3 - powerpellets
// // 4 - empty

// // 5 - all black (corners and a few other all black spaces on the outer rim)
// // 6 - bottom border
// // 7 - right border
// // 8 - left border
// // 9 - top border

// const layout = [
//     5,6,6,6,6,6,6,6,6,6,6,6,6,5,5,6,6,6,6,6,6,6,6,6,6,6,6,5,
//     7,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,8,
//     7,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,8,
//     7,3,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,3,8,
//     7,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,8,
//     7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,
//     7,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,8,
//     7,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,8,
//     7,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,8,
//     5,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,5,
//     5,1,1,1,1,1,0,1,1,4,4,4,4,4,4,4,4,4,4,1,1,0,1,1,1,1,1,5,
//     5,1,1,1,1,1,0,1,1,4,1,1,1,2,2,1,1,1,4,1,1,0,1,1,1,1,1,5,
//     6,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,6,
//     4,4,4,4,4,4,0,0,0,4,1,2,2,2,2,2,2,1,4,0,0,0,4,4,4,4,4,4,
//     9,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,9,
//     5,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,5,
//     5,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,5,
//     7,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,8,
//     7,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,8,
//     7,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,8,
//     7,3,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,3,8,
//     5,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,5,
//     5,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,5,
//     7,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,8,
//     7,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,8,
//     7,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,8,
//     7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,
//     5,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,5
// ]

// function move() {
//     if (start === 1) {

//         if (
//             (squares[pacmanCurrentIndex + direction].classList.contains('wall') && direction == 1 && pacmanCurrentIndex != 391) ||
//             (squares[pacmanCurrentIndex + direction].classList.contains('wall') && direction == -1 && pacmanCurrentIndex != 364) ||
//             (squares[pacmanCurrentIndex + direction].classList.contains('wall') && direction == width) ||
//             (squares[pacmanCurrentIndex + direction].classList.contains('wall') && direction == -width) || 
//             (squares[pacmanCurrentIndex + direction].classList.contains('ghost-lair') && direction == 1) ||
//             (squares[pacmanCurrentIndex + direction].classList.contains('ghost-lair') && direction == -1) ||
//             (squares[pacmanCurrentIndex + direction].classList.contains('ghost-lair') && direction == width) ||
//             (squares[pacmanCurrentIndex + direction].classList.contains('ghost-lair') && direction == -width)
//              ) {
//                 direction = 0
//                 clearInterval(timer)

//         }

//         squares[pacmanCurrentIndex].classList.remove('pacman')
//         squares[pacmanCurrentIndex].classList.add('empty')

//         if (pacmanCurrentIndex == 391 && direction == 1) {
//             pacmanCurrentIndex = 364
//         }
//         else if (pacmanCurrentIndex == 364 && direction == -1) {
//             pacmanCurrentIndex = 391
//         } 
//         else {
//             pacmanCurrentIndex += direction
//         }

//         pacDotEaten()
//         powerPelletEaten()
//         ghostEaten()

//         if (squares[pacmanCurrentIndex].classList.contains('empty')) {
//             squares[pacmanCurrentIndex].classList.remove('empty')
//             clearInterval(timer)
//             timer = setInterval(move, intervalTime)
//         }
//         else if (squares[pacmanCurrentIndex].classList.contains('pac-dot')) {
//             squares[pacmanCurrentIndex].classList.remove('pac-dot')
//             clearInterval(timer)
//             timer = setInterval(move, intervalTime)
//         }
//         else if (squares[pacmanCurrentIndex].classList.contains('power-pellet')) {
//             squares[pacmanCurrentIndex].classList.remove('power-pellet')
//             clearInterval(timer)
//             timer = setInterval(move, intervalTime)
//         }
//         else if (squares[pacmanCurrentIndex].classList.contains('ghost-lair')) {
//             squares[pacmanCurrentIndex].classList.remove('ghost-lair')
//             clearInterval(timer)
//             timer = setInterval(move, intervalTime)
//         }
//         squares[pacmanCurrentIndex].classList.add('pacman')
//         checkForWin()
//         checkForGameOver()
//     }
// }

// // 0 - pacdots
// // 1 - wall
// // 2 - ghost lair
// // 3 - powerpellets
// // 4 - empty

// //create board
// function createBoard() {
//     for (let i = 0; i < layout.length; i++) {
//         //create a square 
//         const square = document.createElement('div')
//         //put square in grid 
//         grid.appendChild(square)
//         //put square in squares array
//         squares.push(square)

//         if (layout[i] === 0) {
//             squares[i].classList.add('pac-dot')
//         } else if (layout[i] === 1) {
//             squares[i].classList.add('wall')

//             // 3 borders
//             if (layout[i - width] != 1 && layout[i - width] < 5 &&
//                 layout[i + 1] != 1 && layout[i + 1] < 5 && 
//                 layout[i + width] != 1 && layout[i + width] < 5) {
//                     squares[i].classList.add('border-top-right-bottom')
//             }
//             else if (layout[i + 1] != 1 && layout[i + 1] < 5 && 
//                 layout[i + width] != 1 && layout[i + width] < 5 && 
//                 layout[i - 1] != 1 && layout[i - 1] < 5) {
//                     squares[i].classList.add('border-right-bottom-left')
//             }
//             else if (layout[i + width] != 1 && layout[i + width] < 5 && 
//                 layout[i - 1] != 1 && layout[i - 1] < 5 && 
//                 layout[i - width] != 1 && layout[i - width] < 5) {
//                     squares[i].classList.add('border-bottom-left-top')
//             }
//             else if (layout[i - 1] != 1 && layout[i - 1] < 5 && 
//                 layout[i - width] != 1 && layout[i - width] < 5 &&
//                 layout[i + 1] != 1 && layout[i + 1] < 5) {
//                     squares[i].classList.add('border-left-top-right')
//             }

//             // 2 borders
//             else if (layout[i - width] != 1 && layout[i - width] < 5 &&
//                 layout[i + 1] != 1 && layout[i + 1] < 5) {
//                     squares[i].classList.add('border-top-right')
//             }
//             else if (layout[i + width] != 1 && layout[i + width] < 5 && 
//                 layout[i + 1] != 1 && layout[i + 1] < 5) {
//                     squares[i].classList.add('border-bottom-right')
//             }
//             else if (layout[i - width] != 1 && layout[i - width] < 5 &&
//                 layout[i - 1] != 1 && layout[i - 1] < 5) {
//                     squares[i].classList.add('border-top-left')
//             }
//             else if (layout[i + width] != 1 && layout[i + width] < 5 && 
//                 layout[i - 1] != 1 && layout[i - 1] < 5) {
//                     squares[i].classList.add('border-bottom-left')
//             }
//             else if (layout[i - width] != 1 && layout[i - width] < 5 &&
//                 layout[i + width] != 1 && layout[i + width] < 5) {
//                     squares[i].classList.add('border-top-bottom')
//             }
//             else if (layout[i - 1] != 1 && layout[i - 1] < 5 &&
//                 layout[i + 1] != 1 && layout[i + 1] < 5) {
//                     squares[i].classList.add('border-left-right')
//             }

//             // 1 border
//             else if (layout[i - width] != 1 && layout[i - width] < 5) {
//                 squares[i].classList.add('border-top')
//             }
//             else if (layout[i + 1] != 1 && layout[i + 1] < 5) {
//                 squares[i].classList.add('border-right')
//             }
//             else if (layout[i + width] != 1 && layout[i + width] < 5) {
//                 squares[i].classList.add('border-bottom')
//             }
//             else if (layout[i - 1] != 1 && layout[i - 1] < 5) {
//                 squares[i].classList.add('border-left')
//             }
            
//         } else if (layout[i] === 2) {
//             squares[i].classList.add('ghost-lair')
//         } else if (layout[i] === 3) {
//             squares[i].classList.add('power-pellet')
//         } else if (layout[i] === 4) {
//             squares[i].classList.add('empty')
//         } 

//         //outside game border
//         else if (layout[i] === 5) {
//             squares[i].classList.add('wall')
//         }
//         else if (layout[i] === 6) {
//             squares[i].classList.add('wall')
//             squares[i].classList.add('border-bottom')
//         }
//         else if (layout[i] === 7) {
//             squares[i].classList.add('wall')
//             squares[i].classList.add('border-right')
//         }
//         else if (layout[i] === 8) {
//             squares[i].classList.add('wall')
//             squares[i].classList.add('border-left')
//         }
//         else if (layout[i] === 9) {
//             squares[i].classList.add('wall')
//             squares[i].classList.add('border-top')
//         }
//     }
// }
// createBoard()





// // on every speed increase, the direction changes

// startBtn.addEventListener('click', function() {
//     start = 1
//     ghosts.forEach(ghost => startGhost(ghost))
//     document.addEventListener('keydown', control)
//     ghosts.forEach(ghost => speedUp(ghost))
// })

// function speedUp(ghost) {
//     // ghost.timerId = ghost.timerId*speedChange
//     if (!ghost.isScared && gameOver === 0) {
//         // clearInterval(ghost.constantTimer)
//         // console.log('in speed up', ghost.speed)
//         ghost.constantTimer = setInterval(function() {speedUpTimer(ghost, ghost.speed, direction)}, constantIncrease)
//     }
//     else if (gameOver === 1) {
//         clearInterval(ghost.constantTimer)
//         clearInterval(ghost.timerId)
//     }
// }

// function speedUpTimer(ghost, ghostSpeed, direction) {
//     if (gameOver === 1) {
//         clearInterval(ghost.constantTimer)
//         clearInterval(ghost.timerId)
//         // console.log('A')
//     }
//     else if (ghost.isScared) {
//         clearInterval(ghost.constantTimer)
//         // console.log('B')
//     }
//     else {
//         clearInterval(ghost.timerId)
//         clearInterval(ghost.constantTimer)
//         ghost.speed = ghostSpeed*speedChange
//         speedUp(ghost)
//         ghost.timerId = setInterval(function() {ghostMovement(ghost, ghost.speed, direction)}, ghost.speed)
//         // console.log(ghost.className, ghost.speed)
//         console.log('C')
//     }

// }








// restartBtn.addEventListener('click', function() {
//     messageDisplay.innerHTML = ""
//     score = 0
//     scoreDisplay.innerHTML = '00'
//     squares[pacmanCurrentIndex].classList.remove('pacman')
//     ghosts.forEach(ghost => {
//         squares[ghost.currentIndex].classList.remove(ghost.className)
//         squares[ghost.currentIndex].classList.remove('ghost')
//         if (ghost.isScared) {
//             squares[ghost.currentIndex].classList.remove('scared-ghost')
//         }
//         clearInterval(ghost.constantTimer)
//         clearInterval(ghost.timerId)
//     })

//     for (let i = 0; i < ghostStartSpeeds.length; i++) {
//         ghosts[i].speed = ghostStartSpeeds[i]
//         // console.log('restarted speeds', ghosts[i].speed)
//     }
//     // console.log('restarted')












//     //remove old classes
//     grid.innerHTML = ''
//     squares = []
//     createBoard()

//     gameOver = 0
//     start = 1
//     pacmanCurrentIndex = 490
//     squares[pacmanCurrentIndex].classList.add('pacman')
//     ghosts.forEach(ghost => {
//         ghost.currentIndex = ghost.startIndex
//         squares[ghost.currentIndex].classList.add(ghost.className)
//         squares[ghost.currentIndex].classList.add('ghost')
//     })

//     ghosts.forEach(ghost => startGhost(ghost))

//     ghosts.forEach(ghost => speedUp(ghost))

//     document.addEventListener('keydown', control)
// })

// // down - 40
// // up key - 38
// // left - 37
// // right - 39

// //starting position of pacman 
// let pacmanCurrentIndex = 490
// squares[pacmanCurrentIndex].classList.add('pacman')

// var lastEvent
// function control(e) {
//     squares[pacmanCurrentIndex].classList.remove('pacman')

//     if (lastEvent && lastEvent.keyCode == e.keyCode) {
//         squares[pacmanCurrentIndex].classList.add('pacman')
//     }
//     else {
//         lastEvent = e

//         //Version 2
//         switch(e.keyCode) {
//             case 40:
//             // console.log('pressed down')
//             direction = width
//             move()
//             break

//             case 38:
//             // console.log('pressed up')
//             direction = -width
//             move()
//             break

//             case 37: 
//             // console.log('pressed left')
//             direction = -1
//             move()
//             break

//             case 39:
//             // console.log('pressed right')
//             direction = 1
//             move()
//             break
//         }
//     }
// }

// // document.addEventListener('keydown', control)


// function pacDotEaten() {
//     if (squares[pacmanCurrentIndex].classList.contains('pac-dot')) {
//         // squares[pacmanCurrentIndex].classList.remove('pac-dot')
//         // squares[pacmanCurrentIndex].classList.add('empty')
//         score++
//         scoreDisplay.innerHTML = score
//     }
// }

// function powerPelletEaten() {
//     //if square pacman is in contains a power pellet
//     if (squares[pacmanCurrentIndex].classList.contains('power-pellet')) {
//         //remove power pellet class
//         // squares[pacmanCurrentIndex].classList.remove('power-pellet')
//         // squares[pacmanCurrentIndex].classList.add('empty')
//         //add a score of 10
//         score +=10
//         scoreDisplay.innerHTML = score

//         ghosts.forEach(ghost => clearInterval(ghost.timerId))
//         ghosts.forEach(ghost => clearInterval(ghost.constantTimer))

//         //change each of the four ghosts to isScared
//         ghosts.forEach(ghost => ghost.isScared = true)
//         ghosts.forEach(ghost => squares[ghost.currentIndex].classList.add('scared-ghost'))
//         // ghosts change color but do not start moving right away ################


//         // console.log('before',ghosts[0].speed)
//         // ghosts.forEach(ghost => ghost.speed = 3000)

//         // ghosts.forEach(ghost => clearInterval(ghost.timerId))
//         // ghosts.forEach(ghost => clearInterval(ghost.constantTimer))
//         ghosts.forEach(ghost => ghost.savedSpeed = ghost.speed)
//         ghosts.forEach(ghost => ghost.speed = ghost.slowSpeed)
//         ghosts.forEach(ghost => ghost.timerId = setInterval(function() {ghostMovement(ghost, ghost.slowSpeed, direction)}, ghost.slowSpeed))


//         //use setTimeout to unscare ghosts after 10 seconds
//         alreadyEaten = 1  
//         setTimeout(unScareGhosts, 10000)  
//     }
// }

// function ghostEaten() {
//     if (squares[pacmanCurrentIndex].classList.contains('ghost') && 
//         squares[pacmanCurrentIndex].classList.contains('scared-ghost')) {
//             score +=100
//             scoreDisplay.innerHTML = score
//             for (let i = 0; i < ghosts.length; i++) {
//                 if (ghosts[i].currentIndex == pacmanCurrentIndex) {
//                     squares[ghosts[i].currentIndex].classList.remove(ghosts[i].className, 'ghost', 'scared-ghost')
//                     ghosts[i].currentIndex = ghosts[i].startIndex
//                     squares[ghosts[i].currentIndex].classList.add(ghosts[i].className, 'ghost')
//                     ghosts[i].isScared = false
//                     clearInterval(ghosts[i].timerId)
//                     startGhost(ghosts[i])

//                 }
//             }
//     }
// }

// function pacmanCaught(ghost) {
//     if (squares[ghost.currentIndex].classList.contains('pacman') && 
//         !squares[ghost.currentIndex].classList.contains('scared-ghost')) {

//             ghosts.forEach(ghost => clearInterval(ghost.timerId))

//             direction = 0
//             gameOver = 1

//             if (score > highscore) {
//                 highscore = score
//                 highscoreDisplay.innerHTML = highscore
//             }

//             //remove eventlistener from our control function
//             document.removeEventListener('keydown', control)
//             //tell user the game is over   
//             messageDisplay.innerHTML = 'YOU LOST'
//             clearInterval(timer)
//             // clearInterval(constantTimer)

//             startBtn.classList.remove('active')
//             startBtn.classList.add('hidden')
//             restartBtn.classList.remove('hidden')
//             restartBtn.classList.add('active')
//             start = 0
//     }
// }




// function unScareGhosts() {
//     if (gameOver === 1) {
//         ghosts.forEach(ghost => ghost.isScared = false)
//         // ghosts.forEach(ghost => squares[ghost.currentIndex].classList.remove('scared-ghost'))
//         ghosts.forEach(ghost => clearInterval(ghost.timerId))
//         ghosts.forEach(ghost => clearInterval(ghost.constantTimer))
//     }
//     // else if (alreadyEaten === 1) {
//     //     ghosts.forEach(ghost => clearInterval(ghost.timerId))
//     //     ghosts.forEach(ghost => ghost.timerId = setInterval(function() {ghostMovement(ghost, ghost.speed, direction)}, ghost.speed))
//     //     ghosts.forEach(ghost => ghost.speed = ghost.savedSpeed)
//     //     // ghosts.forEach(ghost => squares[ghost.currentIndex].classList.remove('scared-ghost'))
//     // }
//     else {
//         if (alreadyEaten === 1) {
//             ghosts.forEach(ghost => ghost.isScared = false)
//             ghosts.forEach(ghost => squares[ghost.currentIndex].classList.remove('scared-ghost'))
//         }
//         ghosts.forEach(ghost => clearInterval(ghost.timerId))
//         ghosts.forEach(ghost => ghost.timerId = setInterval(function() {ghostMovement(ghost, ghost.speed, direction)}, ghost.speed))
//         ghosts.forEach(ghost => ghost.speed = ghost.savedSpeed)
//         // console.log('after',ghosts[0].speed)
//     }
//     ghosts.forEach(ghost => ghost.savedSpeed = 0)
//     ghosts.forEach(ghost => speedUp(ghost))
//     alreadyEaten = 0
    
// }


// class Ghost {
//     constructor(className, startIndex, speed) {
//         this.className = className
//         this.startIndex = startIndex
//         this.speed = speed
//         this.currentIndex = startIndex
//         this.isScared = false
//         this.timerId = NaN
//         this.slowSpeed = 1000
//         this.savedSpeed = 0
//         this.constantTimer = 0
//     }
// }

// const ghosts = [
//     new Ghost('blinky', 349, blinkyStartSpeed),
//     new Ghost('pinky', 377, pinkyStartSpeed),
//     new Ghost('inky', 350, inkyStartSpeed),
//     new Ghost('clyde', 378, clydeStartSpeed)
// ]

// //draw my ghosts onto my grid
// ghosts.forEach(ghost => {
//     squares[ghost.currentIndex].classList.add(ghost.className)
//     squares[ghost.currentIndex].classList.add('ghost')
// })

// //move the ghosts
// // ghosts.forEach(ghost => startGhost(ghost))




// function ghostMovement(ghost, changingSpeed, direction) {
//     //all our code
//     // let direction = -width   //cannot remove 
//     console.log(ghost.className, direction)  
//     prevDirection = -direction 
//     //Phase 1
//     if ((ghost.currentIndex == ghost.startIndex) || 
//         (ghost.currentIndex == ghost.startIndex - width) ||
//         ((ghost.currentIndex == ghost.startIndex - 2*width) && !squares[ghost.currentIndex + direction].classList.contains('wall'))) {
//             direction = -width
//             //remove any ghost
//             squares[ghost.currentIndex].classList.remove(ghost.className)
//             squares[ghost.currentIndex].classList.remove('ghost', 'scared-ghost')
//             // //add direction to current Index
//             ghost.currentIndex += direction
//             // //add ghost class
//             squares[ghost.currentIndex].classList.add(ghost.className)  
//             squares[ghost.currentIndex].classList.add('ghost')  
//             //if the ghost is currently scared 
//             if (ghost.isScared) {
//                 squares[ghost.currentIndex].classList.add('scared-ghost')
//             }
//     }

//     //Phase 2
//     else {
//         clearInterval(ghost.timerId)
//         const directions = [-1, +1, -width, +width]

//         // //check boxes around currentindex
//         // prevDirection = -direction
//         // let updatedDirections = []
//         // for (let i = 0; i < directions.length; i++) {
//         //     if (directions[i] != prevDirection &&
//         //         (squares[ghost.currentIndex + directions[i]].classList.contains('empty') ||
//         //         squares[ghost.currentIndex + directions[i]].classList.contains('pac-dot') ||
//         //         squares[ghost.currentIndex + directions[i]].classList.contains('power-pellet') || 
//         //         squares[ghost.currentIndex + directions[i]].classList.contains('pacman')) &&
//         //         !squares[ghost.currentIndex + directions[i]].classList.contains('ghost')) {
//         //             updatedDirections.push(directions[i])
//         //     }
//         // }
        
//         // direction = updatedDirections[Math.floor(Math.random() * updatedDirections.length)]
        
//         ghost.timerId = setInterval(function() {
//             //all our code
//             //if the next square does NOT contain a wall and does not contain a ghost
//             prevDirection = -direction
//             //for tunneling
//             if (ghost.currentIndex == 391 && direction == 1) {
//                 squares[ghost.currentIndex].classList.remove(ghost.className)
//                 squares[ghost.currentIndex].classList.remove('ghost', 'scared-ghost')

//                 ghost.currentIndex = 364

//                 squares[ghost.currentIndex].classList.add(ghost.className)  
//                 squares[ghost.currentIndex].classList.add('ghost')  
//             }
//             //for tunneling
//             else if (ghost.currentIndex == 364 && direction == -1) {
//                 squares[ghost.currentIndex].classList.remove(ghost.className)
//                 squares[ghost.currentIndex].classList.remove('ghost', 'scared-ghost')

//                 ghost.currentIndex = 391

//                 squares[ghost.currentIndex].classList.add(ghost.className)  
//                 squares[ghost.currentIndex].classList.add('ghost')
//             }

//             //for most cases
//             else {
//                 updatedDirections = []
//                 for (let i = 0; i < directions.length; i++) {
//                     if (directions[i] != prevDirection &&
//                         (squares[ghost.currentIndex + directions[i]].classList.contains('empty') ||
//                         squares[ghost.currentIndex + directions[i]].classList.contains('pac-dot') ||
//                         squares[ghost.currentIndex + directions[i]].classList.contains('power-pellet') || 
//                         squares[ghost.currentIndex + directions[i]].classList.contains('pacman')) &&
//                         !squares[ghost.currentIndex + directions[i]].classList.contains('ghost')) {
//                             updatedDirections.push(directions[i])
//                     }
//                 }
//                 // console.log('prev',ghost.className,prevDirection)
//                 // console.log(updatedDirections.length)

//                 if (updatedDirections.length === 0) {
//                     direction = prevDirection
//                 }
//                 else {
//                     direction = updatedDirections[Math.floor(Math.random() * updatedDirections.length)]
//                     console.log('Set')
//                 }


                
//                 // console.log('chosen',direction)
//                 // console.log(" ")
//                 if (squares[ghost.currentIndex + direction].classList.contains('ghost')) {
//                     direction = prevDirection
//                 }

//                 //####### For moving ghost ###########
//                 //remove any ghost
//                 squares[ghost.currentIndex].classList.remove(ghost.className)
//                 squares[ghost.currentIndex].classList.remove('ghost', 'scared-ghost')
//                 // //add direction to current Index
//                 // ghostEaten()
//                 if (!ghost.isScared) {
//                     pacmanCaught(ghost)
//                 }
//                 // pacmanCaught(ghost)
//                 ghost.currentIndex += direction
//                 // pacmanCaught(ghost)
//                 if (!ghost.isScared) {
//                     pacmanCaught(ghost)
//                 }
                
//                 // //add ghost class
//                 squares[ghost.currentIndex].classList.add(ghost.className)  
//                 squares[ghost.currentIndex].classList.add('ghost')  
//                 //###################################
//             }

//             //if the ghost is currently scared 
//             if (ghost.isScared) {
//                 squares[ghost.currentIndex].classList.add('scared-ghost')
//                 // clearInterval(ghost.timerId)
//             }

//         }, changingSpeed )            
//     }

// }

// function startGhost(ghost) {
//     let direction = -width   //cannot remove    
//     ghost.timerId = setInterval(function() {ghostMovement(ghost, ghost.speed, direction)}, ghost.speed)
// }


// //check for game over
// function checkForGameOver() {
//     //if the square pacman is in contains a ghost AND the square does NOT contain a scared ghost 
//     if (
//         squares[pacmanCurrentIndex].classList.contains('ghost') && 
//         !squares[pacmanCurrentIndex].classList.contains('scared-ghost')) {
//             //for each ghost - we need to stop it moving
//             ghosts.forEach(ghost => clearInterval(ghost.timerId))
        
//             direction = 0
//             gameOver = 1

//             if (score > highscore) {
//                 highscore = score
//                 highscoreDisplay.innerHTML = highscore
//             }

//             //remove eventlistener from our control function
//             document.removeEventListener('keydown', control)
//             //tell user the game is over   
//             messageDisplay.innerHTML = 'YOU LOST'
//             clearInterval(timer)
//             // clearInterval(constantTimer)

//             startBtn.classList.remove('active')
//             startBtn.classList.add('hidden')
//             restartBtn.classList.remove('hidden')
//             restartBtn.classList.add('active')
//             start = 0
//     }
// }

// //check for win
// function checkForWin() {
//     let checker = 0
//     for (let i = 0; i < squares.length; i++) {
//         if (squares[i].classList.contains('pac-dot') || squares[i].classList.contains('power-pellet')){
//             checker = 1
//         }
//     }
//     if (checker == 0){ //(score > 274) {
//         //stop each ghost
//         ghosts.forEach(ghost => clearInterval(ghost.timerId))

//         direction = 0
//         gameOver = 1

//         if (score > highscore) {
//             highscore = score
//             highscoreDisplay.innerHTML = highscore
//         }

//         //remove eventlistener from our control function
//         document.removeEventListener('keydown', control)
//         //tell user the game is over   
//         messageDisplay.innerHTML = 'YOU WON!'
//         clearInterval(timer)
//         // clearInterval(constantTimer)

//         startBtn.classList.remove('active')
//         startBtn.classList.add('hidden')
//         restartBtn.classList.remove('hidden')
//         restartBtn.classList.add('active')
//         start = 0
//     }
// }









// // //Original layout
// // // 0 - pacdots
// // // 1 - wall
// // // 2 - ghost lair
// // // 3 - powerpellets
// // // 4 - empty

// // const layout = [
// //     1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
// //     1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
// //     1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
// //     1,3,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,3,1,
// //     1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
// //     1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
// //     1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
// //     1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
// //     1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
// //     1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,
// //     1,1,1,1,1,1,0,1,1,4,4,4,4,4,4,4,4,4,4,1,1,0,1,1,1,1,1,1,
// //     1,1,1,1,1,1,0,1,1,4,1,1,1,2,2,1,1,1,4,1,1,0,1,1,1,1,1,1,
// //     1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
// //     4,4,4,4,4,4,0,0,0,4,1,2,2,2,2,2,2,1,4,0,0,0,4,4,4,4,4,4,
// //     1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
// //     1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
// //     1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
// //     1,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,1,
// //     1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
// //     1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
// //     1,3,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,3,1,
// //     1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
// //     1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
// //     1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1,
// //     1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
// //     1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
// //     1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
// //     1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
// // ]