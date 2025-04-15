let chartTemp, chartUmid;

async function buscarDados(auto = false) {
  let inicio = document.getElementById('inicio').value;
  let fim = document.getElementById('fim').value;

  if (!auto && (!inicio || !fim)) return alert("Preencha o período!");

  if (auto || (!inicio && !fim)) {
    const now = new Date();
    fim = now.toISOString().slice(0, 16);
    now.setHours(now.getHours() - 6);
    inicio = now.toISOString().slice(0, 16);
    document.getElementById('inicio').value = inicio;
    document.getElementById('fim').value = fim;
  }

  const res = await fetch(`/api/dados?inicio=${inicio}&fim=${fim}`);
  const dados = await res.json();

  const labels = dados.map(d => d.dataHora.replace("T", " "));
  const temp = dados.map(d => d.temperatura);
  const umid = dados.map(d => d.umidade);

  document.getElementById("card-temp").innerHTML = `<strong>Temperatura:</strong> ${temp.at(-1)} °C`;
  document.getElementById("card-umid").innerHTML = `<strong>Umidade:</strong> ${umid.at(-1)} %`;

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

// Chamada inicial
buscarDados(true);

// Atualiza a cada 5 minutos
setInterval(() => buscarDados(true), 300000);