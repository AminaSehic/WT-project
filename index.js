const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const path = require('path');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const db = require('../wt20p17978/baza.js');
const Op = db.Sequelize.Op;


const DOZVOLJENI_TIPOVI_AKTIVNOSTI = ["vježbe", "vjezbe", "tutorijal", "predavanje"];
const DOZVOLJENI_DANI_AKTIVNOSTI = ["ponedjeljak", "utorak", "srijeda", "četvrtak", "petak", "pon", "uto", "sri", "cet", "pet", "cetvrtak"];

app.get('/', function (req, res) {
    res.redirect("/html/aktivnost.html");
});
app.get('/v1/predmeti', function (req, res) {
    let podaci = fs.readFileSync('predmeti.txt').toString();
    let redovi = podaci.split('\n');
    let predmeti = [];
    for (let i = 0; i < redovi.length; i++) {
        if (redovi[i].length > 0) {
            predmeti.push({naziv: redovi[i]})
        }
    }
    res.send(predmeti);
});
app.get('/v1/aktivnosti', function (req, res) {
    let podaci = fs.readFileSync('aktivnosti.txt').toString();
    let redovi = podaci.split('\n');
    let aktivnosti = [];
    for (let i = 0; i < redovi.length; i++) {
        let red = redovi[i].split(","); //[ime, tip, pocetak]
        let aktivnost = redUAktivost(red);
        if (redovi[i].length > 0) {
            aktivnosti.push(aktivnost);
        }
    }
    res.send(aktivnosti);
});
app.get('/v1/predmet/:naziv/aktivnost/', function (req, res) {
    let naziv = req.params.naziv;
    let podaci = fs.readFileSync('aktivnosti.txt').toString();
    let redovi = podaci.split('\n');
    let aktivnosti = [];
    for (let i = 0; i < redovi.length; i++) {
        let red = redovi[i].split(","); //[ime, tip, pocetak]
        let aktivnost = redUAktivost(red);
        if (aktivnost.naziv.toLowerCase() === naziv.toLowerCase()) {
            aktivnosti.push(aktivnost);
        }
    }
    res.send(aktivnosti);
});
app.post('/v1/predmet', function (req, res) {
    let predmet = req.body;
    let podaci = fs.readFileSync('predmeti.txt').toString();
    let redovi = podaci.split('\n');
    for (let i = 0; i < redovi.length; i++) {
        if (redovi[i] === predmet.naziv) {
            res.send({message: "Naziv predmeta postoji!"});
            return;
        }
    }
    fs.appendFile('predmeti.txt', predmet.naziv + "\n", function (err) {
        if (err) throw err;
        res.send({message: "Uspješno dodan predmet!"});
    });
});

function redUAktivost(red) {
    let aktivnost = {};
    aktivnost.naziv = red[0];
    aktivnost.tip = red[1];
    aktivnost.pocetak = red[2];
    aktivnost.kraj = red[3];
    aktivnost.dan = red[4];
    return aktivnost;
}

app.post('/v1/aktivnost', function (req, res) {
    let poslanaAktivnost = req.body;
    //VALIDACIJA
    if (
        !DOZVOLJENI_TIPOVI_AKTIVNOSTI.includes(poslanaAktivnost.tip.toLowerCase())
        || !DOZVOLJENI_DANI_AKTIVNOSTI.includes(poslanaAktivnost.dan.toLowerCase())
        || (poslanaAktivnost.pocetak >= poslanaAktivnost.kraj || (poslanaAktivnost.pocetak < 8)
        || (poslanaAktivnost.kraj > 20))) {
        res.send({message: "Aktivnost nije validna!"});
        return;
    }
    let podaci = fs.readFileSync('aktivnosti.txt').toString();
    let redovi = podaci.split('\n');
    for (let i = 0; i < redovi.length; i++) {
        let red = redovi[i].split(","); //[ime, tip, pocetak]
        let aktivnost = redUAktivost(red);
        //provjeriti da li aktivnost vec postoji

        if (aktivnost.naziv === poslanaAktivnost.naziv &&
            aktivnost.tip === poslanaAktivnost.tip &&
            aktivnost.pocetak === poslanaAktivnost.pocetak &&
            aktivnost.kraj === poslanaAktivnost.kraj &&
            aktivnost.dan === poslanaAktivnost.dan
        ) {
            res.send({message: "Aktivnost nije validna!"});
            return;
        }
    }
    let zaDodatAktivnost = poslanaAktivnost.naziv + "," + poslanaAktivnost.tip + "," + poslanaAktivnost.pocetak + "," + poslanaAktivnost.kraj + "," + poslanaAktivnost.dan + "\n";
    fs.appendFile('aktivnosti.txt', zaDodatAktivnost, function (err) {
        if (err) throw err;
        res.send({message: "Uspješno dodana aktivnost!"});
    });
});

