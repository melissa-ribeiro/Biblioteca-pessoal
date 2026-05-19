var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
})

// LOGIN 
router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});


// ONBOARDING
router.post("/onboarding", function (req, res) {
    usuarioController.onboarding(req, res);
});

// BUSCAR GENEROS LIDOS DO USUÁRIO
router.get("/generos/:idUsuario", function (req, res) {
    usuarioController.buscarGenerosMaisLidos(req, res);
})

// BUSCAR LIVROS LIDOS POR MES DO USUÁRIO
router.get("/lidosMes/:idUsuario", function(req,res) {
    usuarioController.buscarLivrosLidosMes(req,res)
})

//BUSCAR KPIs
router.get("/kpis/:idUsuario", function(req,res) {
    usuarioController.buscarKpis(req,res)
})  

module.exports = router;