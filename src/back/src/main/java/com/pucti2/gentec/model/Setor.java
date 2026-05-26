package com.pucti2.gentec.model;

import com.pucti2.gentec.dto.SetorDTO;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Setor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_setor;
    private String nome;
    private String descricao;

    public Setor(String nome,String descricao) {
        this.nome = nome;
        this.descricao = descricao;
    }
    public Setor(){}

    public Integer getId_setor() {
        return id_setor;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public SetorDTO dto(){
        return new SetorDTO(id_setor,nome,descricao);
    }
}
