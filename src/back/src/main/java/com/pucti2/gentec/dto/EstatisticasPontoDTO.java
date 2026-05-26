package com.pucti2.gentec.dto;

import java.util.List;

public record EstatisticasPontoDTO(
        long total_funcionarios,
        long presentes_hoje,
        long atrasados,
        long atrasados_agora,
        long entradas_atrasadas_hoje,
        List<FuncionarioPontoResumoDTO> funcionarios_presentes,
        List<FuncionarioPontoResumoDTO> funcionarios_atrasados_agora,
        List<FuncionarioPontoResumoDTO> funcionarios_entradas_atrasadas
) {
}
