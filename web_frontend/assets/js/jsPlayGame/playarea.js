"use strict";

document.addEventListener("DOMContentLoaded", init);

function init() {
    document.querySelector("section:nth-child(3) a").addEventListener("click", endTurnEvent);
}


function fromHandToField() {
    fetcher("/API/getMana", "getMana", null);
    let allPlayableCards = document.querySelectorAll("#deckContainer > img");
    for (let i = 0; i < allPlayableCards.length; i++) {
        allPlayableCards[i].addEventListener("click", sendCardToField);
    }
    if (heroArray[numberOfHeroInUse] === "Warrior") {
        document.querySelector("#playerSpellContainer img").addEventListener("click", useAbility);
    } else {
        document.querySelector("#playerSpellContainer img").addEventListener("click", whoToAttack);
    }
}

function selectTheAttackCards() {
    let allAttackCards = document.querySelectorAll("#playerAreaContainer img");
    for (let i = 0; i < allAttackCards.length; i++) {
        allAttackCards[i].addEventListener("click", whoToAttack);
    }
}

function sendCardToField(e) {
    let src = e.target.src;
    if ((mana - myHand[src].cost) >= 0) {
        mana -= myHand[src].cost;
        if (myHand[src].type === "Minion") {
            if (document.querySelector("#playerAreaContainer").childElementCount < 7) {
                fetcherNoReturn("/API/sendToField/" + myHand[src].cardId, "movedToField");
                fetcher("/API/getField/me", "FieldGetter", "playerAreaContainer");
            }

        } else if (myHand[src].type === "Weapon") {
            let cardId = myHand[src].cardId;
            let img = "<img src='" + src + "' title='" + cardId + "' alt='" + cardId + "' >";
            document.querySelector("#playerWeaponContainer").innerHTML = img;
            selectedWeaponCard = myHand[src];
            fetcherNoReturn("/API/setWeapon/" + cardId, "setWeapon");
            e.target.remove();
            document.querySelector("#playerWeaponContainer img").addEventListener("click", whoToAttack);

        } else if (myHand[src].type === "Spell") {
            selectedOwnCard = myHand[src];

            if (myHand[src].text.includes("all") || myHand[src].text.includes("ALL")) {
                fetcherNoReturn("/API/executeThisSpell/" + myHand[src].cardId, "executeSpell");

            } else if (myHand[src].text.includes("minion")) {
                fetcher("/API/getTargets/" + myHand[src].cardId, "targetGetter", null);

            } else if (myHand[src].text.includes("hero")) {
            } else if (myHand[src].text.includes("Draw")) {
            } else {
                selectAllEnemies(attackWithSpell);
            }
        }
    }
    fetcher("/API/getCardsInHand/me", "getCardsInHand", "deckContainer");
    fetcher("/API/getCardsInHand/ai", "getCardsInHand", "aideckContainer");
    basicCheck();
}

function whoToAttack(e) {
    e.preventDefault();
    if (this.parentNode.id === "playerWeaponContainer") {
        selectAllEnemies(attackWithWeapon);
    } else if (this.parentNode.id === "playerSpellContainer") {
        selectAllEnemies(useAbility);
    } else {
        selectAllEnemies(attack);
    }
    fetcher("/API/getCardsInHand/me", "getCardsInHand", "deckContainer");
    basicCheck();
    fromHandToField();
}

function selectAllEnemies(sendTo) {
    let allAttackableCards = document.querySelectorAll("#aiAreaContainer img");
    for (let i = 0; i < allAttackableCards.length; i++) {
        allAttackableCards[i].addEventListener("click", sendTo);
        console.log("i got here");
    }
    document.querySelector("#enemy").addEventListener("click", sendTo);
}

function useAbility() {
    if (heroArray[numberOfHeroInUse] === "Warrior") {
        fetcherNoReturn("/API/useAbility/cost_2/armor_2", "ability");
    } else {
        if (this.id === "enemy") {
            fetcherNoReturn("/API/useAbility/cost_2/damage_2", "ability");
        } else {
            fetcherNoReturn("/API/useAbility/cost_2/damage_2_" + this.title, "ability");
        }
    }
    basicCheck();
}

function attackWithWeapon() {
    if (this.id === "enemy") {
        fetcher("/API/attackAndReturnSuccess/weapon/ai", "attack", null);
    } else {
        fetcher("/API/attackAndReturnSuccess/weapon/" + aiField[this.src].soldier.cardId, "attack", null);
    }
    basicCheck();
}

function attackWithSpell() {
    fetcherNoReturn("/API/attackWithSpell/" + selectedOwnCard.cardId, null);
}

function attack(e) {
    let myCardId = selectedOwnCard.soldier.cardId;
    let gotAttacked;
    if (this.id === "enemy") {
        gotAttacked = "ai";
    } else {
        gotAttacked = aiField[e.target.src].soldier.cardId;
    }
    fetcher("/API/attackAndReturnSuccess/" + myCardId + "/" + gotAttacked, "attack", null);
    basicCheck();
}

function aiPlaysAndEndsTurn() {
    if (document.querySelector("#aiAreaContainer").childElementCount < 7) {
        basicCheck();
    }
    endTurn();
}

function endTurnEvent(e) {
    e.preventDefault();
    endTurn();
}

function endTurn() {
    fetcherNoReturn("/API/endTurn", "endTurn");
    fetcher("/API/getCardsInHand/me", "getCardsInHand", "deckContainer");
    fetcher("/API/getCardsInHand/ai", "getCardsInHand", "aideckContainer");
    fetcher("/API/whoseTurn", "whoseTurn", null);
    basicCheck();
}

function basicCheck() {
    fetcher("/API/getMana", "getMana", null);
    fetcher("/API/getHealth", "heroHealth", null);
    fetcher("/API/getField/me", "FieldGetter", "playerAreaContainer");
    fetcher("/API/getField/ai", "FieldGetter", "aiAreaContainer");
    fetcher("/API/didIWin", "won", null);
    fetcher("/API/stillHasWeapon", "hasWeapon", null);
}