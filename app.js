require("dotenv").config()
const express = require("express");
const session = require("express-session")
const MySQLStore = require("express-mysql-session")(session);
const mysql = require("mysql2")
const passport = require("passport")
const handlebars = require("express-handlebars")
const flash = require("connect-flash");
const PORT = 8080
const app = express()
const fs = require("fs");
const multer = require("multer")
const bcrypt = require('bcrypt');
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, armazenamento) => {
      armazenamento(null, "./public/uploads")
    },
    filename: (req, file, armazenamento) => {
      armazenamento(null, file.originalname)
    },

  }), fileFilter: (req, file, armazenamento) => {
    if (file.mimetype == "image/png") {
      armazenamento(null, true)
    } else {
      armazenamento(null, false)
    }
  }
})


const CadUser = require("./models/CadUser")
const CadEmpr = require("./models/CadEmpr")
const CadPlan = require("./models/CadPlan");


app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//conexão com banco
const db = mysql.createConnection(process.env.DATABASE_URL);


db.connect((err) => {
  if (err) {
    console.error('Erro ao se conectar com o banco de dados', err);
  } else {
    console.log('Conexão com o banco estabelecida');
  }
});
const sessionStore = new MySQLStore(
  {
    expiration: null,
    createDatabaseTable: true,
  },
  db
);
//congig session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: null,
    httpOnly: true,
    //secure: true
  },
  store: sessionStore
}))

// config do passport e handlebars
require("./localStrategy")(passport)
require("./passport-setup")
app.use(express.static('public'))

app.engine("handlebars", handlebars.engine({ defaultLayout: "main" }))
app.set("view engine", "handlebars")

app.use(passport.initialize())
app.use(passport.session())
//config rotas get
app.get("/", (req, res) => {
  const currentURL = req.originalUrl;
  const isHome = currentURL === '/';
  res.render("pages/home", { isHome })
})

app.get("/sobre", (req, res) => {
  const currentURL = req.originalUrl;
  const isHome = currentURL === '/sobre';
  res.render("pages/sobre", { isHome })
})

app.get("/servicos", (req, res) => {
  const currentURL = req.originalUrl;
  const isHome = currentURL === '/servicos';
  res.render("pages/servicos", { isHome })
})

app.get("/plano", (req, res) => {
  const currentURL = req.originalUrl;
  const isHome = currentURL === '/plano';
  res.render("pages/plano", { isHome })
})

app.get("/cadastroUsuario", (req, res) => {
  const currentURL = req.originalUrl;
  const isHome = currentURL === '/cadastroUsuario';
  res.render("pages/usuarioCad", { isHome })
})

app.get("/cadastroEmpresa", (req, res) => {//ajeitar css
  const currentURL = req.originalUrl;
  const isHome = currentURL === '/cadastroEmpresa';
  res.render("pages/empresaCad", { isHome })
})

app.get("/usuario_login", (req, res) => {
  const currentURL = req.originalUrl;
  const isHome = currentURL === '/usuario_login';
  res.render("pages/usuario_login", { isHome })

})
app.get("/empresa_login", (req, res) => {
  const currentURL = req.originalUrl;
  const isHome = currentURL === '/empresa_login';
  res.render("pages/empresa_login", { isHome })

})

app.get("/usuariohome", async (req, res) => {// ajeitar css
  const currentURL = req.originalUrl;
  const isHomeApp = currentURL === '/usuariohome';
    let empresas = await CadEmpr.findAll({})
    empresas = empresas.map(empresa => empresa.get({ plain: true }))
    console.log(empresas)
    res.render("pages/usuariohome", { empresas: empresas, isHomeApp})
})

app.get("/empresahome", async (req, res) => { //ajeitar css e handlebars
    const currentURL = req.originalUrl;
    const isHomeEmpr = currentURL === '/estoque';
    let empresas = await CadEmpr.findAll({})
    empresas = empresas.map(empresa => empresa.get({ plain: true }))
    res.render("pages/empresahome", { empresas: empresas, isHomeEmpr })
})

app.get("/loja", async (req,res) => { //ajeitar func handlebars e css
  const currentURL = req.originalUrl;
  const isHomeEmpr = currentURL === '/loja';
    res.render("pages/loja", { isHomeEmpr });
})

app.get("/estoque", async (req,res) => { //ajeitar func handlebars e css
  const currentURL = req.originalUrl;
  const isHomeEmpr = currentURL === '/estoque';
    res.render("pages/estoque", { isHomeEmpr });
})
app.get("/empresaDetails", async (req,res) => { //ajeitar func handlebars
  const currentURL = req.originalUrl;
  const isHomeEmpr = currentURL === '/empresaDetails';
    res.render("pages/empresahome", { isHomeEmpr });
})

app.get("/qrcode", (req,res) =>{// ajeitar config do qrcode
  res.render("pages/qrcode", )
})
// criação das rotas post

