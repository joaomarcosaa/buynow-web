package com.buynow.model;

import com.buynow.interfaces.Processavel;

public class PagamentoBoleto implements Processavel {

    private double valor;
    private String status;

    public PagamentoBoleto(double valor) {
        this.valor = valor;
        this.status = "PENDENTE";
    }

    @Override
    public boolean processar() {
        System.out.println("Boleto gerado de R$ " + String.format("%.2f", valor) +
                " com vencimento em 3 dias úteis.");
        this.status = "AGUARDANDO_PAGAMENTO";
        return true;
    }

    @Override
    public String getTipo() { return "BOLETO"; }

    public double getValor() { return valor; }
    public String getStatus() { return status; }
}