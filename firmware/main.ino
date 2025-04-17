#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiManager.h>
#include <Wire.h>
#include <Adafruit_AHTX0.h>
#include <SparkFun_ENS160.h>

#define INTERVALO_ENVIO 300000 // 5 minutos

Adafruit_AHTX0 aht;
SparkFun_ENS160 ens160;
unsigned long lastSendTime = 0;
String serverUrl = "http://191.252.38.247:8080/api/dados"; // Altere para seu IP

void enviarDados(float temperatura, float umidade) {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");

  String payload = "{\"temperatura\":";
  payload += temperatura;
  payload += ",\"umidade\":";
  payload += umidade;
  payload += "}";

  int httpCode = http.POST(payload);
  Serial.printf("Dados enviados! Código HTTP: %d\n", httpCode);
  http.end();
}

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22);
  delay(500);

  // Inicializa sensores
  if (!aht.begin(&Wire)) {
    Serial.println("Erro ao iniciar AHT20.");
    while (1) delay(10);
  }

  if (!ens160.begin(Wire)) {
    Serial.println("Erro ao iniciar ENS160.");
    while (1) delay(10);
  }

  ens160.setOperatingMode(SFE_ENS160_STANDARD);

  // Inicia WiFiManager
  WiFiManager wm;
  bool conectado = wm.autoConnect("MODULO_TEMP_UMID");

  if (!conectado) {
    Serial.println("Falha na conexão. Reiniciando...");
    delay(3000);
    ESP.restart();
  }

  Serial.print("Conectado no WiFi! IP: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  if (WiFi.status() == WL_CONNECTED && millis() - lastSendTime > INTERVALO_ENVIO) {
    sensors_event_t humidity, temp;
    aht.getEvent(&humidity, &temp);

    enviarDados(temp.temperature, humidity.relative_humidity);
    lastSendTime = millis();
  }
}