app.delete('/v1/aktivnost/:naziv', function (req, res) {
    let naziv = req.params.naziv;
    let podaci = fs.readFileSync('aktivnosti.txt').toString();
    let redovi = podaci.split('\n');
    let velicina = redovi.length;
    for (let i = 0; i < redovi.length; i++) {
        let red = redovi[i].split(","); //[ime, tip, pocetak]
        let aktivnost = redUAktivost(red);
        if (aktivnost.naziv.toLowerCase() === naziv.toLowerCase()) {
            //obrisi
            redovi.splice(i, 1); //izmjeni niz
            i--;
        }
    }
    if (velicina === redovi.length) {
        res.send({message: "Greška - aktivnost nije obrisana!"});
        return;
    }
    fs.writeFile('aktivnosti.txt', redovi.join('\n'), function (err) {
        if (err) {
            res.send({message: "Greška - aktivnost nije obrisana"});
        } else {
            res.send({message: "Uspješno obrisana aktivnost!"});
        }
    });
});
app.delete('/v1/predmet/:naziv', function (req, res) {
    let poslaniNaziv = req.params.naziv;
    let podaci = fs.readFileSync('predmeti.txt').toString();
    let redovi = podaci.split('\n');
    let velicina = redovi.length;
    for (let i = 0; i < redovi.length; i++) {
        let red = redovi[i];
        if (red.toLowerCase() === poslaniNaziv.toLowerCase()) {
            //obrisi
            redovi.splice(i, 1); //izmjeni niz
            i--;
        }
    }
    if (velicina === redovi.length) {
        res.send({message: "Greška - predmet nije obrisan"});
        return;
    }
    fs.writeFile('predmeti.txt', redovi.join('\n'), function (err) {
        if (err) {
            res.send({message: "Greška - predmet nije obrisan"});
        } else {
            res.send({message: "Uspješno obrisan predmet!"});
        }
    });
});
app.delete('/v1/all', function (req, res) {
    fs.writeFile('predmeti.txt', "", function (err) {
        if (err) {
            res.send({message: "Greška - sadržaj datoteka nije moguće obrisati!"});
            return;
        }
        fs.writeFile('aktivnosti.txt', "", function (err) {
            if (err) {
                res.send({message: "Greška - sadržaj datoteka nije moguće obrisati!"});
                return;
            }
            res.send({message: "Uspješno obrisan sadržaj datoteka!"});
        });
    });


});


