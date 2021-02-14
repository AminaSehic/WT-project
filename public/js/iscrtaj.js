function iscrtajRaspored(div, dani, satPocetak, satKraj) {
    div.innerHTML = "";
    if (satPocetak >= satKraj || (satPocetak < 0 || satPocetak > 24) || (satKraj < 0 || satKraj > 24)) {
        div.innerHTML += "Greška";
        return;
    }
    const dozvoljeniDani = ["ponedjeljak", "utorak", "srijeda", "četvrtak", "petak", "pon",
        "uto", "sri", "cet", "čet", "pet", "cetvrtak"];

    for (let i = 0; i < dani.length; i++) {
        if (!(dozvoljeniDani.includes(dani[i].toLowerCase()))) {
            console.log("Neispravni dani u sedmici !");
            return;
        }
    }
    let tabela = document.createElement("table");
    div.appendChild(tabela);
    generisiSate(tabela, satPocetak, satKraj);
    generisiRedove(tabela, dani, satPocetak, satKraj);
}

function satZaPrikaz(sat) {
    let s = sat.toString();
    if (s.length === 1) {
        s = '0' + s;
    }
    return s + ':00';
}

function generisiSate(div, satPocetak, satKraj) {
    let brojCelija = (satKraj - satPocetak) * 2;
    let prviRed = document.createElement("tr");
    prviRed.append(document.createElement("td"));

    for (let i = 0; i < brojCelija; i++) {
        let celija = document.createElement("td");
        if ([0, 2, 4, 6, 8, 10, 12, 15, 17, 19, 21, 23].includes(satPocetak + (i / 2))) {
            let divSat = document.createElement("div");
            divSat.textContent = satZaPrikaz((satPocetak + (i / 2)));
            divSat.classList.add("vrijeme");
            celija.appendChild(divSat);
            celija.colSpan = 2;
            i++;
        }
        prviRed.classList.add("sat")
        prviRed.appendChild(celija);
    }
    div.appendChild(prviRed);
}

function generisiRedove(div, dani, satPocetak, satKraj) {
    for (let i = 0; i < dani.length; i++) {
        let red = document.createElement("tr");
        red.classList.add("cas");
        let prvaCelija = document.createElement("td");
        prvaCelija.textContent = dani[i];

        if (["ponedjeljak", "pon"].includes(dani[i].toLowerCase())) {
            prvaCelija.classList.add("trenutni-dan");
        }
        prvaCelija.classList.add("dan-u-sedmici");
        red.appendChild(prvaCelija);

        let brojKolona = (satKraj - satPocetak) * 2 + 1;
        for (let j = 1; j < brojKolona; j++) {
            let celija = document.createElement("td");
            celija.classList.add("prazna");
            if (j % 2 === 1) {
                celija.classList.add("puna-lijevo");
                celija.classList.add("isprekidana-desno");
            } else {
                celija.classList.add("puna-desno");
                celija.classList.add("isprekidana-lijevo");
            }
            let isprekidanaKolona = parseInt((19 - satPocetak) * 2 + 1);
            if (j === isprekidanaKolona || j + 1 === isprekidanaKolona) {
                celija.classList.remove("puna-desno");
                celija.classList.remove("puna-lijevo");
                celija.classList.add("isprekidana-desno");
                celija.classList.add("isprekidana-lijevo");
            }
            red.appendChild(celija);
        }
        div.appendChild(red);
    }
}
//ZADATAK 2
//vraca true ako je vrijeme u ispravnom formatu
function daLiJeIspravnoVrijeme(vrijeme) {
    vrijeme *= 10;
    return (vrijeme % 10 === 5 || vrijeme % 10 === 0);
}

function redZaDan(raspored, dan) {
    let danURasporedu = raspored.getElementsByClassName("dan-u-sedmici");
    for (let i = 0; i < danURasporedu.length; i++) {
        if (danURasporedu[i].textContent === dan) {
            return danURasporedu[i].parentElement;
        }
    }
}

