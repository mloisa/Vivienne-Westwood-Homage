document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id"); // UUIDs devem ser tratados como string

  if (!id) {
    mostrarErro("ID inválido ou não informado.");
    return;
  }

  // Busca o item
  const item = await buscarItemPorId(id);

  if (!item) {
    mostrarErro("Item não encontrado.");
    return;
  }

  apresentarDetalhes(item);
  document.getElementById("btn-editar").addEventListener("click", () => {
    window.location.href = `postar.html?id=${item.id}`;
  });
  document.getElementById("btn-excluir").addEventListener("click", async () => {
    if (confirm(`Tem certeza que deseja excluir "${item.titulo}"?`)) {
      try {
        const endpoint = item.categoria.toLowerCase().includes("acessórios") ? "/acessorios" : "/colecoes";
        const response = await fetch(`${endpoint}/${item.id}`, { method: "DELETE" });

        if (!response.ok) throw new Error("Falha ao excluir item.");

        alert("Item excluído com sucesso!");
        window.location.href = "index.html";
      } catch (error) {
        console.error(error);
        alert("Erro ao excluir item. Tente novamente.");
      }
    }
  });
});

// Buscar
async function buscarItemPorId(id) {
  const endpoints = ["/colecoes", "/acessorios"];

  for (const url of endpoints) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Erro ao buscar dados em ${url}`);

      const data = await response.json();
      // Comparar como string, não como número
      const item = data.find(obj => obj.id === id);
      if (item) return item;
    } catch (error) {
      console.error(`Erro ao buscar em ${url}:`, error);
    }
  }
  return null;
}

// Preenche o HTML com os detalhes do item
function apresentarDetalhes(item) {
  // Banner
  const banner = document.getElementById("banner");
  banner.style.backgroundImage = `url('${item.imagem_principal || "imagens/default.jpg"}')`;
  document.getElementById("titulo-banner").textContent = item.titulo;

  // Textos principais
  document.getElementById("descricao").textContent = item.descricao || "Sem descrição.";
  document.getElementById("conteudo").textContent = item.conteudo || "Conteúdo não disponível.";
  document.getElementById("categoria").textContent = item.categoria || "Não informado";
  document.getElementById("autor").textContent = item.autor || "Desconhecido";
  document.getElementById("data").textContent = item.data
    ? new Date(item.data).toLocaleDateString("pt-BR")
    : "Não informado";

  // Galeria de imagens complementares
  const galeria = document.getElementById("galeria");
  galeria.innerHTML = "";

  if (item.imagens_complementares && item.imagens_complementares.length > 0) {
    item.imagens_complementares.forEach(img => {
      const col = document.createElement("div");
      col.className = "col-md-6 mb-4";
      col.innerHTML = `
        <img src="${img.src}" alt="${img.descricao || item.titulo}" class="img-fluid shadow">
        <p class="mt-2 text-muted">${img.descricao || ""}</p>
      `;
      galeria.appendChild(col);
    });
  } else {
    galeria.innerHTML = `<p class="text-muted">Nenhuma imagem adicional disponível.</p>`;
  }
}

// Exibe mensagem de erro
function mostrarErro(mensagem) {
  document.body.innerHTML = `
    <div class="container text-center mt-5">
      <h2 class="text-danger">${mensagem}</h2>
      <a href="index.html" class="btn btn-dark mt-3">← Voltar</a>
    </div>
  `;
}
