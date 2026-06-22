package com.buynow.buynow_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
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
}