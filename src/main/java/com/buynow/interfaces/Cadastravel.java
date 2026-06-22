package com.buynow.interfaces;

    public interface Cadastravel<T> {
        boolean cadastrar(T objeto);

        T buscarPorId(int id);
    }
