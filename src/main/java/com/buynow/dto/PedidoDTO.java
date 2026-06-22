package com.buynow.dto;

import com.buynow.model.ItemPedido;
import com.buynow.model.Pedido;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class PedidoDTO {

    private int id;
    private String nomeCliente;
    private String formaPagamento;
    private String status;
    private LocalDateTime dataCriacao;
    private double total;
    private List<ItemPedidoDTO> itens;

    public PedidoDTO(Pedido pedido) {
        this.id = pedido.getId();
        this.nomeCliente = pedido.getCliente().getNome();
        this.formaPagamento = pedido.getFormaPagamento();
        this.status = pedido.getStatus().name();
        this.dataCriacao = pedido.getDataCriacao();
        this.total = pedido.calcularTotal();
        this.itens = pedido.getItens().stream()
                .map(ItemPedidoDTO::new)
                .collect(Collectors.toList());
    }

    public static class ItemPedidoDTO {
        private int produtoId;
        private String nomeProduto;
        private int quantidade;
        private double precoUnitario;
        private double subtotal;

        public ItemPedidoDTO(ItemPedido item) {
            this.produtoId = item.getProduto().getId();
            this.nomeProduto = item.getProduto().getNome();
            this.quantidade = item.getQuantidade();
            this.precoUnitario = item.getPrecoUnitario();
            this.subtotal = item.getSubtotal();
        }

        public int getProdutoId() { return produtoId; }
        public String getNomeProduto() { return nomeProduto; }
        public int getQuantidade() { return quantidade; }
        public double getPrecoUnitario() { return precoUnitario; }
        public double getSubtotal() { return subtotal; }
    }

    public int getId() { return id; }
    public String getNomeCliente() { return nomeCliente; }
    public String getFormaPagamento() { return formaPagamento; }
    public String getStatus() { return status; }
    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public double getTotal() { return total; }
    public List<ItemPedidoDTO> getItens() { return itens; }
}