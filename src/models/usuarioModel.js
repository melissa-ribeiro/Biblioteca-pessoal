var database = require("../database/config")

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucaoSql = `
    SELECT 
        id_usuario, 
        nome, 
        email, 
        primeiro_acesso,
        nickname,
        pronome,
        avatar
    FROM usuario 
    WHERE email = '${email}' 
    AND senha = sha2('${senha}', 256);
`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
function cadastrar(nome, email, senha) {
    console.log("SENHA RECEBIDA NO MODEL:", senha);
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, senha);

    var instrucaoSql = `
        INSERT INTO usuario (nome,email, senha) VALUES ('${nome}','${email}',  sha2('${senha}', 256));
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function onboarding(nickname, pronome, avatar, idUsuario) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nickname, pronome, avatar);
    // PRIMEIRO O UPDATE
    var instrucaoUpdate = `
    UPDATE usuario 
    SET avatar = '${avatar}',
        nickname = '${nickname}',
        pronome = '${pronome}',
        primeiro_acesso = 0
    WHERE id_usuario = ${idUsuario};
`;
    console.log("Executando a instrução SQL: \n" + instrucaoUpdate);

    return database.executar(instrucaoUpdate).then(() => {
        // SELECT PARA RETORNAR DADOS ATUALIZADOS
        var instrucaoSelect = `
    SELECT nickname,
    pronome,
    avatar
    FROM usuario 
    WHERE id_usuario = ${idUsuario}
    `;
        console.log("Executando a instrução SQL: \n" + instrucaoSelect);
        return database.executar(instrucaoSelect);
    });


}

//GRÁFICOS
function buscarGenerosMaisLidos(idUsuario) {
    var instrucaoSql = `
    SELECT genero, COUNT(*) AS quantidade
    FROM livros
    JOIN usuario 
    ON id_usuario = usuario_id
    WHERE usuario_id = ${idUsuario}
    GROUP BY genero;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}
function buscarLivrosLidosMes(idUsuario) {
    var instrucaoSql = `
    SELECT MONTH(data_conclusao) AS mes, COUNT(*) AS quantidade
    FROM livros
    WHERE usuario_id = ${idUsuario}
    AND status_leitura = 'concluido'
    GROUP BY MONTH(data_conclusao)
    ORDER BY mes;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}
//KPIs
function buscarKpis(idUsuario) {
    var instrucaoSql = `
        SELECT * FROM vw_kpis
        WHERE usuario_id = ${idUsuario};
        `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// MEUS LIVROS
// CADASTRAR LIVROS (SEM FAVORITOS || SEM AVALIACAO)
function salvarLivro(titulo, autor, genero, pages, stts, dt_conclusao, idUsuario) {

    
    if (dt_conclusao != '') {
         var insertSql = `
        INSERT INTO livros (nome, autor, genero, paginas, status_leitura, data_conclusao, usuario_id)
        VALUES ('${titulo}','${autor}','${genero}','${pages}','${stts}', ${dt_conclusao ? `'${dt_conclusao}'` : 'NULL'} ,'${idUsuario}')
    `;
        console.log("Executando a instrução SQL: \n" + insertSql);
        return database.executar(insertSql);
    } else {
        var insertSql = `
        INSERT INTO livros (nome, autor, genero, paginas, status_leitura, usuario_id)
        VALUES ('${titulo}','${autor}','${genero}','${pages}','${stts}','${idUsuario}')
    `;
        console.log("Executando a instrução SQL: \n" + insertSql);
        return database.executar(insertSql);
    }
}

// INSERIR FAVORITO,SE LIVRO JÁ CONCLUÍDO
function salvarFavorito(idUsuario, idLivro) {
    var instrucaoSql = `
        INSERT INTO favoritos (usuario_id, livro_id)
        VALUES (${idUsuario}, ${idLivro});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}
// INSERIR AVALIAÇÃO SE LIVRO JÁ CONCLUÍDO
function salvarAvaliacao(idUsuario, idLivro, avaliacao) {
    var instrucaoSql = `
        INSERT INTO avaliacao (usuario_id, livro_id, estrelas)
        VALUES (${idUsuario}, ${idLivro}, ${avaliacao});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}
// BUSCA LIVROS CADASTRADOS (COM LEFT, POIS SE NÃO HOUVER FAV, DT_CONCL OU AVALIACAO, FICA NULL OU FALSE)
function buscarLivro(idUsuario) {
    var instrucaoSql = `SELECT l.id_livro,
	l.nome AS titulo,
    l.autor AS autor,
    l.genero AS genero,
    l.paginas AS pages,
    l.status_leitura AS stts,
    l.data_conclusao AS dt_conclusao,
    a.estrelas,
     CASE WHEN f.livro_id IS NOT NULL THEN 1 ELSE 0 END AS favorito
    FROM livros AS l
    LEFT JOIN avaliacao AS a
    ON a.livro_id = l.id_livro
    LEFT JOIN favoritos AS f 
    on f.livro_id = l.id_livro
    WHERE l.usuario_id = ${idUsuario};`

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrar,
    onboarding,
    buscarGenerosMaisLidos,
    buscarLivrosLidosMes,
    buscarKpis,
    salvarLivro,
    salvarFavorito,
    salvarAvaliacao,
    buscarLivro
};