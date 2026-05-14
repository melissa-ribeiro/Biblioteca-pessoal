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
    AND senha = '${senha}';
`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
function cadastrar(nome, email, senha, meta) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, senha, meta);

    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    var instrucaoSql = `
        INSERT INTO usuario (nome,email, senha, meta_dias) VALUES ('${nome}','${email}', '${senha}', '${meta}');
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

module.exports = {
    autenticar,
    cadastrar,
    onboarding
};