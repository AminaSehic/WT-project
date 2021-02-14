function postojiLiPredmet(naziv) {
    var ajax = new XMLHttpRequest();
    ajax.open("GET", `/predmet/${naziv}`, true);
    ajax.send();
    ajax.onreadystatechange = function () {// Anonimna funkcija
        if (ajax.readyState == 4 && ajax.status == 200) {
            return JSON.parse(ajax.response);
        }
        if (ajax.readyState == 4 && ajax.status == 404) {
            alert("Greška");
            return null;
        }
    }
}

function snimiAktivnost(podaci, postoji) {
    var ajax = new XMLHttpRequest();
    ajax.open("POST", "/v2/aktivnost", true);
    ajax.setRequestHeader("Content-Type", "application/json");
    ajax.send(JSON.stringify(podaci));
    ajax.onreadystatechange = function () {// Anonimna funkcija

        if (ajax.readyState == 4 && ajax.status == 200) {
            console.log(ajax.response);
        }

        if (ajax.readyState == 4 && ajax.status == 404) {
            if (!postoji) {
                ajax.open("DELETE", "/v2/predmet/:naziv", true);
                ajax.setRequestHeader("Content-Type", "application/json");
                ajax.send();
                ajax.onreadystatechange = function () {// Anonimna funkcija
                    if (ajax.readyState == 4 && ajax.status == 200) {
                        console.log("Uspješno izbrisan predmet!");
                    }
                    if (ajax.readyState == 4 && ajax.status == 404) {
                        console.log("Greška - nije izbrisan predmet!");
                    }
                }
            }
            else{
                console.log("greska"); return;
            }

        }

    }
}

function f1(podaci) {
    podaci = JSON.parse(podaci);
    let predmet = postojiLiPredmet(podaci.predmet)
    console.log(predmet)
    if (!predmet) {
        var ajax = new XMLHttpRequest();
        ajax.open("POST", "/v2/predmet", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify({naziv: podaci.predmet}));
        ajax.onreadystatechange = function () {// Anonimna funkcija
            if (ajax.readyState == 4 && ajax.status == 200) {
                podaci.predmet = JSON.parse(ajax.response).id
                snimiAktivnost(podaci, true);
            }
            if (ajax.readyState == 4 && ajax.status == 404) {
                alert("Greška");
            }
        }
    } else {
        podaci.predmet = predmet.id;
        snimiAktivnost(podaci, false);
    }
}

function ucitajPredmete() {
    var ajax = new XMLHttpRequest();
    ajax.open("GET", "/v2/predmeti", true);
    ajax.send();
    ajax.onreadystatechange = function () {// Anonimna funkcija
        if (ajax.readyState == 4 && ajax.status == 200) {
            let select = document.getElementById("predmeti")
            JSON.parse(ajax.response).forEach(predmet => {
                option = document.createElement("option");
                option.value = predmet.id
                option.text = predmet.naziv
                select.add(option)
            })
        }
        if (ajax.readyState == 4 && ajax.status == 404) {
            alert("greska prema bazi")
        }
    }
}


function ucitajTipove() {
    var ajax = new XMLHttpRequest();
    ajax.open("GET", "/v2/tipovi", true);
    ajax.send();
    ajax.onreadystatechange = function () {// Anonimna funkcija
        if (ajax.readyState == 4 && ajax.status == 200) {
            let select = document.getElementById("tip")
            JSON.parse(ajax.response).forEach(tip => {
                option = document.createElement("option");
                option.value = tip.id
                option.text = tip.naziv
                select.add(option)
            })
        }
        if (ajax.readyState == 4 && ajax.status == 404) {
            alert("greska prema bazi")
        }
    }
}

function ucitajDane() {
    var ajax = new XMLHttpRequest();
    ajax.open("GET", "/v2/dani", true);
    ajax.send();
    ajax.onreadystatechange = function () {// Anonimna funkcija
        if (ajax.readyState == 4 && ajax.status == 200) {
            let select = document.getElementById("daniUSedmici")
            JSON.parse(ajax.response).forEach(dan => {
                option = document.createElement("option");
                option.value = dan.id
                option.text = dan.naziv
                select.add(option)
            })
        }
        if (ajax.readyState == 4 && ajax.status == 404) {
            alert("greska prema bazi")
        }
    }
}

window.onload = function () {
    let forma = document.getElementsByTagName('form')[0];
    forma.addEventListener('submit', function (event) {
        event.preventDefault();
        let podaci = Object.fromEntries(new FormData(event.target).entries());
        f1(JSON.stringify(podaci));
    });
    ucitajTipove();
    ucitajDane();
}
