const {Sequelize, DataTypes} = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "mysql"
});

const CadUser = sequelize.define("cadUser", {
    nome: {
        type: DataTypes.STRING(100),

    },
    email: {
        type: DataTypes.STRING(100)
    },
    numero: {
        type: DataTypes.STRING(14)
    },
    data:{
        type: DataTypes.DATE
    },
    cpf:{
        primaryKey: true,
        type: DataTypes.STRING(14)
    },
    placa:{
        type: DataTypes.STRING(7)
    },
    modelo: {
        type: DataTypes.STRING(20)
    },
    senha:{
        type: DataTypes.STRING(255)
    },
    genero: {
        type: DataTypes.STRING(20)
    }
}, {timestamps: false});

CadUser.sync()
    .then(()=> {
        console.log("Tabela usuario sincronizada com sucesso!");
    });

module.exports = CadUser;