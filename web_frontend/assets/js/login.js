"use strict";

document.addEventListener("DOMContentLoaded", init);

function init() {
    document.querySelector("form").addEventListener("submit", goToMenu);
    let allLinks = document.querySelectorAll("a");
    for (let i=0; i<allLinks.length; i++){
        if (i!==1) {
            allLinks[i].addEventListener("click", goTo);
        }
    }
}

function goTo(e) {
    e.preventDefault();
    document.querySelector("#login").classList.add("hidden");
    document.querySelector("#"+this.id.replace("Button", "")).classList.remove("hidden");
    switch (this.id.replace("Button", "")){
        case "register":
            document.querySelector("#register").addEventListener("submit", addRegisterToDatabase);
            break;
        case "forgotPass":
            document.querySelector("#forgotPass").addEventListener("submit", forgotPassSection);
            break;
    }
}

function addRegisterToDatabase(e) {
    e.preventDefault();
    window.alert("Welcome!\n" +
        "Please verify your amail address by clicking the link we send u.");
    document.querySelector("#login").classList.remove("hidden");
    document.querySelector("#register").classList.add("hidden");
}

function forgotPassSection(e) {
    e.preventDefault();
    window.alert("Don't panic!\n"+
    "Help is on the way! Please check your email!");
    document.querySelector("#login").classList.remove("hidden");
    document.querySelector("#forgotPass").classList.add("hidden");
}

function goToMenu(e) {
    e.preventDefault();
    window.alert("Not yet implemented, click play as guest.")
}