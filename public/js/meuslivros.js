function listarLivros() {
    var idUsuario = sessionStorage.ID_USUARIO;

    fetch(`/usuarios/listarLivros/${idUsuario}`)
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (livros) {
                    console.log("Livros:", livros);

                    var tabela = document.getElementById('conteudo-tabela');  // id do tbody
                    tabela.innerHTML = ''; // Pega o tbody pelo id e limpa o conteúdo fixo que está no HTML

                    for (let i = 0; i < livros.length; i++) { // percorre cada livro que veio do banco
                        var livro = livros[i]; // posição do livro

                        // converte estrelas em símbolos
                        var estrelas = ''; // primeiro deixa a variável vazia
                        if (livro.estrelas) { // se livro tiver avaliação
                            for (let e = 0; e < livro.estrelas; e++) { // let e é a mesma coisa que let i; percorre as estrelas
                                estrelas += '★'; // vai adiciondo estrela até a quantidade da avaliação
                            }
                        } else {
                            estrelas = '-'; // estrela fica  nulo se não tiver avaliação
                        }

                        // formata a data para formato br
                        var data = livro.dt_conclusao
                            ? new Date(livro.dt_conclusao).toLocaleDateString('pt-BR') : '-'; // se não tem data mostra -
                        // codição  ? se verdadeiro : se falso (operadores ternários)

                        // favorito
                        var favorito = livro.favorito == 1 ? '★' : '☆'; // é valores boleanos, se for 1 estrela cheia

                        // cria a linha
                        var linha = `
                            <tr>
                                <td>${favorito}</td>
                                <td>${livro.titulo}</td>
                                <td>${livro.autor}</td>
                                <td>${livro.genero}</td>
                                <td>${livro.pages}</td>
                                <td>${livro.stts}</td>
                                <td>${estrelas}</td>
                                <td>${data}</td>
                               <td class="col-acoes">
                                
                                <button id="btnedit" onclick="window.location.href='./editarLivros.html?id=${livro.id_livro}'">Editar</button>
                             
                                
                                </td>
                            </tr>
                        `; // as variáveis dentro do ${} são trocadas pelos valores reais.
                        tabela.innerHTML += linha; // cada livro é adicionado depois do anterior
                    }
                });
            }
        });
}

window.onload = function () {
    listarLivros();
}; // Chama a função assim que a página terminar de carregar