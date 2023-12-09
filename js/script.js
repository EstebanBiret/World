countries2Guess = [];
countriesGuessed = [];

const audio = new Audio("sounds/minecraft.mp3");
const audioLose = new Audio("sounds/died.mp3");
const audioXp = new Audio("sounds/xp.mp3");
const audioClick = new Audio("sounds/click.mp3");
const audioWin = new Audio("sounds/win.mp3");
const audioMenu = new Audio("sounds/menu.mp3");
const audioBook = new Audio("sounds/book.mp3");

const svgElement = document.getElementById('allSvg');

// const mode1Screen = document.getElementById('mode-1-screen');
// const backToHomeScreenFrom1Button = document.getElementById('back-to-home-screen-from-1-button');
// const playMode1Button = document.getElementById('play-mode-1-button');

const mode2Screen = document.getElementById('mode-2-screen');
const backToHomeScreenFrom2Button = document.getElementById('back-to-home-screen-from-2-button');
const playMode2Button = document.getElementById('play-mode-2-button');
const countriesFound = document.getElementById('countries-found');
const countryInput = document.getElementById('country-input');

const mode4Screen = document.getElementById("mode-4-screen");
const mode4ScreenContent = document.getElementById("mode-4-screen-content");
const backToHomeScreenFrom4Button = document.getElementById("back-to-home-screen-from-4-button");
const startQuizOverlay = document.getElementById("start-quiz-overlay");
const playMode4Button = document.getElementById('play-mode-4-button');

const numberOfCountries = document.getElementById('number-of-countries');
const maxCountries = Object.keys(allCountries).length;
numberOfCountries.max = maxCountries;
const continentsCountries= document.getElementById("continents-countries");

//back button of mode on the map (pour la 3, direct menu principal)
// const backToGameModeMenuButton1 = document.getElementById('back-to-menu-button-1');
const backToGameModeMenuButton2 = document.getElementById('back-to-menu-button-2');
const backToGameModeMenuButton3 = document.getElementById('back-to-menu-button-3');

const helpOverlay = document.getElementById("help-overlay");
const helpButtonOpen = document.getElementById("help-open");
const helpButtonClose = document.getElementById("help-close");

const promptOverlay = document.getElementById("prompt-overlay");
const promptOpen = document.getElementById("prompt-open");
const promptClose = document.getElementById("prompt-close");

let started = false;

// 2, 3 ou 4
let gameMode;

const winOverlay = document.getElementById("win-overlay");
const replayButton = document.getElementById("replay");
const gameModeMenuButton = document.getElementById("home");

const discoverOverlay = document.getElementById("discover-overlay");
const discoverCountryName = document.getElementById("country-name");
const discoverCountryCapital = document.getElementById("country-capital");
const discoverCountryFlag = document.getElementById("country-flag");
const discoverClose = document.getElementById("discover-close");

const mapScreen = document.getElementById('map-screen');

const homeScreen = document.getElementById('home-screen');
// const gameMode1Button = document.getElementById('mode-1');
const gameMode2Button = document.getElementById('mode-2');
const gameMode3Button = document.getElementById('mode-3');
const gameMode4Button = document.getElementById('mode-4');

//change color of all country (white->brown) or reset when disco 
function resetColor() {
    for (const key in allCountries) {
        const countrySelector = `[id="${key}"]`;
        const countryElements = document.querySelectorAll(countrySelector);

        countryElements.forEach(countryElement  => {
            countryElement.style.fill = "rgb(235, 209, 155)";
        });
    }
}

function guessCountries(numberOfCountries) {
    // console.log(numberOfCountries + " pays à deviner !");
    const countriesCopy = { ...allCountries };
    const continentCounts = {
        Europe: 0,
        Amérique: 0,
        Afrique: 0,
        Océanie: 0,
        Asie: 0
    };

    for (var i = 0; i < numberOfCountries; i++) {
        var keys = Object.keys(countriesCopy);
        var number = Math.floor(Math.random() * keys.length);
        var selectedCountry = countriesCopy[keys[number]];
        countries2Guess.push(selectedCountry);

        const continent = selectedCountry["continent"];
        continentCounts[continent]++;
        const paragraph = document.querySelector(`#continents-countries p[data-continent="${continent}"]`);
        
        if(paragraph){
            paragraph.innerHTML = `${continent} : 0/${continentCounts[continent]}`;
            paragraph.style.color = '#B51F1F'; 
        }
                 
        //retire le pays sélectionné de la copie du JSON
        delete countriesCopy[keys[number]];
        const selector = `[id="${Object.keys(allCountries).find(key => allCountries[key] === selectedCountry)}"]`;
        const elements = document.querySelectorAll(selector);

        //colorie en rouge
        elements.forEach(element => {
            element.style.fill = "rgb(223, 74, 74)";
        });
    }
    countriesFound.innerHTML = "Pays trouvés : 0/" + numberOfCountries;
}

