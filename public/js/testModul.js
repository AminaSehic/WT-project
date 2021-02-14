let expect = chai.expect;
let assert = chai.assert;

var div = document.createElement("div");
document.body.appendChild(div);
function ocistiDokument() {
    div.innerHTML = "";
    let tabela = document.createElement("table")
    div.appendChild(tabela)
}

function isprazniTabelu() {
    ocistiDokument();
    Raspored.iscrtajRaspored(div, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 8, 21)
}

describe('iscrtaj raspored', function () {
    this.timeout(10000);

    it('treba vratiti tabelu koja ima 6 redova', function () {
        ocistiDokument();
        Raspored.iscrtajRaspored(div, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 8, 21)
        let brojRedova = document.getElementsByTagName("table")[0].children.length;
        assert.strictEqual(brojRedova, 6);
    });
    it('treba vratiti tabelu koja ima 2 reda', function () {
        ocistiDokument();
        Raspored.iscrtajRaspored(div, ["Ponedjeljak", "Utorak"], 8, 21)
        let brojRedova = document.getElementsByTagName("table")[0].children.length;
        assert.strictEqual(brojRedova, 3);
    });
    it('treba vratiti tabelu koja ima 27 kolona', function () {
        ocistiDokument();
        Raspored.iscrtajRaspored(div, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 8, 21)
        let brojKolona = document.getElementsByTagName("table")[0].children[1].children.length;
        assert.strictEqual(brojKolona, 27);
    });
    it('ne treba iscrtati raspored sa negativnim satima', function () {
        ocistiDokument();
        Raspored.iscrtajRaspored(div, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], -8, -21)
        assert.strictEqual(div.innerHTML, "Greška");
    });
    it('treba iscrtati raspored od 0 do 24 ', function () {
        ocistiDokument();
        Raspored.iscrtajRaspored(div, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 0, 24)
        let brojKolona = document.getElementsByTagName("table")[0].children[1].children.length;
        assert.strictEqual(brojKolona, 49);
    });
    it('ne treba iscrtati raspored sa neispravnim danima u sedmici', function () {
        ocistiDokument();
        Raspored.iscrtajRaspored(div, ["Nije", "Dan", "U", "Sedmici"], 9, 10);
        assert.strictEqual(div.innerHTML, "");
    });
    it('ne treba iscrtati raspored sa negativnim satovima', function () {
        ocistiDokument();
        Raspored.iscrtajRaspored(div, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], -9, -10);
        assert.strictEqual(div.innerHTML, "Greška");
    });
    it('ne iscrtava se prvi sat', function () {
        ocistiDokument();
        Raspored.iscrtajRaspored(div, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 9, 14)
        assert.deepEqual(Raspored.dajPocetakIKrajRasporeda(div.querySelector("table")), [9, 14]);
    });
    it('isti sati pocetka i sat kraja', function () {
        ocistiDokument();
        Raspored.iscrtajRaspored(div, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 9, 9)
        assert.strictEqual(div.innerHTML, "Greška");
    });
    it('sat pocetka veci od kraja ', function () {
        ocistiDokument();
        Raspored.iscrtajRaspored(div, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 20, 9)
        assert.strictEqual(div.innerHTML, "Greška");
    });

    it('raspored ima samo 2 kolone ', function () {
        ocistiDokument();
        Raspored.iscrtajRaspored(div, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 8, 8.5)
        let brojKolona = document.getElementsByTagName("table")[0].children[1].children.length;
        assert.strictEqual(brojKolona, 2);
    });
    it('zadnji sat se ne ispisuje ', function () {
        ocistiDokument();
        Raspored.iscrtajRaspored(div, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 10, 21)
        let ispisaniSati = div.querySelectorAll(".sat > td > .vrijeme")
        let zadnjiIspisanSat = ispisaniSati[ispisaniSati.length - 1]
        assert.notStrictEqual(zadnjiIspisanSat, 21);
    });
});


