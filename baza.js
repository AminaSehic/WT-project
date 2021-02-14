const {Sequelize} = require("sequelize");
const path = require("path");
const sequelize = new Sequelize("wt2017978", "root", "root", {
    host: "localhost",
    dialect: "mysql",
    logging: false,
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.predmet = require(path.join(__dirname, 'modeli/predmet.js'))(sequelize, Sequelize.DataTypes);
db.aktivnost = require(path.join(__dirname, 'modeli/aktivnost.js'))(sequelize, Sequelize.DataTypes);
db.dan = require(path.join(__dirname, 'modeli/dan.js'))(sequelize, Sequelize.DataTypes);
db.grupa = require(path.join(__dirname, 'modeli/grupa.js'))(sequelize, Sequelize.DataTypes);
db.student = require(path.join(__dirname, 'modeli/student.js'))(sequelize, Sequelize.DataTypes);
db.grupaStudent = require(path.join(__dirname, 'modeli/grupaStudent.js'))(sequelize, Sequelize.DataTypes);
db.tip = require(path.join(__dirname, 'modeli/tip.js'))(sequelize, Sequelize.DataTypes);

// Predmet 1-N Grupa
db.predmet.hasMany(db.grupa, {});
db.grupa.belongsTo(db.predmet, {});

// Aktivnost N-1 Predmet
db.predmet.hasMany(db.aktivnost, {});
db.aktivnost.belongsTo(db.predmet, {});

// Aktivnost N-0 Grupa
db.grupa.hasMany(db.aktivnost, {
    foreignKey: {
        allowNull: true
    }
});
db.aktivnost.belongsTo(db.grupa, {
    foreignKey: {
        allowNull: true
    }
});

// Aktivnost N-1 Dan
db.dan.hasMany(db.aktivnost, {});
db.aktivnost.belongsTo(db.dan, {});

// Aktivnost N-1 Tip
db.tip.hasMany(db.aktivnost, {});
db.aktivnost.belongsTo(db.tip, {});

// Student N-M Grupa
db.student.belongsToMany(db.grupa, {
    through: db.grupaStudent,
    as: "grupa"
});
db.grupa.belongsToMany(db.student, {
    through: db.grupaStudent,
    as: "student"
});

module.exports = db;
