package com.buynow.service;

import com.buynow.model.Cliente;
import com.buynow.model.Usuario;
import com.buynow.repository.UsuarioRepository;
import com.buynow.util.RespostaAPI;
import com.buynow.util.ValidadorCPF;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.buynow.dto.UsuarioDTO;
import com.buynow.model.Administrador;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public RespostaAPI cadastrarCliente(Cliente cliente) {
        // Validação de campos obrigatórios
        if (cliente.getNome() == null || cliente.getNome().isBlank())
            return RespostaAPI.erro("Nome é obrigatório.");

        if (cliente.getEmail() == null || !cliente.getEmail().contains("@"))
            return RespostaAPI.erro("Email inválido.");

        if (cliente.getSenha() == null || cliente.getSenha().length() < 6)
            return RespostaAPI.erro("A senha deve ter pelo menos 6 caracteres.");

        if (!ValidadorCPF.isValido(cliente.getCpf()))
            return RespostaAPI.erro("CPF inválido.");

        if (cliente.getCelular() == null || cliente.getCelular().isBlank())
            return RespostaAPI.erro("Celular é obrigatório.");

        if (cliente.getEndereco() == null || cliente.getEndereco().isBlank())
            return RespostaAPI.erro("Endereço é obrigatório.");

        // Verifica se email já está em uso
        if (usuarioRepository.findByEmail(cliente.getEmail()).isPresent())
            return RespostaAPI.erro("Email já cadastrado.");

        // Criptografa a senha
        cliente.setSenha(encoder.encode(cliente.getSenha()));

        usuarioRepository.save(cliente);
        return RespostaAPI.ok("Cliente cadastrado com sucesso!", cliente);
    }

    public RespostaAPI login(String email, String senha) {
        if (email == null || email.isBlank())
            return RespostaAPI.erro("Email é obrigatório.");

        if (senha == null || senha.isBlank())
            return RespostaAPI.erro("Senha é obrigatória.");

        Optional<Usuario> optional = usuarioRepository.findByEmail(email);

        if (optional.isEmpty())
            return RespostaAPI.erro("Email ou senha inválidos.");

        Usuario usuario = optional.get();

        if (!encoder.matches(senha, usuario.getSenha()))
            return RespostaAPI.erro("Email ou senha inválidos.");

        return RespostaAPI.ok("Login realizado com sucesso!", new UsuarioDTO(usuario));
    }

    public RespostaAPI listarClientes() {
        List<Usuario> clientes = usuarioRepository.findAllClientes();
        List<UsuarioDTO> dtos = clientes.stream()
                .map(UsuarioDTO::new)
                .toList();
        return RespostaAPI.ok("Clientes listados com sucesso!", dtos);
    }
    public RespostaAPI cadastrarAdmin(String nome, String email, String senha) {
        if (usuarioRepository.findByEmail(email).isPresent())
            return RespostaAPI.erro("Email já cadastrado.");

        Administrador admin = new Administrador(nome, email, encoder.encode(senha));
        usuarioRepository.save(admin);
        return RespostaAPI.ok("Administrador cadastrado com sucesso!", new UsuarioDTO(admin));
    }
}