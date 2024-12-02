async function get() {
    const response = await fetch('https://api-1-v0r5.onrender.com/usuarios');
    if (!response.ok) {
      throw new Error('Erro ao obter os dados');
    }
    const dados = await response.json(); 
    return dados;
  }

  function validardados(){
    const usuario = document.getElementById('name').value
    const senha = document.getElementById('senha').value; 
    if(usuario && senha !== ""){
        return {usuario: usuario, senha: senha}
    } else {
        window.alert("Verifique os dados e tente novamente!")
        return;
    }

  }



 async function logar(event) {
    event.preventDefault(); 
    const usuario = validardados().usuario
    const senha = validardados().senha
    let index = ''   

    try {

        const usuarios = await get();  
        let usuarioValido = false;

        for (let i = 0; i < usuarios.length; i++) {
            if (usuario === usuarios[i].conta.nome && senha === usuarios[i].conta.senha && typeof usuario === "string") {
                index = usuarios[i].id
                usuarioValido = true;
                logado = true
                break;
            }
        }
  
        if (usuarioValido) {
            usuariologado = true
            localStorage.setItem("usuario", usuario)
            localStorage.setItem("id", index)
            window.location.href = 'Pages/principal.html';  
        } else {
            alert('Usuário ou senha inválidos!');
        }
  
    } catch (error) {
        console.error('Erro:', error);
        alert('Houve um erro ao tentar fazer login. Tente novamente mais tarde.');
    }
  
  }
  
  document.getElementById('loginForm').addEventListener('submit', logar);