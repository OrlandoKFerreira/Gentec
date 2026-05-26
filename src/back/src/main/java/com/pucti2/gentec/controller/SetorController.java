package com.pucti2.gentec.controller;

import com.pucti2.gentec.dto.SetorDTO;
import com.pucti2.gentec.model.Setor;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.PersistenceUnit;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/setores")
public class SetorController {
    @PersistenceUnit
    private EntityManagerFactory emf;

    @GetMapping
    public ResponseEntity<?> listarSetores() {
        EntityManager manager = emf.createEntityManager();
        try {
            var setores = manager
                    .createQuery("SELECT s FROM Setor s WHERE s.nome IN (:nomes) ORDER BY s.nome", Setor.class)
                    .setParameter("nomes", java.util.List.of("TI", "Comercial", "RH"))
                    .getResultList()
                    .stream()
                    .map(Setor::dto)
                    .toList();

            return ResponseEntity.ok(setores);
        } finally {
            manager.close();
        }
    }

    @PostMapping
    public ResponseEntity<?> cadastrarSetor(@RequestBody SetorDTO dto) {
        Setor novo = new Setor(dto.nome(), dto.descricao());
        EntityManager manager = emf.createEntityManager();
        try {
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

    @GetMapping("/{id_setor}")
    public ResponseEntity<?> localizarSetor(@PathVariable int id_setor){
        EntityManager manager = emf.createEntityManager();
        try {
            Setor setor = manager.find(Setor.class,id_setor);
            if (setor == null)
                return ResponseEntity.notFound().build();
            return ResponseEntity.ok(setor.dto());
        } finally {
            manager.close();
        }
    }

    @DeleteMapping("/{id_setor}")
    public ResponseEntity<?> excluirSetor(@PathVariable int id_setor) {
        EntityManager manager = emf.createEntityManager();
        try {
            Setor setor = manager.find(Setor.class,id_setor);
            if (setor == null)
                return ResponseEntity.notFound().build();
            manager.getTransaction().begin();
            manager.remove(setor);
            manager.getTransaction().commit();
            return ResponseEntity.noContent().build();
        } finally {
            if (manager.getTransaction().isActive())
                manager.getTransaction().rollback();
            manager.close();
        }
    }

    @PutMapping("/{id_setor}")
    public ResponseEntity<?> atualizarSetor(@PathVariable int id_setor, @RequestBody SetorDTO dto) {
        EntityManager manager = emf.createEntityManager();
        try {
            manager.getTransaction().begin();
            Setor setor = manager.find(Setor.class, id_setor);
            if (setor == null)
                return ResponseEntity.notFound().build();
            if (dto.nome() != null) setor.setNome(dto.nome());
            if (dto.descricao() != null) setor.setDescricao(dto.descricao());
            manager.merge(setor);
            manager.getTransaction().commit();
            return ResponseEntity.ok(setor.dto());
        } finally {
            if (manager.getTransaction().isActive())
                manager.getTransaction().rollback();
            manager.close();
        }

    }

}
