package com.pucti2.gentec.dto;

import java.time.LocalTime;

public record FuncionarioPontoResumoDTO(
        Integer id_funcionario,
        String nome,
        String cargo,
        String nome_setor,
        LocalTime inicio_expediente,
        LocalTime fim_expediente,
        LocalTime horario_registro
) {
}
