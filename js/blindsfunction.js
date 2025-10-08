const APP = {
  speed: 1000,
  time: 0,
  timeUntilBreak: 0,
  data: [],
  intervalID: "",
  breakIntervalID: "",
  init() {
      //Add listeners to the site
      //Work out the data that needs to fill the fields
      //Update the fields
      APP.addEventListeners();
      APP.howLongUntilBreak();
    },
  startingScreens() {
    // Add functionality to splash, settings, and tutorial screens
    const splash = document.querySelector("#splash")
    const logo = document.querySelector("#logo")
    const welcome = document.querySelector("#welcome")
    const enterSettingsButton = document.querySelector("#enter-your-settings-button")
    const blankInputs = document.querySelectorAll("form span")
    const saveBtn = document.querySelector("#btnSave")
    const inputs = document.querySelectorAll("input[type=number]")
    let inputsFilled = [0,0,0,0,0,0,0,0]
      
    setTimeout(function() {
      logo.classList.add("loaded-logo")
      welcome.classList.add("loaded-welcome")
      logo.innerText = "DPS"
      splash.classList.add("loaded-splash")
    }, 3000)

    splash.addEventListener("click", () => {
      logo.classList.add("loaded-logo")
      welcome.classList.add("loaded-welcome")
      splash.classList.add("loaded-splash")
    })
    enterSettingsButton.addEventListener("click", () => {
      const howItWorks = document.querySelector('#how-it-works')
      howItWorks.classList.add("dismissed")
      inputs[0].focus()
    })

    const form = document.querySelector("#form")
    
    blankInputs.forEach(input => {
      input.style.opacity = 0;
    })
    inputs.forEach((input, i) => {
      input.addEventListener("change", (e) => {
        isEmpty(e, i)
      })
    })
    function isEmpty(e, i) {
      if (e.target.value < .1) {
        inputsFilled[i] = 0
        e.target.value = ""
        e.target.previousElementSibling.firstElementChild.style.opacity = 0
      } else {
        inputsFilled[i] = 1
        e.target.previousElementSibling.firstElementChild.style.opacity = 1
        e.target.previousElementSibling.firstElementChild.innerText = e.target.value
      }
      let howFilled = 0
      for (let i = 0; i < inputsFilled.length; i++) {
        if (inputsFilled[i] > 0) {
          howFilled++
        }   
      }
      if (howFilled === 8) {
        saveBtn.disabled = false;
      } else {
        saveBtn.disabled = true;
      }
    }
    form.addEventListener('submit', APP.saveData);
    
    form.addEventListener("submit", () => {
      collect.classList.add("dismissed")
      APP.init()
    })    
  },
  addEventListeners() {
    const settings = document.querySelector(".js-settings");
    
    // open settings menu
    const settingsIcon = document.querySelector(".settings-section");

    settingsIcon.addEventListener("click", () => {
      settings.style.left = "0%";
    });
    
    // close settings menu
    const closeSettings = settings.querySelector(".js-close-settings");
    
    closeSettings.addEventListener("click", () => {
      settings.style.left = "101%";
    });
    
    // start and stop the clock
    const playButton = document.querySelector(".js-play-pause");
    let playButtonClicked = false;
    let timer = false;
    // let intervalID;
    // let breakIntervalID;
    
    playButton.addEventListener("click", () => {
      if (!playButtonClicked) {
        playButton.firstElementChild.src = "./assets/icons/pause.svg";
        playButtonClicked = true;
        timer = true;
        APP.intervalID = setInterval(APP.updateCountdown, APP.speed);
        APP.breakIntervalID = setInterval(APP.updateBreakTimer, APP.speed);
      } else {
        playButton.firstElementChild.src = "./assets/icons/play.svg";
        playButtonClicked = false;
        timer = false;
        clearInterval(APP.intervalID);
        clearInterval(APP.breakIntervalID);
      };
    });

    const next = document.getElementById("next");
    next.addEventListener("click", () => {
      const table = document.querySelector("table");
      const currentLevel = table.querySelector(".current");
      if (currentLevel.nextElementSibling) {
        APP.updateCurrent();
        APP.howLongUntilBreak();
      };
    })
    const previous = document.getElementById("previous");
    previous.addEventListener("click", () => {
      const table = document.querySelector("table");
      const currentLevel = table.querySelector(".current");
      if (currentLevel.children[1].innerText != 1) {
        APP.moveBackCurrent();
        APP.howLongUntilBreak();
      };
    })
  },
  saveData(ev) {
    ev.preventDefault();

    const form = ev.target;
    const formdata = new FormData(form);
    // save the data in APP.data
    APP.cacheData(formdata)
  },
  cacheData(formdata) {
    let userValues = Object.fromEntries(formdata.entries())
    if (userValues.numberOfPlayers == '') {
      userValues.numberOfPlayers = sessionStorage.getItem("players");
    }
    if (userValues.gameDurationHours  == '') {
      userValues.gameDurationHours  = sessionStorage.getItem("gameLength");
    }
    if (userValues.levelDuration == '') {
      userValues.levelDuration = sessionStorage.getItem("levelLength");
    }
    if (userValues.startingStack  == '') {
      userValues.startingStack = sessionStorage.getItem("stack");
    }
    if (userValues.smallestChipValue  == '') {
      userValues.smallestChipValue = sessionStorage.getItem("smallestChip");
    }
    if (userValues.breakLengthMinutes == '') {
      userValues.breakLengthMinutes = sessionStorage.getItem("breakLength");
    }
    if (userValues.maxTimeBetweenBreaks  == '') {
      userValues.maxTimeBetweenBreaks = sessionStorage.getItem("betweenBreaksLength");
    }
    if (userValues.startingSmallBlind  == '') {
      userValues.startingSmallBlind = sessionStorage.getItem("smallBlind");
    }
    const labels = document.querySelectorAll("form label");
    const foo = Object.values(userValues)
    for (let i = 0; i < labels.length; i++) {
      labels[i].firstElementChild.innerText = foo[i];
    }
    sessionStorage.setItem("players", foo[0])
    sessionStorage.setItem("gameLength", foo[1])
    sessionStorage.setItem("levelLength", foo[2])
    sessionStorage.setItem("stack", foo[3])
    sessionStorage.setItem("smallestChip", foo[4])
    sessionStorage.setItem("breakLength", foo[5])
    sessionStorage.setItem("betweenBreaksLength", foo[6])
    sessionStorage.setItem("smallBlind", foo[7])
    
    APP.buildTable(userValues.numberOfPlayers, userValues.gameDurationHours, userValues.levelDuration, userValues.startingStack, userValues.smallestChipValue, userValues.breakLengthMinutes, userValues.maxTimeBetweenBreaks, userValues.startingSmallBlind)
  },
  buildTable(numberOfPlayers, gameDurationHours, levelDuration, startingStack, smallestChipValue, breakLengthMinutes, maxTimeBetweenBreaks, startingSmallBlind) {
    const lastLevelSmallBlind = Math.floor(startingStack * startingSmallBlind * 2 * numberOfPlayers * .134 * .01) * 100;
    console.log("Total Chips in play: " + startingStack * startingSmallBlind * 2 * numberOfPlayers)
    console.log("My jank solution: " + lastLevelSmallBlind * 2)
    console.log("Suggested 7% last level Big Blind = " + startingStack * 2 * startingSmallBlind * numberOfPlayers * .07)
    const gameDurationMinutes = (gameDurationHours * 60) + 30;
    const numberOfBreaks = Math.floor(gameDurationMinutes / (Number(maxTimeBetweenBreaks) + Number(breakLengthMinutes)));
    const numberOfLevels = Math.ceil((gameDurationMinutes - numberOfBreaks * breakLengthMinutes) / levelDuration + 1);

    const tableBody = document.getElementById('table-body');

    // Initialise list
    let startingBlindIncrement = 1.1
    
    loopThroughBlinds();

    // Function to loop through blinds looking for correct tempIncrement value 
    function loopThroughBlinds() {
      startingBlindIncrement = Math.round(startingBlindIncrement * 100) / 100;
      let x = startingSmallBlind;
      let y = x * 2;
      let z = 0;
      let time = 0;
      let hours = 0;
      let minutes = "00";
      let breaks = 0;
      let h = 5;
      let levelNumber = 1

      tableBody.innerHTML = `
          <tr class="current level">
            <td class="time">0:00</td>
            <td class="levelNumber">1</td>
            <td class="smallBlind">${x}</td>
            <td class="bigBlind">${y}</td>
            <td class="ante">${z}</td>
            <td class="duration">${levelDuration}</td>
          </tr>`
          levelNumber++
    
      for (let i = 1; i < Number(numberOfLevels); i++) {
        x < 40 ? h = 5
        : x < 100 ? h = 10 
        : x < 450 ? h = 25
        : h = 100
        x = Math.ceil((x * Number(startingBlindIncrement)) / h) * h;
        y = x * 2
        time = time + Number(levelDuration);
        hours = Math.floor(time / 60);
        minutes = time % 60;
        minutes = minutes < 10 ? "0" + minutes : minutes; 

        const levelsBetweenBreaks = Math.ceil(numberOfLevels / (numberOfBreaks + 1))

        if ( (levelNumber - 1) % levelsBetweenBreaks == 0) {
          tableBody.innerHTML+= `
          <tr class="break">
            <td class="time">${hours}:${minutes}</td>
            <td class=""></td>
            <td class="" style="font-weight: 600;">BREAK</td>
            <td class=""></td>
            <td class=""></td>
            <td class="duration">${breakLengthMinutes}</td>
          </tr>`
          breaks++;
          levelNumber++
          time = time + parseInt(breakLengthMinutes);
          minutes = time % 60;
          minutes = minutes < 10 ? "0" + minutes : minutes;
          hours = Math.floor(time / 60);
        }

        tableBody.innerHTML+= `
          <tr class="level">
            <td class="time">${hours}:${minutes}</td>
            <td class="levelNumber">${i + 1}</td>
            <td class="smallBlind">${x}</td>
            <td class="bigBlind">${y}</td>
            <td class="ante">${z}</td>
            <td class="duration">${levelDuration}</td>
          </tr>`
          levelNumber++
      }
      if (x > lastLevelSmallBlind) {
        return;
      } else {
        startingBlindIncrement += 0.01;
        loopThroughBlinds();
      }
      return;
    }
    APP.howLongUntilBreak();
  },
  howLongUntilBreak() {
    const breakTimeField = document.querySelector(".break-time")
    const table = document.querySelector("table");
    const rounds = table.children[1].children
    const currentLevel = table.querySelector(".current")
    const countDownClock = document.querySelector(".countdown-clock").firstElementChild;
    
    countDownClock.innerText = currentLevel.children[5].innerText + ":00";
    let startingMinutes = parseInt(currentLevel.children[5].innerText);
    APP.time = startingMinutes * 60;
    
    let index
    // let pokerLevels = 0
    let cumulativeTime = 0;
    // Get the index of the current level
    for (let j = 0; j < rounds.length; j++) {
      if (rounds[j].classList.contains("current")) {
        index = j;
        break;
      };
    }
    // for (let l = 0; l < rounds.length; l++) {
    //   if (rounds[l].classList.contains("level")) {
    //     // pokerLevels++
    //   } else {
    //     // breaks++
    //   }
    // }

    // Loop through all the levels until you hit a break
    for (let i = index; i < rounds.length; i++) {
      if (rounds[i].classList.contains("break")) {
        break;
      } else {
        cumulativeTime += parseInt(rounds[i].children[5].innerText);
      }
      // Accumulate the duration
      // if next level contains break reset timer to 0 and level counter to 0 and return the cumulative duration.
    }
    APP.timeUntilBreak = cumulativeTime * 60;
    APP.updateCountdown(startingMinutes);
    APP.updateBreakTimer();
    APP.updateFields(breakTimeField);
  },

  updateFields() {
    const table = document.querySelector("table");
    const levels = table.querySelectorAll(".level");
    const numberOfLevels = levels.length;
    const breakTimeField = document.querySelector(".break-time")
    const countDownClock = document.querySelector(".countdown-clock").firstElementChild;
    const currentRoundText = document.querySelector(".js-round-number");
    const smallBlindText = document.querySelector(".blinds1");
    const bigBlindText = document.querySelector(".blinds2");
    const nextSmallBlindText = document.querySelector(".next-blinds1");
    const nextBigBlindText = document.querySelector(".next-blinds2");
    const anteText = document.querySelector(".ante-number");
    const nextAnteText = document.querySelector(".next-ante-number");
    const nextBlinds = document.querySelector(".next-blinds")
    const nextAnte = document.querySelector(".next-ante")
    let currentLevel = document.querySelector(".current");
    let levelNumber = currentLevel.children[1].innerText;
    let breakClock = document.querySelector(".js-time-to-break_clock")
    let breakMinutes = Math.floor(APP.timeUntilBreak / 60);
    let breakSeconds = APP.timeUntilBreak % 60;
    breakSeconds = breakSeconds < 10 ? "0" + breakSeconds : breakSeconds

      
    document.body.style.backgroundColor = "rgb(22, 22, 22)";
    breakTimeField.innerHTML = `
    <h3 class="time-to-break_title">Time until break</h3>
    <div class="time-to-break_clock js-time-to-break_clock">-</div>`
    nextBlinds.style.display = "block";
    nextAnte.style.display = "block";

    breakClock = document.querySelector(".js-time-to-break_clock")
    breakMinutes = Math.floor(APP.timeUntilBreak / 60);
    breakSeconds = APP.timeUntilBreak % 60;
    breakSeconds = breakSeconds < 10 ? "0" + breakSeconds : breakSeconds
    // update fields
    // If there are no more rounds
    if (currentLevel.children[1].innerText == numberOfLevels)  {
      console.log("No more rounds")
      currentRoundText.innerText = `Last round! Level ${levelNumber} of ${numberOfLevels}`;
      breakClock.innerText = `${breakMinutes}:${breakSeconds}`;
      smallBlindText.innerText = currentLevel.children[2].innerText;
      bigBlindText.innerText = currentLevel.children[3].innerText;
      nextBlinds.style.display = "none";
      anteText.innerText = currentLevel.children[4].innerText;
      nextAnte.style.display = "none";
      countDownClock.innerText = currentLevel.children[5].innerText + ":00";
      //If the next round is a break
    } else if (currentLevel.nextElementSibling.classList.contains("break")) {
      console.log("Next round is a break")
      currentRoundText.innerText = `Level ${levelNumber} of ${numberOfLevels}`;
      breakClock.innerText = `${breakMinutes}:${breakSeconds}`;
      smallBlindText.innerText = currentLevel.children[2].innerText;
      bigBlindText.innerText = currentLevel.children[3].innerText;
      nextSmallBlindText.innerText = currentLevel.nextElementSibling.nextElementSibling.children[2].innerText;
      nextBigBlindText.innerText = currentLevel.nextElementSibling.nextElementSibling.children[3].innerText;
      anteText.innerText = currentLevel.children[4].innerText;
      nextAnteText.innerText = currentLevel.nextElementSibling.nextElementSibling.children[4].innerText + ":00";
      countDownClock.innerText = currentLevel.children[5].innerText + ":00"; 
      // If it is a break
    } else if (currentLevel.classList.contains("break")) {
      console.log("Break")
      breakTimeField.innerHTML = `
      <h1 style="font-size: 5vh">Break Time</h2>`
      document.body.style.backgroundColor = "lightblue";
      smallBlindText.innerText = currentLevel.previousElementSibling.children[2].innerText;
      currentRoundText.innerText = `Break`;
      bigBlindText.innerText = currentLevel.previousElementSibling.children[3].innerText;
      nextSmallBlindText.innerText = currentLevel.nextElementSibling.children[2].innerText;
      nextBigBlindText.innerText = currentLevel.nextElementSibling.children[3].innerText;
      anteText.innerText = currentLevel.previousElementSibling.children[4].innerText;
      nextAnteText.innerText = currentLevel.nextElementSibling.children[4].innerText;
      countDownClock.innerText = currentLevel.children[5].innerText + ":00";
    } else if (!currentLevel.classList.contains("break") && currentLevel.previousElementSibling != null && currentLevel.previousElementSibling.classList.contains("break")) {
      // Previous level was a break
      console.log("Previous level was break")
      currentRoundText.innerText = `Level ${levelNumber} of ${numberOfLevels}`;
      breakClock.innerText = `${breakMinutes}:${breakSeconds}`;
      smallBlindText.innerText = currentLevel.children[2].innerText;
      bigBlindText.innerText = currentLevel.children[3].innerText;
      nextSmallBlindText.innerText = currentLevel.nextElementSibling.children[2].innerText;
      nextBigBlindText.innerText = currentLevel.nextElementSibling.children[3].innerText;
      anteText.innerText = currentLevel.children[4].innerText;
      nextAnteText.innerText = currentLevel.nextElementSibling.children[4].innerText;
      countDownClock.innerText = currentLevel.children[5].innerText + ":00";
    } else {
      console.log("Normal round")
      currentRoundText.innerText = `Level ${levelNumber} of ${numberOfLevels}`;
      breakClock.innerText = `${breakMinutes}:${breakSeconds}`;
      smallBlindText.innerText = currentLevel.children[2].innerText;
      bigBlindText.innerText = currentLevel.children[3].innerText;
      nextSmallBlindText.innerText = currentLevel.nextElementSibling.children[2].innerText;
      nextBigBlindText.innerText = currentLevel.nextElementSibling.children[3].innerText;
      anteText.innerText = currentLevel.children[4].innerText;
      nextAnteText.innerText = currentLevel.nextElementSibling.children[4].innerText;
      countDownClock.innerText = currentLevel.children[5].innerText + ":00";
    }
    // if(smallBlindText.innerText < 40) {
    //     console.log(smallBlindText.innerText)
    //     return
    //   } else if(smallBlindText.innerText < 100) {
    //     alert("Chip-up 5s to 10s")
    //   } else if(smallBlindText.innerText < 450) {
    //     alert("Chip-up 10s to 25s")
    //   }
    // smallBlindText.innerText > 40 && smallBlindText.innerText < 100 ? 
    // : smallBlindText.innerText < 450 ? alert("Chip-up 10s to 25")
    // : alert("Chip-up 25s to 100s")
  },
  updateCountdown() {
    const countDownClock = document.querySelector(".countdown-clock").firstElementChild;
    const progressBar = document.querySelector(".time-left-graphic")
    const currentLevel = document.querySelector(".current")

    APP.time--
    if (APP.time < 0) {
      clearInterval(APP.intervalID); // Stop the current countdown
      APP.updateCurrent();       // Update to the next round
      APP.howLongUntilBreak();   // Recalculate break time
      return;
    }
    let minutes = Math.floor( APP.time / 60 );
    let seconds = APP.time % 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    
    countDownClock.innerText = `${minutes}:${seconds}`

    const totalLevelTime = parseInt(currentLevel.children[5].innerText) * 60;
    progressBar.style.width = ((totalLevelTime - APP.time) / totalLevelTime * 100) + "%";

    if (APP.time < 6 && APP.time > 0) {
      if (APP.time % 2 === 0) {
        document.body.style.backgroundColor = "red";
      } else {
        document.body.style.backgroundColor = "rgb(22, 22, 22)";
      }
    };
    if (APP.time <= 0) {
      clearInterval(APP.intervalID);
      progressBar.style.width = "0%"
      APP.updateCurrent();
      APP.updateFields();
      const startingMinutes = parseInt(currentLevel.children[5].innerText);
      APP.time = startingMinutes * 60;
      APP.intervalID = setInterval(APP.updateCountdown, APP.speed);
    }
  },
  updateBreakTimer() {
    const breakTimeField = document.querySelector(".break-time")
    const remainingTimeCountdown = breakTimeField.children[1]
    if (APP.tiemUntilBreak <= 0 || undefined || null ) {
      clearInterval(APP.breakIntervalID);
      APP.timeUntilBreak = 0;
      return;
    } else {
      APP.timeUntilBreak--;
      let minutes = Math.floor( APP.timeUntilBreak / 60 );
      let seconds = APP.timeUntilBreak % 60;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      if (remainingTimeCountdown != null) {
        remainingTimeCountdown.innerText = `${minutes}:${seconds}`
      }
    }
  },
  updateCurrent() {
    const table = document.querySelector("table");
    let currentLevel = table.querySelector(".current");
    currentLevel.classList.remove("current");
    
    if (currentLevel.nextElementSibling) {
      currentLevel.nextElementSibling.classList.add("current");
    } else {
      alert("Time's Up. End of planned blinds")
    }
    // currentLevel.nextElementSibling.classList.add("current");
    // currentLevel = document.querySelector(".current");
    APP.updateFields();
    APP.howLongUntilBreak();
  },
  moveBackCurrent() {
    const table = document.querySelector("table");
    let currentLevel = table.querySelector(".current");
    currentLevel.classList.add("temporary")
    let temporary = table.querySelector(".temporary")
    temporary.previousElementSibling.classList.add("current");
    temporary.classList.remove("current");
    temporary.classList.remove("temporary");
    currentLevel = document.querySelector(".current");
  }
};

document.addEventListener('DOMContentLoaded', APP.startingScreens)
