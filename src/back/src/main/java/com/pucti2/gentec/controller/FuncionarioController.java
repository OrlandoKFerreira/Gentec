package com.pucti2.gentec.controller;

import com.pucti2.gentec.dto.FuncionarioCreateDTO;
import com.pucti2.gentec.dto.FuncionarioLoginDTO;
import com.pucti2.gentec.model.Funcionario;
import com.pucti2.gentec.model.Setor;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.PersistenceUnit;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/funcionarios")
public class FuncionarioController {
    @PersistenceUnit
    private EntityManagerFactory emf;

    @PostMapping
    public ResponseEntity<?> cadastrarFuncionario(@RequestBody FuncionarioCreateDTO dto) {
        if (senhaInvalida(dto.senha())) {
            return ResponseEntity.badRequest().body("A senha deve ter no mínimo 8 caracteres.");
        }

        EntityManager manager = emf.createEntityManager();
        try {
            Setor setor = manager.find(Setor.class,dto.id_setor());
            if (setor == null)
                return ResponseEntity.badRequest().body("Setor não encontrado");
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            Funcionario novo = new Funcionario(
                    dto.eh_gestor(),
                    dto.nome(),
                    dto.email(),
                    dto.cpf(),
                    encoder.encode(dto.senha()),
                    dto.cargo(),
                    dto.inicio_expediente(),
                    dto.fim_expediente(),
                    setor);
            manager.getTransaction().begin();
            manager.persist(novo);
            manager.getTransaction().commit();
            return ResponseEntity.ok().build();
        } finally {
            if (manager.getTransaction().isActive())
                manager.getTransaction().rollback();
            manager.close();
        }
    }

    @GetMapping("/{id_funcionario}")
    public ResponseEntity<?> localizarFuncionario(@PathVariable int id_funcionario){
        EntityManager manager = emf.createEntityManager();
        try {
            Funcionario funcionario = manager.find(Funcionario.class,id_funcionario);
            if(funcionario == null)
                return ResponseEntity.notFound().build();
            return ResponseEntity.ok(funcionario.dto());
        } finally {
            manager.close();
        }
    }

    @PutMapping("/{id_funcionario}")
    public ResponseEntity<?> atualizarFuncionario(@PathVariable int id_funcionario,@RequestBody FuncionarioCreateDTO dto) {
        EntityManager manager = emf.createEntityManager();
        manager.getTransaction().begin();
        Funcionario funcionario = manager.find(Funcionario.class,id_funcionario);
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        if (funcionario == null)
            return ResponseEntity.notFound().build();
        if (dto.eh_gestor() != null) funcionario.setEh_gestor(dto.eh_gestor());
        if (dto.nome() != null) funcionario.setNome(dto.nome());
        if (dto.email() != null) funcionario.setEmail(dto.email());
        if (dto.cpf() != null) funcionario.setCpf(dto.cpf());
        if (dto.senha() != null) funcionario.setSenha(encoder.encode(dto.senha()));
        if (dto.cargo() != null) funcionario.setCargo(dto.cargo());
        if (dto.inicio_expediente() != null) funcionario.setInicio_expediente(dto.inicio_expediente());
        if (dto.fim_expediente() != null) funcionario.setFim_expediente(dto.fim_expediente());
        if (dto.id_setor() != null){
            Setor setor = manager.find(Setor.class,dto.id_setor());
            funcionario.setSetor(setor);
        }
        manager.merge(funcionario);
        manager.getTransaction().commit();
        manager.close();
        return ResponseEntity.ok(funcionario.dto());
    }

    @DeleteMapping("/{id_funcionario}")
    public ResponseEntity<?> excluirFuncionario(@PathVariable int id_funcionario) {
        EntityManager manager = emf.createEntityManager();
        try {
            Funcionario funcionario = manager.find(Funcionario.class,id_funcionario);
            if (funcionario == null)
                return ResponseEntity.notFound().build();
            manager.getTransaction().begin();
            manager.remove(funcionario);
            manager.getTransaction().commit();
            return ResponseEntity.noContent().build();
        } finally {
            if (manager.getTransaction().isActive())
                manager.getTransaction().rollback();
            manager.close();
        }
    }
    
    @GetMapping
public ResponseEntity<?> listarFuncionarios() {
    EntityManager manager = emf.createEntityManager();
    try {
        var funcionarios = manager
                .createQuery("SELECT f FROM Funcionario f", Funcionario.class)
                .getResultList()
                .stream()
                .map(Funcionario::dto)
                .toList();

        return ResponseEntity.ok(funcionarios);
    } finally {
        manager.close();
    }
}
    
    @PostMapping("/login")
    public ResponseEntity<?> loginFuncionario(@RequestBody FuncionarioLoginDTO dto,@RequestParam boolean eh_gestor) {
        EntityManager manager = emf.createEntityManager();
        try {
            Funcionario usuario = manager
                    .createQuery("SELECT A FROM Funcionario A WHERE A.email = :email", Funcionario.class)
                    .setParameter("email", dto.email())
                    .getResultStream()
                    .findFirst()
                    .orElse(null);
            if (usuario == null)
                return ResponseEntity.notFound().build();
            int response = usuario.login(dto.email(), dto.senha(), eh_gestor);
            if (response != 200)
                return ResponseEntity.status(response).build();
            return ResponseEntity.ok(usuario.dto());
        } finally {
            manager.close();
        }
    }

    private boolean senhaInvalida(String senha) {
        return senha == null || senha.length() < 8;
    }

}
