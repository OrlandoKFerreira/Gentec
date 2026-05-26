package com.pucti2.gentec.model;

import com.pucti2.gentec.dto.FuncionarioResponseDTO;
import jakarta.persistence.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDate;
import java.time.LocalTime;


@Entity
public class Funcionario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_funcionario;

    @ManyToOne
    @JoinColumn(name="id_setor")
    private Setor setor;
    private boolean eh_gestor;
    private String nome;
    private String email;
    private String cpf;
    private String senha;
    private String cargo;
    private LocalDate data_cadastro;
    private LocalTime inicio_expediente;
    private LocalTime fim_expediente;

    public Funcionario(Boolean eh_gestor,String nome,String email,String cpf,String senha,String cargo,
                       LocalTime inicio_expediente,LocalTime fim_expediente,Setor setor) {
        this.setor = setor;
        this.eh_gestor = eh_gestor;
        this.nome = nome;
        this.email = email;
        this.cpf = cpf;
        this.senha = senha;
        this.cargo = cargo;
        this.inicio_expediente = inicio_expediente;
        this.fim_expediente = fim_expediente;
        this.data_cadastro = LocalDate.now();
    }
    public Funcionario(){}

    public Integer getId_funcionario() {
        return id_funcionario;
    }

    public Setor getSetor() {
        return setor;
    }

    public void setSetor(Setor setor) {
        this.setor = setor;
    }

    public boolean isEh_gestor() {
        return eh_gestor;
    }

    public void setEh_gestor(Boolean eh_gestor) {
        this.eh_gestor = eh_gestor;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getCargo() {
        return cargo;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }

    public LocalDate getData_cadastro() {
        return data_cadastro;
    }

    public LocalTime getInicio_expediente() {
        return inicio_expediente;
    }

    public void setInicio_expediente(LocalTime inicio_expediente) {
        this.inicio_expediente = inicio_expediente;
    }

    public LocalTime getFim_expediente() {
        return fim_expediente;
    }

    public void setFim_expediente(LocalTime fim_expediente) {
        this.fim_expediente = fim_expediente;
    }

    public FuncionarioResponseDTO dto(){
        Integer id_setor = setor == null ? null : setor.dto().id_setor();
        String nome_setor = setor == null ? null : setor.dto().nome();
        return new FuncionarioResponseDTO(id_funcionario,id_setor,nome_setor,eh_gestor,nome,email,cpf,cargo,data_cadastro,inicio_expediente,fim_expediente);
    }

    public int login(String email,String senha,boolean eh_gestor) {
        if(this.eh_gestor != eh_gestor)
            return 403;
        if(!this.email.equals(email))
            return 404;
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        if(encoder.matches(senha,this.senha)) {
            return 200;
        } else {
            return 401;
        }

    }

}
