# Monitor de Sensores Ambientais

Sistema completo para monitoramento remoto de sensores ambientais (temperatura e umidade), com backend em Spring Boot, frontend web dinâmico em JavaScript e firmware integrado para microcontroladores como o ESP32.

![Placa e Sensores - Exemplo de Hardware](https://raw.githubusercontent.com/renatocampoy/monitor-sensor/refs/heads/main/images/cloud_board_f.jpg)

---

## Índice

- [Descrição](#descrição)
- [Arquitetura](#arquitetura)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação e Execução](#instalação-e-execução)
- [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
- [Configuração e Deploy do Firmware](#configuração-e-deploy-do-firmware)
- [Utilização](#utilização)
- [API](#api)
- [WebSocket](#websocket)
- [Possíveis Expansões](#possíveis-expansões)
- [Licença](#licença)

---

## Descrição

O projeto **Monitor de Sensores Ambientais** foi desenvolvido para aquisição, armazenamento e visualização, em tempo real e de forma histórica, de dados coletados por sensores ambientais de temperatura e umidade.

- **Firmware embarcado** em microcontrolador realiza a leitura dos sensores e envia dados ao backend via HTTP.
- **Backend em Spring Boot** armazena e fornece dados via API REST, além de suportar atualização em tempo real via WebSocket.
- **Frontend Web** exibe dashboards em tempo real, gráficos históricos e informações detalhadas das medidas.

---

## Arquitetura

[Firmware (ESP32) + Sensores] │ (POST /api/dados) ▼ [Backend Spring Boot + MySQL] │ (REST/WebSocket) ▼ [Frontend Web]

- **Comunicação HTTP**: Firmware → Backend (envio dos dados).
- **API REST**: Backend → Frontend (consulta de períodos de dados).
- **WebSocket (STOMP/SockJS)**: Backend → Frontend (dados em tempo real).

---

## Funcionalidades

- Recebimento e persistência de dados de sensores ambientais.
- Consulta de dados históricos filtrando por períodos.
- Dashboards dinâmicos com gráficos interativos.
- Atualização em tempo real das medições (WebSocket).
- Interface amigável e responsiva para uso em desktop e dispositivos móveis.

---

## Tecnologias Utilizadas

- **Backend**: Java 17, Spring Boot, Spring Data JPA, Spring Web, Spring WebSocket, MySQL, Lombok
- **Frontend**: HTML5, CSS3, JavaScript, Chart.js, STOMP.js, SockJS
- **Firmware**: C++ (Arduino)/ESP32, Bibliotecas: WiFi, HTTPClient, Adafruit_AHTX0, SparkFun_ENS160, WiFiManager

---

## Instalação e Execução

### Backend

1. **Pré-requisitos**: Java 17, Maven, MySQL
2. **Clone o projeto**:

   ```bash
   git clone https://github.com/seu-usuario/monitor-sensor.git
   cd monitor-sensor
   ```

3. **Configure o banco de dados** no arquivo `src/main/resources/application.properties`:

   ```
   spring.datasource.url=jdbc:mysql://localhost:3306/sensores
   spring.datasource.username=<usuario>
   spring.datasource.password=<senha>
   ```

4. **Compile e execute**:

   ```bash
   ./mvnw spring-boot:run
   ```

5. O backend estará disponível por padrão em http://localhost:8080

### Frontend

- Localizado na pasta `src/main/resources/static` (ou similar - ajustar conforme customização).
- Pode ser acessado diretamente pelo navegador ao subir o backend.

### Banco de Dados

Certifique-se de que o banco de dados MySQL está rodando e acessível de acordo com a configuração do backend.

### Firmware

1. **Configuração**:
    - Altere o endereço do backend no firmware para apontar corretamente para a API REST.
    - Carregue o código no ESP32 utilizando Arduino IDE ou plataforma similar.

2. **Funcionamento**:
    - O dispositivo irá se conectar ao WiFi e enviar os dados periodicamente conforme programação do firmware.

---

## Utilização

1. Acesse a interface web do sistema.
2. Visualize gráficos em tempo real e valores atuais de temperatura/umidade.
3. Selecione períodos para análises históricas das medições.
4. Novos dados aparecem automaticamente na interface, sem recarregar a página.

---

## API

- **POST /api/dados**  
  Consome dados JSON de medições de temperatura e umidade enviados pelo firmware.
- **GET /api/dados?inicio={data}&fim={data}**  
  Permite consulta de medições no período informado.

Os detalhes completos dos endpoints podem ser consultados na documentação de código ou acessando o backend.

---

## WebSocket

- Subscribe no tópico `/topic/dados` para receber novas medições em tempo real.
- O frontend conecta automaticamente e integra as notificações aos gráficos e painéis.

---

## Possíveis Expansões

- Inclusão de novos tipos de sensores (gases, pressão, luminosidade etc).
- Exibição de alertas para valores fora dos limites.
- Exportação de dados em CSV/Excel.
- Usuários com permissões diferenciadas e autenticação.
- Deploy em nuvem ou integração com dashboards empresariais.

---

## Licença

Este projeto é de código aberto e está disponível sob a licença [MIT](LICENSE).

---
