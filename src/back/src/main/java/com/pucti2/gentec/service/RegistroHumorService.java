package com.pucti2.gentec.service;

import com.pucti2.gentec.dto.RegistroHumorDTO;
import com.pucti2.gentec.dto.RegistroHumorMensalGroupDTO;
import com.pucti2.gentec.dto.RegistroHumorMensalRowDTO;
import com.pucti2.gentec.model.Funcionario;
import com.pucti2.gentec.model.RegistroHumor;
import com.pucti2.gentec.model.TipoRegistroHumor;
import com.pucti2.gentec.repository.FuncionarioRepository;
import com.pucti2.gentec.repository.RegistroHumorRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.EnumMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class RegistroHumorService {
    private final RegistroHumorRepository registroHumorRepository;
    private final FuncionarioRepository funcionarioRepository;

    public RegistroHumorService(
            RegistroHumorRepository registroHumorRepository,
            FuncionarioRepository funcionarioRepository
    ) {
        this.registroHumorRepository = registroHumorRepository;
        this.funcionarioRepository = funcionarioRepository;
    }

    public RegistroHumorDTO registrarHumor(Integer id_funcionario, TipoRegistroHumor humor, String comentario) {
        Funcionario funcionario = buscarFuncionario(id_funcionario);
        RegistroHumor registrado = encontrarHumorHoje(id_funcionario);

        if(registrado != null)
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Humor já registrado hoje.");

        return registroHumorRepository.save(new RegistroHumor(funcionario,humor,comentario)).dto();

    }

    public List<RegistroHumorDTO> listarHistorico() {
        return registroHumorRepository.findAllAsDTO();
    }
    public List<RegistroHumorMensalGroupDTO> listarHistoricoMensal() {
        List<RegistroHumorMensalRowDTO> registros = registroHumorRepository.findRegistroMensalDTO();
        Map<YearMonth,Map<TipoRegistroHumor,Long>> grouped = new LinkedHashMap<>();

        for (RegistroHumorMensalRowDTO registro : registros) {
            YearMonth ym = YearMonth.of(registro.ano(),registro.mes());
            grouped
                    .computeIfAbsent(ym,k-> new EnumMap<>(TipoRegistroHumor.class))
                    .put(registro.tipo(),registro.registros());
        }
        return grouped.entrySet()
                .stream()
                .map(entry -> new RegistroHumorMensalGroupDTO(
                        entry.getKey().getMonthValue(),
                        entry.getKey().getYear(),
                        entry.getValue()
                ))
                .toList();
    }
    public List<RegistroHumorDTO> listarHistoricoDoFuncionario(Integer id_funcionario) {
        Funcionario funcionario = buscarFuncionario(id_funcionario);
        return registroHumorRepository.findAllByFuncionario(funcionario.getId_funcionario());
    }

    private Funcionario buscarFuncionario(Integer id_funcionario) {
        if (id_funcionario == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Funcionário é obrigatório.");
        }

        return funcionarioRepository.findById(id_funcionario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário não encontrado."));
    }

    public RegistroHumor encontrarHumorHoje(Integer id_funcionario) {
        LocalDate hoje = LocalDate.now();
        Funcionario funcionario = buscarFuncionario(id_funcionario);
        return registroHumorRepository.findFirstByFuncionarioAndDataRegistro(funcionario,hoje);
    }
}
