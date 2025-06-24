// js/adicionar_aluno.js
import { apiAdmin } from "../service/apiAdmin.js"; // Adicione .js aqui!

document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.querySelector('.btn-adicionar-card'); 

    if (addButton) {
        addButton.addEventListener('click', async () => {
            const nomeInput = document.getElementById('nome'); 
            const cpfInput = document.getElementById('cpf');   
            const emailInput = document.getElementById('email'); 
            const telefoneInput = document.getElementById('telefone'); 

            const nome = nomeInput.value;
            const cpf = cpfInput.value;
            const email = emailInput.value;
            const telefone = telefoneInput.value;

            if (!nome || !cpf || !email || !telefone) { 
                alert('Por favor, preencha todos os campos (Nome, CPF, Email, Telefone) para adicionar o aluno.');
                return;
            }

            const alunoData = {
                nome: nome,
                cpf: cpf,         
                email: email,
                telefone: telefone 
            };

            try {
                const novoAluno = await apiAdmin.addAluno(alunoData);
                alert(`Aluno "${novoAluno.nome}" adicionado com sucesso!`);

                nomeInput.value = '';
                cpfInput.value = '';
                emailInput.value = '';
                telefoneInput.value = '';

            } catch (error) {
                console.error('Erro ao adicionar aluno:', error);
                alert('Erro ao adicionar aluno. Verifique o console para mais detalhes.');
            }
        });
    } else {
        console.error('Botão de adicionar aluno não encontrado.');
    }
});