const input = document.getElementById('input');
var allCountriesjQuery = Object.values(allCountries).map(country => country.name);
let inInformations = false;
var isSuggestionsListOpen = false;

$("#input").autocomplete({
    source: function(request, response) {
        var term = normalizeString(request.term.toLowerCase());
        var filtered = $.grep(allCountriesjQuery, function(item) {
            return normalizeString(item.toLowerCase()).indexOf(term) > -1;
        });
        response(filtered);
    },
    open: function(event, ui) {
        $(".ui-menu-item").first().addClass('ui-state-focus');
        // console.log('coucou');
        isSuggestionsListOpen = true;
    },
    close: function(event, ui){
        // console.log('caché');
        isSuggestionsListOpen = false;
    }
});

//Obtenir les pays correspondants à la saisie
function getMatchingCountries(input) {
    var matchingCountries = [];
    for (const key in allCountries) {
        const countryName = normalizeString(allCountries[key]["name"].toLowerCase());

        if (countryName.includes(normalizeString(input))) {
            matchingCountries.push(countryName);
        }
        if (input == "") {
            matchingCountries = [];
        }
    }
    return matchingCountries;
}

//Obtenir le nom original du pays
function getOriginalCountryName(normalizedCountry) {
    for (const key in allCountries) {
        if (normalizeString(allCountries[key]["name"].toLowerCase()) === normalizedCountry) {
            return allCountries[key];
        }
    }
    return normalizedCountry;
}

//Normaliser une chaîne de caractères en retirant les accents
function normalizeString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

async function countryValidator(country) {
    for (var i=0; i<countries2Guess.length; i++) {
        const countryName = normalizeString(countries2Guess[i]["name"].toLowerCase());

        if (countryName === normalizeString(country.toLowerCase())) {
            return true;
        }
    }
    return false;
}

async function findISOByCountryNameAsync(country) {
    return findISOByCountryName(country);
}

function findISOByCountryName(countryName) {
    for (const iso in allCountries) {
        if (normalizeString(allCountries[iso]["name"].toLowerCase()) === normalizeString(countryName.toLowerCase())) {
            return iso;
        }
    }
    return null;
}

function wrong() {
    input.classList.add('wrong');
    setTimeout(() => {
    input.classList.remove('wrong');
    }, 700);
}

function displayInformations(id_country, country) {
    inInformations = true;
    $('#ui-id-1').css("display", "none");    
    var img = document.createElement("img");
    img.src = "flags/" + id_country.toLowerCase() + ".png";
    discoverCountryFlag.appendChild(img);
    discoverCountryName.innerHTML = country["name"];
    discoverCountryCapital.innerHTML = 'Capitale : ' + country["capital"];
    discoverOverlay.style.display = "block";
    discoverOverlay.classList.add('fade-in');

}

input.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {

        if (input.value === "/help"){
            input.value = "";
            openHelp();
        }
        else if (input.value === '/start disco' && !discoInProgress){
            input.value = "";
            startDisco();
        }
        else if (input.value === "/stop disco" && discoInProgress){
            input.value = "";
            stopDisco();
        }
        else if (input.value === "/radio"){
            input.value = "";
            window.open("https://radio.embuscade.tech/", "_blank");
        }
        else if (input.value === "/rick"){
            input.value = "";
            window.open("https://rick.embuscade.tech/", "_blank");
        }
        else if (input.value === "/memory"){
            input.value = "";
            window.open("https://memory.embuscade.tech/", "_blank");
        }
        else if (input.value === "/macron"){
            input.value = "";
            window.open("https://macron.embuscade.tech/", "_blank");
        }
        else if (input.value === "/fish"){
            input.value = "";
            window.open("https://fish.embuscade.tech/", "_blank");
        }
        else if (input.value === "/whistle"){
            input.value = "";
            window.open("https://whistle.embuscade.tech/", "_blank");
        }
        else if (input.value === "/weather"){
            input.value = "";
            window.open("https://weather.embuscade.tech/", "_blank");
        }
        else if (input.value === "/surtom"){
            input.value = "";
            window.open("https://surtom.yvelin.net/", "_blank");
        }
        else if (input.value === "/departement"){
            input.value = "";
            window.open("http://departementdle.ouipouet.tech/", "_blank");
        }
        else if (input.value === "/personne"){
            input.value = "";
            window.open("https://thispersondoesnotexist.com/", "_blank");
        }
        else if (input.value === "/nuke"){
            input.value = "";
            window.open("nuke.pdf", "_blank");
        }
        else {
            if (gameMode == 2) { //devine
                event.preventDefault();

                if(isSuggestionsListOpen){
                    var firstSuggestion = $(".ui-menu-item").first().text();
            
                    if (firstSuggestion) {
                        if(normalizeString(firstSuggestion).toLowerCase().includes(normalizeString(input.value).toLowerCase())){
                            input.value = firstSuggestion;
                            $('#input').autocomplete('close');
                        }
                    }
                }
                else {
                    countryValidator(input.value).then((res) => {
                        if (res) {
                            const indexToRemove = countries2Guess.findIndex(country => normalizeString(country["name"].toLowerCase()) === normalizeString(input.value.toLowerCase()));
                            if (indexToRemove !== -1) {
                                countries2Guess.splice(indexToRemove, 1);
                            }
                            const isoFound = findISOByCountryName(input.value);
                            if (isoFound) {
                                document.getElementById(isoFound).style.fill = "lightgreen";
                                countriesGuessed.push(isoFound);
                                updateContinents(isoFound);
                            }
                            input.value = "";
                            countriesFound.innerHTML = "Pays trouvés : " + countriesGuessed.length + "/" + (countries2Guess.length + countriesGuessed.length);
                            if(countries2Guess.length === 0) {
                                win();
                            }
                        }
                        else {
                            wrong();
                        }
                    });
                }
            }

            else if (gameMode == 3) { //découverte
                event.preventDefault();

                if(isSuggestionsListOpen){
                    var firstSuggestion = $(".ui-menu-item").first().text();

                    if (firstSuggestion) {
                        if(normalizeString(firstSuggestion).toLowerCase().includes(normalizeString(input.value).toLowerCase())){
                            input.value = firstSuggestion;
                            $('#input').autocomplete('close');
                        }
                    }
                }
                else{
                    findISOByCountryNameAsync(input.value).then((res) => {
                        if (res) {
                            resetColor();
                            const isoFound = findISOByCountryName(input.value);
                            if (isoFound) {
                                document.getElementById(isoFound).style.fill = "lightgreen";
                            }
                            if(!inInformations) {
                                setTimeout(() => {
                                    displayInformations(findISOByCountryName(input.value), getOriginalCountryName(normalizeString(input.value.toLowerCase())));
                                }, 200);
                            }
                        }
                        else {
                            wrong();
                        }
                    });
                }
            }
        }
    }
});