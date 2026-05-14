var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {

    var email = req.body.emailServer;
    var senha = req.body.senhaServer;


    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");

    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");

    } 
    else {

        usuarioModel.autenticar(email, senha)

            .then(function (resultadoAutenticar) {

                console.log(resultadoAutenticar);

                if (resultadoAutenticar.length == 1) {

                    res.json({
                        id_usuario: resultadoAutenticar[0].id_usuario,
                        nome: resultadoAutenticar[0].nome,
                        email: resultadoAutenticar[0].email,
                        primeiro_acesso: resultadoAutenticar[0].primeiro_acesso,
                        nickname: resultadoAutenticar[0].nickname,
                        pronome: resultadoAutenticar[0].pronome,
                        avatar: resultadoAutenticar[0].avatar
                    });

                } else if (resultadoAutenticar.length == 0) {

                    res.status(403).send("Email e/ou senha inválido(s)");

                } else {

                    res.status(403).send("Mais de um usuário com o mesmo login!");

                }

            }).catch(function (erro) {

                console.log(erro);
                console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);

                res.status(500).json(erro.sqlMessage);

            });
    }
}

function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var meta = req.body.metaServer;

    // Faça as validações dos valores
    if (nome == undefined) {

        res.status(400).send("Seu nome está undefined!");

    } else if (email == undefined) {

        res.status(400).send("Seu email está undefined!");

    } else if (senha == undefined) {

        res.status(400).send("Sua senha está undefined!");

    } else if (meta == undefined) {

        res.status(400).send("Sua meta está undefined!");

    } else {


        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        usuarioModel.cadastrar(nome, email, senha, meta)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function onboarding(req, res) {
    // variaveis para recuperar os valores do arquivo boasVindas.html
    var nickname = req.body.nicknameServer;
    var pronome = req.body.pronomeServer;
    var avatar = req.body.avatarServer;
    var idUsuario = req.body.idUsuarioServer;

    if (nickname == undefined) {
        res.status(400).send("Seu apelido está undefined!");
    } else if (pronome == undefined) {
        res.status(400).send("Seus pronomes estão undefined!");
    } else if (avatar == undefined) {
        res.status(400).send("Seu avatar está undefined!");
    } else if (idUsuario == undefined) {
        res.status(400).send("Seu ID está undefined!");
    } else {

        usuarioModel.onboarding(nickname, pronome, avatar, idUsuario)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

module.exports = {
    autenticar,
    cadastrar,
    onboarding
}