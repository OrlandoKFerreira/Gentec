package com.pucti2.gentec.dto;

import java.time.LocalDateTime;

public record StatusPontoDTO(
        Integer id_funcionario,
        LocalDateTime ultima_entrada,
        LocalDateTime ultima_saida,
        String status_atual
) {
}
