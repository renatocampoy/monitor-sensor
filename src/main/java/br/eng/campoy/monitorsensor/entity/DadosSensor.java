package br.eng.campoy.monitorsensor.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "dados_sensor")
public class DadosSensor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal temperatura;
    private BigDecimal umidade;

    @Column(name = "data_hora", nullable = false, updatable = false)
    private LocalDateTime dataHora = LocalDateTime.now();

    public Long getId() { return id; }
    public BigDecimal getTemperatura() { return temperatura; }
    public void setTemperatura(BigDecimal temperatura) { this.temperatura = temperatura; }
    public BigDecimal getUmidade() { return umidade; }
    public void setUmidade(BigDecimal umidade) { this.umidade = umidade; }
    public LocalDateTime getDataHora() { return dataHora; }
}