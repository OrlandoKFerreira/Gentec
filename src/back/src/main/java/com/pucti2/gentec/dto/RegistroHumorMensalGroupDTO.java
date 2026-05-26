package com.pucti2.gentec.dto;

import com.pucti2.gentec.model.TipoRegistroHumor;
import java.util.Map;

public record RegistroHumorMensalGroupDTO(int mes,
                                          int ano,
                                          Map<TipoRegistroHumor, Long> registros) {
}
