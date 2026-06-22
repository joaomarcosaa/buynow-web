package com.buynow.repository;

import com.buynow.model.ItemPedido;
import com.buynow.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemPedidoRepository extends JpaRepository<ItemPedido, Integer> {
    List<ItemPedido> findByPedido(Pedido pedido);
}