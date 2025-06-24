// Import fallback API
import fallbackAPI from './api-fallback.js';

// API Configuration
const API_CONFIG = {
    SAUDE_API: 'https://saude-api-hwp6.onrender.com',
    ADMIN_API: 'https://api-admin-8p0v.onrender.com'
};

// Utility function to handle API calls
async function makeApiCall(endpoint, method = 'GET', data = null, apiType = 'SAUDE_API') {
    try {
        const baseUrl = API_CONFIG[apiType];
        const url = `${baseUrl}${endpoint}`;
        
        console.log(`🌐 API Call: ${method} ${url}`);
        console.log('📤 Request Data:', data);
        
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                // Add any authentication headers here if needed
            }
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }

        console.log('🔧 Request Options:', options);

        const response = await fetch(url, options);
        
        console.log(`📥 Response Status: ${response.status}`);
        console.log(`📥 Response Headers:`, response.headers);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ API Error: ${response.status} - ${errorText}`);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
        
        const responseData = await response.json();
        console.log('📥 Response Data:', responseData);
        
        return responseData;
    } catch (error) {
        console.error('❌ API call failed:', error);
        
        // Detalhes específicos para diferentes tipos de erro
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            console.error('🔍 Erro de rede detectado. Usando sistema de fallback...');
            throw new Error('NETWORK_ERROR');
        }
        
        console.error('🔍 Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            endpoint,
            method,
            data,
            apiType,
            url: `${API_CONFIG[apiType]}${endpoint}`
        });
        throw error;
    }
}

// API functions with fallback
const api = {
    // Saude API endpoints
    saude: {
        // Authentication endpoints
        async login(credentials) {
            try {
                return await makeApiCall('/auth/login', 'POST', credentials, 'SAUDE_API');
            } catch (error) {
                if (error.message === 'NETWORK_ERROR') {
                    console.log('🔄 Usando sistema de fallback para login...');
                    return await fallbackAPI.login(credentials);
                }
                throw error;
            }
        },

        async register(userData) {
            try {
                return await makeApiCall('/auth/register', 'POST', userData, 'SAUDE_API');
            } catch (error) {
                if (error.message === 'NETWORK_ERROR') {
                    console.log('🔄 Usando sistema de fallback para registro...');
                    return { success: true, message: 'Usuário registrado com sucesso (modo offline)' };
                }
                throw error;
            }
        },
        
        // Password recovery endpoints
        async requestPasswordReset(email) {
            try {
                return await makeApiCall('/auth/request-password-reset', 'POST', { email }, 'SAUDE_API');
            } catch (error) {
                if (error.message === 'NETWORK_ERROR') {
                    console.log('🔄 Usando sistema de fallback para recuperação de senha...');
                    return await fallbackAPI.requestPasswordReset(email);
                }
                throw error;
            }
        },

        async verifyResetCode(code) {
            try {
                return await makeApiCall('/auth/verify-reset-code', 'POST', { code }, 'SAUDE_API');
            } catch (error) {
                if (error.message === 'NETWORK_ERROR') {
                    console.log('🔄 Usando sistema de fallback para verificação de código...');
                    return await fallbackAPI.verifyResetCode(code);
                }
                throw error;
            }
        },

        async resetPassword(data) {
            try {
                return await makeApiCall('/auth/reset-password', 'POST', data, 'SAUDE_API');
            } catch (error) {
                if (error.message === 'NETWORK_ERROR') {
                    console.log('🔄 Usando sistema de fallback para redefinição de senha...');
                    return await fallbackAPI.resetPassword(data);
                }
                throw error;
            }
        },
        
        // Profile endpoints
        async getProfile() {
            try {
                const token = localStorage.getItem('userToken');
                return await makeApiCall('/profile', 'GET', null, 'SAUDE_API');
            } catch (error) {
                if (error.message === 'NETWORK_ERROR') {
                    console.log('🔄 Usando sistema de fallback para obter perfil...');
                    const token = localStorage.getItem('userToken');
                    return await fallbackAPI.getProfile(token);
                }
                throw error;
            }
        },

        async updateProfile(data) {
            try {
                return await makeApiCall('/profile/update', 'POST', data, 'SAUDE_API');
            } catch (error) {
                if (error.message === 'NETWORK_ERROR') {
                    console.log('🔄 Usando sistema de fallback para atualizar perfil...');
                    const token = localStorage.getItem('userToken');
                    return await fallbackAPI.updateProfile(token, data);
                }
                throw error;
            }
        },
    },
    
    // Admin API endpoints
    admin: {
        // Authentication endpoints
        async login(credentials) {
            try {
                return await makeApiCall('/auth/login', 'POST', credentials, 'ADMIN_API');
            } catch (error) {
                if (error.message === 'NETWORK_ERROR') {
                    console.log('🔄 Usando sistema de fallback para login admin...');
                    return await fallbackAPI.login(credentials);
                }
                throw error;
            }
        },
        
        // Profile endpoints
        async getProfile() {
            try {
                return await makeApiCall('/admin/profile', 'GET', null, 'ADMIN_API');
            } catch (error) {
                if (error.message === 'NETWORK_ERROR') {
                    console.log('🔄 Usando sistema de fallback para obter perfil admin...');
                    const token = localStorage.getItem('userToken');
                    return await fallbackAPI.getProfile(token);
                }
                throw error;
            }
        },

        async updateProfile(data) {
            try {
                return await makeApiCall('/admin/profile/update', 'POST', data, 'ADMIN_API');
            } catch (error) {
                if (error.message === 'NETWORK_ERROR') {
                    console.log('🔄 Usando sistema de fallback para atualizar perfil admin...');
                    const token = localStorage.getItem('userToken');
                    return await fallbackAPI.updateProfile(token, data);
                }
                throw error;
            }
        },
        
        // Password recovery endpoints
        async requestPasswordReset(email) {
            try {
                return await makeApiCall('/auth/request-password-reset', 'POST', { email }, 'ADMIN_API');
            } catch (error) {
                if (error.message === 'NETWORK_ERROR') {
                    console.log('🔄 Usando sistema de fallback para recuperação de senha admin...');
                    return await fallbackAPI.requestPasswordReset(email);
                }
                throw error;
            }
        },

        async verifyResetCode(code) {
            try {
                return await makeApiCall('/auth/verify-reset-code', 'POST', { code }, 'ADMIN_API');
            } catch (error) {
                if (error.message === 'NETWORK_ERROR') {
                    console.log('🔄 Usando sistema de fallback para verificação de código admin...');
                    return await fallbackAPI.verifyResetCode(code);
                }
                throw error;
            }
        },

        async resetPassword(data) {
            try {
                return await makeApiCall('/auth/reset-password', 'POST', data, 'ADMIN_API');
            } catch (error) {
                if (error.message === 'NETWORK_ERROR') {
                    console.log('🔄 Usando sistema de fallback para redefinição de senha admin...');
                    return await fallbackAPI.resetPassword(data);
                }
                throw error;
            }
        },
    }
};

// Export the API object
export default api; 