//BAZA
app.post('/v2/predmet', function (req, res) {
    let predmet = req.body;
    if(!predmet.naziv){
        res.send({message: "Unesite ispravan naziv predmeta"});
        return;
    }
    db.predmet.create({
        naziv: predmet.naziv
    }).then((rs) => {
        res.send(rs);
    }).catch((err) => {
            res.status(404).send({
                "message": "Wrong parameters sent. Please try again!"
            });
        }
    )
});
app.post('/v2/aktivnost', function (req, res) {
    let aktivnost = req.body;
    if (!aktivnost.naziv || !aktivnost.pocetak || !aktivnost.kraj || !aktivnost.dan || !aktivnost.tip || !aktivnost.predmet) {
        res.send({message: "Popunite obavezne parametre"});
        // ne provjeravam grupu jer je tu veza 0-N
        return;
    }
    if (!daLiJeIspravnoVrijeme(aktivnost.pocetak) || !daLiJeIspravnoVrijeme(aktivnost.kraj)) {
        res.send({message: "Vrijeme nije ispravno"});
        return;
    }
    db.aktivnost.create({
        naziv: aktivnost.naziv,
        pocetak: aktivnost.pocetak,
        kraj: aktivnost.kraj,
        grupaId: aktivnost.grupa,
        danId: aktivnost.dan,
        tipId: aktivnost.tip,
        predmetId: aktivnost.predmet
    }).then(() => {
        res.send({message: 'uspjesno dodana aktivnost'});
    }).catch((err) => {
            console.log(err);
            res.status(404).send({
                "message": "Wrong parameters sent. Please try again!"
            });
        }
    )
});
app.post('/v2/dan', function (req, res) {
    let dan = req.body;
    if(dan.naziv===""){
        res.send({message: "Unesite ispravan dan"});
        return;
    }
    db.dan.create({
        naziv: dan.naziv
    }).then(() => {
        res.send({message: 'uspjesno dodan dan'});
    }).catch((err) => {
            res.status(404).send({
                "message": "Wrong parameters sent. Please try again!"
            });
        }
    )
});
app.post('/v2/tip', function (req, res) {
    let tip = req.body;
    if(tip.naziv===""){
        res.send({message: "Unesite ispravan tip"});
        return;
    }
    db.tip.create({
        naziv: tip.naziv
    }).then(() => {
        res.send({message: 'uspjesno dodan tip'});
    }).catch((err) => {
            res.status(404).send({
                "message": "Wrong parameters sent. Please try again!"
            });
        }
    )
});
app.post('/v2/grupa', function (req, res) {
    let grupa = req.body;
    if (!grupa.predmetId || !grupa.naziv) {
        res.send({message: "Popunite obavezne parametre"});
        return;
    }
    db.grupa.create({
        naziv: grupa.naziv,
        predmetId: grupa.predmet
    }).then((g) => {
        g.setPredmet(grupa.predmet)
        res.send({message: 'uspjesno dodana grupa'});
    }).catch((err) => {
            res.status(404).send({
                "message": "Wrong parameters sent. Please try again!"
            });
        }
    )
});
app.post('/v2/student', function (req, res) {
    let student = req.body;
    db.student.create({
        naziv: student.naziv,
        index: student.index
    }).then(() => {
        res.send({message: 'uspjesno dodan student'});
    }).catch((err) => {
            res.status(404).send({
                "message": "Wrong parameters sent. Please try again!"
            });
        }
    )
});
app.post('/v2/studenti', function (req, res) {
    let studentiZahtjev = req.body.studenti;
    let poruke = [];
    let grupaZahtjev = req.body.grupa;
    let result = studentiZahtjev.reduce((p, s) => {
        return p.then((rs) => {
            if (rs) {
                postaviGrupu(grupaZahtjev, rs);
            }
            return dodajStudenta(s);
        }).catch((err) => {
            poruke.push(err);
        })
    }, Promise.resolve())

    result.then((rs) => {
        if (rs) {
            postaviGrupu(grupaZahtjev, rs)
        }
        res.status(200).send(poruke);
    }).catch((err) => {
            res.status(404).send({
                "message": "Wrong parameters sent. Please try again!"
            });
        }
    )
});

