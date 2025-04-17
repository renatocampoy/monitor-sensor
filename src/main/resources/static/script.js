let chartTemp, chartUmid;
let labels = [], temp = [], umid = [];

async function buscarDados(auto = false) {

  const now = new Date();
  document.getElementById("ultima-atualizacao").textContent = now.toLocaleString();

  let inicio = document.getElementById('inicio').value;
  let fim = document.getElementById('fim').value;

  if (!auto && (!inicio || !fim)) {
    alert("Preencha o período!");
    return;
  }

  if (auto || (!inicio && !fim)) {
    const now = new Date();
    fim = now.toISOString().slice(0, 16);
    now.setHours(now.getHours() - 6);
    inicio = now.toISOString().slice(0, 16);
    document.getElementById('inicio').value = inicio;
    document.getElementById('fim').value = fim;
  }

  try {
    const res = await fetch(`/api/dados?inicio=${inicio}&fim=${fim}`);
    const dados = await res.json();

    labels = dados.map(d => d.dataHora.replace("T", " "));
    temp = dados.map(d => d.temperatura);
    umid = dados.map(d => d.umidade);

    atualizarInterfaceComDados(labels, temp, umid);
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
  }
}

function atualizarInterfaceComDados(labels, temp, umid) {
  const ultimaTemp = temp[temp.length - 1] ?? '--';
  const ultimaUmid = umid[umid.length - 1] ?? '--';

  document.getElementById("card-temp").innerHTML = `<strong>Temperatura:</strong> ${ultimaTemp} °C`;
  document.getElementById("card-umid").innerHTML = `<strong>Umidade:</strong> ${ultimaUmid} %`;

  if (chartTemp) chartTemp.destroy();
  if (chartUmid) chartUmid.destroy();

  chartTemp = new Chart(document.getElementById("graficoTemp"), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: "Temperatura (°C)",
        data: temp,
        borderWidth: 2,
        fill: false,
        borderColor: 'rgba(0,123,255,1)',
        pointRadius: 4
      }]
    }
  });

  chartUmid = new Chart(document.getElementById("graficoUmid"), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: "Umidade (%)",
        data: umid,
        borderWidth: 2,
        fill: false,
        borderColor: 'rgba(0,200,100,1)',
        pointRadius: 4
      }]
    }
  });
}

// Atualiza interface em tempo real com WebSocket
function atualizarInterfaceComNovoDado(dado) {
  const novaData = dado.dataHora.replace("T", " ");
  labels.push(novaData);
  temp.push(dado.temperatura);
  umid.push(dado.umidade);

  if (labels.length > 100) { // Limita histórico local
    labels.shift();
    temp.shift();
    umid.shift();
  }

  atualizarInterfaceComDados(labels, temp, umid);
}

// WebSocket setup
const socket = new SockJS('/ws');
const stompClient = Stomp.over(socket);

stompClient.connect({}, () => {
  stompClient.subscribe('/topic/dados', message => {
    const dados = JSON.parse(message.body);
    atualizarInterfaceComNovoDado(dados);
  });
});

// Carrega dados iniciais
setTimeout(() => buscarDados(true), 500);
