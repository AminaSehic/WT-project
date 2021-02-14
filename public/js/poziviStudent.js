function f(podaci) {
    var ajax = new XMLHttpRequest();
    ajax.open("POST", "/v2/studenti", true);
    ajax.setRequestHeader("Content-Type", "application/json");
    ajax.send(JSON.stringify(podaci));
    ajax.onreadystatechange = function () {// Anonimna funkcija
        if (ajax.readyState == 4 && ajax.status == 200) {
            let tekst = document.getElementById("ime_prezime");
            tekst.value = JSON.parse(ajax.response).toString().replace(",", "\n");
        }
        if (ajax.readyState == 4 && ajax.status == 404) {
            console.log("greska");
        }
    }
}

function popuniSelect() {
    var ajax = new XMLHttpRequest();
    ajax.open("GET", "/v2/grupe", true);
    ajax.send();
    ajax.onreadystatechange = function () {// Anonimna funkcija
        if (ajax.readyState == 4 && ajax.status == 200) {
            let select = document.getElementById("grupa")
            JSON.parse(ajax.response).forEach(grupa => {
                option = document.createElement("option");
                option.value = grupa.id
                option.text = grupa.naziv
                select.add(option)
            })
        }
        if (ajax.readyState == 4 && ajax.status == 404) {
            alert("greska prema bazi")
        }
    }
}

var studenti = [];
var podaci = {};

window.onload = function () {
    popuniSelect();
    let forma = document.getElementsByTagName('form')[0];
    forma.addEventListener('submit', function (event) {
        event.preventDefault();
        studenti = [];
        let imeIprezime = document.getElementsByTagName("textarea")[0].value;
        let grupa = document.getElementById("grupa").value;

        let redovi = imeIprezime.split("\n");
        for (let i = 0; i < redovi.length; i++) {
            let red = redovi[i].split(",");
            let studnet = {naziv: red[0], index: red[1]};
            studenti.push(studnet);
        }
        podaci = {
            studenti: studenti,
            grupa: grupa
        }
        f(podaci);
    });
}