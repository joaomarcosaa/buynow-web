package com.buynow.service;

import com.buynow.model.Produto;
import com.buynow.repository.ProdutoRepository;
import com.buynow.util.RespostaAPI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    public RespostaAPI cadastrarProduto(Produto produto) {
        if (produto.getNome() == null || produto.getNome().isBlank())
            return RespostaAPI.erro("Nome do produto é obrigatório.");

        if (produto.getPreco() <= 0)
            return RespostaAPI.erro("Preço deve ser maior que zero.");

        if (produto.getEstoque() < 0)
            return RespostaAPI.erro("Estoque não pode ser negativo.");

        produtoRepository.save(produto);
        return RespostaAPI.ok("Produto cadastrado com sucesso!", produto);
    }

    public RespostaAPI listarProdutos() {
        List<Produto> produtos = produtoRepository.findAll();
        return RespostaAPI.ok("Produtos listados com sucesso!", produtos);
    }

    public RespostaAPI atualizarEstoque(int id, int novoEstoque) {
        if (novoEstoque < 0)
            return RespostaAPI.erro("Estoque não pode ser negativo.");

        Optional<Produto> optional = produtoRepository.findById(id);

        if (optional.isEmpty())
            return RespostaAPI.erro("Produto não encontrado.");

        Produto produto = optional.get();
        produto.setEstoque(novoEstoque);
        produtoRepository.save(produto);
        return RespostaAPI.ok("Estoque atualizado com sucesso!", produto);
    }

    public RespostaAPI removerProduto(int id) {
        if (!produtoRepository.existsById(id))
            return RespostaAPI.erro("Produto não encontrado.");

        produtoRepository.deleteById(id);
        return RespostaAPI.ok("Produto removido com sucesso!");
    }

    public RespostaAPI atualizarProduto(int id, Produto dadosNovos) {
        Optional<Produto> optional = produtoRepository.findById(id);

        if (optional.isEmpty())
            return RespostaAPI.erro("Produto não encontrado.");

        if (dadosNovos.getPreco() <= 0)
            return RespostaAPI.erro("Preço deve ser maior que zero.");

        Produto produto = optional.get();
        produto.setNome(dadosNovos.getNome());
        produto.setDescricao(dadosNovos.getDescricao());
        produto.setPreco(dadosNovos.getPreco());
        produto.setEstoque(dadosNovos.getEstoque());
        produtoRepository.save(produto);
        return RespostaAPI.ok("Produto atualizado com sucesso!", produto);
    }

}