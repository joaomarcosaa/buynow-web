package com.buynow.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "pedido")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL)
    private List<ItemPedido> itens;

    @Enumerated(EnumType.STRING)
    private StatusPedido status;

    private String formaPagamento;
    private LocalDateTime dataCriacao;

    public enum StatusPedido {
        PENDENTE, CONFIRMADO, EM_TRANSPORTE, ENTREGUE, CANCELADO
    }

    public Pedido() {}

    public Pedido(Cliente cliente, List<ItemPedido> itens, String formaPagamento) {
        this.cliente = cliente;
        this.itens = itens;
        this.formaPagamento = formaPagamento;
        this.status = StatusPedido.PENDENTE;
        this.dataCriacao = LocalDateTime.now();
    }

    public double calcularTotal() {
        return itens.stream()
                .mapToDouble(ItemPedido::getSubtotal)
                .sum();
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }

    public List<ItemPedido> getItens() { return itens; }
    public void setItens(List<ItemPedido> itens) { this.itens = itens; }

    public StatusPedido getStatus() { return status; }
    public void setStatus(StatusPedido status) { this.status = status; }

    public String getFormaPagamento() { return formaPagamento; }
    public void setFormaPagamento(String formaPagamento) { this.formaPagamento = formaPagamento; }

    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }
}