app.post("/loginEmprAfterCad", async (req, res) => {
  try {
    let name = req.body.firstname
    let Cnpj = req.body.Cnpj
    let razaoSocial = req.body.Razao
    let numero = req.body.number
    let whatsapp_number = req.body.number_whatsapp
    let cep = req.body.endereco
    let Bairro = req.body.bairro
    let cidade = req.body.Cidade
    let Email = req.body.email
    let Site = req.body.Site
    let date = req.body.data
    let password = req.body.password

    const cryptPassword = await bcrypt.hash(password, 10)
    await CadEmpr.create({ nome_empr: name, CNPJ: Cnpj, RazaoSocial: razaoSocial, telefone: numero, whatsapp: whatsapp_number, CEP: cep, bairro: Bairro, cidade: cidade, email: Email, site: Site, data_de_inauguramento: date, senha: cryptPassword.toString() });


    res.redirect("/empresa_login")
  } catch (error) {
    console.log(error)
  }

})

app.post("/loginUserAfterCad", async (req, res) => {
  try {
    let firstname = req.body.firstname
    let email = req.body.email
    let number = req.body.number
    let data = req.body.data
    let CPF = req.body.CPF
    let Placa = req.body.Placa
    let resposta = req.body.resposta
    let password = req.body.password
    let gender = req.body.gender

    const cryptPassword = await bcrypt.hash(password, 10);
    console.log(cryptPassword)
    await CadUser.create({ nome: firstname, email: email, numero: number, data: data, cpf: CPF, placa: Placa, modelo: resposta, senha: cryptPassword.toString(), genero: gender });
    res.redirect("/usuario_login")
  } catch (error) {
    console.log(error)

  }

})
//authenticate local
app.post("/loginsuccessuser", async (req, res, next) => {
  try {
    passport.authenticate("local", {      
      successRedirect: "/usuariohome",
      failureRedirect: "/usuario_login",
      failureFlash: true
      
    })(req, res, next)
  } catch {
    console.log("erro ao se conectar")
  }
})

app.post("/loginsuccessempr", (req, res, next,err) => {
  try {
    passport.authenticate("local", {
      successRedirect: "/empresahome",
      failureRedirect: "/empresa_login",
      failureFlash: true
    })(req, res, next)
    if(err){
      req.flash("error_msg", "Erro ao se conectar, Tente novamente!!")
    } else {
      req.flash("success_msg", "Usuario Autenticado com sucesso!!")
    }
  } catch {
    console.log("erro ao se conectar")
  }
})
 
app.post("/envioImage", upload.single('imagem'), async (req, res) => {

  if (req.session.empr && req.session.empr.CNPJ && req.file) {
    const { filename } = req.file;
    const cnpj = req.session.empr.CNPJ;

    const imagePath = `./public/uploads/${filename}`;
    const imageBuffer = fs.readFileSync(imagePath);

    CadEmpr.update(
      { imagem: imageBuffer },
      { where: { CNPJ: cnpj } }
    )
      .then(() => {
        fs.unlinkSync(imagePath);
        console.log("Imagem enviada com sucesso")
        res.status(200).send("Imagem enviada com sucesso.");
      })
      .catch((error) => {
        console.error("Erro ao atualizar o registro no banco de dados:", error);
        res.status(500).send("Erro ao enviar a imagem.");
      });
  } else {
    res.status(400).send("Nenhuma imagem enviada ou empresa não está logada.");
  }

});

app.post("/agendamento", async (req, res) => {
  const cnpjValue = req.body.cnpj;

  let empresa = await CadEmpr.findOne({ where: { CNPJ: cnpjValue } });
  empresa = empresa.get({ plain: true })
  if (!empresa) {
    res.status(404).send("Empresa não encontrada");
  } else {
    console.log("info empresa:", empresa)
    res.render("pages/agendamento", { empresa: empresa});
  }
});



app.post("/realizarPagamento", async (req, res) => {
  let id_compra = req.body.id_compra
  let nomeEmpresa = req.body.nome
  let numCartao = req.body.numeroCartao
  let numCvv = req.body.cvv
  let dataVal = req.body.validade
  let formaPayements = req.body.formaPagamento
  let values = req.body.valor

  await CadPlan.create({ id: id_compra, nomeEmpr: nomeEmpresa, numeroCart: numCartao, numcvv: numCvv, dateVal: dataVal, formaPagamento: formaPayements, valor, values })
})



app.post("/pagamento", async (req, res) => {
  res.render("pages/pagamentoPlano")
})


app.post("/loginEmpr", (req, res) => {
  const currentURL = req.originalUrl;
  const isHome = currentURL === '/loginEmpr';
  res.render("pages/empresa_login", { isHome })
})


app.post("/loginUserhome", async (req, res) => {
  const currentURL = req.originalUrl;
  const isHome = currentURL === '/loginUserhome';
  res.render("pages/usuario_login", { isHome })

})


//cofig google authenticate

app.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }))
app.get("/google/return", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => {
  res.redirect("/usuariohome")

})

// rota escutada
app.listen(PORT, () => {
  console.log("Aplicação rodando na porta http://localhost:8080")
})