function updateContinents(isoFound){
    const continent = allCountries[isoFound]["continent"];
    const paragraph = document.querySelector(`#continents-countries p[data-continent="${continent}"]`);

    if (paragraph) {
        const matches = paragraph.innerHTML.match(/(\d+)\/(\d+)/);
        if (matches) {
            const currentCount = parseInt(matches[1]);
            const totalCount = parseInt(matches[2]);

            const newCount = currentCount + 1;
            paragraph.innerHTML = `${continent} : ${newCount}/${totalCount}`;
            const percentage = (newCount / totalCount) * 100;

             if (percentage <= 66 && percentage > 33) {
                paragraph.style.color = 'rgb(255, 153, 0)';          
            } else if (percentage < 100 && percentage > 66) {
                paragraph.style.color = 'rgb(255, 238, 0)';          
            } else if (percentage == 100){
                paragraph.style.color = 'rgb(15, 235, 34)';          
            }
        }
    }
}

function resetContinent() {
    const paragraph = document.getElementById("continents-countries");
    paragraph.innerHTML = "<p>Localisation des pays à trouver : </p><br><p data-continent='Europe'>Europe : 0/0</p><p data-continent='Amérique'>Amérique : 0/0</p><p data-continent='Afrique'>Afrique : 0/0</p><p data-continent='Océanie'>Océanie : 0/0</p><p data-continent='Asie'>Asie : 0/0</p>";
}

function exitGame() {
    countries2Guess = [];
    countriesGuessed = [];
    stopDisco();
    removeConfetti();
    input.value = "";
    countriesFound.innerHTML = "";
}

function exitInformations() {
    inInformations = false;
    input.value = "";
    discoverOverlay.classList.add('fade-out');
    setTimeout(() => {
        discoverOverlay.style.display = "none";
        discoverOverlay.classList.remove('fade-out');
        discoverCountryName.innerHTML = "";
        discoverCountryCapital.innerHTML = "";
        discoverCountryFlag.innerHTML = "";
    }, 800);
}

function exitWin() {
    winOverlay.classList.add('fade-out');
    setTimeout(() => {
        winOverlay.style.display = "none";
        winOverlay.classList.remove('fade-out');
    }, 1000);
}

function menuGameMode2() {
    started = false;
    exitGame();

    mode2Screen.classList.add('visible');
    backToHomeScreenFrom2Button.classList.add('visible');
    backToGameModeMenuButton2.classList.remove('visible');
}

// function menuGameMode1() {
//     started = false;
//     exitGame();

//     // mode1Screen.classList.add('visible');
//     backToHomeScreenFrom1Button.classList.add('visible');
//     backToGameModeMenuButton1.classList.remove('visible');
// }

function gameModeMenu() {
    exitGame();
    exitWin();

    mapScreen.classList.remove('fade-in');
    mapScreen.classList.remove('visible');
    homeScreen.classList.remove('hidden');
    mode2Screen.classList.remove('visible');
    // mode1Screen.classList.remove('visible');
    countryInput.classList.remove('hidden');
}

function replay() {
    // console.log('Et ça rejoue !');
    started = true;
    exitGame();
    exitWin();
    resetContinent();
    guessCountries(numberOfCountries.value);
}

function win() {
    audioWin.play();
    $('#ui-id-1').css("display", "none");    
    // console.log('Victoire !');
    startConfetti();
    stopDisco();
    winOverlay.classList.add('fade-in');
    winOverlay.style.display = "block";
    started = false;
}

function openHelp() {
    helpOverlay.style.display = "block";
    helpOverlay.classList.add('fade-in');
}

function openPrompt() {
    promptOverlay.style.display = "block";
    promptOverlay.classList.add('fade-in');
}

function closeHelp() {
    helpOverlay.classList.add('fade-out');
    setTimeout(() => {
        helpOverlay.style.display = "none";
        helpOverlay.classList.remove('fade-out');
    }, 800);
}

function closePrompt() {
    promptOverlay.classList.add('fade-out');
    setTimeout(() => {
        promptOverlay.style.display = "none";
        promptOverlay.classList.remove('fade-out');
    }, 800);
}

numberOfCountries.addEventListener('input', function() {
    const minAllowedValue = parseInt(numberOfCountries.min);
    const maxAllowedValue = parseInt(numberOfCountries.max);
    const enteredValue = parseInt(numberOfCountries.value);
    this.value = this.value.replace(/\D/g, '');

    if (enteredValue > maxAllowedValue) {
        numberOfCountries.value = maxAllowedValue;
    }

    else if (enteredValue < minAllowedValue) {
        numberOfCountries.value = minAllowedValue;
    }
});

// playMode1Button.addEventListener('click', _ => {
//     if(numberOfCountries.value != '' && !started) {
//         console.log('Jeu Mode 1');
//         started = true;
//         mode1Screen.classList.remove('visible');
//         mapScreen.classList.add('visible');
//         countryInput.classList.add('hidden');
//         mapScreen.classList.add('fade-in');
//         backToGameModeMenuButton1.classList.add('visible');
//         backToHomeScreenFrom1Button.classList.remove('visible');
//         backToGameModeMenuButton2.classList.remove('visible');
//         backToGameModeMenuButton3.classList.remove('visible');
//         gameMode = 1;
//         disableMouseEvents();
//     }
// });

