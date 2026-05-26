import { useCallback, useEffect, useState } from "react";
import styles from "./controlePonto.module.css";
import { consultarStatus, registrarEntrada, registrarSaida } from "../../services/api";
import type { Employee, StatusPonto } from "../../types";

interface ControlePontoProps {
  employee: Employee | null;
  onVerHistorico: () => void;
}

export default function ControlePonto({ employee, onVerHistorico }: ControlePontoProps) {
  const [status, setStatus] = useState<StatusPonto | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!employee) return;
    try {
      const res = await consultarStatus(employee.id_funcionario);
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
        setError(null);
      } else {
        setError("Erro ao carregar status do ponto.");
      }
    } catch {
      setError("Erro de conexão ao carregar status.");
    } finally {
      setLoading(false);
    }
  }, [employee]);

  useEffect(() => {
    let ignore = false;

    async function loadStatus() {
      if (!employee) return;

      try {
        const res = await consultarStatus(employee.id_funcionario);

        if (ignore) return;

        if (res.ok) {
          const data = await res.json();
          setStatus(data);
          setError(null);
        } else {
          setError("Erro ao carregar status do ponto.");
        }
      } catch {
        if (!ignore) {
          setError("Erro de conexão ao carregar status.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void loadStatus();

    return () => {
      ignore = true;
    };
  }, [employee]);

  const handleAction = async () => {
    if (!employee || !status) return;
    
    setActionLoading(true);
    try {
      let res;
      if (status.status_atual === "FORA_DO_EXPEDIENTE") {
        res = await registrarEntrada(employee.id_funcionario);
      } else {
        res = await registrarSaida(employee.id_funcionario);
      }

      if (res.ok) {
        await fetchStatus();
      } else {
        const errData = await res.json().catch(() => null);
        alert(errData?.message || "Erro ao registrar ponto.");
      }
    } catch {
      alert("Erro de conexão ao registrar ponto.");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "--:--";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!employee) {
    return <div className={styles.container}>Usuário não identificado.</div>;
  }

  if (loading) {
    return <div className={styles.container}>Carregando...</div>;
  }

  const isEmExpediente = status?.status_atual === "EM_EXPEDIENTE";
  const actionTitle = isEmExpediente ? "Registrar Saída" : "Registrar Entrada";
  const actionMessage = isEmExpediente 
    ? "Você está atualmente em expediente." 
    : "Você está fora do expediente.";

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>{actionTitle}</h2>
        <p className={styles.message}>{actionMessage}</p>
      </div>

      <div className={styles.card}>
        <h3 className={styles.sectionTitle}>Status Atual</h3>
        <div className={styles.statusInfo}>
          <p><strong>Última entrada:</strong> {formatDate(status?.ultima_entrada ?? null)}</p>
          <p><strong>Última saída:</strong> {formatDate(status?.ultima_saida ?? null)}</p>
          <p><strong>Status:</strong> {isEmExpediente ? "Trabalhando" : "Fora do trabalho"}</p>
        </div>
      </div>

      <div className={styles.card}>
        <h3 className={styles.sectionTitle}>Ação</h3>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.buttonGroup}>
          <button 
            className={styles.actionButton} 
            onClick={handleAction}
            disabled={actionLoading}
          >
            {actionLoading ? "Registrando..." : actionTitle}
          </button>
          <button
            className={styles.secondaryButton}
            onClick={onVerHistorico}
            type="button"
          >
            Histórico de Ponto
          </button>
        </div>
      </div>
    </div>
  );
}
