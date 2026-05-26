package com.pucti2.gentec.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record FuncionarioCreateDTO(
        Integer id_funcionario,
        Integer id_setor,
        Boolean eh_gestor,
        String nome,
        String email,
        String senha,
        String cpf,
        String cargo,
        LocalDate data_cadastro,
        LocalTime inicio_expediente,
        LocalTime fim_expediente) {
}
