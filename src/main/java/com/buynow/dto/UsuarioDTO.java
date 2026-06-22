package com.buynow.dto;

import com.buynow.model.Usuario;

public class UsuarioDTO {

    private int id;
    private String nome;
    private String email;
    private String tipo;

    public UsuarioDTO(Usuario usuario) {
        this.id = usuario.getId();
        this.nome = usuario.getNome();
        this.email = usuario.getEmail();
        this.tipo = usuario.getTipo();
    }

    public int getId() { return id; }
    public String getNome() { return nome; }
    public String getEmail() { return email; }
    public String getTipo() { return tipo; }
}