function ucitajAktivnosti() {
    let aktivnosti = [];
    var ajax = new XMLHttpRequest();
    ajax.open("GET", "/v2/aktivnosti", true);
    ajax.send();
    ajax.onreadystatechange = function () {// Anonimna funkcija
        if (ajax.readyState == 4 && ajax.status == 200) {
            aktivnosti = JSON.parse(ajax.response);
            var tabela = document.getElementsByTagName("table")[0];
            aktivnosti.forEach((aktivnost) => {
                dodajAktivnost(tabela, aktivnost.naziv, "vježbe", aktivnost.pocetak, aktivnost.kraj, aktivnost.dan);
            })
        }
        if (ajax.readyState == 4 && ajax.status == 404) {
            alert("greska");
        }
    }
}

window.onload = function () {
    var tabela = document.getElementsByTagName("table")[0];
    iscrtajRaspored(tabela, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 8, 21)
    ucitajAktivnosti();
}