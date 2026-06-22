package com.buynow.controller;

import com.buynow.service.PedidoService;
import com.buynow.util.RespostaAPI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<RespostaAPI> criarPedido(@RequestBody Map<String, Object> body) {
        try {
            int clienteId = ((Number) body.get("clienteId")).intValue();
            List<Map<String, Object>> itensRaw = (List<Map<String, Object>>) body.get("itens");
            String formaPagamento = (String) body.get("formaPagamento");
            int parcelas = body.containsKey("parcelas") ?
                    ((Number) body.get("parcelas")).intValue() : 1;

            List<Map<String, Object>> itens = new ArrayList<>();
            for (Map<String, Object> item : itensRaw) {
                Map<String, Object> itemConvertido = new HashMap<>();
                itemConvertido.put("produtoId", ((Number) item.get("produtoId")).intValue());
                itemConvertido.put("quantidade", ((Number) item.get("quantidade")).intValue());
                itens.add(itemConvertido);
            }

            RespostaAPI resposta = pedidoService.criarPedido(clienteId, itens, formaPagamento, parcelas);

            if (resposta.isSucesso()) return ResponseEntity.ok(resposta);
            return ResponseEntity.badRequest().body(resposta);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    RespostaAPI.erro("Erro ao processar pedido: " + e.getMessage()));
        }
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<RespostaAPI> listarPedidos(@PathVariable int clienteId) {
        RespostaAPI resposta = pedidoService.listarPedidosDoCliente(clienteId);
        return ResponseEntity.ok(resposta);
    }
}