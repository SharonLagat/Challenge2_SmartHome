"use strict";

document.addEventListener("DOMContentLoaded", init);

function initAfterHeroSelect() {
    //set the hero
    setTheHero();
    fetchThis();
    document.querySelector("#nextdeck").addEventListener("click", nextHero);
    document.querySelector("#previousdeck").addEventListener("click", previousHero);

    //deck type select
    let allAvailableIcons = document.querySelectorAll("#availableType > img, #inDeckType >img");
    for (let i = 0; i < allAvailableIcons.length; i++) {
        allAvailableIcons[i].addEventListener("click", defineNeededVariableAndIdForTypeSelect);
    }

    //Drag and drop try to chain
    document.querySelector("#inDeck").addEventListener("dragover", allowDrop);
    document.querySelector("#inDeck").addEventListener("drop", drop);
}


//set the hero and their deck
function setTheHero() {
    document.querySelector("#hero").src = "../../assets/img/" + heroArray[numberOfHeroInUse] + ".gif";
    document.querySelector("#deckBuilder article:nth-child(4) h2").innerHTML = heroArray[numberOfHeroInUse] + " Deck";

    fetcher("/API/getMyDeck/" + heroArray[numberOfHeroInUse], "deckGenerator", null);
    addCardsFromArrayToDeck();
    selectAllDeleteableCards();

    typeSelect("availableType");
}

function nextHero() {
    numberOfHeroInUse = (numberOfHeroInUse + 1) % heroArray.length;
    setTheHero();
}

function previousHero() {
    numberOfHeroInUse = numberOfHeroInUse - 1;
    if (numberOfHeroInUse < 0) {
        numberOfHeroInUse += heroArray.length;
    }
    setTheHero();
}


//deck type select
//because typeSelect is not an eventlistener, this function is used to catch the alt and id of the clicked item.
function defineNeededVariableAndIdForTypeSelect(e) {
    e.preventDefault();
    neededAltFromImage = this.alt;
    typeSelect(this.parentNode.id);
}


function typeSelect(needed) {
    if (needed==="availableType"){
        fetcher("/API/cardsFor/"+heroArray[numberOfHeroInUse]+"/selectOnly/"+neededAltFromImage, "typeSelect", "availableType");
    } else if (needed==="inDeckType"){
        //TODO: once default deck and database is added, make sure this fetches from those
        fetcher("/API/filterMyDeck/"+neededAltFromImage, "typeSelect", "deckType");
    }
}


//Drag and drop
function allowDrop(e) {
    e.preventDefault();
}

function drag() {
    heldCard = this.className;
}

function drop(e) {
    e.preventDefault();
    let multiUnieCardCounter=0;

    for (let i=0; i<deckInUse.length; i++){
        if(e.dataTransfer.getData("text")===deckInUse[i].img){
            multiUnieCardCounter++;
        }
    }

    if(multiUnieCardCounter<2) {
        if (parseInt(document.querySelector("#inDeckNr").innerHTML) < parseInt(document.querySelector("#MaxNr").innerHTML)) {
            if (heldCard === "onlyThisAllowedInDeck") {
                for (let i = 0; i < myAvailableCardsForDeck.length; i++) {
                    if (e.dataTransfer.getData("text") === myAvailableCardsForDeck[i].img) {
                        deckInUse.push(myAvailableCardsForDeck[i]);
                        fetcherNoReturn("/API/addCard/"+ myAvailableCardsForDeck[i].cardId +"/" + heroArray[numberOfHeroInUse], "add", null);
                        addCardsFromArrayToDeck();
                        i = myAvailableCardsForDeck.length;
                    }
                }
            }
        } else {
            addCustomAlert("30Max");
        }
    } else {
        addCustomAlert("2Max");
    }
}


//alert js
function addCustomAlert(alertType) {
    document.querySelector("#modal").classList.remove("hidden");
    switch (alertType) {
        case "30Max":
            document.querySelector("#modal p").innerHTML = "You can't have more than 30 cards!";
            break;
        case "2Max":
            document.querySelector("#modal p").innerHTML = "You can't have more than 2 of the same card!";
            break;
        case "20Min":
            document.querySelector("#modal p").innerHTML = "You can't have less than 20 cards!";
            break;
    }
    document.querySelector("#modal a").addEventListener("click", close)
}

function close(e) {
    e.preventDefault();
    document.querySelector("#modal").classList.add("hidden");
}


//visual add'er
function addCardsFromArrayToDeck() {
    document.querySelector("#inDeck").innerHTML = "";
    for (let i = 0; i < deckInUse.length; i++) {
        document.querySelector("#inDeck").innerHTML += "<img src='" + deckInUse[i].img + "' draggable='false' class='onlyThisAllowedInDeck' />";
    }
    document.querySelector("article:nth-child(4) p > span").innerHTML = deckInUse.length;
    selectAllDeleteableCards();
}


//deleter
function selectAllDeleteableCards() {
    let allImagesInDeck = document.querySelectorAll("#inDeck > img");
    for (let i = 0; i < allImagesInDeck.length; i++) {
        allImagesInDeck[i].addEventListener("click", removeFromArray);
    }
}


//remove backend
function removeFromArray(e) {
    e.target.remove();
    //TODO: connect to remove from java (post)
    let neededToFindIndex = "";
    for (let i = 0; i < deckInUse.length; i++) {
        if (deckInUse[i].img === e.target.src) {
            neededToFindIndex = i;
        }
    }
    fetcherNoReturn("/API/removeCard/"+ deckInUse[neededToFindIndex].cardId, "remove", null);
    deckInUse.splice(neededToFindIndex, 1);
    document.querySelector("p > span").innerHTML = deckInUse.length;
}