playMode2Button.addEventListener('click', _ => {
    audioClick.play();
    if(numberOfCountries.value != '' && !started) {
        // console.log('Jeu Mode 2');
        started = true;
        mode2Screen.classList.remove('visible');
        mapScreen.classList.add('visible');
        mapScreen.classList.add('fade-in');
        guessCountries(numberOfCountries.value);
        backToGameModeMenuButton2.classList.add('visible');
        backToHomeScreenFrom2Button.classList.remove('visible');
        // backToGameModeMenuButton1.classList.remove('visible');
        backToGameModeMenuButton3.classList.remove('visible');
        gameMode = 2;
        continentsCountries.classList.add('visible');

    }
});

// pas de playMode3Button car sur ce mode on joue est direct sur la map via le bouton du menu

playMode4Button.addEventListener('click', _ => {
    audioClick.play();
    startQuizOverlay.style.display = "none";
    startQuiz();
});

// backToHomeScreenFrom1Button.addEventListener('click', _ => {
//     audioClick.play();
//     console.log('Retour au menu principal');
//     backToHomeScreenFrom1Button.classList.remove('visible');
//     gameModeMenu();
// });

backToHomeScreenFrom2Button.addEventListener('click', _ => {
    audioClick.play();
    // console.log('Retour au menu principal');
    backToHomeScreenFrom2Button.classList.remove('visible');
    gameModeMenu();
});

backToHomeScreenFrom4Button.addEventListener('click', _ => {
    backToHome();
});

// backToGameModeMenuButton1.addEventListener('click', _ => {
//     audioClick.play();
//     console.log('Retour au menu du mode 1');
//     mapScreen.classList.remove('fade-in');
//     mapScreen.classList.remove('visible');
//     numberOfCountries.value = 1;
//     menuGameMode1();
// });

backToGameModeMenuButton2.addEventListener('click', _ => {
    audioClick.play();
    // console.log('Retour au menu du mode 2');
    mapScreen.classList.remove('fade-in');
    mapScreen.classList.remove('visible');
    numberOfCountries.value = 1;
    menuGameMode2();
    resetContinent();
    continentsCountries.classList.remove('visible');
});

backToGameModeMenuButton3.addEventListener('click', _ => {
    audioClick.play();
    // console.log('Retour au menu du mode 3 (donc menu principal directement)');
    disableMouseEvents();
    gameModeMenu();
});

gameModeMenuButton.addEventListener('click', _ => {
    audioClick.play();
    // console.log('Victoire, retour au menu principal');
    started = false;
    gameModeMenu();
    resetContinent();
    continentsCountries.classList.remove('visible');
});

replayButton.addEventListener('click', _ => {
    if (!started) {
        audioClick.play();
        replay();
    }
});

// gameMode1Button.addEventListener('click', _ => {
//     audioClick.play();
//     console.log('Mode 1 sélectionné');
//     audio.play();
//     numberOfCountries.value = 1;
//     homeScreen.classList.add('hidden');
//     mode1Screen.classList.add('visible');
//     backToHomeScreenFrom1Button.classList.add('visible');
// });

gameMode2Button.addEventListener('click', _ => {
    audioClick.play();
    // console.log('Mode 2 sélectionné');
    audio.play();
    numberOfCountries.value = 1;
    homeScreen.classList.add('hidden');
    mode2Screen.classList.add('visible');
    backToHomeScreenFrom2Button.classList.add('visible');
});

gameMode3Button.addEventListener('click', _ => {
    audioClick.play();
    // console.log('Mode 3 sélectionné, on joue');
    audio.play();
    homeScreen.classList.add('hidden');
    mapScreen.classList.add('visible');
    mapScreen.classList.add('fade-in');
    gameMode = 3;
    backToGameModeMenuButton3.classList.add('visible');
    resetColor();
    input.value = '';
    enableMouseEvents();
});

gameMode4Button.addEventListener('click', _ => {
    audioClick.play();
    // console.log('Mode 4 sélectionné');
    audio.play();
    homeScreen.classList.add('hidden');
    mode4Screen.classList.add('visible');
    startQuizOverlay.style.display = "block";
    startQuizOverlay.classList.add('fade-in');

    gameMode = 4;
});

helpButtonOpen.addEventListener('click', _ => {
    audioMenu.play();
    audio.play();
    openHelp();
});

helpButtonClose.addEventListener('click', _ => {
    audioMenu.play();
    closeHelp();
});

promptOpen.addEventListener("click", _ => {
    audioMenu.play();
    openPrompt();
});

promptClose.addEventListener("click", _ => {
    audioMenu.play();
    closePrompt();
});

audio.addEventListener('ended', function() {
    audio.currentTime = 0;
    audio.play();
});

discoverClose.addEventListener("click", _ => {
    audioMenu.play();
    exitInformations();
});

resetColor();
initializeColorIndices();
eventClick();

window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        exitInformations();
    }
});

//loading mask
window.onload = function () {
    setTimeout(() => {
        $('#loading-mask').fadeOut(1000);
    }, 1000);
}

//preload images
for (const key in allCountries) {
    const img = new Image();
    img.src = `flags/${key.toLowerCase()}.png`;
}