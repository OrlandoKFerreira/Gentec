package com.pucti2.gentec.dto;

import com.pucti2.gentec.model.TipoRegistroHumor;

import java.time.LocalDate;

public record RegistroHumorDTO (Integer id_registro_humor,
                               Integer id_funcionario,
                               TipoRegistroHumor humor,
                               String comentario,
                               LocalDate dataRegistro){
}
