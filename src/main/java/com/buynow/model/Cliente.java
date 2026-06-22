package com.buynow.model;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("CLIENTE")
public class Cliente extends Usuario {

    private String cpf;
    private String celular;
    private String cep;
    private String endereco;
    private String numero;
    private String complemento;

    public Cliente() {}

    public Cliente(String nome, String email, String senha, String cpf,
                   String celular, String cep, String endereco,
                   String numero, String complemento) {
        super(nome, email, senha);
        this.cpf = cpf;
        this.celular = celular;
        this.cep = cep;
        this.endereco = endereco;
        this.numero = numero;
        this.complemento = complemento;
    }

    @Override
    public String getTipo() { return "CLIENTE"; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getCelular() { return celular; }
    public void setCelular(String celular) { this.celular = celular; }

    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }

    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public String getComplemento() { return complemento; }
    public void setComplemento(String complemento) { this.complemento = complemento; }
}