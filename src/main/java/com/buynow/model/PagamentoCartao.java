package com.buynow.model;

import com.buynow.interfaces.Processavel;
import com.buynow.interfaces.Reembolsavel;

public class PagamentoCartao implements Processavel, Reembolsavel {

    private double valor;
    private int parcelas;
    private String status;

    public PagamentoCartao(double valor, int parcelas) {
        this.valor = valor;
        this.parcelas = parcelas;
        this.status = "PENDENTE";
    }

    @Override
    public boolean processar() {
        System.out.println("Processando Cartão em " + parcelas +
                "x de R$ " + String.format("%.2f", valor / parcelas));
        this.status = "APROVADO";
        return true;
    }

    @Override
    public boolean reembolsar() {
        System.out.println("Reembolsando R$ " + String.format("%.2f", valor) + " no cartão");
        this.status = "REEMBOLSADO";
        return true;
    }

    @Override
    public String getTipo() { return "CARTAO"; }

    public double getValor() { return valor; }
    public int getParcelas() { return parcelas; }
    public String getStatus() { return status; }
}