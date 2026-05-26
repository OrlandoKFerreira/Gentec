package com.pucti2.gentec.model;

import com.pucti2.gentec.dto.RegistroPontoResponseDTO;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.time.LocalDateTime;

@Entity
public class RegistroPonto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_registro_ponto;

    @ManyToOne
    @JoinColumn(name = "id_funcionario")
    private Funcionario funcionario;

    @Enumerated(EnumType.STRING)
    private TipoRegistroPonto tipo;

    @Column(name = "data_hora")
    private LocalDateTime dataHora;

    public RegistroPonto(Funcionario funcionario, TipoRegistroPonto tipo) {
        this.funcionario = funcionario;
        this.tipo = tipo;
        this.dataHora = LocalDateTime.now();
    }

    public RegistroPonto() {
    }

    public Integer getId_registro_ponto() {
        return id_registro_ponto;
    }

    public Funcionario getFuncionario() {
        return funcionario;
    }

    public TipoRegistroPonto getTipo() {
        return tipo;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public LocalDateTime getData_hora() {
        return dataHora;
    }

    public RegistroPontoResponseDTO dto() {
        return new RegistroPontoResponseDTO(
                id_registro_ponto,
                funcionario.getId_funcionario(),
                funcionario.getNome(),
                tipo,
                dataHora
        );
    }
}
