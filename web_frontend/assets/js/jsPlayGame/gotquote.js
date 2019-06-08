"use strict";

document.addEventListener("DOMContentLoaded", init);

function init() {
}

function quote(){
    fetch('https://got-quotes.herokuapp.com/quotes', {
        headers: new Headers({
            'Accept': 'application/json'
        })
    }).then(function (response) {
        if (response.ok) return response.json();
        throw new Error('issue found in gotquote');
    }).then(function (data) {
        let phrase    = document.querySelector('#phrase');
        let character = document.querySelector('#character');

        phrase.innerHTML    = '"' + data.quote + '"';
        character.innerHTML = '- ' + data.character;
    }).catch(function (error) {
        console.log(error);
    });
}