function dajPocetakIKrajRasporeda(raspored) {
    let kolone = raspored.querySelectorAll(".sat td");
    let duzinaRasporeda = 0;
    let udaljenostDoPrvogSata = 0;
    let pronadjenPrviSat = false;
    let prviSat;
    for (let i = 1; i < kolone.length; i++) {
        duzinaRasporeda += kolone[i].colSpan;
        if (!pronadjenPrviSat) {
            udaljenostDoPrvogSata++;
            if (kolone[i].querySelector(".vrijeme")) {
                pronadjenPrviSat = true;
                prviSat = kolone[i].querySelector(".vrijeme").textContent;
                udaljenostDoPrvogSata--;
            }
        }
    }
    let duzinaUSatima = (duzinaRasporeda) / 2;
    prviSat = parseInt(prviSat.split(":")[0]) - udaljenostDoPrvogSata / 2;
    return [prviSat, prviSat + duzinaUSatima];
}

function dodajAktivnost(raspored, naziv, tip, vrijemePocetak, vrijemeKraj, dan) {
    let tabela = raspored.getElementsByTagName("table")[0];
    if (tabela == null || tabela === "") {
        window.alert("Greška - raspored nije kreiran");
        return;
    }
    if (!["vježbe", "vjezbe", "tutorijal", "predavanje"].includes(tip)) {
        alert("Tip može biti vježbe, tutorijal ili predavanje");
        return;
    }
    let temp = tabela.getElementsByClassName("dan-u-sedmici");
    let dani = [];
    for (let i = 0; i < temp.length; i++) {
        dani.push(temp[i].textContent)
    }
    if (!dani.includes(dan)) {
        window.alert("Greška");
        return;
    }
    let red = redZaDan(tabela, dan);
    let [satPocetkaRasporeda, satKrajaRasporeda] = dajPocetakIKrajRasporeda(tabela);

    if ((vrijemeKraj <= vrijemePocetak) || vrijemePocetak < satPocetkaRasporeda || vrijemeKraj > satKrajaRasporeda || !daLiJeIspravnoVrijeme(vrijemePocetak) || !daLiJeIspravnoVrijeme(vrijemeKraj)) {
        window.alert("Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin");
        return;
    }

    if (vrijemePocetak > satKrajaRasporeda || vrijemeKraj < satPocetkaRasporeda) {
        alert("Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin");
        return;
    }
    let zeljenaUdaljenost = (vrijemePocetak - satPocetkaRasporeda) * 2;
    let trenutnaUdaljenost = 0;
    let niz = red.children;
    for (let i = 1; i < niz.length; i++) {
        let trenutnaCelija = niz[i];
        if (i !== 1) {
            //udaljenost racunamo DO trenutne celije - nju ne ukljucujemo
            trenutnaUdaljenost += niz[i - 1].colSpan;
        }
        if (trenutnaUdaljenost > zeljenaUdaljenost) {
            alert("Greška - već postoji termin u rasporedu u zadanom vremenu");
            return;
        } else if (trenutnaUdaljenost === zeljenaUdaljenost) {
            let trajanjeZauzeca = (vrijemeKraj - vrijemePocetak) * 2;
            if (trajanjeZauzeca > (niz.length - i)) {
                alert("Greška - u rasporedu ne postoji ili vrijeme u kojem pokušavate dodati termin");
                return;
            } else {
                if (Array.from(trenutnaCelija.classList).includes("zauzeto")) {
                    alert("Greška - već postoji termin u rasporedu u zadanom vremenu");
                    return;
                }
                for (let k = 1; k < trajanjeZauzeca; k++) {
                    let temp = niz[i + k];
                    if (Array.from(temp.classList).includes("zauzeto")) {
                        alert("Greška - već postoji termin u rasporedu u zadanom vremenu");
                        return;
                    }
                }
                for (let k = 0; k < trajanjeZauzeca - 1; k++) {
                    let temp = niz[i + 1];
                    temp.remove();
                }
                let nazivPredmeta = document.createElement("div");
                nazivPredmeta.classList.add("predmet");
                nazivPredmeta.textContent = naziv;
                let tipNastave = document.createElement("div");
                tipNastave.classList.add("tip-nastave");
                tipNastave.textContent = tip;

                trenutnaCelija.classList.remove("prazna");
                trenutnaCelija.classList.remove("isprekidana-desno");
                trenutnaCelija.classList.remove("puna-desno");
                if ((i + 1) % 2 === 0) {
                    trenutnaCelija.classList.add("puna-desno");
                } else {
                    trenutnaCelija.classList.add("isprekidana-desno");
                }
                trenutnaCelija.classList.add("zauzeto");
                trenutnaCelija.appendChild(nazivPredmeta);
                trenutnaCelija.appendChild(tipNastave);
                trenutnaCelija.colSpan = trajanjeZauzeca;
                return;
            }
        }
    }
}
