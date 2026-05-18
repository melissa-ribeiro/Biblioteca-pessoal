// GRÁFICO DE LINHA (Dinâmico - Puxando do Banco de Dados) 
function plotarGraficoLinha() {
    var idUsuario = sessionStorage.ID_USUARIO;
    if (!idUsuario) {
        console.error("ID do usuário não foi encontrado no sessionStorage!");
        return;
    }

    fetch(`/usuarios/lidosMes/${idUsuario}`)
        .then(function (resposta) {
             console.log("Status da resposta:", resposta.status);
            if (resposta.ok) {
                resposta.json().then(function (dadosDoBanco) {
                    console.log("Dados que vieram do Banco:", dadosDoBanco);

                    // Vetores  que vão receber os dados reais do banco
                    var labelsGerais = [];
                    var dadosGerais = [];
                    var nomeMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                        'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
                    // Preenchendo os vetores com o resultado SELECT
                    for (var i = 0; i < dadosDoBanco.length; i++) {
                        var registro = dadosDoBanco[i];
                        labelsGerais.push(nomeMeses[registro.mes - 1]);
                        dadosGerais.push(registro.quantidade);
                    }

                    // Renderiza o gráfico 
                    const ctxLinha = document.getElementById('Lidospormes').getContext('2d');
                    new Chart(ctxLinha, {
                        type: 'line',
                        data: {
                            labels: labelsGerais,
                            datasets: [{
                                label: 'Livros Concluídos',
                                data: dadosGerais,
                                borderColor: '#A396E9',
                                backgroundColor: 'rgba(110, 0, 179, 0.1)',
                                borderWidth: 3,
                                tension: 0.3,
                                fill: true
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        stepSize: 1,
                                        precision: 0 
                                    }
                                }
                            }
                        }
                    });
                });
            } else {
                console.error("Houve um erro na requisição da rota de gêneros.");
            }
        }).catch(function (erro) {
            console.error("Erro de conexão com a API:", erro);
        });

}


//  GRÁFICO DE PIZZA (Dinâmico - Puxando do Banco de Dados) 
function plotarGraficoPizza() {
    var idUsuario = sessionStorage.ID_USUARIO;


    if (!idUsuario) {
        console.error("ID do usuário não foi encontrado no sessionStorage!");
        return;
    }

    fetch(`/usuarios/generos/${idUsuario}`)
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (dadosDoBanco) {
                    console.log("Dados que vieram do Banco:", dadosDoBanco);

                    // Vetores  que vão receber os dados reais do banco
                    var labelsGerais = [];
                    var dadosGerais = [];

                    // Preenchendo os vetores com o resultado SELECT
                    for (var i = 0; i < dadosDoBanco.length; i++) {
                        var registro = dadosDoBanco[i];
                        labelsGerais.push(registro.genero);
                        dadosGerais.push(registro.quantidade);
                    }

                    // Renderiza o gráfico 
                    const ctxPizza = document.getElementById('generoslidos').getContext('2d');
                    new Chart(ctxPizza, {
                        type: 'pie',
                        data: {
                            labels: labelsGerais,
                            datasets: [{
                                data: dadosGerais,
                                backgroundColor: [
                                    '#6E00B3',
                                    '#9f4dcb',
                                    '#7523cc',
                                    '#861897',
                                    '#ecbaec',
                                    '#d685d6',
                                ],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false
                        }
                    });
                });
            } else {
                console.error("Houve um erro na requisição da rota de gêneros.");
            }
        }).catch(function (erro) {
            console.error("Erro de conexão com a API:", erro);
        });
}

// Executa as funções dinâmicas assim que a página carregar
window.onload = function () {
    plotarGraficoPizza();
    plotarGraficoLinha();
};