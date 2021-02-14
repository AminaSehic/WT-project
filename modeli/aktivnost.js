const Sequelize = require("sequelize");

module.exports = function(sequelize,DataTypes){
    const Aktivnost = sequelize.define("aktivnost",{
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        naziv:Sequelize.STRING,
        pocetak:Sequelize.FLOAT,
        kraj:Sequelize.FLOAT
    })
    return Aktivnost;
};
