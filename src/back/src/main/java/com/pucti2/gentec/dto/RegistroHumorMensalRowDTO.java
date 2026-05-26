package com.pucti2.gentec.dto;

import com.pucti2.gentec.model.TipoRegistroHumor;

public record RegistroHumorMensalRowDTO(int mes,
                                        int ano,
                                        TipoRegistroHumor tipo,
                                        Long registros) {
}
