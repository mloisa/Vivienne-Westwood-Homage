function gerarId() {
  return crypto.randomUUID();
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const [colecoesRes, acessoriosRes] = await Promise.all([
      fetch("/colecoes"),
      fetch("/acessorios"),
    ]);

    const colecoes = await colecoesRes.json();
    const acessorios = await acessoriosRes.json();

    const colecoesContainer = document.getElementById("colecoes-container");
    const acessoriosContainer = document.getElementById("acessorios-container");
    const carousel = document.getElementById("carousel-itens");

    // Limpa containers antes de popular (evita duplicação se recarregar)
    colecoesContainer.innerHTML = "";
    acessoriosContainer.innerHTML = "";
    carousel.innerHTML = "";

    //   RENDER COLEÇÕES
    colecoes.forEach((colecao, index) => {
      //if (!colecao.id) colecao.id = gerarId();

// CARROSSEL
if (colecao.destaque) {
  const activeClass = index === 0 ? "active" : "";
  carousel.innerHTML += `
    <div class="carousel-item ${activeClass}" data-bs-interval="8000">
      <a href="detalhes.html?id=${colecao.id}">
        <img src="${colecao.imagem_principal}" class="d-block w-100" alt="${colecao.titulo}">
        <div class="carousel-caption d-none d-md-block">
          <h5>${colecao.titulo}</h5>
          <p>${colecao.descricao}</p>
        </div>
      </a>
    </div>`;
}

      // CARD
      colecoesContainer.innerHTML += `
        <div class="col">
          <div class="card colecao-card h-100" data-id="${colecao.id}">
            <img src="${colecao.imagens_complementares[0].src}"
                 class="card-img-top img-fluid" alt="${colecao.titulo}">

            <button class="favorite-btn"><span class="icon">♡</span></button>

            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${colecao.titulo}</h5>
              <p class="card-text desc">${colecao.descricao}</p>
              <a href="detalhes.html?id=${colecao.id}" 
                 class="btn btn-outline-dark mt-auto">Ver mais</a>
            </div>
          </div>
        </div>`;
    });

    //   RENDER ACESSÓRIOS

    acessorios.forEach((acessorio) => {
      if (!acessorio.id) acessorio.id = gerarId();

      acessoriosContainer.innerHTML += `
        <div class="col">
          <div class="card h-100" data-id="${acessorio.id}">
            <img src="${acessorio.imagem_principal}"
                 class="card-img-top img-fluid" alt="${acessorio.titulo}">

            <button class="favorite-btn"><span class="icon">♡</span></button>

            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${acessorio.titulo}</h5>
              <p class="card-text desc">${acessorio.descricao}</p>
              <a href="detalhes.html?id=${acessorio.id}" 
                 class="btn btn-outline-dark mt-auto">Ver mais</a>
            </div>
          </div>
        </div>`;
    });

    // Inicializa favoritos após carregar os cards
    carregarFavoritos();
    renderizarFavoritos();
    iniciarClicksFavoritos();

  } catch (error) {
    console.error("Erro ao carregar os dados do servidor:", error);
  }

  //Buscar entidade principal
  const inputBusca = document.getElementById("busca-colecoes");

  if (inputBusca) {
    inputBusca.addEventListener("input", () => {
      const termo = inputBusca.value.toLowerCase();
      // Use o seletor com a classe correta 'colecao-card' adicionada aos cards de coleção
      const cards = document.querySelectorAll("#colecoes-container .colecao-card");

      cards.forEach(card => {
        const titulo = card.querySelector(".card-title").textContent.toLowerCase();
        const desc = card.querySelector(".desc").textContent.toLowerCase();

        card.style.display = (titulo.includes(termo) || desc.includes(termo))
          ? ""
          : "none";
      });
    });
  }
});

// FAVORITOS

function iniciarClicksFavoritos() {
  document.addEventListener("click", (event) => {
    const btn = event.target.closest(".favorite-btn");
    if (!btn) return;

    const card = btn.closest(".card");
    if (!card) return;

    const cardId = card.dataset.id;

    card.classList.toggle("fav");

    btn.classList.toggle("favorited");
    btn.querySelector(".icon").textContent =
      btn.classList.contains("favorited") ? "❤" : "♡";

    salvarFavoritos();
    renderizarFavoritos();
  });
}

// Salvar favoritos no localStorage
function salvarFavoritos() {
  const favoritos = [...document.querySelectorAll(".card.fav")].map(card => card.dataset.id);
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

// Carregar favoritos ao iniciar
function carregarFavoritos() {
  const favoritosSalvos = JSON.parse(localStorage.getItem("favoritos") || "[]");

  favoritosSalvos.forEach(id => {
    const card = document.querySelector(`.card[data-id='${id}']`);
    if (card) {
      card.classList.add("fav");
      const btn = card.querySelector(".favorite-btn");
      if (btn) {
        btn.classList.add("favorited");
        btn.querySelector(".icon").textContent = "❤";
      }
    }
  });
}

// Renderiza os favs
function renderizarFavoritos() {
  const container = document.getElementById("favoritos-container");
  container.innerHTML = "";

  const favoritos = document.querySelectorAll(".card.fav");

  favoritos.forEach(original => {
    const clone = original.cloneNode(true);

    // Corrige coração no clone
    const btn = clone.querySelector(".favorite-btn");
    if (btn) btn.querySelector(".icon").textContent = "❤";

    container.appendChild(clone);
  });
}

