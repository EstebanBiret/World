const colors = ["red", "green", "pink", "purple", "brown", "black", "yellow", "blue", "orange", "cyan", "magenta", "lime", "teal", "indigo", "violet", "olive", "navy", "maroon"];
const colorIndices = {};
let discoInterval;
let discoPromptInterval;
let discoInProgress = false;
let promptColorIndex = 0;

function initializeColorIndices() {
    for (key in allCountries) {
        colorIndices[key] = Math.floor(Math.random() * colors.length);
    }
}

function startDiscoPrompt() {
    discoPromptInterval = setInterval(() => {
        const currentColorIndex = promptColorIndex;
        let nextColorIndex;

        do {
            nextColorIndex = Math.floor(Math.random() * colors.length);
        } while (nextColorIndex === currentColorIndex);

        const currentColor = colors[currentColorIndex];
        const nextColor = colors[nextColorIndex];

        input.style.transition = 'border 0.2s ease-in-out, box-shadow 0.2s ease-in-out';
        input.style.border = `4px solid ${currentColor}`;
        input.style.boxShadow = `${currentColor} inset 0px 0px 15px`;

        setTimeout(() => {
            input.style.border = `4px solid ${nextColor}`;
            input.style.boxShadow = `${nextColor} inset 0px 0px 15px`;
        }, 200);

        promptColorIndex = nextColorIndex;
    }, 200);
}

function stopDiscoPrompt() {
    clearInterval(discoPromptInterval);
    setTimeout(() => {
        input.style.border = "4px solid #2E8743";
        input.style.boxShadow = "#53FF38 inset 0px 0px 15px";
    }, 500);   
}

//nan nan
function startDisco(){
    startDiscoPrompt();
    discoInProgress = true;
    discoInterval = setInterval(() => {
        for (key in allCountries) {
            const countryIdDisco = `[id="${key}"]`;
            const countryDisco = document.querySelectorAll(countryIdDisco);
            
            countryDisco.forEach(country => {
                const currentColorIndex = colorIndices[key];

                let nextColorIndex;
                do {
                    nextColorIndex = Math.floor(Math.random() * colors.length);
                } while (nextColorIndex === currentColorIndex);
                
                const currentColor = colors[currentColorIndex];
                const nextColor = colors[nextColorIndex];

                country.style.transition = 'fill 0.2s ease-in-out';
                country.style.fill = currentColor;

                setTimeout(() => {
                    country.style.fill = nextColor;
                }, 200);

                colorIndices[key] = nextColorIndex;
            });
        }   
    }, 200);
}

function stopDisco() {
    stopDiscoPrompt();
    discoInProgress = false;
    clearInterval(discoInterval);
    setTimeout(() => {
        resetColor();
        input.value = "";
        //on remet les pays manquants en rouges
        for(var i =0; i<countries2Guess.length; i++){
            id = findISOByCountryName(countries2Guess[i]["name"])
            document.getElementById(id).style.fill = "rgb(223, 74, 74)";
        }

        //et ceux trouvés en vert
        for(var i =0; i<countriesGuessed.length; i++){
            document.getElementById(countriesGuessed[i]).style.fill = "lightgreen";
        }
    }, 500);
}