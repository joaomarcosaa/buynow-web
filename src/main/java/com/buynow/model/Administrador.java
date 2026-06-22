package com.buynow.model;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("ADMIN")
public class Administrador extends Usuario {

    public Administrador() {}

    public Administrador(String nome, String email, String senha) {
        super(nome, email, senha);
    }

    @Override
    public String getTipo() { return "ADMIN"; }
}