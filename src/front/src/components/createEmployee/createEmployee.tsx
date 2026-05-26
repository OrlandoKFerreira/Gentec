import { useEffect, useState } from "react";
import { criarFuncionario, listarSetores } from "../../services/api";
import type { AppAction, Sector } from "../../types";
import styles from "./CreateEmployee.module.css";

interface CreateEmployeeProps {
    dispatch: (action: AppAction) => void;
}

const timeOptions = Array.from({ length: 24 * 4 }, (_, index) => {
    const totalMinutes = index * 15;
    const hours = Math.floor(totalMinutes / 60).toString().padStart(2, "0");
    const minutes = (totalMinutes % 60).toString().padStart(2, "0");

    return `${hours}:${minutes}`;
});

export default function CreateEmployee({ dispatch }: CreateEmployeeProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [cpf, setCpf] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [sector, setSector] = useState("");
    const [isManager, setIsManager] = useState(false);
    const [startTime, setStartTime] = useState("08:00");
    const [endTime, setEndTime] = useState("17:00");
    const [sectors, setSectors] = useState<Sector[]>([]);

    useEffect(() => {
        async function loadSectors() {
            const response = await listarSetores();
            if (!response.ok) return;

            const data = await response.json();
            if (!Array.isArray(data)) return;

            setSectors(data);
            setSector(String(data[0]?.id_setor || ""));
        }

        loadSectors();
    }, []);

    async function handleCreate() {
        try {
            if (!sector) {
                alert("Selecione um setor.");
                return;
            }

            if (!isValidTime(startTime) || !isValidTime(endTime)) {
                alert("Informe os horários no formato 24h, por exemplo 08:00 e 17:00.");
                return;
            }

            const response = await criarFuncionario({
                id_setor: Number(sector),
                eh_gestor: isManager,
                nome: name,
                email,
                senha: password,
                cpf: cpf.replace(/\D/g, ""),
                cargo: role,
                inicio_expediente: startTime,
                fim_expediente: endTime,
            });

            if (response.ok) {
                dispatch({ type: "SET_VIEW", payload: "dashboard" });
                return;
            }

            const message = await response.text();
            alert(message || "Não foi possível cadastrar o funcionário.");
        } catch {
            alert("Não foi possível conectar ao backend.");
        }
    }

    const isValidTime = (value: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value);

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
        if (value.length > 11) value = value.slice(0, 11);

        // Apply mask: XXX.XXX.XXX-XX
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

        setCpf(value);
    };

    return (
        <div className={styles.container}>
            <div className={styles.back} onClick={() => dispatch({ type: "SET_VIEW", payload: "dashboard" })}><i className="fa-solid fa-house"></i></div>
            <section className={styles.title}>
                <h1>Criar funcionário</h1>
                <h2>Insira os dados do funcionário</h2>
            </section>
            <section className={styles.form}>
                <div>
                    <label htmlFor="name">Nome:</label>
                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="cpf">CPF:</label>
                    <input
                        type="text"
                        id="cpf"
                        value={cpf}
                        onChange={handleCpfChange}
                        placeholder="000.000.000-00"
                        maxLength={14}
                    />
                </div>
                <div>
                    <label htmlFor="password">Senha:</label>
                    <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="role">Cargo:</label>
                    <input type="text" id="role" value={role} onChange={e => setRole(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="sector">Setor:</label>
                    <select id="sector" value={sector} onChange={e => setSector(e.target.value)}>
                        {sectors.map(option => (
                            <option key={option.id_setor} value={option.id_setor}>
                                {option.nome}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.checkboxField}>
                    <input
                        type="checkbox"
                        id="isManager"
                        checked={isManager}
                        onChange={e => setIsManager(e.target.checked)}
                    />
                    <label htmlFor="isManager">Gestor</label>
                </div>
                <div>
                    <label htmlFor="startTime">Entrada:</label>
                    <select
                        id="startTime"
                        value={startTime}
                        onChange={e => setStartTime(e.target.value)}
                    >
                        {timeOptions.map(time => (
                            <option key={time} value={time}>
                                {time}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="endTime">Saída:</label>
                    <select
                        id="endTime"
                        value={endTime}
                        onChange={e => setEndTime(e.target.value)}
                    >
                        {timeOptions.map(time => (
                            <option key={time} value={time}>
                                {time}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <button onClick={handleCreate}>
                        Salvar
                    </button>
                </div>
            </section>
        </div>
    );
}
