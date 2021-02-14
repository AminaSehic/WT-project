window.onload = function () {

    let okvir1 = document.getElementById("tabela1");
    let okvir2 = document.getElementById("tabela2");

    iscrtajRaspored(okvir1, ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'], 8, 14);
    iscrtajRaspored(okvir2, ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'], 8, 19);

    dodajAktivnost(okvir1, 'WT', 'predavanje', 6, 9, 'Ponedjeljak');
    dodajAktivnost(okvir1, 'RMS', 'vježbe', 12, 13.5, 'Srijeda');
    dodajAktivnost(okvir1, 'RMA', 'predavanje', 14, 17, 'Ponedjeljak');
    dodajAktivnost(okvir1, 'SI', 'predavanje', 14, 17, 'Utorak');
    dodajAktivnost(okvir1, 'OS', 'tutorijal', 12, 13, 'Petak');
    dodajAktivnost(okvir1, 'RG', 'tutorijal', 12.5, 13.5, 'Utorak');

    dodajAktivnost(okvir2, 'VVS', 'vježbe', 12, 15, 'Srijeda');
    dodajAktivnost(okvir2, 'PWS', 'tutorijal', 14.5, 16,     'Utorak');
    dodajAktivnost(okvir2, 'OIS', 'predavanje', 20, 21, 'Petak');
    dodajAktivnost(okvir2, 'DM', 'predavanje', 8.5, 11.5, 'Utorak');
    dodajAktivnost(okvir2, 'OIS', 'predavanje', 16, 9, 'Petak');
    dodajAktivnost(okvir2, 'OOI', 'predavanje', 8, 11.5, 'Petak');
    dodajAktivnost(okvir2, 'OBP', 'tutorijal', 8, 11.5, 'Petak');
}
