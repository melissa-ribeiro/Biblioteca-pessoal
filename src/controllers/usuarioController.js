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

    console.log("SENHA RECEBIDA NO CONTROLLER:", senha);
    // Faça as validações dos valores
    if (nome == undefined) {

        res.status(400).send("Seu nome está undefined!");

    } else if (email == undefined) {

        res.status(400).send("Seu email está undefined!");

    } else if (senha == undefined) {

        res.status(400).send("Sua senha está undefined!");

    } else {


        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        usuarioModel.cadastrar(nome, email, senha)
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


function buscarGenerosMaisLidos(req, res) {
    var idUsuario = req.params.idUsuario;

    usuarioModel.buscarGenerosMaisLidos(idUsuario)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum resultado encontrado!");
            }
        }).catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarLivrosLidosMes(req, res) {
    var idUsuario = req.params.idUsuario;

    usuarioModel.buscarLivrosLidosMes(idUsuario)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum resultado encontrado!");
            }
        }).catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}


function buscarKpis(req, res) {
    var idUsuario = req.params.idUsuario;

    usuarioModel.buscarKpis(idUsuario)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum resultado encontrado!");
            }
        }).catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

// CADASTRO DE LIVROS
function salvarLivro(req, res) {

    var titulo = req.body.tituloServer;
    var autor = req.body.autorServer;
    var pages = req.body.pagesServer;
    var genero = req.body.generoServer;
    var stts = req.body.sttsServer;
    var idUsuario = req.params.idUsuario;

    // Campos opcionais — só existem se status for 'concluido'
    var dt_conclusao = req.body.dt_conclusaoServer || null;
    var favorito = req.body.favoritoServer || false;
    var avaliacao = req.body.avaliacaoServer || null;

    //validações dos valores
    if (titulo == undefined) {
        res.status(400).send("O titulo está undefined!");

    } else if (autor == undefined) {
        res.status(400).send("O autor está undefined!");

    } else if (pages == undefined) {
        res.status(400).send("As páginas estão undefined!");

    } else if (genero == undefined) {
        res.status(400).send("O gênero está undefined!");

    } else if (stts == undefined) {
        res.status(400).send("O status está undefined!");
    } else {

        usuarioModel.salvarLivro(titulo, autor, genero, pages, stts, dt_conclusao, idUsuario)
            .then(
                function (resultado) {
                    var idLivro = resultado.insertId; // id gerado pelo INSERT
                    if (favorito) {
                        // se stts = concluído; inserir em favorito
                        return usuarioModel.salvarFavorito(idUsuario, idLivro)
                            .then(function () {
                                return idLivro; // passa o id para o próximo .then
                            })
                    }
                    return idLivro;
                }
            ).then(function (idLivro) {
                //Se avaliou, INSERT em avaliacao

                if (avaliacao) {
                    return usuarioModel.salvarAvaliacao(idUsuario, idLivro, avaliacao);
                }
            })
            .then(function () {
                res.status(200).json({ mensagem: "Livro salvo com sucesso!" });
            })
            .catch(
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

function buscarLivro(req, res) {
    var idUsuario = req.params.idUsuario;

    usuarioModel.buscarLivro(idUsuario)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum resultado encontrado!");
            }
        }).catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}


