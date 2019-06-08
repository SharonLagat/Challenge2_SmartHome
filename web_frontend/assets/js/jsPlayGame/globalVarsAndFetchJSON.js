"use strict";

document.addEventListener("DOMContentLoaded", init);

//GlOBAL VARIABLES------------------------------------------------------------------------------------------------------
let myAvailableCardsForDeck;

let heroArray = ["Mage", "Hunter", "Warrior"];
let numberOfHeroInUse = 0;

let neededAltFromImage = "All";

let arrayOfCardsInDeckMage = [];
let arrayOfCardsInDeckHunter = [];
let arrayOfCardsInDeckWarrior = [];
let decks = {"Mage": arrayOfCardsInDeckMage, "Hunter": arrayOfCardsInDeckHunter, "Warrior": arrayOfCardsInDeckWarrior};

let deckInUse = decks.Mage;

let heldCard;
let myHand = {};
let myField = {};
let aiField = {};
let mana = 1;

let selectedOwnCard;
let selectedWeaponCard;
//let myTurn=true;
//GlOBAL VARIABLES------------------------------------------------------------------------------------------------------

function init() {
    //fetchAllCards();
}

//-------------------------------java connect------------------

function fetchThis() {
    fetcher("/API/cardsFor/" + heroArray[numberOfHeroInUse], "fetchThis", null);
}

function fetcher(url, whereFrom, extraValue) {
    fetch(
        "http://localhost:4242" + url,
        {headers: new Headers({'Accept': 'application/json'})}, {method: "GET"}
    ).then(function (res) {
        if (res.ok) return res.json();
        throw new Error('something went wrong!');
    }).then(function (data) {
        switch (whereFrom) {
            case "deckGenerator":
                deckInUse = data;
                addCardsFromArrayToDeck();
                break;
            case "typeSelect":
                if (extraValue === "availableType") {
                    extendAvailableTypeFetcher(data);
                } else if (extraValue === "deckType") {
                    extendDeckTypeFetcher(data);
                }
                break;
            case "getCardsInHand":
                extendGetCardsInHand(data, extraValue);
                break;
            case "getMana":
                mana = data.myMana;
                document.querySelector("#playArea div p:nth-child(11) span").innerHTML = mana;
                document.querySelector("#manaContainer").innerHTML = "";
                for (let i = 0; i < mana; i++) {
                    document.querySelector("#manaContainer").innerHTML += "<img src='../../assets/img/diamond.png' title='mana' alt='mana'>";
                }
                document.querySelector("#playArea div p:nth-child(2) span").innerHTML = data.aiMana;
                break;
            case "whoseTurn":
                //myTurn=data.myTurn;
                if (data.myTurn) {
                    fromHandToField();
                } else {
                    aiPlaysAndEndsTurn();
                }
                break;
            case "FieldGetter":
                document.querySelector("#" + extraValue).innerHTML = "";
                for (let i = 0; i < data.length; i++) {
                    if (document.querySelector("#" + extraValue).childElementCount < 7) {
                        if (extraValue === "playerAreaContainer") {
                            myField[data[i].soldier.img] = data[i];
                        } else {
                            aiField[data[i].soldier.img] = data[i];
                        }
                        let soldier = data[i].soldier;
                        document.querySelector("#" + extraValue).innerHTML += "<img src='" + soldier.img + "' title='" + soldier.cardId + "' alt='" + soldier.cardId + "' >";
                    }
                }
                selectTheAttackCards();
                break;
            case "attack":
                fetcher("/API/getHealth", "heroHealth", null);
                fetcher("/API/didIWin", "won", null);
                break;
            case "heroHealth":
                document.querySelector("#aihp").innerHTML = data.aiHealth;
                document.querySelector("#playerhp").innerHTML = data.meHealth;
                break;
            case "hasWeapon":
                if (!data) {
                    document.querySelector("#playerWeaponContainer").innerHTML = "";
                }
                break;
            case "targetGetter":
                let allEnemies = document.querySelectorAll("#aiAreaContainer img");
                for (let i = 0; i < allEnemies.length; i++) {
                    if (data.img in aiField) {
                        allEnemies[i].addEventListener("click", attackWithSpell);
                    }
                }
                break;
            case "won":
                break;
            default:
                break;
        }
    }).catch(function (error) {
        console.error(error + " this is an unknown error");
    });
}

function goToTheMenu() {
    window.location.href = "../../game/menu/index.html";
}

function fetcherNoReturn(url, what) {
    fetch(
        "http://localhost:4242" + url,
        {headers: new Headers({'Accept': 'application/json'})}, {method: "GET"}
    ).then(function (res) {
        if (res.ok) return res.ok;
        throw new Error('something went wrong!');
    }).then(function () {
        if (what === "initBF") {
            fetcher("/API/getHealth", "heroHealth", null);
            fetcher("/API/getMana", "getMana", null);
            fetcher("/API/getCardsInHand/me", "getCardsInHand", "deckContainer");
            fetcher("/API/getCardsInHand/ai", "getCardsInHand", "aideckContainer");
        }
    }).catch(function (error) {
        console.error(error);
    });
}

function extendAvailableTypeFetcher(data) {
    document.querySelector("#available").innerHTML = "";
    for (let i = 0; i < data.length; i++) {
        document.querySelector("#available").innerHTML += "<img src='" + data[i].img + "' title='" + data[i].name + "' alt='" + data[i].name + "' class='onlyThisAllowedInDeck' >";
    }

    myAvailableCardsForDeck = data;

    let allImagesThatAreDragable = document.querySelectorAll(".onlyThisAllowedInDeck");
    for (let i = 0; i < allImagesThatAreDragable.length; i++) {
        allImagesThatAreDragable[i].addEventListener("drag", drag);
    }
}

function extendDeckTypeFetcher(data) {
    document.querySelector("#inDeck").innerHTML = "";
    for (let i = 0; i < data.length; i++) {
        document.querySelector("#inDeck").innerHTML += "<img src='" + data[i].img + "' title='" + data[i].name + "' alt='" + data[i].name + "' >";
    }
    selectAllDeleteableCards();
}

function extendGetCardsInHand(data, extraValue) {
    document.querySelector("#" + extraValue).innerHTML = "";
    for (let i = 0; i < data.length; i++) {
        if (extraValue === "deckContainer") {
            myHand[data[i].img] = data[i];
        }
        document.querySelector("#" + extraValue).innerHTML += "<img src='" + data[i].img + "' title='" + data[i].cardId + "' alt='" + data[i].cardId + "' >";
    }
    fromHandToField();
}