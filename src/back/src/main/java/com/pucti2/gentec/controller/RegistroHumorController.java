package com.pucti2.gentec.controller;

import com.pucti2.gentec.dto.RegistroHumorDTO;
import com.pucti2.gentec.dto.RegistroHumorRequestDTO;
import com.pucti2.gentec.model.RegistroHumor;
import com.pucti2.gentec.model.TipoRegistroHumor;
import com.pucti2.gentec.service.RegistroHumorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/humor")
public class RegistroHumorController {
    private final RegistroHumorService registroHumorService;

    public RegistroHumorController(RegistroHumorService registroHumorService) {
        this.registroHumorService = registroHumorService;
    }

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarHumor(
            @RequestBody RegistroHumorRequestDTO registro
    ) {
        return ResponseEntity.ok(registroHumorService.registrarHumor(registro.id_funcionario(), registro.humor(), registro.comentario()));
    }

    @GetMapping("/historico")
    public ResponseEntity<?> listarHistorico() {
        return ResponseEntity.ok(registroHumorService.listarHistorico());
    }

    @GetMapping("/historico-mensal")
    public ResponseEntity<?> listarHistoricoMensal() {
        return ResponseEntity.ok(registroHumorService.listarHistoricoMensal());
    }

    @GetMapping("/funcionario/{id}")
    public ResponseEntity<?> listarHistoricoDoFuncionario(@PathVariable Integer id) {
        return ResponseEntity.ok(registroHumorService.listarHistoricoDoFuncionario(id));
    }

    @GetMapping("/funcionario-hoje/{id}")
    public ResponseEntity<?> receberHumorFuncionarioHoje(@PathVariable Integer id) {
        RegistroHumor humorHoje = registroHumorService.encontrarHumorHoje(id);
        if (humorHoje == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(humorHoje.dto());
    }
}
