const API_BASE_URL = 'https://api-admin-8p0v.onrender.com';

window.apiAdmin = {
    // --- Endpoints para Professores ---
    getProfessores: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/professores`);
            if (!response.ok) throw new Error(`Erro HTTP ao buscar professores: ${response.status} - ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error('Erro na função getProfessores:', error);
            throw error;
        }
    },
    getProfessorById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/professores/${id}`);
            if (!response.ok) throw new Error(`Erro HTTP ao buscar professor por ID: ${response.status} - ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error(`Erro na função getProfessorById (ID: ${id}):`, error);
            throw error;
        }
    },
    addProfessor: async (professorData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/professores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(professorData)
            });
            if (!response.ok) throw new Error(`Erro HTTP ao adicionar professor: ${response.status} - ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error('Erro na função addProfessor:', error);
            throw error;
        }
    },
    updateProfessor: async (id, professorData) => {
        try {
            const formData = new FormData();
            formData.append('nome', professorData.nome);
            formData.append('email', professorData.email);
            formData.append('telefone', professorData.telefone);
            // Envie fotoPerfil SOMENTE se for um arquivo (caso a edição permita trocar a foto)
            if (professorData.fotoPerfil instanceof File) {
                formData.append('fotoPerfil', professorData.fotoPerfil);
            }

            const response = await fetch(`${API_BASE_URL}/professores/${id}`, {
                method: 'PUT',
                body: formData
            });
            if (!response.ok) throw new Error(`Erro HTTP ao atualizar professor: ${response.status} - ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error(`Erro na função updateProfessor (ID: ${id}):`, error);
            throw error;
        }
    },
    deleteProfessor: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/professores/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error(`Erro HTTP ao excluir professor: ${response.status} - ${response.statusText}`);
            if (response.status !== 204 && response.headers.get('content-length') !== '0') {
                return await response.json();
            }
            return;
        } catch (error) {
            console.error(`Erro na função deleteProfessor (ID: ${id}):`, error);
            throw error;
        }
    },

    // --- Endpoints para Alunos ---
    getAlunos: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/alunos`);
            if (!response.ok) throw new Error(`Erro HTTP ao buscar alunos: ${response.status} - ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error('Erro na função getAlunos:', error);
            throw error;
        }
    },
    getAlunoById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/alunos/${id}`);
            if (!response.ok) throw new Error(`Erro HTTP ao buscar aluno por ID: ${response.status} - ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error(`Erro na função getAlunoById (ID: ${id}):`, error);
            throw error;
        }
    },
    addAluno: async (alunoData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/alunos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(alunoData)
            });
            if (!response.ok) throw new Error(`Erro HTTP ao adicionar aluno: ${response.status} - ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error('Erro na função addAluno:', error);
            throw error;
        }
    },
    updateAluno: async (id, alunoData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/alunos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(alunoData)
            });
            if (!response.ok) throw new Error(`Erro HTTP ao atualizar aluno: ${response.status} - ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error(`Erro na função updateAluno (ID: ${id}):`, error);
            throw error;
        }
    },
    deleteAluno: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/alunos/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error(`Erro HTTP ao excluir aluno: ${response.status} - ${response.statusText}`);
            if (response.status !== 204 && response.headers.get('content-length') !== '0') {
                return await response.json();
            }
            return;
        } catch (error) {
            console.error(`Erro na função deleteAluno (ID: ${id}):`, error);
            throw error;
        }
    },

    // --- Produtos Segmentados ---
    getProdutosSemTamanho: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/produtos/semtamanho`);
            if (!response.ok) throw new Error(`Erro HTTP ao buscar produtos sem tamanho: ${response.status} - ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error('Erro na função getProdutosSemTamanho:', error);
            throw error;
        }
    },
    getProdutosComTamanho: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/produtos/comtamanho`);
            if (!response.ok) throw new Error(`Erro HTTP ao buscar produtos com tamanho: ${response.status} - ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error('Erro na função getProdutosComTamanho:', error);
            throw error;
        }
    },
    // (opcional) Junta os dois segmentos em um array só
    getTodosProdutos: async () => {
        try {
            const [semTamanho, comTamanho] = await Promise.all([
                window.apiAdmin.getProdutosSemTamanho(),
                window.apiAdmin.getProdutosComTamanho()
            ]);
            // Retorna um único array com todos os produtos
            return [...semTamanho, ...comTamanho];
        } catch (error) {
            console.error('Erro na função getTodosProdutos:', error);
            throw error;
        }
    },

    // --- NÃO USE MAIS ---
    // Se não quiser mais que /produtos seja usado, pode remover ou lançar erro
    getProdutos: async () => {
        throw new Error('Use getProdutosComTamanho ou getProdutosSemTamanho!');
    },

    getProdutoById: async (id, segmento = 'semtamanho') => {
        // segmento: 'semtamanho' ou 'comtamanho'
        try {
            const response = await fetch(`${API_BASE_URL}/produtos/${segmento}/${id}`);
            if (!response.ok) throw new Error(`Erro HTTP ao buscar produto por ID: ${response.status} - ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error(`Erro na função getProdutoById (ID: ${id}, segmento: ${segmento}):`, error);
            throw error;
        }
    },

    // ATUALIZANDO a função addProduto para aceitar FormData
    addProduto: async (produtoFormData, segmento = 'semtamanho') => { // Agora espera um FormData e segmento
        try {
            const response = await fetch(`${API_BASE_URL}/produtos/${segmento}`, {
                method: 'POST',
                // NUNCA defina 'Content-Type' manualmente para FormData. O navegador faz isso.
                body: produtoFormData // Envie o FormData diretamente
            });
            if (!response.ok) {
                let errorDetails = '';
                try {
                    errorDetails = await response.json(); // Tenta parsear erro JSON
                } catch (e) {
                    errorDetails = await response.text(); // Fallback para texto
                }
                throw new Error(`Erro HTTP ao adicionar produto: ${response.status} - ${response.statusText}. Detalhes: ${JSON.stringify(errorDetails)}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Erro na função addProduto:', error);
            throw error;
        }
    },
    updateProduto: async (id, produtoData, segmento = 'semtamanho') => {
        try {
            const response = await fetch(`${API_BASE_URL}/produtos/${segmento}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(produtoData)
            });
            if (!response.ok) throw new Error(`Erro HTTP ao atualizar produto: ${response.status} - ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error(`Erro na função updateProduto (ID: ${id}, segmento: ${segmento}):`, error);
            throw error;
        }
    },
    deleteProduto: async (id, segmento = 'semtamanho') => {
        try {
            const response = await fetch(`${API_BASE_URL}/produtos/${segmento}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error(`Erro HTTP ao excluir produto: ${response.status} - ${response.statusText}`);
            if (response.status !== 204 && response.headers.get('content-length') !== '0') {
                return await response.json();
            }
            return;
        } catch (error) {
            console.error(`Erro na função deleteProduto (ID: ${id}, segmento: ${segmento}):`, error);
            throw error;
        }
    },

    // --- Novas Rotas Específicas para Produtos ---
    reservarProduto: async (id, quantidade, segmento = 'semtamanho') => {
        try {
            const response = await fetch(`${API_BASE_URL}/produtos/${segmento}/${id}/reservar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantidade })
            });
            if (!response.ok) throw new Error(`Erro HTTP ao reservar produto: ${response.status} - ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error(`Erro na função reservarProduto (ID: ${id}, Quantidade: ${quantidade}, segmento: ${segmento}):`, error);
            throw error;
        }
    },
    confirmarPagamentoProduto: async (id, quantidade, segmento = 'semtamanho') => {
        try {
            const response = await fetch(`${API_BASE_URL}/produtos/${segmento}/${id}/confirmar-pagamento`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantidade })
            });
            if (!response.ok) throw new Error(`Erro HTTP ao confirmar pagamento: ${response.status} - ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error(`Erro na função confirmarPagamentoProduto (ID: ${id}, Quantidade: ${quantidade}, segmento: ${segmento}):`, error);
            throw error;
        }
    },
    finalizarVendaProduto: async (id, quantidade, segmento = 'semtamanho') => {
        try {
            const response = await fetch(`${API_BASE_URL}/produtos/${segmento}/${id}/finalizar-venda`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantidade })
            });
            if (!response.ok) throw new Error(`Erro HTTP ao finalizar venda: ${response.status} - ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error(`Erro na função finalizarVendaProduto (ID: ${id}, Quantidade: ${quantidade}, segmento: ${segmento}):`, error);
            throw error;
        }
    },
    cancelarReservaProduto: async (id, quantidade, segmento = 'semtamanho') => {
        try {
            const response = await fetch(`${API_BASE_URL}/produtos/${segmento}/${id}/cancelar-reserva`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantidade })
            });
            if (!response.ok) throw new Error(`Erro HTTP ao cancelar reserva: ${response.status} - ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error(`Erro na função cancelarReservaProduto (ID: ${id}, Quantidade: ${quantidade}, segmento: ${segmento}):`, error);
            throw error;
        }
    }
};