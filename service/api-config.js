// Configuração das URLs das APIs
const API_CONFIG = {
    LOGIN: 'https://saude-api-hwp6.onrender.com/api/login',
    USUARIO: 'https://saude-api-hwp6.onrender.com/api/usuario',
    ADMIN: 'https://api-admin-lt52.onrender.com'
};

// Função para fazer login
async function login(email, senha) {
    try {
        console.log('Tentando login com:', { email, senha });

        // Configurar timeout de 10 segundos
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        // Tenta login como usuário normal
        const response = await fetch(API_CONFIG.LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        console.log('Resposta do servidor:', response.status);

        if (response.ok) {
            const data = await response.json();
            console.log('Login bem sucedido:', data);
            localStorage.setItem('userToken', data.token);
            return { success: true, isAdmin: false, data };
        }

        // Se falhar, tenta login como admin
        console.log('Tentando login como admin...');
        const adminResponse = await fetch(`${API_CONFIG.ADMIN}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        console.log('Resposta do admin:', adminResponse.status);

        if (adminResponse.ok) {
            const adminData = await adminResponse.json();
            console.log('Login admin bem sucedido:', adminData);
            localStorage.setItem('adminToken', adminData.token);
            return { success: true, isAdmin: true, data: adminData };
        }

        // Se ambos falharem, retorna erro
        const errorData = await response.json().catch(() => ({}));
        console.log('Erro de login:', errorData);
        return { 
            success: false, 
            message: errorData.message || 'Email ou senha inválidos' 
        };
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        if (error.name === 'AbortError') {
            return { 
                success: false, 
                message: 'Tempo limite excedido. Verifique sua conexão.' 
            };
        }
        return { 
            success: false, 
            message: 'Erro ao fazer login. Verifique sua conexão.' 
        };
    }
}

// Função para recuperar senha
async function recuperarSenha(email) {
    try {
        console.log('Iniciando recuperação de senha para:', email);
        
        // Configurar timeout de 10 segundos
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`${API_CONFIG.USUARIO}/recuperar-senha`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        console.log('Resposta da recuperação de senha:', response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Erro ao enviar código de recuperação');
        }

        const data = await response.json();
        console.log('Código enviado com sucesso:', data);
        return data;
    } catch (error) {
        console.error('Erro na recuperação de senha:', error);
        if (error.name === 'AbortError') {
            throw new Error('Tempo limite excedido. Verifique sua conexão.');
        }
        throw error;
    }
}

// Função para verificar código
async function verificarCodigo(email, codigo) {
    try {
        console.log('Verificando código para:', email);
        
        // Configurar timeout de 10 segundos
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`${API_CONFIG.USUARIO}/verificar-codigo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email,
                codigo: codigo.toString()
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        console.log('Resposta da verificação de código:', response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Código inválido');
        }

        const data = await response.json();
        console.log('Código verificado com sucesso:', data);
        return data;
    } catch (error) {
        console.error('Erro na verificação de código:', error);
        if (error.name === 'AbortError') {
            throw new Error('Tempo limite excedido. Verifique sua conexão.');
        }
        throw error;
    }
}

// Função para alterar senha
async function alterarSenha(email, novaSenha) {
    try {
        console.log('Alterando senha para:', email);
        
        // Configurar timeout de 10 segundos
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`${API_CONFIG.USUARIO}/alterar-senha`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email,
                novaSenha
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        console.log('Resposta da alteração de senha:', response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Erro ao alterar senha');
        }

        const data = await response.json();
        console.log('Senha alterada com sucesso:', data);
        return data;
    } catch (error) {
        console.error('Erro na alteração de senha:', error);
        if (error.name === 'AbortError') {
            throw new Error('Tempo limite excedido. Verifique sua conexão.');
        }
        throw error;
    }
}

// Função para obter dados do usuário
async function obterDadosUsuario(token) {
    try {
        const response = await fetch(`${API_CONFIG.USUARIO}/perfil`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao obter dados do usuário:', error);
        throw error;
    }
}

// Função para obter dados do administrador
async function obterDadosAdmin(token) {
    try {
        const response = await fetch(`${API_CONFIG.ADMIN}/perfil`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao obter dados do administrador:', error);
        throw error;
    }
}

// Exportar as funções
export {
    login,
    recuperarSenha,
    verificarCodigo,
    alterarSenha,
    obterDadosUsuario,
    obterDadosAdmin
}; 