//todo: i've changed the url in html to hide=true so we can delete this?
"use strict";

document.addEventListener("DOMContentLoaded", init);

function init() {
    document.querySelector("#goToDeck").addEventListener("click", goToCollection);
}

function goToCollection(e) {
    e.preventDefault();
    window.location.href = "../../game/play/index.html?hide=true";
}


