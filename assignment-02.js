//references: 
//https://www.youtube.com/watch?v=n_ec3eowFLQ
//https://freshman.tech/simon-game/

let highestScore = 0; 

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("start").addEventListener("click", initializeGame);
  document.getElementById("highest-score").textContent = highestScore.toString().padStart(2, '0');
  // Bind click event handlers to each color button
  document.querySelectorAll(".circle").forEach(button => {
    button.addEventListener("click", handlePlayerClick);
  });
});

function initializeGame() {
  document.getElementById("start").disabled = true;
  document.getElementById("gameLight").style.backgroundColor = "green";
  sequence = [];
  userSeq = [];
  level = 0;
  setTimeout(addToSequence, 3000);
}

function addToSequence() {
  const colors = ['green', 'red', 'yellow', 'blue'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  sequence.push(randomColor); // Add a random color to the sequence
  showSequence();
}

function showSequence() {
  let i = 0;
  userSeq = []; // Reset user sequence
  let intervalTime = 1000; // Initial interval set to 1000ms
  
  // Adjust interval time based on the length of the sequence
  if (sequence.length > 13) {
    intervalTime = 500; 
  } else if (sequence.length > 9) {
    intervalTime = 600; 
  } else if (sequence.length > 5) {
    intervalTime = 700; 
  }

  const intervalId = setInterval(() => {
    lightUp(sequence[i]);
    i++;
    if (i >= sequence.length) {
      clearInterval(intervalId);
      givePlayerTime(); // After the sequence is displayed, wait for the player to act
    }
  }, intervalTime);
}

function flashAllButtons(times) {
  let count = 0;
  const flashInterval = setInterval(() => {
    // Toggle the 'active' class on all buttons to create a flashing effect
    document.querySelectorAll(".circle").forEach(button => {
      button.classList.add('active');
    });
    
    setTimeout(() => {
      document.querySelectorAll(".circle").forEach(button => {
        button.classList.remove('active');
      });
    }, 250); // Short duration of lighting up for the flashing effect

    count++;
    if (count >= times) {
      clearInterval(flashInterval);
    }
  }, 500); // Interval of flashing
}

function lightUp(color) {
  // If the color parameter is an array, flash all buttons
  if (Array.isArray(color)) {
    color.forEach(c => {
      const button = document.getElementById(c);
      button.classList.add('active');
      setTimeout(() => {
        button.classList.remove('active');
      }, 500); // Duration of flashing
    });
  } else { // Otherwise, only flash the specified color button
    const button = document.getElementById(color);
    button.classList.add('active');
    setTimeout(() => {
      button.classList.remove('active');
    }, 500); // Duration of flashing
  }
}

function handlePlayerClick(event) {
  clearTimeout(timeId); // Clear any existing timeout timer

  const color = event.target.id;
  userSeq.push(color);
  lightUp(color);

  // Check if the user sequence is correct
  for (let i = 0; i < userSeq.length; i++) {
    if (userSeq[i] !== sequence[i]) {
      displayError();
      return;
    }
  }

  // If the user has correctly copied the entire sequence
  if (userSeq.length === sequence.length) {
    level++; // Successfully completed a sequence click, increase the level
    document.getElementById("current-score").textContent = level.toString().padStart(2, '0'); // Update the success score display

    if (level < 20) {
      setTimeout(() => {
        addToSequence(); // Continue the game, add a new color to the sequence
      }, 1000);
    } 
  } else {
    // The user has not completed the sequence, reset the timeout timer for the next click
    givePlayerTime();
  }
}

function givePlayerTime() {
  // Set a timeout timer, if the user doesn't click within 5 seconds, execute failure logic
  timeId = setTimeout(() => {
    displayError(); // Trigger failure logic
  }, 5000);
}

function displayError() {
  // Flash all buttons 5 times to indicate an error
  flashAllButtons(5);
  updateScores(); // Update scores when displaying error
  
  // Ensure execution after all buttons have finished flashing
  setTimeout(() => {
    document.getElementById("gameLight").style.backgroundColor = "red"; // Change the indicator light to red
    document.getElementById("current-score").textContent = "00"; // Reset the success score display to 00
    document.getElementById("start").disabled = false; // Re-enable the start button
  }, 5 * (500 + 250));
}

function updateScores() {
  const currentScore = parseInt(document.getElementById("current-score").textContent);
  if (currentScore > highestScore) {
    highestScore = currentScore; // If the current score is higher than the highest score, update the highest score
  }
  document.getElementById("highest-score").textContent = highestScore.toString().padStart(2, '0');
}
