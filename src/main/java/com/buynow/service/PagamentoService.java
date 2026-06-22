package com.buynow.service;

import com.buynow.interfaces.Processavel;
import com.buynow.model.PagamentoBoleto;
import com.buynow.model.PagamentoCartao;
import com.buynow.model.PagamentoPix;
import com.buynow.util.RespostaAPI;
import org.springframework.stereotype.Service;

// SRP: responsável apenas por processar pagamentos
@Service
public class PagamentoService {

    public RespostaAPI processarPagamento(String tipo, double valor, int parcelas) {
        if (tipo == null || tipo.isBlank())
            return RespostaAPI.erro("Forma de pagamento é obrigatória.");

        Processavel pagamento;

        switch (tipo.toUpperCase()) {
            case "PIX" -> pagamento = new PagamentoPix(valor);
            case "BOLETO" -> pagamento = new PagamentoBoleto(valor);
            case "CARTAO" -> {
                if (parcelas <= 0) parcelas = 1;
                pagamento = new PagamentoCartao(valor, parcelas);
            }
            default -> { return RespostaAPI.erro("Forma de pagamento inválida."); }
        }

        boolean sucesso = pagamento.processar();

        if (sucesso)
            return RespostaAPI.ok("Pagamento processado via " + pagamento.getTipo(), pagamento);

        return RespostaAPI.erro("Erro ao processar pagamento.");
    }
}