describe('dodaj aktivnost', function () {
    this.timeout(10000);

    it('Treba dodat aktivnost u rasporedu 1 ', function () {
        isprazniTabelu();
        Raspored.dodajAktivnost(div, "WT", "vjezbe", 10, 12, "Ponedjeljak")
        assert.strictEqual(document.querySelector("body > div > table > tr:nth-child(2) > td.puna-lijevo.puna-desno.zauzeto > div.predmet").textContent, "WT")
    });

    it('Treba dodat aktivnost u rasporedu 2 ', function () {
        isprazniTabelu();
        Raspored.dodajAktivnost(div, "WT", "vjezbe", 17, 21, "Ponedjeljak");
        assert.strictEqual(document.querySelector("body > div > table > tr:nth-child(2) > td.puna-lijevo.puna-desno.zauzeto > div.predmet").textContent, "WT")
    });

    it('Treba dodat aktivnost u rasporedu 3 ', function () {
        isprazniTabelu();
        Raspored.dodajAktivnost(div, "WT", "vjezbe", 12, 15, "Utorak")
        assert.strictEqual(document.querySelector("body > div > table > tr:nth-child(3) > td.puna-lijevo.puna-desno.zauzeto > div.predmet").textContent, "WT")
    });
    it('Ne treba dodat aktivnost u rasporedu koja pocinje prije pocetka rasporeda', function () {

        isprazniTabelu();
        Raspored.dodajAktivnost(div, "WT", "vjezbe", 6, 15, "Utorak")
        let zauzete = document.getElementsByClassName("zauzeto").length;
        assert.strictEqual(zauzete, 0);
    });
    it('Ne treba dodati aktivnost ako je zauzeto vrijeme', function () {
        isprazniTabelu();
        Raspored.dodajAktivnost(div, "WT", "vjezbe", 13, 15, "Srijeda")
        Raspored.dodajAktivnost(div, "WT", "vjezbe", 12, 15, "Utorak")
        Raspored.dodajAktivnost(div, "WT", "vjezbe", 14, 17, "Utorak")
        let zauzete = document.getElementsByClassName("zauzeto").length
        assert.strictEqual(zauzete, 2)
    });
    it('Ne treba dodati aktivnost ako je nepostojeci dan u rasporedu', function () {
        isprazniTabelu();
        Raspored.dodajAktivnost(div, "WT", "vjezbe", 10, 15, "Nedjelja")
        let zauzete = document.getElementsByClassName("zauzeto").length
        assert.strictEqual(zauzete, 0);
    });

    it('Ne treba dodati aktivnost koja ima neispravan tip', function () {
        isprazniTabelu();
        Raspored.dodajAktivnost(div, "WT", "tip", 10, 15, "Petak")
        let zauzete = document.getElementsByClassName("zauzeto").length
        assert.strictEqual(zauzete, 0);
    });

    it('Ne treba dodat aktivnost u rasporedu koja zavrsava nakon rasporeda', function () {
        isprazniTabelu();
        Raspored.dodajAktivnost(div, "naziv", "vjezbe", 20, 22, "Petak")
        let zauzete = document.getElementsByClassName("zauzeto").length
        assert.strictEqual(zauzete, 0);
    });

    it('Ne treba dodat aktivnost u rasporedu koja ima neispravno vrijeme pocetka', function () {
        isprazniTabelu();
        Raspored.dodajAktivnost(div, "naziv", "vjezbe", -10, 15, "Petak")
        let zauzete = document.getElementsByClassName("zauzeto").length
        assert.strictEqual(zauzete, 0);
    });
    it('Ne treba dodat aktivnost u rasporedu koja ima neispravno vrijeme kraja', function () {
        isprazniTabelu();
        Raspored.dodajAktivnost(div, "naziv", "vjezbe", 12, 35, "Petak")
        let zauzete = document.getElementsByClassName("zauzeto").length
        assert.strictEqual(zauzete, 0);
    });
});