// ALTERAR LIVRO
function buscarLivroParaEditar(req, res) {
    var idLivro = req.params.idLivro;

    usuarioModel.buscarLivroParaEditar(idLivro)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum resultado encontrado!");
            }
        }).catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function editarLivro(req, res) {
    console.log("Dados recebidos:", req.body, "idLivro:", req.params.idLivro); // apenas para identificar possiveis erros no terminal

    var titulo = req.body.tituloServer;
    var autor = req.body.autorServer;
    var pages = req.body.pagesServer;
    var genero = req.body.generoServer;
    var stts = req.body.sttsServer; // dados que vieram do body do fetch

    var idLivro = req.params.idLivro; // pega que vem da URL
    var idUsuario = req.body.idUsuarioServer; // idUsuario vem do body, porque a URL só tem o idLivro

    // Campos opcionais
    var dt_conclusao = req.body.dt_conclusaoServer || null;
    var favorito = req.body.favoritoServer || false;
    var avaliacao = req.body.avaliacaoServer || null;

    //validações dos valores
    if (titulo == undefined) {
        res.status(400).send("O titulo está undefined!");

    } else if (autor == undefined) {
        res.status(400).send("O autor está undefined!");

    } else if (pages == undefined) {
        res.status(400).send("As páginas estão undefined!");

    } else if (genero == undefined) {
        res.status(400).send("O gênero está undefined!");

    } else if (stts == undefined) {
        res.status(400).send("O status está undefined!");
    } else {


        usuarioModel.editarLivro(titulo, autor, genero, pages, stts, dt_conclusao, idLivro) // idLivro que vai para o model; parametros precisam estar na mesma ordem

            .then(
                function (resultado) {

                    if (favorito) {
                        // favorito marcado, então INSERT IGNORE (serve para ignorar silenciosamente se o registro já existir )
                        return usuarioModel.salvarFavorito(idUsuario, idLivro)
                            .then(function () { return idLivro; });
                    } else {
                        // favorito desmarcado, então DELETE
                        return usuarioModel.removerFavorito(idUsuario, idLivro)
                            .then(function () { return idLivro; });
                    }

                }
            ).then(function (idLivro) {
                //Se avaliou, INSERT em avaliacao

                if (avaliacao) {
                    return usuarioModel.salvarAvaliacao(idUsuario, idLivro, avaliacao);
                     // se avaliou, faz insert ON DUPLICATE KEY UPDATE  ()
                }
            })
            .then(function () {
                res.status(200).json({ mensagem: "Livro salvo com sucesso!" }); // Se tudo deu certo, mostra alert sucesso
            })
            .catch(
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



function buscarPerfilLeitor(req, res) { // chama a primeira função do model (quantos livros o usuário concluiu.))
    var idUsuario = req.params.idUsuario; // pega o id do usuário da URL

    usuarioModel.buscarTotalLivros(idUsuario)
        .then(function(resultado) {
            // O banco retorna um array. Pego o valor 'total' do primeiro objeto
            var total = resultado[0].total; 

            var frase = '';
            // determinando a frase de acordo com a qntd de livros lidos
            if (total >= 0 && total <= 2) {
                frase = 'Leitor Iniciante';
            } else if (total >= 3 && total <= 9) {
                frase = 'Leitor Regular';
            } else if (total >= 10 && total <= 19) {
                frase = 'Leitor Voraz';
            } else {
                frase = 'Devorador de Livros';
            }

            return usuarioModel.salvarPerfilLeitor(idUsuario, frase); // chama a segunda função do model (salva a frase)
            // return necessário para passar o resultado dessa operação para o próximo .then DEPOIS que o banco terminar de salvar a informação.
        })
        .then(function() {
            return usuarioModel.buscarPerfilLeitor(idUsuario);  
            //chama a terceira função para buscar a frase atualizada 
        })
        .then(function(perfil) {
            res.status(200).json(perfil); 
            
        })
        .catch(function(erro) {
            // Se QUALQUER erro acontecer em qualquer um dos passos acima, ele cai aqui
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

// BUSCAR GÊNEROS FAVORITOS
function buscarGenerosFavoritos(req, res) {
    var idUsuario = req.params.idUsuario;

    usuarioModel.buscarGenerosFavoritos(idUsuario)
        .then(function(resultado) {
            // Aqui o banco vai devolver: [{genero: 'Fantasia'}, {genero: 'Romance'}]
            res.status(200).json(resultado);
        })
        .catch(function(erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    autenticar,
    cadastrar,
    onboarding,
    buscarGenerosMaisLidos,
    buscarLivrosLidosMes,
    buscarKpis,
    salvarLivro,
    buscarLivro,
    buscarLivroParaEditar,
    editarLivro,
    buscarPerfilLeitor,
    buscarGenerosFavoritos
}