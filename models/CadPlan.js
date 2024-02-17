const {Sequelize, DataTypes} = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "mysql"
});
    const CadPlan = sequelize.define("CadPlan", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nomeEmpr: {
        type: DataTypes.STRING(100),
      },
      numeroCart: {
        type: DataTypes.STRING(20),
      },
      numcvv: {
        type: DataTypes.STRING(3),
      },
      dateVal: {
        type: DataTypes.STRING(10),
      },
      formaPagamento: {
        type: DataTypes.STRING(15),
      },
      valor: {
        type: DataTypes.INTEGER,
      },
    }, { timestamps: false });
  
    CadPlan.sync()
      .then(() => {
        console.log("Tabela Plano sincronizada com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao sincronizar a tabela Plano:", error);
      });

module.exports = CadPlan