//baza get
app.get('/predmet/:naziv', function (req, res) {
    db.predmet.findOne({where: {naziv: req.params.naziv}}).then(
        (rs) => {
            if (rs) {
                res.send(rs);
            } else {
                res.send(null)
            }
        }).catch((err) => {
        res.send(err);
    });
});
//baza get
app.get('/v2/predmeti', function (req, res) {
    db.predmet.findAll().then((resultSet) => {
        const predmeti = resultSet.map(e => {
            return {id: e.id, naziv: e.naziv}
        });
        res.send(predmeti);
    }).catch((err) => {
            res.status(404).send({
                "message": "Wrong parameters sent. Please try again!"
            });
        }
    );
});
app.get('/v2/aktivnosti', function (req, res) {
    db.aktivnost.findAll({include: [db.dan, db.tip, db.grupa, db.predmet]}).then((resultSet) => {
        const aktivnosti = resultSet.map(e => {
            let grupaNaziv = e.grupa ? e.grupa.naziv : null;
            return {
                id: e.id,
                naziv: e.naziv,
                pocetak: e.pocetak,
                kraj: e.kraj,
                dan: e.dan.naziv,
                tip: e.tip.naziv,
                grupa: grupaNaziv,
                predmet: e.predmet.naziv
            };
        });
        res.send(aktivnosti);
    }).catch((err) => {
            res.status(404).send({
                "message": "Wrong parameters sent. Please try again!"
            });
        }
    );
});
app.get('/v2/dani', function (req, res) {
    db.dan.findAll().then((resultSet) => {
        const dani = resultSet.map(e => {
            return {id: e.id, naziv: e.naziv};
        });
        res.send(dani);
    }).catch((err) => {
            res.status(404).send({
                "message": "Wrong parameters sent. Please try again!"
            });
        }
    );
});
app.get('/v2/tipovi', function (req, res) {
    db.tip.findAll().then((resultSet) => {
        const tipovi = resultSet.map(e => {
            return {id: e.id, naziv: e.naziv};
        });
        res.send(tipovi);
    }).catch((err) => {
            res.status(404).send({
                "message": "Wrong parameters sent. Please try again!"
            });
        }
    );
});
app.get('/v2/grupe', function (req, res) {
    db.grupa.findAll({include: [db.predmet]}).then((resultSet) => {
        const grupe = resultSet.map(e => {
            let predmetNaziv = e.predmet ? e.predmet.naziv : "nema predmeta"
            return {id: e.id, naziv: e.naziv, predmet: predmetNaziv};
        });
        res.send(grupe);
    }).catch((err) => {
            res.status(404).send({
                "message": "Wrong parameters sent. Please try again!"
            });
        }
    );
});
app.get('/v2/studenti', function (req, res) {
    db.student.findAll().then((resultSet) => {
        const studenti = resultSet.map(e => {
            return {id: e.id, naziv: e.naziv, index: e.index};
        });
        res.send(studenti);
    }).catch((err) => {
            res.status(404).send({
                "message": "Wrong parameters sent. Please try again!"
            });
        }
    );
});

//baza delete
app.delete('/v2/predmet/:id', function (req, res) {
    db.predmet.destroy({
        where: {id: req.params.id}
    }).then(function () {
        console.log('Izbrisi sve podatke');
        res.send();
    }).catch((err) => {
            res.status(404).send({
                "message": "Wrong parameters sent. Please try again!"
            });
        }
    )
});
app.delete('/v2/aktivnost/:id', function (req, res) {
    db.aktivnost.destroy({
        where: {id: req.params.id}
    }).then(function () {
        console.log('Izbrisi sve podatke');
        res.send()
    }).catch((err) => {
            res.status(404).send({
                "message": "Wrong parameters sent. Please try again!"
            });
        }
    )
});
app.delete('/v2/dan/:id', function (req, res) {
    db.dan.destroy({
        where: {id: req.params.id}
    }).then(function () {
        console.log('Izbrisi sve podatke');
        res.send()
    }).catch((err) => {
            res.status(404).send({
                "message": "Wrong parameters sent. Please try again!"
            });
        }
    )
});
app.delete('/v2/grupa/:id', function (req, res) {
    db.grupa.destroy({
        where: {id: req.params.id}
    }).then(function () {
        console.log('Izbrisi sve podatke');
        res.send()
    }).catch((err) => {
            res.status(404).send({
                "message": "Wrong parameters sent. Please try again!"
            });
        }
    )
});
app.delete('/v2/student/:id', function (req, res) {
    db.student.destroy({
        where: {id: req.params.id}
    }).then(function () {
        console.log('Izbrisi sve podatke');
        res.send()
    }).catch((err) => {
            res.status(404).send({
                "message": "Wrong parameters sent. Please try again!"
            });
        }
    )
});
app.delete('/v2/tip/:id', function (req, res) {
    db.tip.destroy({
        where: {id: req.params.id}
    }).then(function () {
        console.log('Izbrisi sve podatke');
        res.send()
    }).catch((err) => {
            res.status(404).send({
                "message": "Wrong parameters sent. Please try again!"
            });
        }
    )
});


