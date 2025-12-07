document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-cadastro");
  const msg = document.getElementById("mensagem");
  const URL_API = "/usuarios";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = form.nome.value.trim();
    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const senha = form.senha.value;
    const confirmar = form.confirmar.value;

    // validação de senha
    if (senha !== confirmar) {
      msg.textContent = "As senhas não coincidem!";
      msg.style.color = "red";
      return;
    }

    try {
      // verifica duplicidades
      const res = await fetch(URL_API);
      const usuarios = await res.json();

      if (usuarios.some(u => u.username === username)) {
        msg.textContent = "Nome de usuário já existe!";
        msg.style.color = "red";
        return;
      }

      if (usuarios.some(u => u.email === email)) {
        msg.textContent = "Email já cadastrado!";
        msg.style.color = "red";
        return;
      }

      // cria novo usuário
      const novoUsuario = { nome, username, email, senha };

      const salvar = await fetch(URL_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoUsuario)
      });

      if (!salvar.ok) throw new Error();

      msg.textContent = "Usuário cadastrado com sucesso!";
      msg.style.color = "green";

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1200);

    } catch (error) {
      msg.textContent = "Erro ao cadastrar. Tente novamente.";
      msg.style.color = "red";
    }
  });
});
