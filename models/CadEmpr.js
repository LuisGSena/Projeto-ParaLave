const {Sequelize, DataTypes} = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "mysql"
});

const CadEmpr = sequelize.define("cadEmpr", {
    nome_empr: {
        type: DataTypes.STRING(100),

    },
    CNPJ: {
        primaryKey: true,
        type: DataTypes.STRING(20)
    },
    RazaoSocial: {
        type: DataTypes.STRING(30)
    },
    telefone:{
        type: DataTypes.STRING(15)
    },
    whatsapp:{
        type: DataTypes.STRING(15)
    },
    CEP:{
        type: DataTypes.STRING(8)
    },
    bairro: {
        type: DataTypes.STRING(30)
    },
    cidade:{
        type: DataTypes.STRING(30)
    },
    email: {
        type: DataTypes.STRING(30)
    },
    site:{
        type: DataTypes.STRING(100)
    },
    data_de_inauguramento:{
        type: DataTypes.STRING(10)
    },
    senha:{
        type: DataTypes.STRING(255)
    },
    imagem: {
        type: DataTypes.BLOB
    }
}, {timestamps: false});

CadEmpr.sync()
    .then(()=> {
        console.log("Tabela empresa sincronizada com sucesso!");
    })
    .catch((error) => {
        console.error("Erro ao sincronizar a tabela empresa:", error);
      });


module.exports = CadEmpr