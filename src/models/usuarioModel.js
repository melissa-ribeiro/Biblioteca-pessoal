var database = require("../database/config")

// FUNÇÃO LOGIN
function autenticar(email, senha) { // recebe email e senha como parâmetros
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
// FUNÇÃO CADASTRO
function cadastrar(nome, email, senha) {
    console.log("SENHA RECEBIDA NO MODEL:", senha);
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, senha);

    var instrucaoSql = `
        INSERT INTO usuario (nome,email, senha) VALUES
        ('${nome}','${email}',  sha2('${senha}', 256));
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// FUNÇÃO ONBOARDING
function onboarding(nickname, pronome, avatar, idUsuario) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nickname, pronome, avatar);

    // PRIMEIRO O UPDATE
    var instrucaoUpdate = `
    UPDATE usuario 
    SET avatar = '${avatar}',
        nickname = '${nickname}',
        pronome = '${pronome}',
        primeiro_acesso = 0
    WHERE id_usuario = ${idUsuario};`;
    /*primeiro_acesso = 0; marca que o onboarding foi concluído.
    Na próxima vez que o usuário logar, o sistema sabe que não 
    precisa mostrar o onboarding de novo.*/

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

// Gráfico pizza
function buscarGenerosMaisLidos(idUsuario) {
    // LEFT JOIN para garantir que, mesmo se o livro não tiver avaliação ou favorito, ainda seja considerado na contagem do gênero.
    var instrucaoSql = `
    SELECT genero, COUNT(*) AS quantidade
    FROM livros
    WHERE usuario_id = ${idUsuario}
    AND 
    status_leitura = 'concluido'
    GROUP BY genero
    ORDER BY quantidade DESC
    LIMIT 4;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}
