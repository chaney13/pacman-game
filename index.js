// Works the best, slight pause between speed ups
// Issue when 2 powerpellets are eaten - fixed
// Timed fruit in middle to reset grid
// Timed fruit random location for bonus points

const width = 28
let grid = document.querySelector('.grid')
const scoreDisplay = document.getElementById('score')
const highscoreDisplay = document.getElementById('highscore')
const messageDisplay = document.getElementById('message')
const startBtn = document.getElementById('start-btn')
const restartBtn = document.getElementById('restart-btn')
const blinkyStartSpeed = 250
const pinkyStartSpeed = 400
const inkyStartSpeed = 300
const clydeStartSpeed = 500
const ghostStartSpeeds = [blinkyStartSpeed, pinkyStartSpeed, inkyStartSpeed, clydeStartSpeed]

var lastEvent

let start = 0
let restart = 0
let squares = []
let score = 0
let highscore = 0
let pacmanDirection = 0
let direction = 0
let pacmanSpeed = 290 //pacman normal speed
const pacmanFastSpeed = 215 //pacman speed with powerpellet
let timer = setInterval(move, pacmanSpeed)
let prevDirection = 0
let gameOver = 0
let winningPoints = 3000 // 3000 points awarded if you win
let powerEaten = 0

let constantTimer = 0
let constantIncrease = 10000 // every 10 sec (originally 5)
let speedChange = 0.95

// let alreadyEaten = 0

let unScareTimer = 7000 // 7 sec

let timeleft = -2
let timeleft2 = -2
let downloadTimer = 0
let timeout = 0
let countdownTimer = document.getElementById("countdown-timer")
let countdownTimer2 = document.getElementById("countdown-timer2")

let fruitBoard = 0
let fruitBoardTimer = 45000 // generate fruit every 45s
let fruitBoardPoints = 50
let fruitRandom = 0
let fruitRandomTimer = 20000 // generate fruit every 20s
let fruitRandomPoints = 100 // change in 2 other areas

let savedGrid = ''
let savedSquares = []
let boxLoss = document.getElementById('box-loss')
boxLoss.style.display = "none"
let boxWin = document.getElementById('box-win')
boxWin.style.display = "none"
// let boxInitial = document.getElementById('box-initial')

let pacmanPrevIndex = 0
let ghostPoints = 0
let rewardedPoints = 0

let gif = 0

// const arrowKeys = document.getElementById('arrow-keys')
// const upBtn = document.getElementById('up-btn')
// const leftBtn = document.getElementById('left-btn')
// const rightBtn = document.getElementById('right-btn')
// const downBtn = document.getElementById('down-btn')


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
    7,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,8,
    7,3,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,3,8,
    7,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,8,
    7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,
    5,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,5
]

function move() {
    if (start === 1) {
        // console.log(pacmanDirection)

        if (
            (squares[pacmanCurrentIndex + pacmanDirection].classList.contains('wall') && pacmanDirection == 1 && pacmanCurrentIndex != 391) ||
            (squares[pacmanCurrentIndex + pacmanDirection].classList.contains('wall') && pacmanDirection == -1 && pacmanCurrentIndex != 364) ||
            (squares[pacmanCurrentIndex + pacmanDirection].classList.contains('wall') && pacmanDirection == width) ||
            (squares[pacmanCurrentIndex + pacmanDirection].classList.contains('wall') && pacmanDirection == -width) || 
            (squares[pacmanCurrentIndex + pacmanDirection].classList.contains('ghost-lair') && pacmanDirection == 1) ||
            (squares[pacmanCurrentIndex + pacmanDirection].classList.contains('ghost-lair') && pacmanDirection == -1) ||
            (squares[pacmanCurrentIndex + pacmanDirection].classList.contains('ghost-lair') && pacmanDirection == width) ||
            (squares[pacmanCurrentIndex + pacmanDirection].classList.contains('ghost-lair') && pacmanDirection == -width)
             ) {
                pacmanDirection = 0
                // console.log('Here')
                clearInterval(timer)

        }

        ghostEaten()
        squares[pacmanCurrentIndex].classList.remove('pacman')
        squares[pacmanCurrentIndex].classList.add('empty')

        if (pacmanCurrentIndex != pacmanPrevIndex) {
            pacmanPrevIndex = pacmanCurrentIndex
        }

        if (pacmanCurrentIndex == 391 && pacmanDirection == 1) {
            pacmanCurrentIndex = 364
        }
        else if (pacmanCurrentIndex == 364 && pacmanDirection == -1) {
            pacmanCurrentIndex = 391
        } 
        else {
            pacmanCurrentIndex += pacmanDirection
        }

        pacDotEaten()
        powerPelletEaten()
        ghostEaten()
        fruitEaten()


        if (powerEaten == 0) {
            if (squares[pacmanCurrentIndex].classList.contains('empty')) {
                squares[pacmanCurrentIndex].classList.remove('empty')
                clearInterval(timer)
                timer = setInterval(move, pacmanSpeed)
            }
            else if (squares[pacmanCurrentIndex].classList.contains('pac-dot')) {
                squares[pacmanCurrentIndex].classList.remove('pac-dot')
                clearInterval(timer)
                timer = setInterval(move, pacmanSpeed)
            }
            else if (squares[pacmanCurrentIndex].classList.contains('power-pellet')) {
                squares[pacmanCurrentIndex].classList.remove('power-pellet')
                clearInterval(timer)
                timer = setInterval(move, pacmanSpeed)
            }
            else if (squares[pacmanCurrentIndex].classList.contains('ghost-lair')) {
                squares[pacmanCurrentIndex].classList.remove('ghost-lair')
                clearInterval(timer)
                timer = setInterval(move, pacmanSpeed)
            }
        }
        else {
            if (squares[pacmanCurrentIndex].classList.contains('empty')) {
                squares[pacmanCurrentIndex].classList.remove('empty')
                clearInterval(timer)
                timer = setInterval(move, pacmanFastSpeed)
            }
            else if (squares[pacmanCurrentIndex].classList.contains('pac-dot')) {
                squares[pacmanCurrentIndex].classList.remove('pac-dot')
                clearInterval(timer)
                timer = setInterval(move, pacmanFastSpeed)
            }
            else if (squares[pacmanCurrentIndex].classList.contains('power-pellet')) {
                squares[pacmanCurrentIndex].classList.remove('power-pellet')
                clearInterval(timer)
                timer = setInterval(move, pacmanFastSpeed)
            }
            else if (squares[pacmanCurrentIndex].classList.contains('ghost-lair')) {
                squares[pacmanCurrentIndex].classList.remove('ghost-lair')
                clearInterval(timer)
                timer = setInterval(move, pacmanFastSpeed)
            }
        }



        squares[pacmanCurrentIndex].classList.add('pacman')
        checkForWin()
        checkForGameOver()
        
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

let pelletArray = []
let fruitRandomIndex = 0
function makeFruitRandom() {
    fruitRandom = setTimeout(function() {
        pelletArray = []
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('pac-dot')){
                pelletArray.push(i)
            }
        }

        fruitRandomIndex = pelletArray[Math.floor(Math.random() * pelletArray.length)]
        squares[fruitRandomIndex].classList.remove('pac-dot')
        squares[fruitRandomIndex].classList.add('fruit-random')
    }, fruitRandomTimer)


}

