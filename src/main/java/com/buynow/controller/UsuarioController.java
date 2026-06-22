package com.buynow.controller;

import com.buynow.model.Cliente;
import com.buynow.service.UsuarioService;
import com.buynow.util.RespostaAPI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/cadastrar")
    public ResponseEntity<RespostaAPI> cadastrar(@RequestBody Cliente cliente) {
        RespostaAPI resposta = usuarioService.cadastrarCliente(cliente);
        if (resposta.isSucesso()) {
            return ResponseEntity.ok(resposta);
        }
        return ResponseEntity.badRequest().body(resposta);
    }

    @PostMapping("/login")
    public ResponseEntity<RespostaAPI> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String senha = body.get("senha");
        RespostaAPI resposta = usuarioService.login(email, senha);
        if (resposta.isSucesso()) {
            return ResponseEntity.ok(resposta);
        }
        return ResponseEntity.status(401).body(resposta);
    }

    @GetMapping("/clientes")
    public ResponseEntity<RespostaAPI> listarClientes() {
        return ResponseEntity.ok(usuarioService.listarClientes());
    }
    @PostMapping("/cadastrar-admin")
    public ResponseEntity<RespostaAPI> cadastrarAdmin(@RequestBody Map<String, String> body) {
        String nome = body.get("nome");
        String email = body.get("email");
        String senha = body.get("senha");

        if (nome == null || email == null || senha == null)
            return ResponseEntity.badRequest().body(RespostaAPI.erro("Preencha todos os campos."));

        if (!email.contains("@"))
            return ResponseEntity.badRequest().body(RespostaAPI.erro("Email inválido."));

        if (senha.length() < 6)
            return ResponseEntity.badRequest().body(RespostaAPI.erro("Senha deve ter pelo menos 6 caracteres."));

        RespostaAPI resposta = usuarioService.cadastrarAdmin(nome, email, senha);
        if (resposta.isSucesso()) return ResponseEntity.ok(resposta);
        return ResponseEntity.badRequest().body(resposta);
    }
}