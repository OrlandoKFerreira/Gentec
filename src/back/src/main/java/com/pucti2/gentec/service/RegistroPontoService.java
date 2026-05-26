package com.pucti2.gentec.service;

import com.pucti2.gentec.dto.EstatisticasPontoDTO;
import com.pucti2.gentec.dto.FuncionarioPontoResumoDTO;
import com.pucti2.gentec.dto.RegistroPontoResponseDTO;
import com.pucti2.gentec.dto.StatusPontoDTO;
import com.pucti2.gentec.model.Funcionario;
import com.pucti2.gentec.model.RegistroPonto;
import com.pucti2.gentec.model.TipoRegistroPonto;
import com.pucti2.gentec.repository.FuncionarioRepository;
import com.pucti2.gentec.repository.RegistroPontoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

@Service
public class RegistroPontoService {
    private final RegistroPontoRepository registroPontoRepository;
    private final FuncionarioRepository funcionarioRepository;

    public RegistroPontoService(
            RegistroPontoRepository registroPontoRepository,
            FuncionarioRepository funcionarioRepository
    ) {
        this.registroPontoRepository = registroPontoRepository;
        this.funcionarioRepository = funcionarioRepository;
    }

    public RegistroPontoResponseDTO registrarEntrada(Integer id_funcionario) {
        Funcionario funcionario = buscarFuncionario(id_funcionario);
        RegistroPonto ultimoRegistro = buscarUltimoRegistro(funcionario);

        if (ultimoRegistro != null && ultimoRegistro.getTipo() == TipoRegistroPonto.ENTRADA) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Funcionário já possui uma entrada aberta.");
        }

