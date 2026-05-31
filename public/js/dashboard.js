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

                    // Vetores usados para separar dados; Vão receber os dados reais do banco
                    var labelsGerais = []; // guarda os meses lidos
                    var dadosGerais = []; // guarda a quantidade de livros lidos

                    // vetor com nome dos meses de Janeiro até dezembro
                    var nomeMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                        'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

                    // Preenchendo os vetores com o resultado SELECT
                    for (var i = 0; i < dadosDoBanco.length; i++) {
                        var registro = dadosDoBanco[i]; // objeto json indexado de i
                        
                        // - 1 é usado para chegar ao índice 0 do vetor labelsGerais
                        labelsGerais.push(nomeMeses[registro.mes - 1]);

                        // insere a quantidade no vetor dadosGerais
                        dadosGerais.push(registro.quantidade);
                    }

                    // Renderiza o gráfico 
                    const ctxLinha = document.getElementById('Lidospormes').getContext('2d');
                    // econtra elemento canvas com id 'Lidospormes'

                    new Chart(ctxLinha, {
                        type: 'line', // gráfico de linha
                        data: {
                            labels: labelsGerais, // meses
                            datasets: [{ // tipos de dados
                                label: 'Livros Concluídos', // legenda
                                data: dadosGerais, // apresenta os valores
                                borderColor: '#A396E9', 
                                backgroundColor: 'rgba(110, 0, 179, 0.1)',
                                borderWidth: 3, // espessura das bordas
                                tension: 0.3, // curvatura das linhas
                                fill: true // gráfico de "área"
                            }]
                        },
                        options: {
                            responsive: true,
                            // se redimensiona se a tela mudar de tamanho

                            maintainAspectRatio: false, 
                            // usa toda a altura disponivel do container
                            scales: { // escalas
                                y: { 
                                    beginAtZero: true, // começa com 0
                                    ticks: {
                                        stepSize: 1, // eixo Y pulando de 1 em 1
                                        precision: 0 // apenas números inteiros
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

    // confirma se o usuário tem id
    if (!idUsuario) {
        console.error("ID do usuário não foi encontrado no sessionStorage!");
        return;
    }

    fetch(`/usuarios/generos/${idUsuario}`)
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (dadosDoBanco) {
                    console.log("Dados que vieram do Banco:", dadosDoBanco);

                    var total = 0;
                    // lê dadosDoBanco, pois veio preenchido do banco
                    // for para ver quantas ocorrencias tem no json
                    for(var i = 0; i < dadosDoBanco.length;i ++){
                        total += dadosDoBanco[i].quantidade // lê do banco
                    }
                    
                    // Vetores  que vão receber os dados reais do banco
                    var labelsGerais = []; // guardas os nomes dos gêneros
                    var dadosGerais = []; // guarda a porcentagem de livros concluídos
                    

                    // Preenchendo os vetores com o resultado SELECT
                    for (var i = 0; i < dadosDoBanco.length; i++) { // lê as ocorrências
                        var registro = dadosDoBanco[i]; // objeto json indexado de i
                        labelsGerais.push(registro.genero); // insere a ocorrência em labelsGerais

                        // Calcula a porcentagem em vez da quantidade
                        var porcentagem = (registro.quantidade / total * 100).toFixed(1);
                        dadosGerais.push(porcentagem); // insere a ocorrência em dadosGerais
                    }

                    // Renderiza o gráfico 
                    const ctxPizza = document.getElementById('generoslidos').getContext('2d');
                    // encontra o elemento canvas com id "generoslidos"
                    new Chart(ctxPizza, { // novo gráfico
                        type: 'pie', // tipo pizza
                        data: {
                            labels: labelsGerais, // gêneros
                            datasets: [{ // tipos de dados
                                data: dadosGerais, // valores em porcentagem
                                backgroundColor: [
                                    '#6E00B3',
                                    '#9f4dcb',
                                    '#ecbaec',
                                    '#d685d6',
                                ], /* quatro cores de fundo devido ao 'LIMIT 4' no Model*/
                                borderWidth: 1 // espessura da borda entre as fatias
                            }]
                        },
                        options: {
                            responsive: true, // se redimensiona se a janela muda de tamanho
                            maintainAspectRatio: false, // usa toda a altura disponivel do container
                            plugins: {
                                tooltip: {
                                    callbacks: {
                                        label: function(context){
                                            // nome do gênero         valor inserido
                                            return context.label + ':' + context.raw + '%'
                                        }
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

function preencherKpis() {
    var idUsuario = sessionStorage.ID_USUARIO;

    // confirma se o usuário tem id
    if (!idUsuario) {
        console.error("ID do usuário não foi encontrado no sessionStorage!");
        return;
    }

    fetch(`/usuarios/kpis/${idUsuario}`)
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (dadosDoBanco) {
                    console.log("KPIs:", dadosDoBanco);

                    var kpis = dadosDoBanco[0]; // Posição 0 do json dadosDoBanco 
                    console.log("lidos_mes:", kpis.lidos_mes);

                    // preenche kpi, através do id no html com dados reais do banco
                    document.getElementById('kpi_livrosLidos').textContent = kpis.livros_lidos;
                    document.getElementById('kpi_livrosLendo').textContent = kpis.livros_lendo;
                    document.getElementById('kpi_paginasLidas').textContent = Number(kpis.total_paginas_lidas).toLocaleString('pt-BR');
                    document.getElementById('kpi_favoritos').textContent = kpis.livros_favoritos;
                    document.getElementById('kpi_LidosMes').textContent = kpis.lidos_mes;
                }
                )
            }
        }
        )


}

// Executa as funções dinâmicas assim que a página carregar
window.onload = function () {
    plotarGraficoPizza();
    plotarGraficoLinha();
    preencherKpis();
};