let fruitBoardIndex = 489
function makeFruitBoard() {
    fruitBoard = setTimeout(function() {
        squares[fruitBoardIndex].classList.remove('empty')
        squares[fruitBoardIndex].classList.add('fruit-board')
    }, fruitBoardTimer)
}

function fruitEaten() {
    if (squares[pacmanCurrentIndex].classList.contains('fruit-board')) {
        clearTimeout(fruitRandom)
        squares[fruitRandomIndex].classList.remove('fruit-random')
        squares[fruitRandomIndex].classList.add('pac-dot')
        pelletArray = []

        fruitBoardPoints += 50
        squares[pacmanCurrentIndex].classList.remove('fruit-board')
        squares[pacmanCurrentIndex].classList.add('empty')
        grid.innerHTML = ''
        squares = []
        createBoard()
        score += fruitBoardPoints //100
        scoreDisplay.innerHTML = score
        // clearInterval(fruitBoard)
        makeFruitBoard()
        makeFruitRandom()
    }
    else if (squares[pacmanCurrentIndex].classList.contains('fruit-random')) {
        fruitRandomPoints += 100
        squares[pacmanCurrentIndex].classList.remove('fruit-random')
        squares[pacmanCurrentIndex].classList.add('empty')
        // grid.innerHTML = ''
        // squares = []
        // createBoard()
        pelletArray = []
        score += fruitRandomPoints
        scoreDisplay.innerHTML = score
        // clearInterval(fruitRandom)
        makeFruitRandom()
    }
}

startBtn.addEventListener('click', function() {
    start = 1
    gameOver = 0
    fruitBoardPoints = 50
    fruitRandomPoints = 100
    // ghosts.forEach(ghost => startGhost(ghost))
    // document.addEventListener('keydown', control)
    // ghosts.forEach(ghost => speedUp(ghost))
    startBtn.classList.remove('active')
    startBtn.classList.add('hidden')
    restartBtn.classList.remove('hidden')
    restartBtn.classList.add('active')

    // arrowKeys.classList.remove('hidden')
    // arrowKeys.classList.add('active-arrow-keys')





    lastEvent = NaN

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
    direction = -width

    for (let i = 0; i < ghostStartSpeeds.length; i++) {
        ghosts[i].speed = ghostStartSpeeds[i]
        // console.log('restarted speeds', ghosts[i].speed)
    }
    // console.log('restarted')

    //remove old classes
    grid.innerHTML = ''
    squares = []
    createBoard()

    makeFruitBoard()
    makeFruitRandom()

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

    ghosts.forEach(ghost => speedUp(ghost, direction))

    document.addEventListener('keydown', control)
})

function speedUp(ghost, direction) {
    // console.log('Sped up')
    // ghost.timerId = ghost.timerId*speedChange
    if (gameOver === 0) {
        // clearInterval(ghost.constantTimer)
        // console.log('in speed up', ghost.speed)
        clearInterval(ghost.timerId)
        // clearInterval(ghost.constantTimer)
        // ghost.constantTimer = setInterval(function() {speedUp(ghost, direction)}, constantIncrease)
        // console.log(ghost.speed)
        if(!ghost.isScared) {
            ghost.speed = ghost.speed * speedChange
        }

        if (ghost.currentIndex != ghost.startIndex) {
            direction = ghost.savedDirection
        }
        // direction = ghost.savedDirection
        ghost.timerId = setInterval(function() {ghostMovement(ghost, ghost.speed, direction)}, ghost.speed)
    }
    else {
        clearInterval(ghost.constantTimer)
        clearInterval(ghost.timerId)
    }
}

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
//         direction = ghost.savedDirection
//         ghost.timerId = setInterval(function() {ghostMovement(ghost, ghost.speed, direction)}, ghost.speed)
//         // console.log(ghost.className, ghost.speed)
//         // console.log('C')
//     }

// }



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
//         direction = ghost.savedDirection
//         ghost.timerId = setInterval(function() {ghostMovement(ghost, ghost.speed, direction)}, ghost.speed)
//         // console.log(ghost.className, ghost.speed)
//         // console.log('C')
//     }

// }

restartBtn.addEventListener('click', function() {
    gameOver = 1
    unScareGhosts()
    clearTimeout(timeout)
    gameOver = 0
    start = 1

    countdownTimer.classList.remove('active')
    countdownTimer2.classList.remove('active')
    countdownTimer.classList.add('hidden')
    countdownTimer2.classList.add('hidden')



    // arrowKeys.classList.remove('hidden')
    // arrowKeys.classList.add('active-arrow-keys')


    //if (ghosts[0].speed == ghosts[0].slowSpeed) {
    clearInterval(downloadTimer)
    //}

    //for each ghost - we need to stop it moving
    ghosts.forEach(ghost => clearInterval(ghost.timerId))
    ghosts.forEach(ghost => ghost.isScared = false)
    direction = 0
    powerEaten = 0

    fruitBoardPoints = 50
    fruitRandomPoints = 100

    //remove eventlistener from our control function
    document.removeEventListener('keydown', control)

    clearInterval(timer)
    clearTimeout(fruitBoard)
    clearTimeout(fruitRandom)
    ghosts.forEach(ghost => clearInterval(ghost.constantTimer))

    lastEvent = NaN

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
    direction = -width

    for (let i = 0; i < ghostStartSpeeds.length; i++) {
        ghosts[i].speed = ghostStartSpeeds[i]
        // console.log('restarted speeds', ghosts[i].speed)
    }
    // console.log('restarted')

    //remove old classes
    grid.innerHTML = ''
    squares = []
    createBoard()

    makeFruitBoard()
    makeFruitRandom()

    start = 1
    pacmanCurrentIndex = 490
    squares[pacmanCurrentIndex].classList.add('pacman')
    ghosts.forEach(ghost => {
        ghost.currentIndex = ghost.startIndex
        squares[ghost.currentIndex].classList.add(ghost.className)
        squares[ghost.currentIndex].classList.add('ghost')
    })

    ghosts.forEach(ghost => startGhost(ghost))

    ghosts.forEach(ghost => speedUp(ghost, direction))

    document.addEventListener('keydown', control)





    // lastEvent = NaN

    // messageDisplay.innerHTML = ""
    // score = 0
    // scoreDisplay.innerHTML = '00'
    // squares[pacmanCurrentIndex].classList.remove('pacman')
    // ghosts.forEach(ghost => {
    //     squares[ghost.currentIndex].classList.remove(ghost.className)
    //     squares[ghost.currentIndex].classList.remove('ghost')
    //     if (ghost.isScared) {
    //         squares[ghost.currentIndex].classList.remove('scared-ghost')
    //     }
    //     clearInterval(ghost.constantTimer)
    //     clearInterval(ghost.timerId)
    // })
    // direction = -width

    // for (let i = 0; i < ghostStartSpeeds.length; i++) {
    //     ghosts[i].speed = ghostStartSpeeds[i]
    //     // console.log('restarted speeds', ghosts[i].speed)
    // }
    // // console.log('restarted')
    // clearInterval(timer)
    // clearTimeout(fruitBoard)
    // clearTimeout(fruitRandom)
    // //remove old classes
    // grid.innerHTML = ''
    // squares = []
    // createBoard()

    // makeFruitBoard()
    // makeFruitRandom()

    // gameOver = 0
    // start = 1
    // powerEaten = 0
    // pacmanCurrentIndex = 490
    // squares[pacmanCurrentIndex].classList.add('pacman')
    // ghosts.forEach(ghost => {
    //     ghost.currentIndex = ghost.startIndex
    //     squares[ghost.currentIndex].classList.add(ghost.className)
    //     squares[ghost.currentIndex].classList.add('ghost')
    // })

    // ghosts.forEach(ghost => startGhost(ghost))

    // ghosts.forEach(ghost => speedUp(ghost, direction))

    // document.addEventListener('keydown', control)
})








