import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HRPage.module.css";
import RhDashboard from "../../components/rhDashboard/rhDashboard";
import ManageEmployees from "../../components/manageEmployees/manageEmployees";
import CreateEmployee from "../../components/createEmployee/createEmployee";
import EditEmployee from "../../components/editEmployee/editEmployee";
import { HistoricoPontos } from "../../components/historicoPontos/historicoPontos";
import { EstatisticasPontos } from "../../components/estatisticasPontos/estatisticasPontos";
import DashboardHumorRH from "../../components/controleHumor/dashboardHumorRH";
import RegistrosHumorRH from "../../components/controleHumor/registrosHumorRH";
import HistoricoHumorMensalRH from "../../components/controleHumor/historicoHumorMensalRH";
import type { AppAction, Employee } from "../../types";

export default function HRPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [selectedHumorEmployee, setSelectedHumorEmployee] = useState<Employee | null>(null);

  const handleDispatch = (action: AppAction) => {
    switch (action.type) {
      case "SET_VIEW":
        setActiveTab(action.payload);
        break;
      case "EDIT_EMPLOYEE":
        setEditingEmployee(action.payload);
        setActiveTab("editar");
        break;
    }
  };

  return (
    <div className={styles.page}>
      <header>
        <h1>Sistema de RH</h1>
        <h1></h1>
      </header>

      <main>
        <aside>
          <ul>
            <li
              className={activeTab === "dashboard" ? styles.activeTab : ""}
              onClick={() => handleDispatch({ type: "SET_VIEW", payload: "dashboard" })}
            >
              <h2>Dashboard</h2>
            </li>
            <li
              className={activeTab === "funcionarios" || activeTab === "adicionar" || activeTab === "editar" ? styles.activeTab : ""}
              onClick={() => handleDispatch({ type: "SET_VIEW", payload: "funcionarios" })}
            >
              <h2>Funcionários</h2>
            </li>
            <li
              className={activeTab === "historico" || activeTab === "estatisticas" ? styles.activeTab : ""}
              onClick={() => handleDispatch({ type: "SET_VIEW", payload: "historico" })}
            >
              <h2><i className="fa-regular fa-clock"></i> Controle de Ponto</h2>
            </li>
            <li
              className={activeTab === "humor" || activeTab === "humorRegistros" || activeTab === "humorMensal" || activeTab === "humorFuncionario" ? styles.activeTab : ""}
              onClick={() => handleDispatch({ type: "SET_VIEW", payload: "humor" })}
            >
              <h2><i className="fa-regular fa-face-smile"></i> Controle de Humor</h2>
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
          {activeTab === "dashboard" && (
            <RhDashboard dispatch={handleDispatch} />
          )}

          {activeTab === "funcionarios" && (
            <ManageEmployees dispatch={handleDispatch} />
          )}

          {activeTab === "adicionar" && (
            <CreateEmployee dispatch={handleDispatch} />
          )}

          {activeTab === "editar" && (
            <EditEmployee
              key={editingEmployee?.id_funcionario ?? "novo"}
              dispatch={handleDispatch}
              employee={editingEmployee}
            />
          )}

          {activeTab === "historico" && (
            <HistoricoPontos onVerEstatisticas={() => handleDispatch({ type: "SET_VIEW", payload: "estatisticas" })} />
          )}

          {activeTab === "estatisticas" && (
            <EstatisticasPontos onVoltar={() => handleDispatch({ type: "SET_VIEW", payload: "historico" })} />
          )}

          {activeTab === "humor" && (
            <DashboardHumorRH
              onVerRegistros={() => {
                setSelectedHumorEmployee(null);
                handleDispatch({ type: "SET_VIEW", payload: "humorRegistros" });
              }}
              onVerMensal={() => handleDispatch({ type: "SET_VIEW", payload: "humorMensal" })}
            />
          )}

          {activeTab === "humorRegistros" && (
            <RegistrosHumorRH
              selectedEmployee={null}
              onSelectEmployee={(employee) => {
                setSelectedHumorEmployee(employee);
                handleDispatch({ type: "SET_VIEW", payload: "humorFuncionario" });
              }}
              onBackToList={() => handleDispatch({ type: "SET_VIEW", payload: "humorRegistros" })}
            />
          )}

          {activeTab === "humorFuncionario" && (
            <RegistrosHumorRH
              selectedEmployee={selectedHumorEmployee}
              onSelectEmployee={(employee) => setSelectedHumorEmployee(employee)}
              onBackToList={() => {
                setSelectedHumorEmployee(null);
                handleDispatch({ type: "SET_VIEW", payload: "humorRegistros" });
              }}
            />
          )}

          {activeTab === "humorMensal" && (
            <HistoricoHumorMensalRH />
          )}
        </div>
      </main>
    </div>
  );
}
