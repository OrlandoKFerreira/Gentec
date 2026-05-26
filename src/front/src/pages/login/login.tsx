import { useState, type FormEvent } from "react";
import { login } from "../../services/api";
import styles from "./Login.module.css"
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            let ehGestor = false;
            let response = await login(email, senha, ehGestor);

            if (response.status === 403) {
                ehGestor = true;
                response = await login(email, senha, ehGestor);
            }

            if (!response.ok) {
                setError("Email ou senha inválidos.");
                return;
            }

            const funcionario = await response.json();
            localStorage.setItem("gentec_funcionario", JSON.stringify(funcionario));
            navigate(funcionario.eh_gestor ? "/hrPage" : "/userPage");
        } catch {
            setError("Não foi possível conectar ao backend.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <header className={styles.title}>
                    <h1>Gentec</h1>
                    <p>Acesse sua conta para continuar</p>
                </header>
                <form className={styles.form} onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div>
                        <label htmlFor="password">Senha</label>
                        <input type="password" id="password" placeholder="••••••••" value={senha} onChange={e => setSenha(e.target.value)} required />
                    </div>
                    {error && <p>{error}</p>}
                    <div className={styles.buttonGroup}>
                        <button type="submit" disabled={loading}>
                            {loading ? "Entrando..." : "Entrar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
