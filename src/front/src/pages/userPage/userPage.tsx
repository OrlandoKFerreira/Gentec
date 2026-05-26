import { useState } from "react";
import styles from "./UserPage.module.css";
import UserData from "../../components/userData/userData";
import ControlePonto from "../../components/controlePonto/controlePonto";
import HistoricoPontoFuncionario from "../../components/historicoPontoFuncionario/historicoPontoFuncionario";
import ControleHumorFuncionario from "../../components/controleHumor/controleHumorFuncionario";
import HistoricoHumorFuncionario from "../../components/controleHumor/historicoHumorFuncionario";
import { useNavigate } from "react-router-dom";
import type { AppAction, Employee } from "../../types";

export default function UserPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("meusdados");
  const storedEmployee = localStorage.getItem("gentec_funcionario");
  const employee: Employee | null = storedEmployee ? JSON.parse(storedEmployee) : null;
  const handleDispatch = (action: AppAction) => {
    switch (action.type) {
      case "SET_VIEW":
        setActiveTab(action.payload);
        break;
      default:
        console.warn("Ação não reconhecida:", action.type);
    }
  };

  return (
    <div className={styles.page}>
      <header>
        <h1>Sistema de RH</h1>
        <h1>{employee?.nome || "Funcionário"}</h1>
      </header>

      <main>
        <aside>
          <ul>
            <li
              className={activeTab === "meusdados" ? styles.activeTab : ""}
              onClick={() => handleDispatch({ type: "SET_VIEW", payload: "meusdados" })}
            >
              <h2>Meus Dados</h2>
            </li>
            <li
              className={activeTab === "controleponto" ? styles.activeTab : ""}
              onClick={() => handleDispatch({ type: "SET_VIEW", payload: "controleponto" })}
            >
              <h2>
                <i className="fa-regular fa-clock"></i> Controle de Ponto
              </h2>
            </li>
            <li
              className={activeTab === "historicoponto" ? styles.activeTab : ""}
              onClick={() => handleDispatch({ type: "SET_VIEW", payload: "historicoponto" })}
            >
              <h2>
                <i className="fa-solid fa-list"></i> Histórico de Ponto
              </h2>
            </li>
            <li
              className={activeTab === "controlehumor" || activeTab === "historicohumor" ? styles.activeTab : ""}
              onClick={() => handleDispatch({ type: "SET_VIEW", payload: "controlehumor" })}
            >
              <h2>
                <i className="fa-regular fa-face-smile"></i> Controle de Humor
              </h2>
            </li>
            <li
              className={styles.logout}
              onClick={() => navigate("/")}>
              <h2>
                <i className="fa-solid fa-right-from-bracket"></i> Sair
              </h2>
            </li>
          </ul>
        </aside>

        <div className={styles.content}>
          {activeTab === "meusdados" && (
            <UserData employee={employee} />
          )}
          {activeTab === "controleponto" && (
            <ControlePonto
              employee={employee}
              onVerHistorico={() => handleDispatch({ type: "SET_VIEW", payload: "historicoponto" })}
            />
          )}
          {activeTab === "historicoponto" && (
            <HistoricoPontoFuncionario employee={employee} />
          )}
          {activeTab === "controlehumor" && (
            <ControleHumorFuncionario
              employee={employee}
              onVerHistorico={() => handleDispatch({ type: "SET_VIEW", payload: "historicohumor" })}
            />
          )}
          {activeTab === "historicohumor" && (
            <HistoricoHumorFuncionario employee={employee} />
          )}
        </div>
      </main>
    </div>
  );
}
