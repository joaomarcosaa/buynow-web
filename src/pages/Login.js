import React, { useState } from 'react';
import api from '../services/api';

function Login({ onLogin }) {
    const [tela, setTela] = useState('login');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [form, setForm] = useState({
        nome: '', email: '', senha: '', cpf: '',
        celular: '', cep: '', endereco: '', numero: '', complemento: ''
    });

    const handleLogin = async () => {
        try {
            const resposta = await api.post('/usuarios/login', { email, senha });
            if (resposta.data.sucesso) {
                onLogin(resposta.data.dados);
            } else {
                setErro(resposta.data.mensagem);
            }
        } catch (e) {
            setErro('Email ou senha inválidos.');
        }
    };

    const handleCadastro = async () => {
        try {
            const resposta = await api.post('/usuarios/cadastrar', form);
            if (resposta.data.sucesso) {
                setSucesso('Conta criada com sucesso! Faça seu login.');
                setErro('');
                setForm({
                    nome: '', email: '', senha: '', cpf: '',
                    celular: '', cep: '', endereco: '', numero: '', complemento: ''
                });
                setTimeout(() => setTela('login'), 2000);
            } else {
                setErro(resposta.data.mensagem);
            }
        } catch (e) {
            setErro('Erro ao cadastrar. Tente novamente.');
        }
    };

    if (tela === 'cadastro') {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <h1 style={styles.titulo}>BuyNow</h1>
                    <p style={styles.subtitulo}>Criar conta</p>

                    <input style={styles.input} placeholder="Nome completo"
                        value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
                    <input style={styles.input} placeholder="Email" type="email"
                        value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    <input style={styles.input} placeholder="Senha" type="password"
                        value={form.senha} onChange={e => setForm({ ...form, senha: e.target.value })} />
                    <input style={styles.input} placeholder="CPF (000.000.000-00)"
                        value={form.cpf} onChange={e => setForm({ ...form, cpf: e.target.value })} />
                    <input style={styles.input} placeholder="Celular"
                        value={form.celular} onChange={e => setForm({ ...form, celular: e.target.value })} />
                    <input style={styles.input} placeholder="CEP"
                        value={form.cep} onChange={e => setForm({ ...form, cep: e.target.value })} />
                    <input style={styles.input} placeholder="Endereço"
                        value={form.endereco} onChange={e => setForm({ ...form, endereco: e.target.value })} />
                    <div style={styles.row}>
                        <input style={{ ...styles.input, flex: 1 }} placeholder="Número"
                            value={form.numero} onChange={e => setForm({ ...form, numero: e.target.value })} />
                        <input style={{ ...styles.input, flex: 2 }} placeholder="Complemento"
                            value={form.complemento} onChange={e => setForm({ ...form, complemento: e.target.value })} />
                    </div>

                    {erro && <p style={styles.erro}>{erro}</p>}
                    {sucesso && <p style={styles.sucesso}>{sucesso}</p>}

                    <button style={styles.botao} onClick={handleCadastro}>
                        Cadastrar
                    </button>
                    <button style={styles.botaoSecundario} onClick={() => { setTela('login'); setErro(''); }}>
                        Já tenho conta
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.titulo}>BuyNow</h1>
                <p style={styles.subtitulo}>Faça seu login</p>

                <input style={styles.input} type="email" placeholder="Email"
                    value={email} onChange={e => setEmail(e.target.value)} />
                <input style={styles.input} type="password" placeholder="Senha"
                    value={senha} onChange={e => setSenha(e.target.value)} />

                {erro && <p style={styles.erro}>{erro}</p>}
                {sucesso && <p style={styles.sucesso}>{sucesso}</p>}

                <button style={styles.botao} onClick={handleLogin}>
                    Entrar
                </button>
                <button style={styles.botaoSecundario} onClick={() => { setTela('cadastro'); setErro(''); }}>
                    Criar conta
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2563eb, #1e40af)'
    },

    card: {
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
        width: '420px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },

    titulo: {
        color: '#2563eb',
        textAlign: 'center',
        margin: 0,
        fontSize: '36px',
        fontWeight: '700'
    },

    subtitulo: {
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: '15px'
    },

    input: {
        padding: '14px',
        borderRadius: '10px',
        border: '1px solid #d1d5db',
        fontSize: '14px',
        outline: 'none',
        transition: '0.3s'
    },

    row: {
        display: 'flex',
        gap: '10px'
    },

    botao: {
        padding: '14px',
        backgroundColor: '#2563eb',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: '0.3s'
    },

    botaoSecundario: {
        padding: '12px',
        backgroundColor: '#ffffff',
        color: '#2563eb',
        border: '2px solid #2563eb',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: '0.3s'
    },

    erro: {
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        padding: '10px',
        borderRadius: '8px',
        textAlign: 'center',
        fontSize: '14px'
    },

    sucesso: {
        backgroundColor: '#dcfce7',
        color: '#16a34a',
        padding: '10px',
        borderRadius: '8px',
        textAlign: 'center',
        fontSize: '14px'
    }
};

export default Login;