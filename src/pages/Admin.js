import React, { useState, useEffect } from "react";
import api from "../services/api";

function Admin({ usuario, onLogout }) {
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [aba, setAba] = useState("produtos");
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    preco: "",
    estoque: "",
  });
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    carregarProdutos();
    carregarClientes();
  }, []);

  const carregarProdutos = async () => {
    const resposta = await api.get("/produtos");
    setProdutos(resposta.data.dados);
  };

  const carregarClientes = async () => {
    const resposta = await api.get("/usuarios/clientes");
    setClientes(resposta.data.dados);
  };

  const adicionarProduto = async () => {
    try {
      const resposta = await api.post("/produtos", {
        nome: form.nome,
        descricao: form.descricao,
        preco: parseFloat(form.preco),
        estoque: parseInt(form.estoque),
      });
      if (resposta.data.sucesso) {
        setMensagem("Produto adicionado com sucesso!");
        setForm({ nome: "", descricao: "", preco: "", estoque: "" });
        carregarProdutos();
      }
    } catch (e) {
      setMensagem("Erro ao adicionar produto.");
    }
  };

  const removerProduto = async (id) => {
    await api.delete(`/produtos/${id}`);
    setMensagem("Produto removido!");
    carregarProdutos();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div
          style={{
            display: "flex",
            gap: "20px",
            padding: "25px 30px 0",
          }}
        >
          <div style={styles.cardInfo}>
            <h3>{produtos.length}</h3>
            <p>Produtos</p>
          </div>

          <div style={styles.cardInfo}>
            <h3>{clientes.length}</h3>
            <p>Clientes</p>
          </div>
        </div>
        <h2 style={styles.logo}>📊 BuyNow Admin</h2>
        <button style={styles.botaoSair} onClick={onLogout}>
          Sair
        </button>
      </div>

      <div style={styles.abas}>
        <button
          style={aba === "produtos" ? styles.abaAtiva : styles.aba}
          onClick={() => setAba("produtos")}
        >
          Produtos
        </button>
        <button
          style={aba === "clientes" ? styles.abaAtiva : styles.aba}
          onClick={() => setAba("clientes")}
        >
          Clientes
        </button>
      </div>

      {aba === "produtos" && (
        <div style={styles.conteudo}>
          <h3>Adicionar Produto</h3>
          {mensagem && <p style={styles.mensagem}>{mensagem}</p>}
          <div style={styles.formRow}>
            <input
              style={styles.input}
              placeholder="Nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
            <input
              style={styles.input}
              placeholder="Descrição"
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            />
            <input
              style={styles.input}
              placeholder="Preço"
              type="number"
              value={form.preco}
              onChange={(e) => setForm({ ...form, preco: e.target.value })}
            />
            <input
              style={styles.input}
              placeholder="Estoque"
              type="number"
              value={form.estoque}
              onChange={(e) => setForm({ ...form, estoque: e.target.value })}
            />
            <button style={styles.botaoAdicionar} onClick={adicionarProduto}>
              Adicionar
            </button>
          </div>
          <table style={styles.tabela}>
            <table style={styles.tabela}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Nome</th>
                  <th style={styles.th}>Descrição</th>
                  <th style={styles.th}>Preço</th>
                  <th style={styles.th}>Estoque</th>
                  <th style={styles.th}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((p) => (
                  <tr key={p.id}>
                    <td style={styles.td}>{p.id}</td>
                    <td style={styles.td}>{p.nome}</td>
                    <td style={styles.td}>{p.descricao}</td>
                    <td style={styles.td}>R$ {p.preco.toFixed(2)}</td>
                    <td style={styles.td}>{p.estoque}</td>
                    <td style={styles.td}>
                      <button
                        style={styles.botaoRemover}
                        onClick={() => removerProduto(p.id)}
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </table>
        </div>
      )}

      {aba === "clientes" && (
        <div style={styles.conteudo}>
          <h3>Clientes cadastrados</h3>
          <table style={styles.tabela}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Nome</th>
                <th style={styles.th}>Email</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id}>
                  <td style={styles.td}>{c.id}</td>
                  <td style={styles.td}>{c.nome}</td>
                  <td style={styles.td}>{c.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  ccontainer: {
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
  },
  header: {
    background: "linear-gradient(90deg,#2563eb,#1e40af)",
    padding: "20px 35px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
  },
  logo: {
    color: "white",
    margin: 0,
    fontSize: "28px",
    fontWeight: "800",
  },
  botaoSair: {
    backgroundColor: "white",
    color: "#2563eb",
    border: "none",
    padding: "10px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },
  abas: {
    display: "flex",
    gap: "8px",
    padding: "24px 30px 0",
  },
  aba: {
    padding: "12px 20px",
    border: "none",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    borderRadius: "12px",
    color: "#6b7280",
    fontWeight: "600",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  cardInfo: {
    background: "white",
    padding: "20px",
    width: "90px",
    borderRadius: "15px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  },
  abaAtiva: {
    padding: "12px 20px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer",
    borderRadius: "12px",
    fontWeight: "700",
    boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
  },
  conteudo: {
    backgroundColor: "white",
    margin: "20px 30px",
    padding: "25px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
  formRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    minWidth: "180px",
  },
  tabela: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    padding: "14px",
    backgroundColor: "#2563eb",
    color: "white",
    fontSize: "14px",
  },
  td: {
    textAlign: "left",
    padding: "10px 8px",
    borderBottom: "1px solid #f0f0f0",
    fontSize: "14px",
  },
  botaoAdicionar: {
    backgroundColor: "#22c55e",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
  },
  botaoRemover: {
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
  mensagem: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "15px",
    fontWeight: "600",
  },
};

export default Admin;
