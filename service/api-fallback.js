// Fallback API Service - Simula respostas quando as APIs reais não funcionam
class FallbackAPIService {
    constructor() {
        this.users = [
            {
                id: 1,
                email: 'admin@academia.com',
                password: 'admin123',
                name: 'Administrador',
                role: 'admin',
                planType: 'Premium',
                planDuration: '12 meses'
            },
            {
                id: 2,
                email: 'usuario@academia.com',
                password: 'user123',
                name: 'Usuário Teste',
                role: 'user',
                planType: 'Básico',
                planDuration: '6 meses'
            }
        ];
        
        this.resetCodes = new Map();
        this.sessions = new Map();
    }

    // Simula delay de rede
    async delay(ms = 500) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Gera token JWT simulado
    generateToken(user) {
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
            exp: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
        };
        return btoa(JSON.stringify(payload)); // Base64 simples
    }

    // Gera código de verificação
    generateResetCode() {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    // Autenticação
    async login(credentials) {
        await this.delay();
        
        const user = this.users.find(u => 
            u.email === credentials.email && u.password === credentials.password
        );

        if (!user) {
            throw new Error('Email ou senha incorretos');
        }

        const token = this.generateToken(user);
        this.sessions.set(token, user);

        return {
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        };
    }

    // Recuperação de senha
    async requestPasswordReset(email) {
        await this.delay();
        
        const user = this.users.find(u => u.email === email);
        if (!user) {
            throw new Error('Email não encontrado');
        }

        const code = this.generateResetCode();
        this.resetCodes.set(email, {
            code,
            timestamp: Date.now(),
            attempts: 0
        });

        console.log(`📧 Código de verificação para ${email}: ${code}`);
        
        return {
            success: true,
            message: 'Código de verificação enviado para o email'
        };
    }

    // Verificação de código
    async verifyResetCode(code) {
        await this.delay();
        
        for (const [email, resetData] of this.resetCodes.entries()) {
            if (resetData.code === code) {
                // Verifica se o código não expirou (15 minutos)
                if (Date.now() - resetData.timestamp > 15 * 60 * 1000) {
                    this.resetCodes.delete(email);
                    throw new Error('Código expirado');
                }

                resetData.attempts++;
                if (resetData.attempts > 3) {
                    this.resetCodes.delete(email);
                    throw new Error('Muitas tentativas. Solicite um novo código');
                }

                const token = this.generateToken({ email, id: 'reset' });
                return {
                    success: true,
                    token,
                    message: 'Código verificado com sucesso'
                };
            }
        }

        throw new Error('Código inválido');
    }

    // Redefinição de senha
    async resetPassword(data) {
        await this.delay();
        
        if (!data.token || !data.newPassword) {
            throw new Error('Token ou nova senha inválidos');
        }

        // Encontra o email associado ao token de reset
        for (const [email, resetData] of this.resetCodes.entries()) {
            const tokenData = JSON.parse(atob(data.token));
            if (tokenData.email === email) {
                // Atualiza a senha do usuário
                const user = this.users.find(u => u.email === email);
                if (user) {
                    user.password = data.newPassword;
                }
                
                // Remove o código de reset
                this.resetCodes.delete(email);
                
                return {
                    success: true,
                    message: 'Senha alterada com sucesso'
                };
            }
        }

        throw new Error('Token inválido ou expirado');
    }

    // Obter perfil
    async getProfile(token) {
        await this.delay();
        
        const session = this.sessions.get(token);
        if (!session) {
            throw new Error('Sessão inválida');
        }

        return {
            success: true,
            data: {
                id: session.id,
                name: session.name,
                email: session.email,
                phone: '(11) 99999-9999',
                cpf: '123.456.789-00',
                planType: session.planType,
                planDuration: session.planDuration
            }
        };
    }

    // Atualizar perfil
    async updateProfile(token, data) {
        await this.delay();
        
        const session = this.sessions.get(token);
        if (!session) {
            throw new Error('Sessão inválida');
        }

        // Atualiza os dados do usuário
        Object.assign(session, data);
        
        return {
            success: true,
            message: 'Perfil atualizado com sucesso'
        };
    }
}

// Instância global do serviço de fallback
const fallbackAPI = new FallbackAPIService();

// Exporta o serviço
export default fallbackAPI; 