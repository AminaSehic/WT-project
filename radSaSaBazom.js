const db = require('../wt20p17978/baza.js');
db.sequelize.sync({force: true}).then(() => {
    initialize().then(() => {
        console.log("Gotovo kreiranje tabela i ubacivanje pocetnih podataka!");
        process.exit();
    }).catch((err) => {
        console.log(err)
    });
}).catch((err) => {
    console.log(err)
});

function initialize() {
    let predmeti = [];
    let dani = [];
    let predmet = {naziv: 'WT'};
    let predmet2 = {naziv: 'RMA'};
    let predmet3 = {naziv: 'RG'};

    let aktivnost = {naziv: 'WT', pocetak: 8, kraj: 10};
    let dan= {naziv: 'Ponedjeljak'}
    let dan2 = {naziv: 'Utorak'};
    let dan3 = {naziv: 'Srijeda'};

    let tip = {naziv: 'Tutorijal'};


    let student = {naziv: 'Amina', index: '17978'};
    let grupa = {naziv: 'wt2'};

    return new Promise((resolve, reject) => {
        predmeti.push(db.predmet.create({naziv: predmet.naziv}));
        predmeti.push(db.predmet.create({naziv: predmet2.naziv}));
        predmeti.push(db.predmet.create({naziv: predmet3.naziv}));
        dani.push(db.dan.create({naziv: dan.naziv}));
        dani.push(db.dan.create({naziv: dan2.naziv}));
        dani.push(db.dan.create({naziv: dan3.naziv}));


        //dodajem predmete u bazu
        Promise.all(predmeti).then((predmeti) => {
            //ovo je nakon sto sam dodala predmete u bazu

            //dodajem grupu u bazu
            db.grupa.create({naziv: grupa.naziv}).then((grupa) => {
                //ovo je nakon sto sam dodala grupu u bazu
                grupa.setPredmet(predmeti[0]);

                //dodajem dane u bazu
                Promise.all(dani).then((dani) => {
                    //ovo je nakon sto sam dodala dane u bazu

                    //dodajem studenta  bazu
                    db.student.create({naziv: student.naziv, index: student.index}).then((student) => {
                        //ovo je nakon sto sam dodala studenta u bazu
                        student.setGrupa(grupa);

                        //dodajem tip  bazu
                        db.tip.create({naziv: tip.naziv}).then((tip) => {
                            //ovo je nakon sto sam dodala tip u bazu

                            //kad je sve dodato, moze se dodati i aktivnosti u bazu
                            db.aktivnost.create({
                                naziv: aktivnost.naziv,
                                pocetak: aktivnost.pocetak,
                                kraj: aktivnost.kraj
                            }).then((aktivnost) => {
                                aktivnost.setPredmet(predmeti[0])
                                aktivnost.setGrupa(grupa)
                                aktivnost.setDan(dani[0])
                                aktivnost.setTip(tip)
                            }).catch((err) => {
                                console.log(err)
                            })
                        }).catch((err) => {
                            console.log(err)
                        })
                    }).catch((err) => {
                        console.log(err)
                    })
                }).catch((err) => {
                    console.log(err)
                })
            }).catch((err) => {
                console.log(err)
            })
        }).catch((err) => {
            console.log(err)
        })
    })
}
