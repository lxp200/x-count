// Lucas' game

const startButton = document.querySelector('#start');
const submitButton = document.querySelector('#submit');
const answerInput = document.querySelector('#answer');
const sequenceTimer = document.querySelector('#sequence-timer');
const sequenceGrid = document.querySelector('#sequence-grid');
const currentScore = document.querySelector('#game-current-score');
const highScore = document.querySelector('#game-highscore');

let xcountScore = localStorage.getItem("highscoreXCount") || 0;
highScore.textContent = xcountScore;

// game settings can be tweaked here
const charCount = 500;
const defaultTimer = 10.0;

// score formula can be tweaked here
function calculateScore(userGuess, timeLeft) {

    const answerWeight = 0.75;
    const timerWeight = 0.25;
    const maxScore = 20;

    let score = (((1 - Math.abs(userGuess - xCountPercentage) / xCountPercentage) * answerWeight) + ((1 - Math.abs(timeLeft - defaultTimer) / defaultTimer) * timerWeight)) * maxScore;

    return Math.round(score);

};

sequenceTimer.innerText = defaultTimer.toFixed(1);

let currentTimer = defaultTimer;
let timerStop = false;
let xCount = 0;
let xCountPercentage = 0;

submitButton.disabled = true;

// start button event listener
startButton.addEventListener('click', function () {

    startButton.disabled = true;
    submitButton.disabled = false;
    answerInput.value = '';
    answerInput.focus();

    currentTimer = defaultTimer;
    timerStop = false;


    // generate the randomized sequence of characters
    let characters = '';
    let targetPercentage = Math.floor(Math.random() * 81) + 10; // about 10 ~ 90% (inclusive) of the sequence should be filled with Xs

    for (let i = 0; i < charCount; i++) {

        let randomNum = Math.random();

        if (randomNum > targetPercentage / 100) {
            characters += '#';
        } else {
            characters += '<span class="x">X</span>';
            xCount++;
        }
    }

    xCountPercentage = Math.round((xCount / charCount) * 100);

    // console output for testing purpose
    console.log("targetPercentage", targetPercentage);
    console.log("xCount", xCount);
    console.log("xCountPercentage", xCountPercentage);

    sequenceGrid.innerHTML = characters;

    // timer
    sequenceTimer.innerHTML = currentTimer.toFixed(1);

    let interval = setInterval(function () {
        currentTimer -= 0.1;
        sequenceTimer.innerHTML = (currentTimer + 0.1).toFixed(1); // compensate for interval

        if (currentTimer <= 0) {
            currentTimer += 0.1;                                  // compensate for interval
            clearInterval(interval);
            sequenceTimer.innerHTML = 0;
            sequenceGrid.innerHTML = "Time's up! Please submit your answer to continue.";
        } else if (timerStop) {
            clearInterval(interval);
        }

        // change timer container color based on remaining time
        if (currentTimer >= 6.66) {

            // clear classes when timer starts
            document.querySelector('#timer-container').classList.remove('timer-green');
            document.querySelector('#timer-container').classList.remove('timer-orange');
            document.querySelector('#timer-container').classList.remove('timer-red');

            document.querySelector('#timer-container').classList.add('timer-green');

        } else if (currentTimer >= 3.33 && currentTimer <= 6.66) {

            document.querySelector('#timer-container').classList.remove('timer-green');
            document.querySelector('#timer-container').classList.add('timer-orange');

        } else if (currentTimer <= 3.33) {

            document.querySelector('#timer-container').classList.remove('timer-orange');
            document.querySelector('#timer-container').classList.add('timer-red');

        }

    }, 100);

});

// submit button event listener
submitButton.addEventListener('click', function () {

    timerStop = true;
    submitButton.disabled = true;

    let guess = parseInt(answerInput.value);
    let score = calculateScore(guess, currentTimer);

    // update the current score and display the summary
    currentScore.innerText = score;
    sequenceGrid.innerHTML = `
        <p>Your answered <span class="highlight">${guess}</span>% with <span class="highlight">${currentTimer.toFixed(1)}</span>s left</p><br />
        <p>The correct X-count percentage was <span class="highlight">${xCountPercentage}</span>%</p><br />
        <p>Your score is: <span class="highlight">${score}</span></p>
    `;

    // update high score if necessary
    let currentHighScore = highScore.innerText;
    if (score > currentHighScore) {
        highScore.innerText = score;
        localStorage.setItem("highscoreXCount", score);
    }

    // reset values for next round
    xCount = 0;
    xCountPercentage = 0;
    startButton.innerText = "Restart";
    startButton.disabled = false;
    startButton.focus();

});
