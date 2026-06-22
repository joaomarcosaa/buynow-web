package com.buynow.service;

import com.buynow.model.*;
import com.buynow.repository.*;
import com.buynow.util.RespostaAPI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.buynow.dto.PedidoDTO;
import java.util.stream.Collectors;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

// SRP: responsável apenas por gerenciar pedidos
@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EstoqueService estoqueService;

    @Autowired
    private PagamentoService pagamentoService;

    public RespostaAPI criarPedido(int clienteId, List<Map<String, Object>> itens,
                                   String formaPagamento, int parcelas) {
        Optional<Usuario> optional = usuarioRepository.findById(clienteId);
        if (optional.isEmpty())
            return RespostaAPI.erro("Cliente não encontrado.");

        Cliente cliente = (Cliente) optional.get();

        RespostaAPI estoqueOk = estoqueService.verificarEstoque(itens);
        if (!estoqueOk.isSucesso())
            return estoqueOk;

        double total = calcularTotal(itens);
        RespostaAPI pagamentoOk = pagamentoService.processarPagamento(formaPagamento, total, parcelas);
        if (!pagamentoOk.isSucesso())
            return pagamentoOk;

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setFormaPagamento(formaPagamento);
        pedido.setStatus(Pedido.StatusPedido.CONFIRMADO);
        pedido.setDataCriacao(java.time.LocalDateTime.now());
        pedido.setItens(new ArrayList<>());
        pedidoRepository.save(pedido);

        List<ItemPedido> itensPedido = new ArrayList<>();
        for (Map<String, Object> item : itens) {
            int produtoId = (int) item.get("produtoId");
            int quantidade = (int) item.get("quantidade");
            Produto produto = produtoRepository.findById(produtoId).orElse(null);
            if (produto != null) {
                ItemPedido itemPedido = new ItemPedido(pedido, produto, quantidade);
                itensPedido.add(itemPedido);
            }
        }

        pedido.setItens(itensPedido);
        pedidoRepository.save(pedido);
        estoqueService.baixarEstoque(itens);

        return RespostaAPI.ok("Pedido criado com sucesso!", new PedidoDTO(pedido));
    }

    public RespostaAPI listarPedidosDoCliente(int clienteId) {
        Optional<Usuario> optional = usuarioRepository.findById(clienteId);
        if (optional.isEmpty())
            return RespostaAPI.erro("Cliente não encontrado.");

        Cliente cliente = (Cliente) optional.get();
        List<Pedido> pedidos = pedidoRepository.findByCliente(cliente);
        List<PedidoDTO> dtos = pedidos.stream()
                .map(PedidoDTO::new)
                .collect(Collectors.toList());
        return RespostaAPI.ok("Pedidos listados com sucesso!", dtos);
    }

    private double calcularTotal(List<Map<String, Object>> itens) {
        double total = 0;
        for (Map<String, Object> item : itens) {
            int produtoId = (int) item.get("produtoId");
            int quantidade = (int) item.get("quantidade");
            Produto produto = produtoRepository.findById(produtoId).orElse(null);
            if (produto != null) {
                total += produto.getPreco() * quantidade;
            }
        }
        return total;
    }
}