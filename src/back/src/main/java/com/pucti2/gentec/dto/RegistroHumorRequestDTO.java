package com.pucti2.gentec.dto;

import com.pucti2.gentec.model.TipoRegistroHumor;

public record RegistroHumorRequestDTO(Integer id_funcionario, TipoRegistroHumor humor,String comentario) {
}