app.put('/v2/predmet/:id', function (req, res) {
    db.predmet.update(
        {naziv: req.body.naziv},
        {where: {id: req.params.id}}
    ).then(result => {
        console.log(result)
        res.send(result)
    }).catch(err => {
        console.error(err)
        res.send(err)
    })
});
app.put('/v2/dan/:id', function (req, res) {
    db.dan.update(
        {naziv: req.body.naziv},
        {where: {id: req.params.id}}
    ).then(result => {
        console.log(result)
        res.send(result)
    }).catch(err => {
        console.error(err)
        res.send(err)
    })
});
app.put('/v2/tip/:id', function (req, res) {
    console.log(req.body);
    db.tip.update(
        {naziv: req.body.naziv},
        {where: {id: req.params.id}}
    ).then(result => {
        console.log(result)
        res.send(result)
    }).catch(err => {
        console.error(err)
        res.send(err)
    })
});
app.put('/v2/aktivnost/:id', function (req, res) {
    db.aktivnost.update(
        {
            naziv: req.body.naziv,
            pocetak: req.body.pocetak,
            kraj: req.body.kraj,
            predmetId: req.body.predmet,
            grupaId: req.body.grupa,
            danId: req.body.dan,
            tipId: req.body.tip
        },
        {where: {id: req.params.id}}
    ).then(result => {
        console.log(result)
        res.send(result)
    }).catch(err => {
        console.error(err)
        res.send(err)
    })
});
app.put('/v2/student/:id', function (req, res) {
    console.log(req.body);
    db.student.update(
        {naziv: req.body.naziv},
        {where: {id: req.params.id}}
    ).then(result => {
        console.log(result)
        res.send(result)
    }).catch(err => {
        console.error(err)
        res.send(err)
    })
});

app.put('/v2/grupa/:id', function (req, res) {
    console.log(req.body.predmet)
    db.grupa.update(
        {naziv: req.body.naziv, predmetId: req.body.predmet},
        {where: {id: req.params.id}}
    ).then(result => {
        console.log(result)
        res.send(result)
    }).catch(err => {
        console.error(err)
        res.send(err)
    })
});


const port = (process.env.NODE_ENV === "test") ? 3001 : 3000;
app.listen(port, function () {
    console.log("Started server")
});
var dodajStudenta = function (student) {
    return new Promise(function (resolve, reject) {
        db.student.findAll({where: {index: student.index}}).then((rs) => {
            if (rs.length === 0) {
                db.student.create({
                    naziv: student.naziv,
                    index: student.index,
                }).then((s) => {
                    resolve(s)
                })
            } else {
                //provjeri je li im isto ime
                if (rs[0].naziv === student.naziv) {
                    resolve(rs[0])
                } else {
                    reject(`Student ${student.naziv} nije kreiran jer postoji student ${rs[0].naziv} sa istim indexom ${rs[0].index}`)
                }
            }
        })
    })
}

var postaviGrupu = function (grupaId, student) {
    //ako je student vec dodan u grupu za dati predmet, izmjena- rs.value.setGrupa(grupaZahtjev)
    //ako nije dodan u grupu za taj predmet dodaj - rs.value.addGrupa(grupaZahtjev)

    //prvo u bazi nadjem grupu koju je korisnik odabrao
    db.grupa.findOne({where: {id: grupaId}}).then((g) => {
        //zatim u bazi nadjemo sve grupe koje imaju isti predmetId kao zeljena grupa
        db.grupa.findAll({where: {predmetId: g.dataValues.predmetId}}).then((grupe) => {
            //sad trazim da li nas student ima unos sa bilo kojom od iznad pronadjenih grupa
            db.grupaStudent.findAll({
                where: {
                    studentId: student.id,
                    grupaId: grupe.map(e => e.dataValues.id)
                }
            }).then((rez) => {
                //ako ima, znaci da je vec upisan u neku grupu za taj predmet, pa samo izmjenim
                if (rez.length > 0) {
                    student.setGrupa(grupaId)
                }
                //ako nema, dodam novi unos
                else {
                    student.addGrupa(grupaId)
                }
            })
        })
    })
}

function daLiJeIspravnoVrijeme(vrijeme) {
    vrijeme *= 10;
    return (vrijeme % 10 === 5 || vrijeme % 10 === 0);
}

var dodajGrupu = function (grupa) {
    return new Promise(function (resolve, reject) {
        db.grupa.findAll({where: {naziv: grupa}}).then((rs) => {
            if (rs.length === 0) {
                db.grupa.create({
                    naziv: grupa,
                }).then((g) => {
                    resolve(g)
                })
            } else {
                resolve(rs[0])
            }
        })
    })
}

module.exports = app;