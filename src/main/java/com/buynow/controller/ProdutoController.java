package com.buynow.controller;

import com.buynow.model.Produto;
import com.buynow.service.ProdutoService;
import com.buynow.util.RespostaAPI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "*")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    @PostMapping
    public ResponseEntity<RespostaAPI> cadastrar(@RequestBody Produto produto) {
        RespostaAPI resposta = produtoService.cadastrarProduto(produto);
        if (resposta.isSucesso()) {
            return ResponseEntity.ok(resposta);
        }
        return ResponseEntity.badRequest().body(resposta);
    }

    @GetMapping
    public ResponseEntity<RespostaAPI> listar() {
        return ResponseEntity.ok(produtoService.listarProdutos());
    }

    @PutMapping("/{id}")
    public ResponseEntity<RespostaAPI> atualizar(@PathVariable int id,
                                                 @RequestBody Produto produto) {
        RespostaAPI resposta = produtoService.atualizarProduto(id, produto);
        if (resposta.isSucesso()) {
            return ResponseEntity.ok(resposta);
        }
        return ResponseEntity.badRequest().body(resposta);
    }

    @PatchMapping("/{id}/estoque")
    public ResponseEntity<RespostaAPI> atualizarEstoque(@PathVariable int id,
                                                        @RequestBody Map<String, Integer> body) {
        int novoEstoque = body.get("estoque");
        RespostaAPI resposta = produtoService.atualizarEstoque(id, novoEstoque);
        if (resposta.isSucesso()) {
            return ResponseEntity.ok(resposta);
        }
        return ResponseEntity.badRequest().body(resposta);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<RespostaAPI> remover(@PathVariable int id) {
        RespostaAPI resposta = produtoService.removerProduto(id);
        if (resposta.isSucesso()) {
            return ResponseEntity.ok(resposta);
        }
        return ResponseEntity.badRequest().body(resposta);
    }
}