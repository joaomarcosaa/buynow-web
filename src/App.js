import React, { useState, useEffect } from "react";
import Login from "./pages/Login";
import Cliente from "./pages/Cliente";
import Admin from "./pages/Admin";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "BuyNow";

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (dados) => {
    setUsuario(dados);
  };

  const handleLogout = () => {
    setUsuario(null);
  };

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#f5f7fa",
        }}
      >
        <h1
          style={{
            color: "#2563eb",
            fontSize: "48px",
            margin: 0,
            fontWeight: "800",
          }}
        >
          🛒 BuyNow
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginTop: "10px",
            fontSize: "16px",
          }}
        >
          Carregando...
        </p>
      </div>
    );
  }

  if (!usuario) {
    return <Login onLogin={handleLogin} />;
  }

  if (usuario.tipo === "ADMIN") {
    return (
      <Admin
        usuario={usuario}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <Cliente
      usuario={usuario}
      onLogout={handleLogout}
    />
  );
}

export default App;