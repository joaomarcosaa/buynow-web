package com.buynow.util;

public class RespostaAPI {

    private boolean sucesso;
    private String mensagem;
    private Object dados;

    public RespostaAPI(boolean sucesso, String mensagem, Object dados) {
        this.sucesso = sucesso;
        this.mensagem = mensagem;
        this.dados = dados;
    }

    public static RespostaAPI ok(String mensagem, Object dados) {
        return new RespostaAPI(true, mensagem, dados);
    }

    public static RespostaAPI ok(String mensagem) {
        return new RespostaAPI(true, mensagem, null);
    }

    public static RespostaAPI erro(String mensagem) {
        return new RespostaAPI(false, mensagem, null);
    }

    public boolean isSucesso() { return sucesso; }
    public String getMensagem() { return mensagem; }
    public Object getDados() { return dados; }
}