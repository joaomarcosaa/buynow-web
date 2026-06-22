package com.buynow.service;

import com.buynow.model.Produto;
import com.buynow.repository.ProdutoRepository;
import com.buynow.util.RespostaAPI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

// SRP: responsável apenas por gerenciar o estoque
@Service
public class EstoqueService {

    @Autowired
    private ProdutoRepository produtoRepository;

    public RespostaAPI verificarEstoque(List<Map<String, Object>> itens) {
        for (Map<String, Object> item : itens) {
            int produtoId = (int) item.get("produtoId");
            int quantidade = (int) item.get("quantidade");

            Produto produto = produtoRepository.findById(produtoId).orElse(null);

            if (produto == null)
                return RespostaAPI.erro("Produto ID " + produtoId + " não encontrado.");

            if (produto.getEstoque() < quantidade)
                return RespostaAPI.erro("Estoque insuficiente para: " + produto.getNome());
        }
        return RespostaAPI.ok("Estoque disponível.");
    }

    public void baixarEstoque(List<Map<String, Object>> itens) {
        for (Map<String, Object> item : itens) {
            int produtoId = (int) item.get("produtoId");
            int quantidade = (int) item.get("quantidade");

            Produto produto = produtoRepository.findById(produtoId).orElse(null);
            if (produto != null) {
                produto.atualizarEstoque(quantidade);
                produtoRepository.save(produto);
            }
        }
    }
}