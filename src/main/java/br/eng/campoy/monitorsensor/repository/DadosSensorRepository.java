package br.eng.campoy.monitorsensor.repository;

import br.eng.campoy.monitorsensor.entity.DadosSensor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface DadosSensorRepository extends JpaRepository<DadosSensor, Long> {
    @Query("SELECT d FROM DadosSensor d WHERE d.dataHora BETWEEN :inicio AND :fim ORDER BY d.dataHora")
    List<DadosSensor> findByPeriodo(@Param("inicio") LocalDateTime inicio, @Param("fim") LocalDateTime fim);
}