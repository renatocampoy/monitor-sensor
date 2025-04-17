package br.eng.campoy.monitorsensor.controller;


import br.eng.campoy.monitorsensor.entity.DadosSensor;
import br.eng.campoy.monitorsensor.repository.DadosSensorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/dados")
public class DadosSensorController {

    @Autowired
    private DadosSensorRepository repository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping
    public void receberDados(@RequestBody DadosSensor dados) {
        repository.save(dados);
        messagingTemplate.convertAndSend("/topic/dados", dados);
    }

    @GetMapping
    public List<DadosSensor> listarPorPeriodo(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim) {
        return repository.findByPeriodo(inicio, fim);
    }
}