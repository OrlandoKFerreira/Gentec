package com.pucti2.gentec.dto;

import com.pucti2.gentec.model.TipoRegistroPonto;

import java.time.LocalDateTime;

public record RegistroPontoResponseDTO(
        Integer id_registro_ponto,
        Integer id_funcionario,
        String nome_funcionario,
        TipoRegistroPonto tipo,
        LocalDateTime data_hora
) {
}
