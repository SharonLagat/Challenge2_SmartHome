"use strict";

document.addEventListener("DOMContentLoaded", init);

function init() {
    document.querySelector("li:nth-child(3)").addEventListener('click', handleClick);
    document.querySelector("#settings").addEventListener('click', handleButton);
}

function handleClick(e) {
    e.preventDefault();
    console.log("you are loging out");
    window.location.href = '../../index.html';
}

function handleButton(e) {
    e.preventDefault();
    let dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
        let openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
        }else{
            openDropdown.classList.add('show');
        }
    }
}