        return registroPontoRepository.save(new RegistroPonto(funcionario, TipoRegistroPonto.ENTRADA)).dto();
    }

    public RegistroPontoResponseDTO registrarSaida(Integer id_funcionario) {
        Funcionario funcionario = buscarFuncionario(id_funcionario);
        RegistroPonto ultimoRegistro = buscarUltimoRegistro(funcionario);

        if (ultimoRegistro == null || ultimoRegistro.getTipo() == TipoRegistroPonto.SAIDA) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Funcionário não possui entrada aberta.");
        }

        return registroPontoRepository.save(new RegistroPonto(funcionario, TipoRegistroPonto.SAIDA)).dto();
    }

    public StatusPontoDTO consultarStatus(Integer id_funcionario) {
        Funcionario funcionario = buscarFuncionario(id_funcionario);

        RegistroPonto ultimaEntrada = buscarUltimoRegistroPorTipo(funcionario, TipoRegistroPonto.ENTRADA);
        RegistroPonto ultimaSaida = buscarUltimoRegistroPorTipo(funcionario, TipoRegistroPonto.SAIDA);
        RegistroPonto ultimoRegistro = buscarUltimoRegistro(funcionario);

        String status = "FORA_DO_EXPEDIENTE";
        if (ultimoRegistro != null && ultimoRegistro.getTipo() == TipoRegistroPonto.ENTRADA) {
            status = "EM_EXPEDIENTE";
        }

        return new StatusPontoDTO(
                id_funcionario,
                ultimaEntrada == null ? null : ultimaEntrada.getDataHora(),
                ultimaSaida == null ? null : ultimaSaida.getDataHora(),
                status
        );
    }

    public List<RegistroPontoResponseDTO> listarHistorico(
            Integer id_funcionario,
            LocalDate data_inicio,
            LocalDate data_fim
    ) {
        LocalDate inicio = data_inicio == null ? LocalDate.now().minusMonths(1) : data_inicio;
        LocalDate fim = data_fim == null ? LocalDate.now() : data_fim;

        if (fim.isBefore(inicio)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Data fim não pode ser anterior à data início.");
        }

        LocalDateTime inicioPeriodo = inicio.atStartOfDay();
        LocalDateTime fimPeriodo = fim.atTime(LocalTime.MAX);

        List<RegistroPonto> registros;
        if (id_funcionario == null) {
            registros = registroPontoRepository.findByDataHoraBetweenOrderByDataHoraDesc(inicioPeriodo, fimPeriodo);
        } else {
            Funcionario funcionario = buscarFuncionario(id_funcionario);
            registros = registroPontoRepository.findByFuncionarioAndDataHoraBetweenOrderByDataHoraDesc(
                    funcionario,
                    inicioPeriodo,
                    fimPeriodo
            );
        }

        return registros.stream().map(RegistroPonto::dto).toList();
    }

    public EstatisticasPontoDTO gerarEstatisticas() {
        LocalDate hoje = LocalDate.now();
        LocalDateTime inicioHoje = hoje.atStartOfDay();
        LocalDateTime fimHoje = hoje.atTime(LocalTime.MAX);
        LocalTime agora = LocalTime.now();

        List<Funcionario> funcionarios = funcionarioRepository.findAll();

        List<Integer> idsPresentesHoje = registroPontoRepository.findByTipoAndDataHoraBetween(TipoRegistroPonto.ENTRADA, inicioHoje, fimHoje)
                .stream()
                .map(registro -> registro.getFuncionario().getId_funcionario())
                .filter(Objects::nonNull)
                .distinct()
                .toList();
        List<FuncionarioPontoResumoDTO> funcionariosPresentes = funcionarios.stream()
                .filter(funcionario -> idsPresentesHoje.contains(funcionario.getId_funcionario()))
                .map(funcionario -> criarResumo(funcionario, primeiraEntradaDoDia(funcionario, inicioHoje, fimHoje).orElse(null)))
                .toList();
        List<FuncionarioPontoResumoDTO> funcionariosAtrasadosAgora = funcionarios.stream()
                .filter(funcionario -> funcionario.getInicio_expediente() != null)
                .filter(funcionario -> funcionario.getInicio_expediente().isBefore(agora))
                .filter(funcionario -> primeiraEntradaDoDia(funcionario, inicioHoje, fimHoje).isEmpty())
                .map(funcionario -> criarResumo(funcionario, null))
                .toList();
        List<FuncionarioPontoResumoDTO> funcionariosEntradasAtrasadas = funcionarios.stream()
                .filter(funcionario -> funcionario.getInicio_expediente() != null)
                .map(funcionario -> primeiraEntradaDoDia(funcionario, inicioHoje, fimHoje)
                        .filter(registro -> registro.getDataHora().toLocalTime().isAfter(funcionario.getInicio_expediente()))
                        .map(registro -> criarResumo(funcionario, registro))
                        .orElse(null))
                .filter(Objects::nonNull)
                .toList();
        return new EstatisticasPontoDTO(
                funcionarios.size(),
                funcionariosPresentes.size(),
                funcionariosAtrasadosAgora.size(),
                funcionariosAtrasadosAgora.size(),
                funcionariosEntradasAtrasadas.size(),
                funcionariosPresentes,
                funcionariosAtrasadosAgora,
                funcionariosEntradasAtrasadas
        );
    }

    private FuncionarioPontoResumoDTO criarResumo(Funcionario funcionario, RegistroPonto registro) {
        return new FuncionarioPontoResumoDTO(
                funcionario.getId_funcionario(),
                funcionario.getNome(),
                funcionario.getCargo(),
                funcionario.getSetor() == null ? null : funcionario.getSetor().getNome(),
                funcionario.getInicio_expediente(),
                funcionario.getFim_expediente(),
                registro == null ? null : registro.getDataHora().toLocalTime()
        );
    }

    private java.util.Optional<RegistroPonto> primeiraEntradaDoDia(
            Funcionario funcionario,
            LocalDateTime inicioHoje,
            LocalDateTime fimHoje
    ) {
        return registroPontoRepository.findByFuncionarioAndDataHoraBetweenOrderByDataHoraDesc(
                        funcionario,
                        inicioHoje,
                        fimHoje
                )
                .stream()
                .filter(registro -> registro.getTipo() == TipoRegistroPonto.ENTRADA)
                .min(Comparator.comparing(RegistroPonto::getDataHora));
    }

    private Funcionario buscarFuncionario(Integer id_funcionario) {
        if (id_funcionario == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Funcionário é obrigatório.");
        }

        return funcionarioRepository.findById(id_funcionario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário não encontrado."));
    }

    private RegistroPonto buscarUltimoRegistro(Funcionario funcionario) {
        return registroPontoRepository.findByFuncionarioOrderByDataHoraDesc(funcionario)
                .stream()
                .findFirst()
                .orElse(null);
    }

    private RegistroPonto buscarUltimoRegistroPorTipo(Funcionario funcionario, TipoRegistroPonto tipo) {
        return registroPontoRepository.findByFuncionarioAndTipoOrderByDataHoraDesc(funcionario, tipo)
                .stream()
                .findFirst()
                .orElse(null);
    }
}
