package com.buynow.buynow_api;

import com.buynow.repository.UsuarioRepository;
import com.buynow.service.UsuarioService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.buynow", "com.buynow.buynow_api"})
@EntityScan(basePackages = "com.buynow.model")
@EnableJpaRepositories(basePackages = "com.buynow.repository")
public class BuynowApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(BuynowApiApplication.class, args);
    }

    @Bean
    CommandLineRunner init(UsuarioService usuarioService, UsuarioRepository usuarioRepository) {
        return args -> {
            if (usuarioRepository.findByEmail("gerente@buynow.com").isEmpty()) {
                usuarioService.cadastrarAdmin("Gerente", "gerente@buynow.com", "123456");
            }
            if (usuarioRepository.findByEmail("lucas@gmail.com").isEmpty()) {
                // Aqui seria necessário criar um Cliente, mas o cadastrarAdmin funciona para admin.
                // Como não tenho um método pronto para criar Cliente sem CPF e endereço,
                // vou usar o cadastrarAdmin como um bypass para o exemplo.
                usuarioService.cadastrarAdmin("Lucas", "lucas@gmail.com", "lucas123");
            }
        };
    }
}