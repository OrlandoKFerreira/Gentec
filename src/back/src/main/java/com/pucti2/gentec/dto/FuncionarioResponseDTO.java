package com.pucti2.gentec.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record FuncionarioResponseDTO(Integer id_funcionario,
                                     Integer id_setor,
                                     String nome_setor,
                                     Boolean eh_gestor,
                                     String nome,
                                     String email,
                                     String cpf,
                                     String cargo,
                                     LocalDate data_cadastro,
                                     LocalTime inicio_expediente,
                                     LocalTime fim_expediente) {}
