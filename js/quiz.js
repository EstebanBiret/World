// const keys = Object.keys(allCountries);
// let index = 0;

// function displayNextFlag() {
//     mode4ScreenContent.classList.add("visible");
//     if (index < keys.length) {
//         const key = keys[index];
//         quizFlag.src = `flags/${key.toLowerCase()}.png`;
//         index++;
//         setTimeout(displayNextFlag, 500);
//     }
// }

const allProposals = document.getElementById("proposals");
const flag = document.getElementById("quiz-flags");
const title = document.getElementById("quiz-title");
const quizFlag = document.getElementById("quiz-flag");
const goodFlag = document.getElementById("good-flag");
const nameGoodFlag = document.getElementById("name-good-flag");
const quizRecord = document.getElementById("quiz-record");

const proposal1 = document.getElementById("proposal-1");
const proposal2 = document.getElementById("proposal-2");
const proposal3 = document.getElementById("proposal-3");
const proposal4 = document.getElementById("proposal-4");

const errorClose = document.getElementById("error-close");
const errorOverlay = document.getElementById("error-overlay");

const resultsOverlay = document.getElementById("results-overlay");
const resultsFlags = document.getElementById("flags-guessed");
const resultsErrors = document.getElementById("errors");
const resultsShare = document.getElementById("share");
const resultsReplay = document.getElementById("replay-quiz");
const resultsHome = document.getElementById("home-quiz");
const resultsImage = document.getElementById("results-image");

let countriesCopyQuiz = { ...allCountries };
const quizKeys = Object.keys(countriesCopyQuiz);

// const question = document.getElementById("current-flag");
let answer = null;
// let currentFlag = 0;
// const numberOfFlags = 30;

// let correctCountriesFound = [];
let record = $.cookie('quizRecord') || 0;

let errors = 0;
let flagsFound = 0;

//pays random
function getRandomCountryCopy() {
    const countryKeys = Object.keys(countriesCopyQuiz);
    const randomKey = countryKeys[Math.floor(Math.random() * countryKeys.length)];
    return randomKey;
}

function getRandomCountry() {
    const countryKeys = Object.keys(allCountries);
    const randomKey = countryKeys[Math.floor(Math.random() * countryKeys.length)];
    return randomKey;
}

//génère 4 propositions de pays
function generate4RandomProposals(correctCountry) {
    const proposals = [correctCountry.name];
    while (proposals.length < 4) {
        const r = getRandomCountry();
        const randomCountry = allCountries[r];
        if (!proposals.includes(randomCountry.name)) {
            proposals.push(randomCountry.name);
        }
    }
    return shuffleArray(proposals);
}

// Mélangez un tableau
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startQuiz() {
    mode4ScreenContent.classList.add("visible");
    backToHomeScreenFrom4Button.classList.add('visible');
    // question.innerHTML = `Drapeaux : ${currentFlag}/${numberOfFlags}`;
    
    let correctCountry = getRandomCountryCopy();
    delete countriesCopyQuiz[correctCountry];

    // Ajouter le pays correct au tableau
    // correctCountriesFound.push(correctCountry);
    // console.log(correctCountriesFound);

    
    answer = allCountries[correctCountry].name;
    const proposals = generate4RandomProposals(allCountries[correctCountry]);

    displayFlag(correctCountry);
    displayProposals(proposals);
    // displayNextFlag();
    startTimer();

}

function displayFlag(correctCountry) {
    flag.classList.add("fade-in-quiz");
    flag.style.display = "block";

    quizFlag.src = `flags/${correctCountry.toLowerCase()}.png`;
}

//array
function displayProposals(proposals) {
    allProposals.classList.add("fade-in-quiz")

    proposal1.textContent = proposals[0];
    proposal2.textContent = proposals[1];
    proposal3.textContent = proposals[2];
    proposal4.textContent = proposals[3];
}

