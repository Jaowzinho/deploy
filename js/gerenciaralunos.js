// js/gerenciarAlunos.js
import { apiAdmin } from "../services/apiAdmin.js";

document.addEventListener('DOMContentLoaded', async () => {
    const alunosContainer = document.getElementById('alunos-container');

    // Função para criar o card de um aluno
    const criarCardAluno = (aluno) => {
        const alunoCard = document.createElement('div');
        alunoCard.classList.add('card-aluno', 'mb-4'); // Classes Bootstrap e sua classe CSS

        // Importante: usar as chaves exatas do JSON da API (id, nome, cpf, email, telefone)
        alunoCard.innerHTML = `
            <div class="mb-3">
                <label for="nome-${aluno.id}" class="form-label">Nome:</label>
                <input type="text" class="form-control" id="nome-${aluno.id}" value="${aluno.nome || ''}" disabled>
            </div>
            <div class="mb-3">
                <label for="cpf-${aluno.id}" class="form-label">CPF:</label>
                <input type="text" class="form-control" id="cpf-${aluno.id}" value="${aluno.cpf || ''}" disabled>
            </div>
            <div class="mb-3">
                <label for="email-${aluno.id}" class="form-label">Email:</label>
                <input type="email" class="form-control" id="email-${aluno.id}" value="${aluno.email || ''}" disabled>
            </div>
            <div class="mb-3">
                <label for="telefone-${aluno.id}" class="form-label">Telefone:</label>
                <input type="tel" class="form-control" id="telefone-${aluno.id}" value="${aluno.telefone || ''}" disabled>
            </div>
            <div class="btn-group-aluno d-flex flex-column flex-md-row justify-content-end">
                <button class="btn btn-secondary btn-editar mb-2 mb-md-0 me-md-2" data-id="${aluno.id}">Editar</button>
                <button class="btn btn-danger btn-excluir" data-id="${aluno.id}">Excluir</button>
            </div>
        `;
        return alunoCard;
    };

    // Função para carregar e exibir os alunos
    const carregarAlunos = async () => {
        alunosContainer.innerHTML = '<p class="text-center text-muted">Carregando alunos...</p>'; // Mensagem de carregamento

        try {
            const alunos = await apiAdmin.getAlunos(); // Chama a função da API para obter os alunos
            console.log('Alunos carregados:', alunos);

            if (alunos && alunos.length > 0) {
                alunosContainer.innerHTML = ''; // Limpa a mensagem de carregamento

                alunos.forEach(aluno => {
                    const card = criarCardAluno(aluno);
                    alunosContainer.appendChild(card);
                });

                // Adiciona listeners para os botões após todos os cards serem criados
                adicionarListenersBotoesAlunos();

            } else {
                alunosContainer.innerHTML = '<p class="text-center text-muted">Nenhum aluno cadastrado.</p>';
            }
        } catch (error) {
            console.error('Erro ao carregar alunos:', error);
            alunosContainer.innerHTML = `<p class="text-danger text-center">Erro ao carregar alunos: ${error.message}. Por favor, tente novamente.</p>`;
        }
    };

    // Função para adicionar os event listeners aos botões de editar e excluir
    const adicionarListenersBotoesAlunos = () => {
        // Botões de Editar
        document.querySelectorAll('.btn-editar').forEach(button => {
            button.addEventListener('click', (event) => {
                const alunoId = event.target.dataset.id;
                const card = event.target.closest('.card-aluno');
                const inputs = card.querySelectorAll('input');

                // Lógica de edição: Alterna entre modo de visualização e edição
                inputs.forEach(input => {
                    input.disabled = !input.disabled;
                });

                if (event.target.textContent === 'Editar') {
                    event.target.textContent = 'Salvar';
                    event.target.classList.remove('btn-secondary');
                    event.target.classList.add('btn-success');

                    // Você pode adicionar um botão "Cancelar" aqui também
                    const cancelarBtn = document.createElement('button');
                    cancelarBtn.textContent = 'Cancelar';
                    cancelarBtn.classList.add('btn', 'btn-warning', 'ms-2', 'btn-cancelar');
                    cancelarBtn.addEventListener('click', () => {
                        inputs.forEach(input => {
                            // Reverte para os valores originais (se você os tiver armazenado)
                            // Por simplicidade aqui, apenas desabilita e muda o botão de volta
                            input.disabled = true;
                        });
                        event.target.textContent = 'Editar';
                        event.target.classList.remove('btn-success');
                        event.target.classList.add('btn-secondary');
                        cancelarBtn.remove();
                    });
                    event.target.parentNode.insertBefore(cancelarBtn, event.target.nextSibling);

                } else { // Modo Salvar
                    const novosDadosAluno = {
                        nome: card.querySelector(`#nome-${alunoId}`).value,
                        cpf: card.querySelector(`#cpf-${alunoId}`).value,
                        email: card.querySelector(`#email-${alunoId}`).value,
                        telefone: card.querySelector(`#telefone-${alunoId}`).value,
                        // Não envie a senha de volta se não for alterada
                        // Se houver campo de senha para atualização, adicione aqui
                    };

                    // Implemente a chamada à API para atualizar o aluno
                    apiAdmin.updateAluno(alunoId, novosDadosAluno)
                        .then(response => {
                            alert('Aluno atualizado com sucesso!');
                            console.log('Aluno atualizado:', response);
                            // Recarrega a lista para mostrar os dados atualizados (ou atualiza o card diretamente)
                            carregarAlunos(); 
                        })
                        .catch(error => {
                            console.error('Erro ao atualizar aluno:', error);
                            alert(`Erro ao atualizar aluno: ${error.message}`);
                        })
                        .finally(() => {
                            // Volta para o modo de visualização
                            inputs.forEach(input => { input.disabled = true; });
                            event.target.textContent = 'Editar';
                            event.target.classList.remove('btn-success');
                            event.target.classList.add('btn-secondary');
                            card.querySelector('.btn-cancelar')?.remove(); // Remove o botão cancelar se existir
                        });
                }
            });
        });

        // Botões de Excluir
        document.querySelectorAll('.btn-excluir').forEach(button => {
            button.addEventListener('click', async (event) => {
                const alunoId = event.target.dataset.id;
                if (confirm(`Tem certeza que deseja excluir o aluno(a) ${alunoId}? Esta ação é irreversível.`)) {
                    try {
                        await apiAdmin.deleteAluno(alunoId); // Chama a função da API para excluir
                        alert('Aluno excluído com sucesso!');
                        carregarAlunos(); // Recarrega a lista de alunos após a exclusão
                    } catch (error) {
                        console.error('Erro ao excluir aluno:', error);
                        alert(`Erro ao excluir aluno: ${error.message}`);
                    }
                }
            });
        });
    };

    // Carrega os alunos quando a página é completamente carregada
    carregarAlunos();
});