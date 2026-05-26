package com.pucti2.gentec.repository;

import com.pucti2.gentec.model.Funcionario;
import com.pucti2.gentec.model.RegistroPonto;
import com.pucti2.gentec.model.TipoRegistroPonto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface RegistroPontoRepository extends JpaRepository<RegistroPonto, Integer> {
    List<RegistroPonto> findByFuncionarioOrderByDataHoraDesc(Funcionario funcionario);

    List<RegistroPonto> findByFuncionarioAndTipoOrderByDataHoraDesc(Funcionario funcionario, TipoRegistroPonto tipo);

    List<RegistroPonto> findByFuncionarioAndDataHoraBetweenOrderByDataHoraDesc(
            Funcionario funcionario,
            LocalDateTime inicio,
            LocalDateTime fim
    );

    List<RegistroPonto> findByDataHoraBetweenOrderByDataHoraDesc(LocalDateTime inicio, LocalDateTime fim);

    long countByFuncionarioAndTipoAndDataHoraBetween(
            Funcionario funcionario,
            TipoRegistroPonto tipo,
            LocalDateTime inicio,
            LocalDateTime fim
    );

    List<RegistroPonto> findByTipoAndDataHoraBetween(
            TipoRegistroPonto tipo,
            LocalDateTime inicio,
            LocalDateTime fim
    );
}
