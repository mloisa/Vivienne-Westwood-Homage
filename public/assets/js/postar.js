document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("form-colecao");
  const mensagem = document.getElementById("mensagem");
  const formTitulo = document.getElementById("form-titulo");
  const URL_API = '/colecoes';
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");

  // Função para gerar ID único
  function gerarId() {
    return crypto.randomUUID();
  }

  let colecaoExistente = null;

  if (postId) {
    formTitulo.textContent = "Editar Coleção";

    try {
      const response = await fetch(`${URL_API}/${postId}`);
      if (!response.ok) throw new Error("Coleção não encontrada");

      colecaoExistente = await response.json();

      form.titulo.value = colecaoExistente.titulo;
      form.conteudo.value = colecaoExistente.conteudo;
      form.fotoPost.value = colecaoExistente.imagem_principal;
      form.destaque.checked = colecaoExistente.destaque;
    } catch (error) {
      mensagem.textContent = "Erro ao carregar coleção para edição.";
      mensagem.style.color = "red";
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const imagem = form.fotoPost.value || "./assets/imagens/default.jpg";

    // Se for edição, mantém o id existente; se for novo, gera um id
    const novoPost = {
      id: colecaoExistente ? colecaoExistente.id : gerarId(),
      titulo: form.titulo.value,
      descricao: form.conteudo.value.substring(0, 100) + "...",
      conteudo: form.conteudo.value,
      categoria: "Coleções destaque",
      destaque: form.destaque.checked,
      data: new Date().toISOString().split("T")[0],
      imagem_principal: imagem,
      imagens_complementares: [{ src: imagem }]
    };

    try {
      let response;

      if (postId) {
        // Edição
        response = await fetch(`${URL_API}/${postId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(novoPost)
        });
      } else {
        // Criação
        response = await fetch(URL_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(novoPost)
        });
      }

      if (!response.ok) throw new Error();

      mensagem.textContent = postId ? "Coleção atualizada com sucesso!" : "Coleção criada com sucesso!";
      mensagem.style.color = "green";
      form.reset();

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);

    } catch (error) {
      console.error(error);
      mensagem.textContent = "Erro ao salvar coleção. Tente novamente.";
      mensagem.style.color = "red";
    }
  });
});
