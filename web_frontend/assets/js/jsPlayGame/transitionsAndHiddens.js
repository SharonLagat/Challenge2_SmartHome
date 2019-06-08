"use strict";

document.addEventListener("DOMContentLoaded", init);

function init() {
    let url_string = window.location.href;
    let url = new URL(url_string);
    let urlParam = url.searchParams.get("hide");
    if (urlParam) {
        onlyDeck();
    } else {
        quote();
        window.setTimeout(hideQuoteAndShowHeroSelect, 10150);
    }

    let allClickableButtonsForSelectingHero = document.querySelectorAll('#chooseHero article>a, #chooseHero figure');
    for (let i = 0; i < allClickableButtonsForSelectingHero.length; i++) {
        allClickableButtonsForSelectingHero[i].addEventListener('click', chooseThisHero);
    }


    document.querySelector("#saveDeck").addEventListener("click", saveDeck);
    document.querySelector("#playBtn").addEventListener("click", goToPlayArea);
}

function hideQuoteAndShowHeroSelect() {
    document.querySelector("aside").classList.add("hidden");
    document.querySelector("main").classList.remove("hidden");
    document.querySelector("#chooseHero").classList.remove("hidden");
}

function chooseThisHero(e) {
    e.preventDefault();

    //if it does not have an id (ex. if its within the deckbuilder to select the hero)
    if (heroArray.indexOf(e.target.id) === -1) {
        numberOfHeroInUse = heroArray.indexOf(e.target.alt);
    } else {
        numberOfHeroInUse = heroArray.indexOf(e.target.id);
    }

    document.querySelector("#chooseHero").classList.add("hidden");
    initAfterHeroSelect();
    document.querySelector("#deckBuilder").classList.remove("hidden");
}

function goToPlayArea() {
    if (parseInt(document.querySelector("#inDeckNr").innerHTML) < 20) {
        addCustomAlert("20Min");
    } else {
        document.querySelector("#deckBuilder").classList.add("hidden");
        document.querySelector("#playArea").classList.remove("hidden");
        document.querySelector("#you").src = "../../assets/img/" + heroArray[numberOfHeroInUse] + ".gif";
        document.querySelector("#playerSpellContainer img").src = "../../assets/img/card/" + heroArray[numberOfHeroInUse] + "Ability.png";
        fetcherNoReturn("/API/initBattleField", "initBF");
    }
}

function onlyDeck() {
    document.getElementById("isLoading").classList.add("hidden");
    document.getElementById("chooseHero").classList.add("hidden");
    document.querySelector("main").classList.remove("hidden");
    document.getElementById("deckBuilder").classList.remove("hidden");
    document.getElementById("playBtn").classList.add("hidden");
    numberOfHeroInUse = 0;
    initAfterHeroSelect();
}

function saveDeck() {
    fetcherNoReturn("/API/saveDeck/" + heroArray[numberOfHeroInUse], "saveDeck");
}