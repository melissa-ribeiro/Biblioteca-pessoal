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



module.exports = router;