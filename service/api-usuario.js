// Configuração das URLs base das APIs
const API_USUARIO = 'https://saude-api-hwp6.onrender.com/api/usuario';
const API_ADMIN = 'https://api-admin-lt52.onrender.com';

// Função para buscar usuários com paginação
async function buscarUsuarios(pagina = 0, quantidade = 8) {
    try {
        const response = await fetch(`${API_USUARIO}?pag=${pagina}&qtd=${quantidade}`);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        throw error;
    }
}

// Função para buscar um usuário específico por ID
async function buscarUsuarioPorId(id) {
    try {
        const response = await fetch(`${API_USUARIO}/${id}`);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        throw error;
    }
}

// Função para criar um novo usuário
async function criarUsuario(dadosUsuario) {
    try {
        const response = await fetch(API_USUARIO, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosUsuario)
        });
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        throw error;
    }
}

// Função para atualizar um usuário
async function atualizarUsuario(id, dadosUsuario) {
    try {
        const response = await fetch(`${API_USUARIO}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosUsuario)
        });
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        throw error;
    }
}

// Função para deletar um usuário
async function deletarUsuario(id) {
    try {
        const response = await fetch(`${API_USUARIO}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        return true;
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        throw error;
    }
}

// Exemplo de uso:
// Para buscar usuários:
// buscarUsuarios(0, 8)
//     .then(usuarios => {
//         console.log('Lista de usuários:', usuarios);
//     })
//     .catch(error => {
//         console.error('Erro:', error);
//     });

// Para criar um novo usuário:
// const novoUsuario = {
//     nome: "Nome do Usuário",
//     email: "email@exemplo.com",
//     senha: "senha123"
// };
// criarUsuario(novoUsuario)
//     .then(response => {
//         console.log('Usuário criado:', response);
//     })
//     .catch(error => {
//         console.error('Erro:', error);
//     }); 