function nextFlag() {
    
    // if ((currentFlag+1)===numberOfFlags) {
    //     console.log("Max des questions atteint !");
    // }
    // else {

        allProposals.classList.add("fade-out-quiz");
        flag.style.display = "none";
        title.classList.add("fade-out-quiz");

        setTimeout(() => {
            allProposals.classList.remove('fade-out-quiz');
            title.classList.remove("fade-out-quiz");

            if (Object.keys(countriesCopyQuiz).length === 0) {
                console.log("Plus de drapeaux !");
                displayResults()
            }
            else {
                let correctCountry = getRandomCountryCopy();

                // Vérifier si le pays est déjà tombé
                // while (correctCountriesFound.includes(correctCountry)) {
                //     if (correctCountriesFound.length === Object.keys(allCountries).length) {
                //         console.log("plus de drapeaux !")
                //         displayResults();
                //     }

                //     console.log("déjà tombé");
                //     correctCountry = getRandomCountry();
                // }

                delete countriesCopyQuiz[correctCountry];


                // Ajouter le pays correct au tableau
                // correctCountriesFound.push(correctCountry);
                // console.log(correctCountriesFound);

                answer = allCountries[correctCountry].name;
                const proposals = generate4RandomProposals(allCountries[correctCountry]);

                title.classList.add("fade-in-quiz");
                displayFlag(correctCountry);
                displayProposals(proposals);
            }

        }, 100);
    // }

    // currentFlag++;
    // question.innerHTML = `Drapeaux : ${currentFlag}/${numberOfFlags}`;
}

function displayError(answer) {
    goodFlag.src = `flags/${findISOByCountryName(answer)}.png`;
    nameGoodFlag.innerHTML = answer;

    errors++;
    errorOverlay.style.display = "block";

    setTimeout(() => {
        errorClose.style.display = "block";
    }, 2000);
}

function closeError() {
    errorClose.style.display = "none";
    errorOverlay.style.display = "none";
    nextFlag();
}

function checkQuiz(answer, proposal) {
    if (answer===proposal) {
        audioXp.play();
        // console.log("Trouvé !");
        flagsFound++;
        nextFlag();
    }

    else {
        audioLose.play();
        displayError(answer);
    }
}

function displayResults() {
    audioWin.play();
    errorOverlay.style.display = "none";

    if (flagsFound > record) {
        quizRecord.innerHTML = `Nouveau record ! : ${flagsFound}`;
        $.cookie('quizRecord', flagsFound);
        record = flagsFound;
        resultsImage.src = "images/win_quiz.png";
    }

    else if (flagsFound == record) {
        quizRecord.innerHTML = `Votre record : ${record}`;
        resultsImage.src = "images/tie_quiz.png";
    }

    else {
        quizRecord.innerHTML = `Votre record : ${record}`;
        resultsImage.src = "images/lose_quiz.png";
    }

    resultsFlags.innerHTML = `Drapeaux trouvés : ${flagsFound}`;    
    resultsErrors.innerHTML = `Erreurs : ${errors}`;    
    resultsOverlay.style.display = "block";
}

function share() {
    audioMenu.play();
    resultsShare.textContent = "Copié !";
    let text = ``;
    if (flagsFound === 0) {
        text = `Je n'ai trouvé aucun drapeaux sur https://world.embuscade.tech !\nJe vais vite fait me ressaisir 👹`;
    }

    else if (flagsFound === 1 ) {
        text = `J'ai trouvé un seul drapeau sur https://world.embuscade.tech !\nAllez on se bouge le cul 👹`;
    }
    else {
        text = `J'ai trouvé ${flagsFound} drapeaux sur https://world.embuscade.tech !\nTake on meee 👹`;
    }
    navigator.clipboard.writeText(text);
}

function resetQuiz() {
    resultsShare.textContent = "Partager";
    audioClick.play();
    resetTimer();
    correctCountriesFound = [];
    countriesCopyQuiz = { ...allCountries };
    errors = 0;
    flagsFound = 0;
    quizFlag.src = "";
    errorClose.style.display = "none";
    mode4ScreenContent.classList.remove("visible");
}

function replayQuiz() {
    resetQuiz();
    resultsOverlay.style.display = "none";
    startQuizOverlay.style.display = "block";
}

function backToHome() {
    resetQuiz();
    // console.log('Retour au menu principal');
    backToHomeScreenFrom4Button.classList.remove('visible');
    homeScreen.classList.remove('hidden');
    mode4Screen.classList.remove('visible');
}

proposal1.addEventListener('click', _ => {
    checkQuiz(answer, proposal1.innerText);
});

proposal2.addEventListener('click', _ => {
    checkQuiz(answer, proposal2.innerText);
});

proposal3.addEventListener('click', _ => {
    checkQuiz(answer, proposal3.innerText);
});

proposal4.addEventListener('click', _ => {
    checkQuiz(answer, proposal4.innerText);
});

errorClose.addEventListener('click', _ => {
    closeError();
    audioMenu.play();
});

resultsHome.addEventListener('click', _ => {
    backToHome();
    resultsOverlay.style.display = "none";
});

resultsReplay.addEventListener('click', _ => {
    replayQuiz();
});