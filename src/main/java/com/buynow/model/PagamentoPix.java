package com.buynow.model;

import com.buynow.interfaces.Processavel;

public class PagamentoPix implements Processavel {

    private double valor;
    private String status;

    public PagamentoPix(double valor) {
        this.valor = valor;
        this.status = "PENDENTE";
    }

    @Override
    public boolean processar() {
        System.out.println("Processando Pix de R$ " + String.format("%.2f", valor));
        this.status = "APROVADO";
        return true;
    }

    @Override
    public String getTipo() { return "PIX"; }
    public double getValor() { return valor; }
    public String getStatus() { return status; }
}