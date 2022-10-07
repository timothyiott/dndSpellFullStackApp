let resultsCanvas = document.getElementById('results');
let searchInput = document.getElementById('searchField');
let searchButton = document.getElementById('searchButton');
let updateOldName = document.getElementById('oldname');
let updateNewName = document.getElementById('newname');
let newSpellName = document.getElementById('name');
// let baseUrl = process.env.URL
let baseUrl = 'http://localhost:8006/spells'
let selected;

resultsCanvas.addEventListener('mousedown', e => {
    let spell = e.target.parentNode;
    if(e.target.classList.contains('overlay')) {
        
        selected = spell.firstChild.textContent;

        for (let i = 0; i < resultsCanvas.childNodes.length; i++) {
            resultsCanvas.childNodes[i].style.border = 'solid black 2px'
        }
        spell.style.border = 'solid black 10px'
    }
})

async function loadAllSpells() {

    let url = baseUrl;
    let response = await fetch(url);
    let data = await response.json();

    emptyResults()
    data.map(spell => {
      createResultCard(spell, resultsCanvas);  
    })
}

async function searchSpells() {
    let url = baseUrl + '/name/' + searchInput.value;
    if (searchInput.value === "") {
        loadAllSpells();
        return;
    } 
    let response = await fetch(url);
    let data = await response.json();
    
    searchInput.value = "";
    emptyResults()
    data.map(spell => {
      createResultCard(spell, resultsCanvas);  
    })
}

async function addSpell() {

    if (newSpellName.value === "") {
        console.log("It's empty");
        alert("Please give new spell a name!")
        return;
    } 

    let url = baseUrl;
    let index = newSpellName.value.replace(' ', '-').toLowerCase();
    let name = newSpellName.value;
    let spellUrl = '/api/spells/' + index;

    let content = {"index":index,"name":name,"url":spellUrl};
    let response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(content)
    })
    newSpellName.value = "";
    loadAllSpells();
}

async function updateSpells() {

    if (updateNewName.value === "" || updateOldName === "") {
        alert("You need both an original name for the spell as well as a new one!")
        return;
    }

    let url = baseUrl + '/update/' + updateOldName.value + '/' + updateNewName.value;
    url = url.replace(' ', '+')

    let response = await fetch(url);

    if (response.status == 404) {

        alert(response.statusText)
        return;
    }
    //let data = await response.json();

    emptyResults()
    resultsCanvas.append(JSON.stringify(response.json()))

    loadAllSpells();
}

async function deleteSpell() {


        let url = baseUrl + '/delete/' + selected.toLowerCase();
        let response = await fetch(url)
        loadAllSpells()
}

function emptyResults() {
    while (resultsCanvas.firstChild) {
        resultsCanvas.removeChild(resultsCanvas.firstChild);
    }
}

function createResultCard(data, parent) {
    //data = {id:val, age:val, kind:val, name:val}

    let overlay = document.createElement("div");
    overlay.classList.add("overlay");

    let resultsCard = document.createElement("span");
    resultsCard.classList.add("result-card");

    let index = document.createElement("h2");
    index.classList.add("index");
    index.textContent = data.index;

    let name = document.createElement("h1");
    name.classList.add("name");
    name.textContent = data.name;

    let url = document.createElement("h2");
    url.classList.add("url");
    url.textContent = data.url;

    resultsCard.append(name, index, url, overlay);
    parent.appendChild(resultsCard);
}