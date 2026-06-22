import React, { useState, useEffect } from "react";
import api from "../services/api";

function Cliente({ usuario, onLogout }) {
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [quantidades, setQuantidades] = useState({});
  const [mensagem, setMensagem] = useState("");
  const [aba, setAba] = useState("loja");
  const [formaPagamento, setFormaPagamento] = useState("PIX");
  const [parcelas, setParcelas] = useState(1);
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    const resposta = await api.get("/produtos");
    setProdutos(resposta.data.dados);
  };

  const adicionarAoCarrinho = (produto) => {
    const qtd = parseInt(quantidades[produto.id] || 1);
    if (!qtd || qtd <= 0) {
      setMensagem("Digite uma quantidade válida.");
      return;
    }
    if (qtd > produto.estoque) {
      setMensagem("Quantidade maior que o estoque.");
      return;
    }
    const existente = carrinho.find((i) => i.produto.id === produto.id);
    if (existente) {
      setCarrinho(
        carrinho.map((i) =>
          i.produto.id === produto.id
            ? { ...i, quantidade: i.quantidade + qtd }
            : i
        )
      );
    } else {
      setCarrinho([...carrinho, { produto, quantidade: qtd }]);
    }
    setMensagem("✓ Produto adicionado ao carrinho!");
    setTimeout(() => setMensagem(""), 2000);
  };

  const removerDoCarrinho = (produtoId) => {
    setCarrinho(carrinho.filter((i) => i.produto.id !== produtoId));
  };

  const calcularTotal = () =>
    carrinho
      .reduce((total, item) => total + item.produto.preco * item.quantidade, 0)
      .toFixed(2);

  const confirmarPedido = async () => {
    const itens = carrinho.map((item) => ({
      produtoId: item.produto.id,
      quantidade: item.quantidade,
    }));

    try {
      const resposta = await api.post("/pedidos", {
        clienteId: usuario.id,
        itens,
        formaPagamento,
        parcelas,
      });

      if (resposta.data.sucesso) {
        setCarrinho([]);
        setModalAberto(false);
        setAba("loja");
        setMensagem("✓ Pedido realizado com sucesso!");
        setTimeout(() => setMensagem(""), 3000);
        carregarProdutos();
      } else {
        setMensagem("Erro: " + resposta.data.mensagem);
        setModalAberto(false);
      }
    } catch (e) {
      setMensagem("Erro ao finalizar compra.");
      setModalAberto(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.logo}>BuyNow</span>
        <span style={styles.bemVindo}>Olá, {usuario.nome}</span>
        <button style={styles.botaoSair} onClick={onLogout}>
          Sair
        </button>
      </div>

      {/* Abas */}
      <div style={styles.abaBar}>
        <button
          style={aba === "loja" ? styles.abaAtiva : styles.aba}
          onClick={() => setAba("loja")}
        >
          🛍️ Loja
        </button>
        <button
          style={aba === "carrinho" ? styles.abaAtiva : styles.aba}
          onClick={() => setAba("carrinho")}
        >
          🛒 Carrinho{" "}
          {carrinho.length > 0 && (
            <span style={styles.badge}>{carrinho.length}</span>
          )}
        </button>
      </div>

      {/* Loja */}
      {aba === "loja" && (
        <div style={styles.conteudo}>
          <h2 style={styles.titulo}>Produtos disponíveis</h2>
          {mensagem && <div style={styles.toast}>{mensagem}</div>}
          <div style={styles.grid}>
            {produtos.map((p) => (
              <div key={p.id} style={styles.card}>
                <div style={styles.cardImgPlaceholder}>🛒</div>
                <div style={styles.cardBody}>
                  <p style={styles.cardNome}>{p.nome}</p>
                  <p style={styles.cardDesc}>{p.descricao}</p>
                  <p style={styles.cardPreco}>
                    R${" "}
                    <span style={styles.cardPrecoValor}>
                      {p.preco.toFixed(2)}
                    </span>
                  </p>
                  <p style={styles.cardEstoque}>
                    {p.estoque > 0
                      ? `✓ ${p.estoque} em estoque`
                      : "✗ Indisponível"}
                  </p>
                  <div style={styles.cardFooter}>
                    <input
                      style={styles.inputQtd}
                      type="number"
                      min="1"
                      max={p.estoque}
                      value={quantidades[p.id] || 1}
                      onChange={(e) =>
                        setQuantidades({
                          ...quantidades,
                          [p.id]: e.target.value,
                        })
                      }
                    />
                    <button
                      style={
                        p.estoque > 0
                          ? styles.botaoAdicionar
                          : styles.botaoDesabilitado
                      }
                      onClick={() => adicionarAoCarrinho(p)}
                      disabled={p.estoque === 0}
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Carrinho */}
      {aba === "carrinho" && (
        <div style={styles.conteudo}>
          <h2 style={styles.titulo}>Meu Carrinho</h2>
          {carrinho.length === 0 ? (
            <div style={styles.carrinhoVazio}>
              <p style={{ fontSize: "48px" }}>🛒</p>
              <p>Seu carrinho está vazio.</p>
              <button
                style={styles.botaoAdicionar}
                onClick={() => setAba("loja")}
              >
                Ver produtos
              </button>
            </div>
          ) : (
            <div style={styles.carrinhoLayout}>
              <div style={styles.carrinhoItens}>
                {carrinho.map((item) => (
                  <div key={item.produto.id} style={styles.carrinhoCard}>
                    <div style={styles.carrinhoImgPlaceholder}>🛒</div>
                    <div style={styles.carrinhoInfo}>
                      <p style={styles.carrinhoNome}>{item.produto.nome}</p>
                      <p style={styles.carrinhoDesc}>
                        {item.produto.descricao}
                      </p>
                      <p style={styles.carrinhoPreco}>
                        R$ {item.produto.preco.toFixed(2)} × {item.quantidade}
                      </p>
                    </div>
                    <div style={styles.carrinhoAcoes}>
                      <p style={styles.carrinhoSubtotal}>
                        R${" "}
                        {(item.produto.preco * item.quantidade).toFixed(2)}
                      </p>
                      <button
                        style={styles.botaoRemover}
                        onClick={() => removerDoCarrinho(item.produto.id)}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumo */}
              <div style={styles.resumo}>
                <h3 style={{ margin: "0 0 16px" }}>Resumo do pedido</h3>
                {carrinho.map((item) => (
                  <div key={item.produto.id} style={styles.resumoLinha}>
                    <span>
                      {item.produto.nome} ×{item.quantidade}
                    </span>
                    <span>
                      R$ {(item.produto.preco * item.quantidade).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div style={styles.resumoDivisor} />
                <div style={styles.resumoTotal}>
                  <span>Total</span>
                  <span>R$ {calcularTotal()}</span>
                </div>

                <label style={styles.label}>Forma de pagamento</label>
                <select
                  style={styles.select}
                  value={formaPagamento}
                  onChange={(e) => setFormaPagamento(e.target.value)}
                >
                  <option value="PIX">Pix</option>
                  <option value="CARTAO">Cartão de crédito</option>
                  <option value="BOLETO">Boleto bancário</option>
                </select>

                {formaPagamento === "CARTAO" && (
                  <>
                    <label style={styles.label}>Parcelas</label>
                    <select
                      style={styles.select}
                      value={parcelas}
                      onChange={(e) => setParcelas(parseInt(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5, 6, 10, 12].map((n) => (
                        <option key={n} value={n}>
                          {n}x de R${" "}
                          {(calcularTotal() / n).toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </>
                )}

                <button
                  style={styles.botaoFinalizar}
                  onClick={() => setModalAberto(true)}
                >
                  Finalizar compra
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal de confirmação */}
      {modalAberto && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitulo}>Confirmar pedido</h2>

            <div style={styles.modalSecao}>
              <p style={styles.modalLabel}>Itens do pedido:</p>
              {carrinho.map((item) => (
                <div key={item.produto.id} style={styles.modalLinha}>
                  <span>
                    {item.produto.nome} ×{item.quantidade}
                  </span>
                  <span>
                    R$ {(item.produto.preco * item.quantidade).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div style={styles.modalDivisor} />

            <div style={styles.modalLinha}>
              <strong>Total</strong>
              <strong>R$ {calcularTotal()}</strong>
            </div>

            <div style={styles.modalSecao}>
              <p style={styles.modalLabel}>Forma de pagamento:</p>
              <p style={styles.modalPagamento}>
                {formaPagamento === "PIX" && "💠 Pix — pagamento instantâneo"}
                {formaPagamento === "CARTAO" &&
                  `💳 Cartão de crédito — ${parcelas}x de R$ ${(
                    calcularTotal() / parcelas
                  ).toFixed(2)}`}
                {formaPagamento === "BOLETO" &&
                  "📄 Boleto bancário — vencimento em 3 dias úteis"}
              </p>
            </div>

            <div style={styles.modalBotoes}>
              <button
                style={styles.botaoCancelar}
                onClick={() => setModalAberto(false)}
              >
                Cancelar
              </button>
              <button style={styles.botaoConfirmar} onClick={confirmarPedido}>
                Confirmar pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f0f0f0",
    fontFamily: "sans-serif",
  },
  header: {
    background: "linear-gradient(90deg, #2563eb, #1e40af)",
    padding: "18px 40px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
  },
  logo: {
    color: "white",
    fontSize: "28px",
    fontWeight: "800",
    flex: 1,
    letterSpacing: "1px",
  },
  abaBar: {
    backgroundColor: "white",
    padding: "0 32px",
    display: "flex",
    gap: "4px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  },
  aba: {
    padding: "14px 20px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: "14px",
    color: "#555",
    borderBottom: "3px solid transparent",
  },
  abaAtiva: {
    padding: "14px 20px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: "14px",
    color: "#2196F3",
    fontWeight: "bold",
    borderBottom: "3px solid #2196F3",
  },
  badge: {
    backgroundColor: "#f44336",
    color: "white",
    borderRadius: "50%",
    padding: "2px 7px",
    fontSize: "12px",
    marginLeft: "6px",
  },
  conteudo: { padding: "24px 32px" },
  titulo: { margin: "0 0 20px", color: "#333", fontSize: "20px" },
  toast: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 16px",
    borderRadius: "4px",
    marginBottom: "16px",
    display: "inline-block",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "16px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
    transition: "0.3s",
  },
  cardImgPlaceholder: {
    background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
    height: "180px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "70px",
  },
  cardBody: { padding: "12px" },
  cardNome: {
    margin: "0 0 8px",
    fontWeight: "700",
    fontSize: "18px",
    color: "#111827",
  },
  cardDesc: { margin: "0 0 8px", fontSize: "12px", color: "#777" },
  cardPreco: { margin: "0 0 4px", fontSize: "13px", color: "#555" },
  cardPrecoValor: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#2563eb",
  },
  cardEstoque: { margin: "0 0 12px", fontSize: "12px", color: "#4CAF50" },
  cardFooter: { display: "flex", gap: "8px", alignItems: "center" },
  inputQtd: {
    width: "55px",
    padding: "6px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "14px",
    textAlign: "center",
  },
  botaoAdicionar: {
    flex: 1,
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "12px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
  },
  botaoDesabilitado: {
    flex: 1,
    backgroundColor: "#ccc",
    color: "white",
    border: "none",
    padding: "8px",
    borderRadius: "4px",
    cursor: "not-allowed",
    fontSize: "13px",
  },
  carrinhoVazio: {
    textAlign: "center",
    padding: "60px",
    backgroundColor: "white",
    borderRadius: "8px",
  },
  carrinhoLayout: { display: "flex", gap: "24px", alignItems: "flex-start" },
  carrinhoItens: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
carrinhoCard: {
  backgroundColor: "#fff",
  borderRadius: "16px",
  padding: "20px",
  display: "flex",
  gap: "16px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
},
  carrinhoImgPlaceholder: {
    width: "70px",
    height: "70px",
    backgroundColor: "#e3f2fd",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
  },
  carrinhoInfo: { flex: 1 },
  carrinhoNome: { margin: "0 0 4px", fontWeight: "bold", fontSize: "15px" },
  carrinhoDesc: { margin: "0 0 4px", fontSize: "13px", color: "#777" },
  carrinhoPreco: { margin: 0, fontSize: "13px", color: "#555" },
  carrinhoAcoes: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "8px",
  },
  carrinhoSubtotal: {
    margin: 0,
    fontWeight: "bold",
    fontSize: "16px",
    color: "#2196F3",
  },
  botaoRemover: {
    backgroundColor: "#fff",
    color: "#f44336",
    border: "1px solid #f44336",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
  },
resumo: {
  backgroundColor: "#fff",
  borderRadius: "18px",
  padding: "24px",
  width: "320px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  position: "sticky",
  top: "20px",
},
  resumoLinha: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    color: "#555",
    marginBottom: "8px",
  },
  resumoDivisor: { borderTop: "1px solid #eee", margin: "12px 0" },
  resumoTotal: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: "bold",
    fontSize: "18px",
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    color: "#555",
    marginBottom: "6px",
  },
  select: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "14px",
    cursor: "pointer",
    marginBottom: "12px",
  },
botaoFinalizar: {
  width: "100%",
  background: "linear-gradient(90deg,#22c55e,#16a34a)",
  color: "white",
  border: "none",
  padding: "16px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "17px"
},
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
modal: {
  backgroundColor: "#fff",
  borderRadius: "20px",
  padding: "35px",
  width: "500px",
  boxShadow: "0 20px 60px rgba(0,0,0,0.25)"
},
  modalTitulo: { margin: "0 0 20px", color: "#333", fontSize: "22px" },
  modalSecao: { marginBottom: "16px" },
  modalLabel: {
    margin: "0 0 8px",
    fontWeight: "bold",
    color: "#555",
    fontSize: "13px",
  },
  modalLinha: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    color: "#333",
    marginBottom: "6px",
  },
  modalDivisor: { borderTop: "1px solid #eee", margin: "16px 0" },
  modalPagamento: {
    margin: 0,
    fontSize: "15px",
    color: "#2196F3",
    fontWeight: "bold",
  },
  modalBotoes: { display: "flex", gap: "12px", marginTop: "24px" },
  botaoCancelar: {
    flex: 1,
    backgroundColor: "white",
    color: "#555",
    border: "1px solid #ddd",
    padding: "12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "15px",
  },
  botaoConfirmar: {
    flex: 2,
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
  },
  botaoSair: {
  backgroundColor: "rgba(255,255,255,0.15)",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.3)",
  padding: "10px 18px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
  backdropFilter: "blur(10px)",
  transition: "all 0.3s ease",
},
};

export default Cliente;