// down - 40
// up key - 38
// left - 37
// right - 39

//starting position of pacman 
let pacmanCurrentIndex = 490
squares[pacmanCurrentIndex].classList.add('pacman')


// let screen = document.querySelector('.screen')
// let hammerjsOptions = {};
// let hammertime = new Hammer(screen, hammerjsOptions);

// let hammertimeBodyRight = new Hammer.Manager(screen, {
//     recognizers: [
//         [Hammer.Swipe, { direction: Hammer.DIRECTION_RIGHT}]
//     ]
// });

// hammertimeBodyRight.on("swipe", function (ev) {
//     console.log('RIGHT')
//     ev.keyCode = 39
//     control(ev)

// });

// let hammertimeBodyLeft = new Hammer.Manager(screen, {
//     recognizers: [
//         [Hammer.Swipe, { direction: Hammer.DIRECTION_LEFT}]
//     ]
// });

// hammertimeBodyLeft.on("swipe", function (ev) {
//     console.log('LEFT')
//     ev.keyCode = 37
//     control(ev)

// });

// let hammertimeBodyUp = new Hammer.Manager(screen, {
//     recognizers: [
//         [Hammer.Swipe, { direction: Hammer.DIRECTION_UP}]
//     ]
// });

// hammertimeBodyUp.on("swipe", function (ev) {
//     console.log('UP')
//     ev.keyCode = 38
//     control(ev)

// });

// let hammertimeBodyDown = new Hammer.Manager(screen, {
//     recognizers: [
//         [Hammer.Swipe, { direction: Hammer.DIRECTION_DOWN}]
//     ]
// });

// hammertimeBodyDown.on("swipe", function (ev) {
//     console.log('DOWN')
//     ev.keyCode = 40
//     control(ev)

// });




document.addEventListener('touchstart', handleTouchStart, false);        
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;                                                        
var yDown = null;

function getTouches(ev) {
  return ev.touches ||             // browser API
         ev.originalEvent.touches; // jQuery
}                                                     

function handleTouchStart(ev) {
    const firstTouch = getTouches(ev)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;                                      
};                                                

function handleTouchMove(ev) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = ev.touches[0].clientX;                                    
    var yUp = ev.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            /* left swipe */ 
            // console.log('LEFT SWIPE')
            ev.keyCode = 37
            control(ev)
        } else {
            /* right swipe */
            // console.log('RIGHT SWIPE')
            ev.keyCode = 39
            control(ev)
        }                       
    } else {
        if ( yDiff > 0 ) {
            /* up swipe */ 
            // console.log('UP SWIPE')
            ev.keyCode = 38
             control(ev)
        } else { 
            /* down swipe */
            // console.log('DOWN SWIPE')
            ev.keyCode = 40
            control(ev)
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
};




function control(e) {
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
            pacmanDirection = width
            move()
            break

            case 38:
            // console.log('pressed up')
            pacmanDirection = -width
            move()
            break

            case 37: 
            // console.log('pressed left')
            pacmanDirection = -1
            move()
            break

            case 39:
            // console.log('pressed right')
            pacmanDirection = 1
            move()
            break
        }
    }
}

