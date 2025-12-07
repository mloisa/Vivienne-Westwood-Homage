document.addEventListener("DOMContentLoaded", () => {

  // Usuário padrão
  if (!localStorage.getItem("usuarios")) {
    const padrao = [{ user: "admin", senha: "123" }];
    localStorage.setItem("usuarios", JSON.stringify(padrao));
  }

  const btnEntrar = document.getElementById("entrar");
  const inputUser = document.getElementById("user");
  const inputSenha = document.getElementById("senha");
  const linkCadastro = document.getElementById("cadastrar");
  const btnPostar = document.querySelector(".publish");

  function verificarLogin() {
    const logado = localStorage.getItem("logado");
    const nomeUsuario = localStorage.getItem("usuarioLogado");

    if (logado === "true") {
      document.querySelectorAll("label").forEach(label => label.style.display = "none");
      btnPostar.style.display = "block";
      inputUser.value = nomeUsuario;
      inputUser.setAttribute("readonly", true);
      inputSenha.style.display = "none";
      btnEntrar.textContent = "Sair";
      btnEntrar.onclick = () => {
        localStorage.removeItem("logado");
        localStorage.removeItem("usuarioLogado");
        location.reload();
      };
      linkCadastro.style.display = "none";
      linkCadastro.href = "#";
    } else {
      btnPostar.style.display = "none";
      inputSenha.style.display = "block";
      inputUser.removeAttribute("readonly");
      btnEntrar.disabled = false;
      btnEntrar.textContent = "Entrar";
      linkCadastro.textContent = "Cadastre-se!";
    }
  }

  verificarLogin();

  btnEntrar.addEventListener("click", function (e) {
    e.preventDefault();
    const userDigitado = inputUser.value.trim();
    const senhaDigitada = inputSenha.value.trim();
    const usuarios = JSON.parse(localStorage.getItem("usuarios"));
    const encontrado = usuarios.find(u => u.user === userDigitado && u.senha === senhaDigitada);

    if (encontrado) {
      alert("Login realizado com sucesso!");
      localStorage.setItem("logado", "true");
      localStorage.setItem("usuarioLogado", encontrado.user);
      verificarLogin();
    } else {
      alert("Usuário ou senha incorretos.");
    }
  });

});
