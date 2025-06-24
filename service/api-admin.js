// Configuração da URL base da API de administração
const API_ADMIN = 'https://api-admin-lt52.onrender.com';

// Função para autenticação do administrador
async function loginAdmin(credenciais) {
    try {
        const response = await fetch(`${API_ADMIN}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credenciais)
        });
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        throw error;
    }
}

// Função para buscar estatísticas do sistema
async function buscarEstatisticas() {
    try {
        const response = await fetch(`${API_ADMIN}/estatisticas`);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        throw error;
    }
}

// Função para buscar logs do sistema
async function buscarLogs(pagina = 0, quantidade = 10) {
    try {
        const response = await fetch(`${API_ADMIN}/logs?pag=${pagina}&qtd=${quantidade}`);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar logs:', error);
        throw error;
    }
}

// Exemplo de uso:
// Para fazer login:
// const credenciais = {
//     email: "admin@exemplo.com",
//     senha: "senha123"
// };
// loginAdmin(credenciais)
//     .then(response => {
//         console.log('Login realizado:', response);
//         // Salvar o token de autenticação se necessário
//         localStorage.setItem('adminToken', response.token);
//     })
//     .catch(error => {
//         console.error('Erro:', error);
//     });

// Para buscar estatísticas:
// buscarEstatisticas()
//     .then(estatisticas => {
//         console.log('Estatísticas:', estatisticas);
//     })
//     .catch(error => {
//         console.error('Erro:', error);
//     }); 