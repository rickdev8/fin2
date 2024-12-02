
async function get() {
    const response = await fetch('https://api-1-v0r5.onrender.com/usuarios');
    if (!response.ok) {
      throw new Error('Erro ao obter os dados');
    }
    const dados = await response.json(); 
    return dados;
}

async function post(conta){
    await fetch('https://api-1-v0r5.onrender.com/usuarios', {
      
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify({ conta })  
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro na resposta da API');
        }
        return response.json();  
      })
      .catch(error => {
        console.error('Erro:', error); 
      });
  }

  function mostrarSenha(){
    const id = document.getElementById('senha')
    if(id.type == 'text'){
      id.type = "password"
    }
    else{
      id.type = "text"
    }

  }

  document.getElementById("cadastroForm").addEventListener("submit", cadastrarusuario, mostrarSenha);

  async function cadastrarusuario(event) {
    event.preventDefault();  
  
    const dados = await get();  

    function verificardados() {
      const nome = document.getElementById('nome').value;
      const idade = parseFloat(document.getElementById('idade').value);
      const sexo = document.getElementById('sexo').value;
      const senha = document.getElementById('senha').value;
    
      let conta = {
        nome: "",
        idade: null,
        sexo: "",
        senha: ""
      };
    
      // Verificando o nome
      if (typeof nome === "string" && nome.length > 3) {
        conta.nome = nome;
      } else {
        window.alert('Nome de usuário inválido!');
        return; 
      }
    
      if (idade > 18 && idade < 120) {
        conta.idade = idade;
      } else {
        window.alert('Idade de usuário inválida!');
        return; 
      }
  
      if (sexo) {
        conta.sexo = sexo;
      } else {
        window.alert('Sexo não informado!');
        return; 
      }
    
      if (senha.length > 4) {
        conta.senha = senha;
      } else {
        window.alert('Senha de usuário muito curta!');
        return; 
      }

      return conta;
    }
    
    const dadosconta = verificardados()
    let nomeExiste = false;
    if(dadosconta == undefined){
      return;
    } else {
    dados.forEach(dado => {
        if (dado.conta.nome === dadosconta.nome) {
          nomeExiste = true;  
    }});

    if (nomeExiste) {
      alert('Esse usuário já existe!');
      return; 
    } 
    window.alert('Conta criada com sucesso!')
    await post(dadosconta);  
  }

}

