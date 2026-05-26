package com.pucti2.gentec.model;
import com.pucti2.gentec.dto.RegistroHumorDTO;
import jakarta. persistence.*;
import java.time.LocalDate;

@Entity
public class RegistroHumor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer id_registro_humor;

    @ManyToOne
    @JoinColumn(name="id_funcionario")
    private Funcionario funcionario;;

    @Enumerated(EnumType.STRING)
    private TipoRegistroHumor humor;

    private String comentario;

    @Column(name="data_registro")
    private LocalDate dataRegistro;

    public RegistroHumor(Funcionario funcionario, TipoRegistroHumor humor, String comentario) {
        this.funcionario = funcionario;
        this.humor = humor;
        this.comentario = comentario;
        this.dataRegistro = LocalDate.now();
    }

    public RegistroHumor() {}

    public Integer getId_registro_humor() {
        return id_registro_humor;
    }
    public Funcionario getFuncionario() {
        return funcionario;
    }
     public void setFuncionario(Funcionario funcionario) {
        this.funcionario = funcionario;
    }

    public TipoRegistroHumor getHumor() {
        return humor;
    }

    public void setHumor(TipoRegistroHumor humor) {
        this.humor = humor;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public LocalDate getDataRegistro() {
        return dataRegistro;
    }

    public RegistroHumorDTO dto(){
        return new RegistroHumorDTO(id_registro_humor,funcionario.getId_funcionario(),humor,comentario, dataRegistro);
    }

}