// //Displayed arrow keys
// upBtn.addEventListener('click', function() {
//     // console.log('pressed up')
//     if (pacmanDirection != -width) {
//         pacmanDirection = -width
//         move()
//     }
// })
// leftBtn.addEventListener('click', function() {
//     // console.log('pressed left')
//     if (pacmanDirection != -1) {
//         pacmanDirection = -1
//         move()
//     }
// })
// rightBtn.addEventListener('click', function() {
//     // console.log('pressed right')
//     if (pacmanDirection != 1) {
//         pacmanDirection = 1
//         move()
//     }
// })
// downBtn.addEventListener('click', function() {
//     // console.log('pressed down')
//     if (pacmanDirection != width) {
//         pacmanDirection = width
//         move()
//     }
// })


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
        // console.log(ghosts[0].savedSpeed)

        ghosts.forEach(ghost => clearInterval(ghost.timerId))
        ghosts.forEach(ghost => clearInterval(ghost.constantTimer))
        // ghosts.forEach(ghost => clearInterval(ghost.constantTimer))
        // if (ghosts[0].isScared || ghosts[1].isScared || ghosts[2].isScared || ghosts[3].isScared) {
        //     // clearTimeout(timeout)
        //     // clearInterval(downloadTimer)
        //     // console.log('Timers should reset')
        // }


        for (let i = 0; i < ghosts.length; i++) {
            // if (ghosts[i].speed != ghosts[i].slowSpeed) {
                ghosts[i].isScared = true
                squares[ghosts[i].currentIndex].classList.add('scared-ghost')
                if (ghosts[i].speed != ghosts[i].slowSpeed) {
                    ghosts[i].savedSpeed = ghosts[i].speed
                }
                // console.log('saved speed updated to', ghosts[i].savedSpeed ,ghosts[i].className)


                // clearInterval(ghosts[i].timerId)
                // clearInterval(ghosts[i].constantTimer)
                // ghosts[i].speed = ghosts[i].savedSpeed
                // speedUp(ghosts[i], direction)

                // ghosts.forEach(ghost => clearInterval(ghost.timerId))
                // ghosts.forEach(ghost => clearInterval(ghost.constantTimer))
                // // ghosts.forEach(ghost => ghost.timerId = setInterval(function() {ghostMovement(ghost, ghost.speed, direction)}, ghost.speed))
                // ghosts.forEach(ghost => ghost.speed = ghost.savedSpeed)
                // ghosts.forEach(ghost => speedUp(ghost, direction))

            //}
        }
        // if (!ghosts[0].isScared || !ghosts[1].isScared || !ghosts[2].isScared || !ghosts[3].isScared) {
        //     //change each of the four ghosts to isScared
        //     ghosts.forEach(ghost => ghost.isScared = true)
        //     ghosts.forEach(ghost => squares[ghost.currentIndex].classList.add('scared-ghost'))
        //     ghosts.forEach(ghost => ghost.savedSpeed = ghost.speed)
        // }

        clearTimeout(timeout)
        clearInterval(downloadTimer)
        // console.log('Timers should reset')

        // //change each of the four ghosts to isScared
        // ghosts.forEach(ghost => ghost.isScared = true)
        // ghosts.forEach(ghost => squares[ghost.currentIndex].classList.add('scared-ghost'))
        // ghosts.forEach(ghost => ghost.savedSpeed = ghost.speed)
        ghosts.forEach(ghost => ghost.speed = ghost.slowSpeed)
        // ghosts.forEach(ghost => ghostMovement(ghost, ghost.slowSpeed, direction))
        // ghosts.forEach(ghost => clearInterval(ghost.timerId))

        ghosts.forEach(ghost => ghost.timerId = setInterval(function() {ghostMovement(ghost, ghost.slowSpeed, direction)}, ghost.slowSpeed))
        ghosts.forEach(ghost => ghostMovement(ghost, ghost.slowSpeed, direction))



        powerEaten = 1

        countdownTimer.classList.remove('hidden')
        countdownTimer2.classList.remove('hidden')
        countdownTimer.classList.add('active')
        countdownTimer2.classList.add('active')

        timeleft = unScareTimer / 1000
        timeleft2 = unScareTimer / 1000
        countdownTimer.textContent = timeleft
        countdownTimer2.textContent = timeleft2
        downloadTimer = setInterval(function() {
            timeleft -= 1
            timeleft2 -= 1
            if (timeleft == 0) {
                countdownTimer.textContent = 'Times Up!'
                countdownTimer2.textContent = 'Times Up!'
                powerEaten = 0
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

        //use setTimeout to unscare ghosts after certain amount of time
        // alreadyEaten = 1  
        timeout = setTimeout(unScareGhosts, unScareTimer)
    }
}

// pacmanCurrentIndex == ghost.prevIndex
//ghost.currentIndex = pacmanPrevIndex
function ghostEaten() {
    for (let j = 0; j < ghosts.length; j++) {
        if ((squares[pacmanCurrentIndex] != undefined) && (squares[ghosts[j].currentIndex] != undefined)) {





            if ((squares[pacmanCurrentIndex].classList.contains('ghost') && 
                squares[pacmanCurrentIndex].classList.contains('scared-ghost')) && 
                ((pacmanCurrentIndex == ghosts[j].prevIndex) || (pacmanCurrentIndex == ghosts[j].currentIndex))) {
                // pacmanPrevIndex == ghosts[j].prevIndex) {

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
                            // console.log("A") // happened every single time except 1


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

            else if ((squares[pacmanPrevIndex].classList.contains('ghost') && 
                    squares[pacmanPrevIndex].classList.contains('scared-ghost')) && 
                    ((pacmanCurrentIndex == ghosts[j].prevIndex) || (pacmanCurrentIndex == ghosts[j].currentIndex)) && 
                    (rewardedPoints == 0)) {
                    // pacmanPrevIndex == ghosts[j].prevIndex) {
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
                            // console.log("B") // never happened


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

                
            else if (((ghosts[j].currentIndex == pacmanPrevIndex) && (ghosts[j].prevIndex == pacmanCurrentIndex)) && (rewardedPoints == 0 )) {
                    clearInterval(ghosts[j].timerId)
                    ghosts[j].prevIndex = 0
                    ghostPoints += 100
                    // console.log('1',ghostPoints)
                    score += ghostPoints
                    scoreDisplay.innerHTML = score
                    // rewardedPoints = 1
                    squares[ghosts[j].currentIndex].classList.remove(ghosts[j].className, 'ghost', 'scared-ghost')
                    ghosts[j].currentIndex = ghosts[j].startIndex
                    squares[ghosts[j].currentIndex].classList.add(ghosts[j].className, 'ghost')
                    ghosts[j].isScared = false
                    startGhost(ghosts[j])
                    // console.log("C") //happened once
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
        

            // for (let j = 0; j < ghosts.length; j++) {
            //     if ((pacmanPrevIndex == ghosts[j].prevIndex) && rewardedPoints == 0 && isScared) {
            //         clearInterval(ghosts[j].timerId)
            //         ghosts[j].prevIndex = 0
            //         ghostPoints += 100
            //         // console.log('2',ghostPoints)
            //         score += ghostPoints
            //         scoreDisplay.innerHTML = score

            //         squares[ghosts[j].currentIndex].classList.remove(ghosts[j].className, 'ghost', 'scared-ghost')
            //         ghosts[j].currentIndex = ghosts[j].startIndex
            //         squares[ghosts[j].currentIndex].classList.add(ghosts[j].className, 'ghost')
            //         ghosts[j].isScared = false
            //         startGhost(ghosts[j])

            //         // for (let i = 0; i < ghosts.length; i++) {
            //         //     if (ghosts[i].currentIndex == pacmanCurrentIndex) {
            //         //         squares[ghosts[i].currentIndex].classList.remove(ghosts[i].className, 'ghost', 'scared-ghost')
            //         //         ghosts[i].currentIndex = ghosts[i].startIndex
            //         //         squares[ghosts[i].currentIndex].classList.add(ghosts[i].className, 'ghost')
            //         //         ghosts[i].isScared = false
            //         //         clearInterval(ghosts[i].timerId)
            //         //         startGhost(ghosts[i])

            //         //     }
            //         // }

            //     }
            // } 
            rewardedPoints = 0 
        } 
    }
}























// function ghostEaten() {
//     if ((squares[pacmanCurrentIndex].classList.contains('ghost') && 
//         squares[pacmanCurrentIndex].classList.contains('scared-ghost'))) { //||
//         // pacmanPrevIndex == ghosts[j].prevIndex) {

//             for (let j = 0; j < ghosts.length; j++) {
//                 if (ghosts[j].currentIndex == pacmanCurrentIndex) {
//                     clearInterval(ghosts[j].timerId)
//                     ghosts[j].prevIndex = 0
//                     ghostPoints += 100
//                     // console.log('1',ghostPoints)
//                     score += ghostPoints
//                     scoreDisplay.innerHTML = score
//                     rewardedPoints = 1

//                     squares[ghosts[j].currentIndex].classList.remove(ghosts[j].className, 'ghost', 'scared-ghost')
//                     ghosts[j].currentIndex = ghosts[j].startIndex
//                     squares[ghosts[j].currentIndex].classList.add(ghosts[j].className, 'ghost')
//                     ghosts[j].isScared = false
//                     startGhost(ghosts[j])


//                     // for (let i = 0; i < ghosts.length; i++) {
//                     //     if (ghosts[i].currentIndex == pacmanCurrentIndex) {
//                     //         squares[ghosts[i].currentIndex].classList.remove(ghosts[i].className, 'ghost', 'scared-ghost')
//                     //         ghosts[i].currentIndex = ghosts[i].startIndex
//                     //         squares[ghosts[i].currentIndex].classList.add(ghosts[i].className, 'ghost')
//                     //         ghosts[i].isScared = false
//                     //         clearInterval(ghosts[i].timerId)
//                     //         startGhost(ghosts[i])
                        
//                     //     }
//                     // }
//                 }
//             }
            
//     }

//     else if ((squares[pacmanPrevIndex].classList.contains('ghost') && 
//             squares[pacmanPrevIndex].classList.contains('scared-ghost'))) { //||
//         // pacmanPrevIndex == ghosts[j].prevIndex) {

//             for (let j = 0; j < ghosts.length; j++) {
//                 if (ghosts[j].prevIndex == pacmanPrevIndex) {
//                     clearInterval(ghosts[j].timerId)
//                     ghosts[j].prevIndex = 0
//                     ghostPoints += 100
//                     // console.log('1',ghostPoints)
//                     score += ghostPoints
//                     scoreDisplay.innerHTML = score
//                     rewardedPoints = 1

//                     squares[ghosts[j].currentIndex].classList.remove(ghosts[j].className, 'ghost', 'scared-ghost')
//                     ghosts[j].currentIndex = ghosts[j].startIndex
//                     squares[ghosts[j].currentIndex].classList.add(ghosts[j].className, 'ghost')
//                     ghosts[j].isScared = false
//                     startGhost(ghosts[j])


//                     // for (let i = 0; i < ghosts.length; i++) {
//                     //     if (ghosts[i].currentIndex == pacmanCurrentIndex) {
//                     //         squares[ghosts[i].currentIndex].classList.remove(ghosts[i].className, 'ghost', 'scared-ghost')
//                     //         ghosts[i].currentIndex = ghosts[i].startIndex
//                     //         squares[ghosts[i].currentIndex].classList.add(ghosts[i].className, 'ghost')
//                     //         ghosts[i].isScared = false
//                     //         clearInterval(ghosts[i].timerId)
//                     //         startGhost(ghosts[i])
                        
//                     //     }
//                     // }
//                 }
//             }
            
//     }

//     // for (let j = 0; j < ghosts.length; j++) {
//     //     if ((pacmanPrevIndex == ghosts[j].prevIndex) && rewardedPoints == 0 && isScared) {
//     //         clearInterval(ghosts[j].timerId)
//     //         ghosts[j].prevIndex = 0
//     //         ghostPoints += 100
//     //         // console.log('2',ghostPoints)
//     //         score += ghostPoints
//     //         scoreDisplay.innerHTML = score

//     //         squares[ghosts[j].currentIndex].classList.remove(ghosts[j].className, 'ghost', 'scared-ghost')
//     //         ghosts[j].currentIndex = ghosts[j].startIndex
//     //         squares[ghosts[j].currentIndex].classList.add(ghosts[j].className, 'ghost')
//     //         ghosts[j].isScared = false
//     //         startGhost(ghosts[j])

//     //         // for (let i = 0; i < ghosts.length; i++) {
//     //         //     if (ghosts[i].currentIndex == pacmanCurrentIndex) {
//     //         //         squares[ghosts[i].currentIndex].classList.remove(ghosts[i].className, 'ghost', 'scared-ghost')
//     //         //         ghosts[i].currentIndex = ghosts[i].startIndex
//     //         //         squares[ghosts[i].currentIndex].classList.add(ghosts[i].className, 'ghost')
//     //         //         ghosts[i].isScared = false
//     //         //         clearInterval(ghosts[i].timerId)
//     //         //         startGhost(ghosts[i])
                
//     //         //     }
//     //         // }

//     //     }
//     // } 
//     rewardedPoints = 0  
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
        // console.log('Unscared')
        // console.log(ghosts[0].savedSpeed)
        // ghosts.forEach(ghost => clearInterval(ghost.timerId))
        ghosts.forEach(ghost => ghost.isScared = false)
        ghosts.forEach(ghost => squares[ghost.currentIndex].classList.remove('scared-ghost'))
        // ghosts.forEach(ghost => clearInterval(ghost.timerId))
        // ghosts.forEach(ghost => clearInterval(ghost.constantTimer))
        // ghosts.forEach(ghost => ghost.timerId = setInterval(function() {ghostMovement(ghost, ghost.speed, direction)}, ghost.speed))
        // console.log('saved speed returned is', ghosts[0].savedSpeed ,ghosts[0].className)
        // console.log('saved speed returned is', ghosts[1].savedSpeed ,ghosts[1].className)
        // console.log('saved speed returned is', ghosts[2].savedSpeed ,ghosts[2].className)
        // console.log('saved speed returned is', ghosts[3].savedSpeed ,ghosts[3].className)
        ghosts.forEach(ghost => ghost.speed = ghost.savedSpeed)
        // console.log(ghosts[0].className, ghosts[0].speed, 'unscaring')
        if (gameOver == 0) {
            for (let i = 0; i < ghosts.length; i++) {
                speedUp(ghosts[i], direction)
            }
            
            ghosts.forEach(ghost => ghost.constantTimer = setInterval(function() {speedUp(ghost, direction)}, constantIncrease))
            
        }  
        
        // ghosts.forEach(ghost => ghost.constantTimer = setInterval(function() {speedUp(ghost, direction)}, constantIncrease))


        // ghosts.forEach(ghost => ghost.constantTimer = setInterval(function() {speedUp(ghost, direction)}, constantIncrease))
        // ghosts.forEach(ghost => speedUp(ghost, direction))
        // console.log('after',ghosts[0].speed)
    }
    // ghosts.forEach(ghost => ghost.savedSpeed = 0)
    
    // alreadyEaten = 0
    ghostPoints = 0
    // powerEaten = 0
    
}

class Ghost {
    constructor(className, startIndex, speed) {
        this.className = className
        this.startIndex = startIndex
        this.speed = speed
        this.currentIndex = startIndex
        this.isScared = false
        this.timerId = NaN
        this.slowSpeed = 1300
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
    // console.log(ghosts[0].className, ghosts[0].isScared) //gets called 12 times initially
    ghostEaten()
    prevDirection = -direction 
    // ghost.savedDirection = direction
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


    if (((ghost.currentIndex == ghost.startIndex) || (ghost.currentIndex == ghost.startIndex - width)) && ((ghost.className == 'blinky') || (ghost.className == 'inky'))) { //&& (!squares[ghost.currentIndex + direction].classList.contains('wall'))) {
        if (squares[ghost.currentIndex + direction].classList.contains('ghost')) {
            direction = 0
        }
        else {
            direction = -width
            ghost.savedDirection = direction
        }
        
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
    else if (((ghost.currentIndex == ghost.startIndex) || (ghost.currentIndex == ghost.startIndex - width) || (ghost.currentIndex == ghost.startIndex - 2*width)) && ((ghost.className == 'pinky') || (ghost.className == 'clyde'))) { //&& (!squares[ghost.currentIndex + direction].classList.contains('wall'))) {
        if (squares[ghost.currentIndex + direction].classList.contains('ghost')) {
            direction = 0
        }
        else {
            direction = -width
            ghost.savedDirection = direction
        }

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
        // console.log('move')
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
                if (ghost.isScared) {
                    squares[ghost.currentIndex].classList.add('scared-ghost')
                }
            }
            //for tunneling
            else if (ghost.currentIndex == 364 && direction == -1) {
                squares[ghost.currentIndex].classList.remove(ghost.className)
                squares[ghost.currentIndex].classList.remove('ghost', 'scared-ghost')

                ghost.currentIndex = 391

                squares[ghost.currentIndex].classList.add(ghost.className)  
                squares[ghost.currentIndex].classList.add('ghost')
                if (ghost.isScared) {
                    squares[ghost.currentIndex].classList.add('scared-ghost')
                }
            }

            //for most cases
            else {
                // console.log(ghost.className, ghost.speed)
                updatedDirections = []
                for (let i = 0; i < directions.length; i++) {
                    if (directions[i] != prevDirection &&
                        (squares[ghost.currentIndex + directions[i]].classList.contains('empty') ||
                        squares[ghost.currentIndex + directions[i]].classList.contains('pac-dot') ||
                        squares[ghost.currentIndex + directions[i]].classList.contains('power-pellet') || 
                        squares[ghost.currentIndex + directions[i]].classList.contains('pacman') ||
                        squares[ghost.currentIndex + directions[i]].classList.contains('fruit-board') || 
                        squares[ghost.currentIndex + directions[i]].classList.contains('fruit-random')) &&
                        !squares[ghost.currentIndex + directions[i]].classList.contains('ghost') &&
                        ((squares[pacmanCurrentIndex] != undefined) && (squares[ghosts[i].currentIndex] != undefined))) {
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
                ghost.savedDirection = direction

                //####### For moving ghost ###########
                if (gameOver == 0) {
                    //remove any ghost
                    squares[ghost.currentIndex].classList.remove(ghost.className)
                    squares[ghost.currentIndex].classList.remove('ghost')
                    // //add direction to current Index
                    // ghostEaten()
                    if (ghost.isScared) {
                        squares[ghost.currentIndex].classList.remove('scared-ghost')
                        // ghostEaten()
                    }
                    // else if (!ghost.isScared) {
                    //     checkForGameOver()
                    //     // pacmanCaught(ghost) ********
                    // }
                    // else if (ghost.isScared) {
                    //     ghostEaten()
                    // }
                    
                    if (ghost.currentIndex != ghost.startIndex) {
                        // pacmanCaught(ghost)
                        ghost.currentIndex += direction
                        // pacmanCaught(ghost)
                        // if (!ghost.isScared) {
                        //     checkForGameOver()
                        //     // pacmanCaught(ghost) ********
                        // }
                        // else if (ghost.isScared) {
                        //     ghostEaten()
                        // }
                        // //add ghost class
                        if (ghost.currentIndex != pacmanCurrentIndex) {
                            squares[ghost.currentIndex].classList.add(ghost.className)  
                            squares[ghost.currentIndex].classList.add('ghost')
                        }
                        //if the ghost is currently scared 
                        if (ghost.isScared) {
                            squares[ghost.currentIndex].classList.add('scared-ghost')
                            // ghostEaten()
                            // clearInterval(ghost.timerId)
                        }
                        else if (!ghost.isScared) {
                            checkForGameOver()
                            // pacmanCaught(ghost) ********
                        }
                        // ghostEaten()
                        //###################################
                    }
                    
                }
                
            }

            
            ghostEaten()
            // ghost.savedDirection = direction

        }, changingSpeed)            
    }
    // ghost.savedDirection = direction

}

function startGhost(ghost) {
    direction = -width   //cannot remove    
    ghost.timerId = setInterval(function() {ghostMovement(ghost, ghost.speed, direction)}, ghost.speed)
    if (ghost.speed != ghost.slowSpeed) {
        ghost.constantTimer = setInterval(function() {speedUp(ghost, direction)}, constantIncrease)
    }
    
}


//check for game over
function checkForGameOver() {
    //if the square pacman is in contains a ghost AND the square does NOT contain a scared ghost 
    for (let i = 0; i < ghosts.length; i++) {
        if ((squares[pacmanCurrentIndex] != undefined) && (squares[ghosts[i].currentIndex] != undefined)) {
            if ((squares[pacmanCurrentIndex].classList.contains('ghost') && 
                !squares[pacmanCurrentIndex].classList.contains('scared-ghost')) || 
                (squares[ghosts[i].currentIndex].classList.contains('pacman') && 
                !squares[ghosts[i].currentIndex].classList.contains('scared-ghost')) && (gameOver == 0)) {
                    //for each ghost - we need to stop it moving
                    ghosts.forEach(ghost => clearInterval(ghost.timerId))
                    ghosts.forEach(ghost => clearInterval(ghost.constantTimer))
                    ghosts.forEach(ghost => ghost.isScared = false)

                    direction = 0
                    gameOver = 1
                    powerEaten = 0

                    scoreDisplay.innerHTML = `${score} L` 

                    if (score > highscore) {
                        highscore = score
                        highscoreDisplay.innerHTML = `${highscore} L` 
                    }

                    savedGrid = grid.innerHTML
                    grid.innerHTML = ''
                    grid.classList.add('hidden')
                    savedSquares = squares
                    squares = []
                    boxLoss.style.display = "block"
                    gif = setTimeout(function() {
                        boxLoss.style.display = "none"
                        // squares = savedSquares
                        grid.innerHTML = savedGrid
                        grid.classList.remove('hidden')
                        // grid.classList.add('active')
                        squares = savedSquares
                        savedSquares = []
                        clearTimeout(gif)
                        // restartBtn.classList.remove('active')
                        // restartBtn.classList.add('hidden')
                        startBtn.classList.remove('hidden')
                        startBtn.classList.add('active')
                    }, 3500)

                    // fruitBoardPoints = 50
                    // fruitRandomPoints = 100

                    //remove eventlistener from our control function
                    document.removeEventListener('keydown', control)
                    //tell user the game is over   
                    messageDisplay.innerHTML = 'YOU LOST'
                    clearInterval(timer)
                    clearTimeout(fruitBoard)
                    clearTimeout(fruitRandom)

                    restartBtn.classList.remove('active')
                    restartBtn.classList.add('hidden')
                    // startBtn.classList.remove('active')
                    // startBtn.classList.add('hidden')
                    // restartBtn.classList.remove('hidden')
                    // restartBtn.classList.add('active')
                    start = 0
                    lastEvent = 0
            }
        }
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
        ghosts.forEach(ghost => clearInterval(ghost.constantTimer))
        ghosts.forEach(ghost => ghost.isScared = false)

        countdownTimer.classList.remove('active')
        countdownTimer2.classList.remove('active')
        countdownTimer.classList.add('hidden')
        countdownTimer2.classList.add('hidden')

        direction = 0
        powerEaten = 0
        gameOver = 1

        unScareGhosts()
        clearTimeout(timeout)

        //if (ghosts[0].speed == ghosts[0].slowSpeed) {
        clearInterval(downloadTimer)
        //}
        

        score += winningPoints
        scoreDisplay.innerHTML = `${score} W` 

        if (score > highscore) {
            highscore = score
            highscoreDisplay.innerHTML = `${highscore} W` 
        }

        savedGrid = grid.innerHTML
        grid.innerHTML = ''
        grid.classList.add('hidden')
        savedSquares = squares
        squares = []
        boxWin.style.display = "block"
        gif = setTimeout(function() {
            boxWin.style.display = "none"
            // squares = savedSquares
            grid.innerHTML = savedGrid
            grid.classList.remove('hidden')
            // grid.classList.add('active')
            squares = savedSquares
            savedSquares = []
            clearTimeout(gif)
            // restartBtn.classList.remove('active')
            // restartBtn.classList.add('hidden')
            startBtn.classList.remove('hidden')
            startBtn.classList.add('active')
        }, 3500)

        // fruitBoardPoints = 50
        // fruitRandomPoints = 100

        //remove eventlistener from our control function
        document.removeEventListener('keydown', control)
        //tell user the game is over   
        messageDisplay.innerHTML = 'YOU WON!'
        clearInterval(timer)
        clearTimeout(fruitBoard)
        clearTimeout(fruitRandom)

        restartBtn.classList.remove('active')
        restartBtn.classList.add('hidden')
        // startBtn.classList.remove('active')
        // startBtn.classList.add('hidden')
        // restartBtn.classList.remove('hidden')
        // restartBtn.classList.add('active')
        start = 0
        lastEvent = 0
    }
}







// let touchstartX = 0
// let touchendX = 0
// let touchstartY = 0
// let touchendY = 0

// const slider = document.getElementById('slider')

// function handleGesture() {
//     let xDiff = Math.abs(touchendX - touchstartX)
//     let yDiff = Math.abs(touchendY - touchstartY)

//     if (xDiff > yDiff) {
//         if (touchendX < touchstartX) {
//             alert('swiped left!')
//             if (pacmanDirection != -1) {
//                 pacmanDirection = -1
//                 move()
//             }
//         }
//         if (touchendX > touchstartX) {
//             alert('swiped right!')
//             if (pacmanDirection != 1) {
//                 pacmanDirection = 1
//                 move()
//             }
//         }
//     }
//     else if (xDiff < yDiff) {
//         if (touchendY < touchstartY) {
//             alert('swiped up!') //might have these mixed up
//             if (pacmanDirection != -width) {
//                 pacmanDirection = -width
//                 move()
//             }
//         }
//         if (touchendY > touchstartY) {
//             alert('swiped down!') //might have these mixed up
//             if (pacmanDirection != width) {
//                 pacmanDirection = width
//                 move()
//             }
//         }
//     }

// }

// slider.addEventListener('touchstart', e => {
//     console.log('clicked')
//     touchstartX = e.changedTouches[0].screenX
//     touchstartY = e.changedTouches[0].screenY
// })

// slider.addEventListener('touchend', e => {
//     touchendX = e.changedTouches[0].screenX
//     touchendY = e.changedTouches[0].screenY
//     handleGesture()
// })







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










// html, body {
//     margin: 0;
//     padding: 0;
//     text-align: center;
//     background: black;
//     font-family: 'Press Start 2P', cursive;
//     height: 1vh;
// }

// button {
//     font-size: 2.5vh;
//     padding: 1.5vh 2.5vh;
//     /* padding: 10px 25px; */
//     transform: scale(1);
//     transition: transform 250ms;
//     cursor: pointer;
// }

// button:hover,
// button:focus {
//     transform: scale(1.2);
// }






// .screen {
//     height: auto;
//     /* padding-bottom: 56.25%; 16:9 */
//     position: relative;
//     /* border: lime solid 2px; */
// }

// .container {
//     margin: 3vh auto;
//     /* border: hotpink 2px solid; */
//     /* margin-top: 5%;
//     margin-bottom: 5%; */
//     height: 90vh;
//     width: 60vh;
//     /* width: 440px; */

//     /* position: absolute;
//     top: 0; left: 0;
//     width: 100%; 
//     height: 100%; */
// }

// .cols {
//     display: flex;
//     justify-content: space-between;
//     /* border: 1px solid purple; */
// }

// .left-col {
//     /* border: lime 2px solid; */
//     margin-left: 5%;
//     /* margin-left: 22px; */
// }
// .right-col {
//     /* border: hotpink 2px solid; */
//     margin-right: 5%;
//     /* margin-right: 22px; */
// }

// h1 {
//     width: 60vh;
//     /* width: 440px; */
//     /* padding-top: 20px; */
//     margin: 0 auto;
//     margin-bottom: 4vh;
//     /* font-size: 32px; */
//     font-size: 4.25vh;
//     color: yellow;
//     /* border: red solid 2px; */
    
// }

// h3 {
//     color: white;
//     font-size: 20px;
// }

// p {
//     margin-bottom: 0;
//     color: white;
//     margin: 0;
//     font-size: 2.5vh;
//     /* border: 2px solid aqua; */
//     /* font-size: 20px; */
// }

// /* .top { */
//     /* margin-top: 35px; */
//     /* border: 2px solid orange; */
// /* } */

// .cols {
//     display: flex;
//     flex-direction: row;
// }

// .grid {
//     display: flex;
//     flex-wrap: wrap;
//     width: 95.45%;
//     height: 64%;
//     /* width: 420px; */
//     /* height: 420px; */
//     /* border: solid red 2px; */
//     background: black;
//     margin: auto;
// }

// .grid div {
//     width: 3.57%;
//     height: 3.57%; 
//     /* width: 15px;
//     height: 15px;    */
// }

// .pac-dot {
//     background-color: peachpuff;
//     border: 0.75vh solid black;
//     /* border: 5px solid black; */
//     box-sizing: border-box;
//     border-radius: 1vh;
// }

// .ghost-lair {
//     background-color: black;
// }

// .wall {
//     background-color: black; /* navy*/
//     box-sizing: border-box;

//     /* background-color: black;
//     box-sizing: border-box;
//     border: 3px solid navy; */
// }

// .border-top {
//     border-top: 3px solid navy;
// }
// .border-right {
//     border-right: 3px solid navy;
// }
// .border-bottom {
//     border-bottom: 3px solid navy;
// }
// .border-left {
//     border-left: 3px solid navy;
// }
// .border-top-right {
//     border-top: 3px solid navy;
//     border-right: 3px solid navy;
// }
// .border-bottom-right {
//     border-bottom: 3px solid navy;
//     border-right: 3px solid navy;
// }
// .border-top-left {
//     border-top: 3px solid navy;
//     border-left: 3px solid navy;
// }
// .border-bottom-left {
//     border-bottom: 3px solid navy;
//     border-left: 3px solid navy;
// }
// .border-top-bottom {
//     border-top: 3px solid navy;
//     border-bottom: 3px solid navy;
//     padding: 0;
// }
// .border-left-right {
//     border-left: 3px solid navy;
//     border-right: 3px solid navy;
// }
// .border-top-right-bottom {
//     border-top: 3px solid navy;
//     border-right: 3px solid navy;
//     border-bottom: 3px solid navy;
// }
// .border-right-bottom-left {
//     border-right: 3px solid navy;
//     border-bottom: 3px solid navy;
//     border-left: 3px solid navy;
// }
// .border-bottom-left-top {
//     border-bottom: 3px solid navy;
//     border-left: 3px solid navy;
//     border-top: 3px solid navy;
// }
// .border-left-top-right {
//     border-left: 3px solid navy;
//     border-top: 3px solid navy;
//     border-right: 3px solid navy;
// }



// .power-pellet {
//     background-color: peachpuff;
//     border-radius: 1vh;
//     /* border-radius: 7.5px; */
//     border: none;
//     /* border: 2.75px solid black;
//     box-sizing: border-box; */

    
//     /* border-radius: 7.5px; */
// }

// .empty {
//     background-color: black;
// }

// .pacman {
//     background-color: yellow;
//     border-radius: 1vh;
//     /* border-radius: 7.5px; */
//     border: none;
// }

// .blinky {
//     background-color: red;
//     border-radius: 80% 80% 0% 0%;
//     border: none;
// }

// .pinky {
//     background-color: pink;
//     border-radius: 80% 80% 0% 0%;
//     border: none;
// }

// .inky {
//     background-color: aqua;
//     border-radius: 80% 80% 0% 0%;
//     border: none;
// }

// .clyde {
//     background-color: orange;
//     border-radius: 80% 80% 0% 0%;
//     border: none;
// }

// .scared-ghost {
//     background-color: blue;
//     border: none;
// }

// .active {
//     display: block;
//     margin: auto;
// }

// .hidden {
//     display: none;
// }

// #countdown-timer1,
// #countdown-timer2 {
//     color: white;
// }

// .countdown-timer {
//     color: white;
// }

// .fruit-board {
//     background-color: lime;
//     border-radius: 1vh;
//     /* border-radius: 7.5px; */
//     border: none;
// }

// .fruit-random {
//     background-color: magenta;
//     border-radius: 1vh;
//     /* border-radius: 7.5px; */
//     border: none;
// }

// /* #box-initial {
//     display: flex;
//     flex-wrap: wrap;
//     width: 420px;
//     height: 420px;
//     background: url("https://media2.giphy.com/media/jxJjBMvqEvMSA/giphy.gif?cid=ecf05e47e63bs3xaz0uslv2g8yc3cxr5noaq6v1r05vxno5h&rid=giphy.gif&ct=g");
//     margin: auto;
// } */

// #box-loss {
//     display: flex;
//     flex-wrap: wrap;
//     width: 420px;
//     height: 420px;
//     background: url("https://media1.giphy.com/media/hkqefnFjn2MWVl6xvq/giphy.gif?cid=ecf05e47e1q70lvjfkp0fycje1jz3xev0gpje69jf3zc8jdv&rid=giphy.gif&ct=g");
//     margin: auto;
// }

// #box-win {
//     display: flex;
//     flex-wrap: wrap;
//     width: 420px;
//     height: 420px;
//     background: url("https://media0.giphy.com/media/go3pCPP4899Jd3xb4p/giphy.gif?cid=ecf05e47mweyjpq4pcjuijko8c2n8yqcw5tiacckvy4a0o76&rid=giphy.gif&ct=g");
//     margin: auto;
// }


// #slider {
//     background-color: black;
//     border: none;
// }


// /* #arrow-keys {
//     display: flex;
//     flex-wrap: wrap;
//     width: 90%;
//     height: 1%; */
//     /* background: white; */
//     /* margin: auto; */
// /* } */

// /* #arrow-keys div,
// #arrow-keys button {
//     width: 33.33%;
//     height: 0.3333%; 
// }

// #arrow-keys button {
//     background: black;
//     border: none;
//     cursor: default;
// }

// #arrow-keys div {
//     background: black;   
// }

// #arrow-keys button:hover,
// #arrow-keys button:focus {
//     transform: scale(1);
// }  */



// /* #up-btn, #down-btn, #left-btn, #right-btn {
//     display: none;
// } */

// @media (max-width: 600px) {
//     .container {
//         margin: 3vh auto;
//         height: 90vh;
//         width: 100vw;
//         /* border: solid 1px red; */
//     }

//     /* h1 {
//         font-size: 3vh;
//     }
//      */
//     /* .pacman,
//     .power-pellet {
//         border-radius: 2vh;
//     }

//     .pac-dot {
//         border: 0.75vh solid black;
//         border-radius: 2vh;
//     } */

// }

//     /* #arrow-keys {
//         display: flex;
//         flex-wrap: wrap;
//         width: 90%;
//         height: 21%; */
//         /* background: white; */
//         /* margin: auto;
//     } */

//     /* #arrow-keys div,
//     #arrow-keys button {
//         width: 33.33%;
//         height: 33.33%; 
//     }

//     #arrow-keys button{
//         background: white;
//         cursor: pointer;
//     }

//     #arrow-keys div {
//         background: black;   
//     }

// } */