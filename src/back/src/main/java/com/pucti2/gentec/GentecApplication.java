package com.pucti2.gentec;

import com.pucti2.gentec.model.Setor;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication()
public class GentecApplication {

	public static void main(String[] args) {
		SpringApplication.run(GentecApplication.class, args);
	}

	@Bean
	CommandLineRunner seedSetores(EntityManagerFactory emf) {
		return args -> {
			String[][] setores = {
					{"TI", "Tecnologia da Informação"},
					{"Comercial", "Área comercial"},
					{"RH", "Recursos Humanos"}
			};

			EntityManager manager = emf.createEntityManager();
			try {
				manager.getTransaction().begin();
				for (String[] setor : setores) {
					boolean exists = !manager
							.createQuery("SELECT s FROM Setor s WHERE s.nome = :nome", Setor.class)
							.setParameter("nome", setor[0])
							.getResultList()
							.isEmpty();

					if (!exists) {
						manager.persist(new Setor(setor[0], setor[1]));
					}
				}
				manager.getTransaction().commit();
			} finally {
				if (manager.getTransaction().isActive())
					manager.getTransaction().rollback();
				manager.close();
			}
		};
	}

}
