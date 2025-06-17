document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("produtos-container");

  fetch(
    "https://api-admin-lt52.onrender.com/produtos")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao buscar produtos: " + response.status);
      }
      return response.json();
    })
    .then((produtos) => {
      container.innerHTML = "";

      produtos.forEach((produto, index) => {
        const reverseClass = index % 2 !== 0 ? "card-um-reverse" : "";

        const card = document.createElement("div");
        card.className = "cards";

        card.innerHTML = `
          <div class="card-um ${reverseClass}">
            <img src="img/img1.jpeg" class="card-img-top" alt="${
              produto.nome
            }" />
            <div class="card-body">
              <h5 class="card-title">${produto.nome}</h5>
              <p>${produto.descricao}</p>
              <p><strong>Preço:</strong> R$ ${produto.preco.toFixed(2)}</p>
              <a href="loja_produto.html?id=${produto.id}" class="btn btn-detalhes">Mais detalhes</a>
            </div>
          </div>
        `;

        container.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Erro ao carregar os produtos:", error);
      container.innerHTML =
        "<p>Erro ao carregar produtos. Detalhes no console.</p>";
    });
});
