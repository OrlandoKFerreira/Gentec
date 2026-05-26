package com.pucti2.gentec.repository;
import com.pucti2.gentec.dto.RegistroHumorDTO;
import com.pucti2.gentec.dto.RegistroHumorMensalRowDTO;
import com.pucti2.gentec.model.Funcionario;
import com.pucti2.gentec.model.RegistroHumor;
import com.pucti2.gentec.model.TipoRegistroHumor;
import org.springframework.cglib.core.Local;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface RegistroHumorRepository extends JpaRepository<RegistroHumor, Integer> {
    
    List<RegistroHumor> findByFuncionarioOrderByDataRegistroDesc(Funcionario funcionario);

    List<RegistroHumor> findRegistroHumorByDataRegistro(LocalDate data);

    List<RegistroHumor> findByFuncionarioAndHumorOrderByDataRegistroDesc(Funcionario funcionario, TipoRegistroHumor humor);

    List<RegistroHumor> findByFuncionarioAndDataRegistroBetweenOrderByDataRegistroDesc(
            Funcionario funcionario,
            LocalDate inicio,
            LocalDate fim
    );

    @Query("SELECT new com.pucti2.gentec.dto.RegistroHumorDTO(r.id_registro_humor," +
                                                             "r.funcionario.id_funcionario," +
                                                             "r.humor," +
                                                             "r.comentario," +
                                                             "r.dataRegistro) FROM RegistroHumor r")
    List<RegistroHumorDTO> findAllAsDTO();

    @Query("SELECT new com.pucti2.gentec.dto.RegistroHumorMensalRowDTO(MONTH(r.dataRegistro)," +
                                                                      "YEAR(r.dataRegistro)," +
                                                                      "r.humor," +
                                                                      "COUNT(*))" +
                                                                      "FROM RegistroHumor r " +
                                                                      "GROUP BY MONTH(r.dataRegistro),YEAR(r.dataRegistro),r.humor")
    List<RegistroHumorMensalRowDTO> findRegistroMensalDTO();

    @Query("SELECT new com.pucti2.gentec.dto.RegistroHumorDTO(r.id_registro_humor," +
            "r.funcionario.id_funcionario," +
            "r.humor," +
            "r.comentario," +
            "r.dataRegistro) FROM RegistroHumor r " +
            "WHERE r.funcionario.id_funcionario = :id_funcionario")
    List<RegistroHumorDTO> findAllByFuncionario(@Param("id_funcionario") int id_funcionario);

    RegistroHumor findFirstByFuncionarioAndDataRegistro(Funcionario funcionario,LocalDate data);

}