//gráfico linha
function buscarLivrosLidosMes(idUsuario) {
    var instrucaoSql = `
    SELECT MONTH(data_conclusao) AS mes, COUNT(*) AS quantidade
    FROM livros
    WHERE usuario_id = ${idUsuario}
    AND status_leitura = 'concluido'
    AND YEAR(data_conclusao) = YEAR(CURDATE())
    GROUP BY MONTH(data_conclusao)
    ORDER BY mes;
    `; // busca quantos livros foram concluídos em cada mês do ano atual (YEAR CURDATE)
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
// CADASTRAR LIVROS (SEM FAVORITOS OU SEM AVALIACAO)
function salvarLivro(titulo, autor, genero, pages, stts, dt_conclusao, idUsuario) {

    if (dt_conclusao != '') {
        var insertSql = `
        INSERT INTO livros 
        (nome, autor, genero, paginas, status_leitura, data_conclusao, usuario_id)
        VALUES ('${titulo}','${autor}','${genero}','${pages}','${stts}',
        '${dt_conclusao}' ,'${idUsuario}')
    `;
        console.log("Executando a instrução SQL: \n" + insertSql);
        return database.executar(insertSql);
    } else {
        var insertSql = `
        INSERT INTO livros (nome, autor, genero, paginas, status_leitura, usuario_id)
        VALUES ('${titulo}','${autor}','${genero}','${pages}','${stts}','${idUsuario}')
    `; // Se a data está vazia, faz um INSERT sem a coluna data_conclusao
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
// REMOVER FAVORITO
function removerFavorito(idUsuario, idLivro) {
    var instrucaoSql = `
        DELETE FROM favoritos 
        WHERE usuario_id = ${idUsuario} 
        AND livro_id = ${idLivro};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// INSERIR AVALIAÇÃO SE LIVRO JÁ CONCLUÍDO
function salvarAvaliacao(idUsuario, idLivro, avaliacao) {
    var instrucaoSql = `
        INSERT INTO avaliacao (usuario_id, livro_id, estrelas)
        VALUES (${idUsuario}, ${idLivro}, ${avaliacao})
        ON DUPLICATE KEY UPDATE estrelas = ${avaliacao}; 
     `; // DUPLICATE KEY serve pra se já existir uma avaliação
    //  para esse usuário e livro, ATUALIZA as estrelas 
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

// Função 1 — busca UM livro para preencher o formulário
function buscarLivroParaEditar(idLivro) {
    var instrucaoSql = `
        SELECT l.id_livro, l.nome AS titulo, l.autor, l.genero,
        l.paginas AS pages, l.status_leitura AS stts,
        l.data_conclusao AS dt_conclusao, a.estrelas,
        CASE WHEN f.livro_id IS NOT NULL THEN 1 ELSE 0 END AS favorito
        FROM livros AS l
        LEFT JOIN avaliacao AS a ON a.livro_id = l.id_livro
        LEFT JOIN favoritos AS f ON f.livro_id = l.id_livro
        WHERE l.id_livro = ${idLivro};
    `;
    return database.executar(instrucaoSql);
}

// Função 2 — atualiza os dados do livro
function editarLivro(titulo, autor, genero, pages, stts, dt_conclusao, idLivro) {
    var dataConclusao = (dt_conclusao && dt_conclusao != '') ? `'${dt_conclusao}'` : 'NULL';

    var instrucaoSql = `
        UPDATE livros 
        SET nome = '${titulo}',
            autor = '${autor}',
            genero = '${genero}',
            paginas = '${pages}',
            status_leitura = '${stts}',
            data_conclusao = '${dt_conclusao}'
        WHERE id_livro = ${idLivro};
    `;
    return database.executar(instrucaoSql);
}

// PÁGINA MEU PERFIL
function buscarTotalLivros(idUsuario) { // recebe idusuario como parâmetro
    var instrucaoSql = `SELECT COUNT(*) AS total
    FROM livros 
    WHERE status_leitura = 'concluido'
    AND usuario_id = ${idUsuario};`

    return database.executar(instrucaoSql); // executa no banco e retorna o resultado para o controller
}

function salvarPerfilLeitor(idUsuario, frase) { // recebe idUsuario e frase como parâmetro

    var instrucaoSql = `INSERT INTO perfil_leitor 
    (usuario_id, frase) VALUES (${idUsuario}, '${frase}')
    ON DUPLICATE KEY UPDATE frase = '${frase}';`
    //  ON DUPLICATE KEY serve para evitar duplicidade caso o usuário já tenha um perfil salvo.

    return database.executar(instrucaoSql); // executa no banco e retorna o resultado para o controller
}

function buscarPerfilLeitor(idUsuario) {  // recebe idusuario como parâmetro
    var instrucaoSql = `SELECT frase FROM 
    perfil_leitor 
    WHERE usuario_id = ${idUsuario};` // Busca a frase salva na tabela perfil_leitor para aquele usuário

    return database.executar(instrucaoSql); // executa no banco e retorna o resultado para o controller
}

function buscarGenerosFavoritos(idUsuario) {

    // LEFT JOIN para garantir que, 
    // mesmo se o livro não tiver avaliação ou favorito,
    //  ainda seja considerado na contagem do gênero.
    var instrucaoSql = `
        SELECT 
            l.genero,
            (COUNT(f.livro_id) + COUNT(a.livro_id)) AS pontuacao
        FROM livros l
        LEFT JOIN favoritos f 
            ON l.id_livro = f.livro_id AND f.usuario_id = l.usuario_id
        LEFT JOIN avaliacao a 
            ON l.id_livro = a.livro_id AND a.usuario_id = l.usuario_id
        WHERE l.usuario_id = ${idUsuario}
        GROUP BY l.genero
        ORDER BY pontuacao DESC
        LIMIT 4;
    `;

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
    removerFavorito,
    salvarAvaliacao,
    buscarLivro,
    buscarLivroParaEditar,
    editarLivro,
    buscarTotalLivros,
    salvarPerfilLeitor,
    buscarPerfilLeitor,
    buscarGenerosFavoritos
};