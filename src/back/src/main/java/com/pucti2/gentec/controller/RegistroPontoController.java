package com.pucti2.gentec.controller;

import com.pucti2.gentec.dto.RegistroPontoRequestDTO;
import com.pucti2.gentec.service.RegistroPontoService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/pontos")
public class RegistroPontoController {
    private final RegistroPontoService registroPontoService;

    public RegistroPontoController(RegistroPontoService registroPontoService) {
        this.registroPontoService = registroPontoService;
    }

    @PostMapping("/entrada")
    public ResponseEntity<?> registrarEntrada(@RequestBody RegistroPontoRequestDTO dto) {
        return ResponseEntity.ok(registroPontoService.registrarEntrada(dto.id_funcionario()));
    }

    @PostMapping("/saida")
    public ResponseEntity<?> registrarSaida(@RequestBody RegistroPontoRequestDTO dto) {
        return ResponseEntity.ok(registroPontoService.registrarSaida(dto.id_funcionario()));
    }

    @GetMapping("/status")
    public ResponseEntity<?> consultarStatus(@RequestParam Integer id_funcionario) {
        return ResponseEntity.ok(registroPontoService.consultarStatus(id_funcionario));
    }

    @GetMapping("/historico")
    public ResponseEntity<?> listarHistorico(
            @RequestParam(required = false) Integer id_funcionario,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data_inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data_fim
    ) {
        return ResponseEntity.ok(registroPontoService.listarHistorico(id_funcionario, data_inicio, data_fim));
    }

    @GetMapping("/estatisticas")
    public ResponseEntity<?> gerarEstatisticas() {
        return ResponseEntity.ok(registroPontoService.gerarEstatisticas());
    }
}
