import styles from "./UserData.module.css";
import type { Employee } from "../../types";

interface UserDataProps {
    employee: Employee | null;
}

export default function UserData({ employee }: UserDataProps) {
    return (
        <div className={styles.container}>
            <section className={styles.title}>
                <h1>Meus Dados</h1>
                <p>Visão geral das suas informações</p>
            </section>

            <section className={styles.myData}>
                <div className={styles.block}>
                    <ul>
                        <li><span className={styles.bold}>Nome: </span>{employee?.nome || "-"}</li>
                        <li><span className={styles.bold}>CPF: </span>{employee?.cpf || "-"}</li>
                        <li><span className={styles.bold}>Setor: </span>{employee?.id_setor ? `${employee.id_setor} - ${employee.nome_setor}` : "Sem setor"}</li>
                        <li><span className={styles.bold}>Cargo: </span>{employee?.cargo || "-"}</li>
                    </ul>
                </div>
            </section>
        </div>
    );
}
