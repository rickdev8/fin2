async function get() {
  const response = await fetch('https://api-1-v0r5.onrender.com/usuarios');
  if (!response.ok) {
    throw new Error('Erro ao obter os dados');
  }
  const dados = await response.json();
  return dados;
}

const dadoss = get()
let radiovalue;

function radio(){
    const radios = document.querySelectorAll('input[name="option"]')
       radios.forEach((radio) => {
           radio.addEventListener('change', function() {
           radiovalue = this.value
})})}

function verificardados(){
  const descriptionvalue = document.getElementById('description').value;
  const valorvalue = parseFloat(document.getElementById('value').value);
  const datavalue = document.getElementById('date').value;

  let dados = {
    description: "",
    valor: 0,
    data: datavalue
  }

  if (typeof descriptionvalue === "string" && 
    descriptionvalue.trim() !== "" && 
    isNaN(descriptionvalue)) {
    dados.description = descriptionvalue;
   } else {
       window.alert("Insira uma descrição válida (não pode ser vazia nem conter números)!");
       return;
   }

  if(valorvalue > 0){
    dados.valor = valorvalue
  } else{
    window.alert('Insira um valor válido!')
    return;
  }
  return dados
}

async function adctransaction() {
  const transacoest = []
  const dados = verificardados()

  let transaction = {
    idtransaction: crypto.randomUUID(),
    tipo: '',
    total: 0,
    receita: 0,
    despesa: 0,
    categoria: "",
    tipo: '',
    descricao: dados.description,
    valor: 0,
    data: dados.data
  };

  let total = 0;
      if (radiovalue === 'entrada') {
        total += dados.valor;
        transaction.total = total;
        transaction.receita = dados.valor;
        transaction.tipo = 'Entrada';
        transaction.categoria = 'Receita'
      } else if (
        radiovalue === 'saida') {
        total -= dados.valor;
        transaction.total = total;
        transaction.despesa = dados.valor;
        transaction.tipo = 'Saída';
        transaction.categoria = 'Despesa'
      }

  transacoest.push(transaction);

    await edit(transacoest);
    await atualizartabela(); 
    await historico(); 
    await dadosretornados()
}

let contador = 0
async function edit(transacoest) {
  const id = await dadosretornados();
  const idf = id.ids;
  contador +=1

  const response = await fetch(`https://api-1-v0r5.onrender.com/usuarios/${idf}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ transacoest })
  });

  if (!response.ok) {
    throw new Error('Erro ao atualizar as transações no servidor');
  }
  return response.json(); 
}

async function dadosretornados() {
  const dados = await get();
  const ids = localStorage.getItem('id');
  let index;
  for (let i = 0; i < dados.length; i++) {
    if (dados[i].id === ids) {
      index = i;
      break; 
    }
  }

  const lista = dados[index].transacoes;
  return { lista: lista, ids: ids};
}



async function atualizartabela() {

  const lista = await dadosretornados();
  const transacoesfinais = lista.lista; 
  const valorreceita = document.getElementById('valorreceita');
  const valordespesa = document.getElementById('valordespesa');
  const valorfinal = document.getElementById('valorfinal');
  let final = 0;
  let receitas = 0;
  let despesas = 0;

  transacoesfinais.map((item) => {
    receitas += parseFloat(item.receita || 0);
    despesas += parseFloat(item.despesa || 0);
    total = parseFloat(item.total);
  });

  final = receitas - despesas;
  valorreceita.innerHTML = receitas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  valordespesa.innerHTML = despesas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  valorfinal.innerHTML = final.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  grafics(receitas, despesas); 
}


async function historico() {
 
  let data = new Date()
  let ano = data.getFullYear();
  let mes = String(data.getMonth() + 1).padStart(2, '0'); 
  let dia = String(data.getDate()).padStart(2, '0'); 

  let dataformatada = `${ano}-${mes}-${dia}`
  document.getElementById('date').value = dataformatada

  const lista = await dadosretornados();
  const transacoesfinais = lista.lista; 
  contarTransacoesPorMes();
  const tr = document.getElementById('tbody');
  let div = '';

  for (let i = 0; i < transacoesfinais.length; i++) {
    let valor = parseFloat(transacoesfinais[i].valor);
    if (isNaN(valor)) {
      valor = 0;
    }
    div += ` 
      <tr>               
        <td id="tipoh">${transacoesfinais[i].tipo}</td>                 
        <td id="desch">${transacoesfinais[i].descricao}</td>                   
        <td id="categh">${transacoesfinais[i].categoria}</td>                     
        <td id="valorh">${transacoesfinais[i].total}</td>               
        <td id="datah" class="income">${transacoesfinais[i].data} <button id="botao" onclick="remover(${i})" >apagar</button></td>
      </tr>`;
  }

  tr.innerHTML = div;
}

async function contarTransacoesPorMes() {
  const lista = await dadosretornados();
  const transacoesfinais = lista.lista;
  const resumoPorMes = new Array(12).fill(0);  

  transacoesfinais.forEach((transacao) => {
    const data = new Date(transacao.data); 
    const mes = data.getMonth(); 
    let valor = 0;

    if (transacao.receita > 0) {
      valor += transacao.receita;
    } else {
      valor -= transacao.despesa;
    }

    resumoPorMes[mes] += parseFloat(valor);  
  });
  return resumoPorMes;
}

document.addEventListener('DOMContentLoaded', async () => {
  radio()
  await atualizartabela();
  await historico();
  await dadosretornados();
  await get()

});

const ctx = document.getElementById('myChart')
const evo = document.getElementById('evo')

let pieChart = null;  
let lineChart = null;

async function grafics(receitas, despesas) {

  if (pieChart) {
    pieChart.destroy(); 
  }

  pieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Despesas', 'Receitas'],
      datasets: [{
        label: 'Distribuição',
        data: [despesas, receitas], 
        backgroundColor: [
          'rgb(255, 99, 132)', 
          'rgb(54, 162, 235)' 
        ],
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.label + ': ' + tooltipItem.raw + ' unidades';
            }
          }
        }
      }
    }
  });


  if (lineChart) {
    lineChart.destroy(); 
  }
  let resumomes = await  contarTransacoesPorMes()
  lineChart = new Chart(evo, {
    type: 'line',
    data: {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec'], // Labels para os meses
      datasets: [{
        label: 'Evolução de Receitas e Despesas',
        data: resumomes, 
        fill:false,
        backgroundColor: [
          'rgb(75, 192, 192)'
        ],
        tension: 0.1,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true 
        }
      }
    }
  });
}
