document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    alert("Produto não encontrado.");
    return;
  }

  fetch(`https://api-admin-lt52.onrender.com/produtos/${id}`)
    .then(response => {
      if (!response.ok) throw new Error("Erro ao buscar o produto");
      return response.json();
    })
    .then(produto => {
      document.getElementById('titulo-pagina').textContent = produto.nome;
      document.getElementById('nome-produto').textContent = produto.nome;
      document.getElementById('descricao-produto').textContent = produto.descricao;
      document.getElementById('tamanho-produto').textContent = produto.tamanho;
      document.getElementById('preco-produto').innerHTML = `R$${parseFloat(produto.preco).toFixed(2)} <i>(cada)</i> <b>NO BOLETO OU PIX</b>`;

      // Atualiza a imagem do produto
      if (produto.imagem) {
        document.getElementById('imagem-produto').src = produto.imagem;
        document.getElementById('imagem-produto').alt = produto.nome;
      }
    })
    .catch(error => {
      console.error(error);
      alert("Erro ao carregar os dados do produto.");
    });
});
