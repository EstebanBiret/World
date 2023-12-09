const mouseOver = function () {
    this.style.fill = "rgb(247, 239, 227)";
};

const mouseOut = function () {
    this.style.fill = "rgb(235, 209, 155)";
};

function addEventListeners(elements, eventType, mouseOverHandler, mouseOutHandler) {
    elements.forEach(element => {
        element.addEventListener("mouseover", mouseOverHandler);
        element.addEventListener("mouseout", mouseOutHandler);
    });
}

function removeEventListeners(elements, eventType, mouseOverHandler, mouseOutHandler) {
    elements.forEach(element => {
        element.removeEventListener("mouseover", mouseOverHandler);
        element.removeEventListener("mouseout", mouseOutHandler);
    });
}

//enable mouse events for mode 3
function enableMouseEvents() {
    // console.log('Ajout des events');

    for (const key in allCountries) {
        const countrySelector = `[id="${key}"]`;
        const countryElements = document.querySelectorAll(countrySelector);
        addEventListeners(countryElements, "mouseover", mouseOver, mouseOut);
    }
}

//disable mouse events of mode 3 
function disableMouseEvents() {
    // console.log('Suppression des events');

    for (const key in allCountries) {
        const countrySelector = `[id="${key}"]`;
        const countryElements = document.querySelectorAll(countrySelector);
        removeEventListeners(countryElements, "mouseover", mouseOver, mouseOut);
    }
}

function eventClick() {
    for (const key in allCountries) {
        const countrySelector = `[id="${key}"]`;
        const countryElements = document.querySelectorAll(countrySelector);

        countryElements.forEach(countryElement  => {
            countryElement.addEventListener("click", function () {
                if (gameMode == 3) {
                    audioBook.play();
                    resetColor();
                    displayInformations(key, allCountries[key]);
                }
            });
        });
    }
}