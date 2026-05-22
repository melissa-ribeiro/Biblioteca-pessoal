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


//RECEBENDO LIVROS CADASTRADOS
router.post("/cadastrarLivros/:idUsuario", function(req,res){
    usuarioController.salvarLivro(req,res)
})

// BUSCANDO LIVROS CADATSRADOS 
router.get("/listarLivros/:idUsuario", function(req,res){
    usuarioController.buscarLivro(req,res)
})

// BUSCAR LIVROS PARA EDITAR
router.get("/buscarLivros/:idLivro", function(req,res){
    usuarioController.buscarLivroParaEditar(req,res)
})

// EDITAR LIVROS
router.put("/AlterarLivros/:idLivro", function(req,res){ // put - alterar algo já existente
    console.log("Rota AlterarLivros acionada! idLivro:", req.params.idLivro);
    usuarioController.editarLivro(req,res)
})

// ROUTE MEU PERFIL
router.get("/fraseLeitor/:idUsuario",function(req,res) {
    console.log("Rota fraseLeitor acionada! idUsuario:", req.params.idUsuario);
    usuarioController.buscarPerfilLeitor(req,res)
})

router.get("/generosFavoritos/:idUsuario", function(req, res) {
    usuarioController.buscarGenerosFavoritos(req, res);
});
module.exports = router;