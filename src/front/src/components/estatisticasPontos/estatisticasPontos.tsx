import { useEffect, useState } from "react";
import styles from "./estatisticasPontos.module.css";
import { gerarEstatisticas } from "../../services/api";
import type { EstatisticasPonto, FuncionarioPontoResumo } from "../../types";

interface EstatisticasPontosProps {
  onVoltar: () => void;
}

export function EstatisticasPontos({ onVoltar }: EstatisticasPontosProps) {
  const [stats, setStats] = useState<EstatisticasPonto | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await gerarEstatisticas();
        if (response.ok) {
          const data: EstatisticasPonto = await response.json();
          setStats(data);
        } else {
          console.error("Failed to fetch estatisticas");
        }
      } catch (error) {
        console.error("Error fetching estatisticas:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      const response = await gerarEstatisticas();
      if (response.ok) {
        const data: EstatisticasPonto = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error refreshing estatisticas:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderFuncionarioList = (
    title: string,
    description: string,
    funcionarios: FuncionarioPontoResumo[],
    registroLabel: string
  ) => (
    <section className={styles.listPanel}>
      <div className={styles.listHeader}>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <span>{funcionarios.length}</span>
      </div>

      {funcionarios.length > 0 ? (
        <div className={styles.employeeList}>
          {funcionarios.map((funcionario) => (
            <article key={funcionario.id_funcionario} className={styles.employeeRow}>
              <div>
                <strong>{funcionario.nome}</strong>
                <p>{funcionario.cargo || "Cargo não informado"} · {funcionario.nome_setor || "Sem setor"}</p>
              </div>
              <div className={styles.timeInfo}>
                <span>Expediente {formatTime(funcionario.inicio_expediente)} - {formatTime(funcionario.fim_expediente)}</span>
                <strong>{registroLabel}: {formatTime(funcionario.horario_registro)}</strong>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className={styles.empty}>Nenhum funcionário nesta situação.</p>
      )}
    </section>
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Estatísticas de Pontos</h1>
      </header>

      {loading ? (
        <p>Carregando...</p>
      ) : stats ? (
        <>
          <div className={styles.cardsContainer}>
            <div className={styles.card}>
              <h3>Funcionários</h3>
              <p className={styles.value}>{stats.total_funcionarios}</p>
            </div>
            <div className={styles.card}>
              <h3>Presentes Hoje</h3>
              <p className={styles.value}>{stats.presentes_hoje}</p>
            </div>
            <div className={styles.card}>
              <h3>Atrasados Agora</h3>
              <p className={styles.value}>{stats.atrasados_agora}</p>
            </div>
            <div className={styles.card}>
              <h3>Entradas Atrasadas</h3>
              <p className={styles.value}>{stats.entradas_atrasadas_hoje}</p>
            </div>
          </div>

          <div className={styles.detailsGrid}>
            {renderFuncionarioList(
              "Presentes hoje",
              "Funcionários que já registraram entrada hoje.",
              stats.funcionarios_presentes,
              "Entrada"
            )}
            {renderFuncionarioList(
              "Atrasados agora",
              "Funcionários sem entrada após o início do expediente.",
              stats.funcionarios_atrasados_agora,
              "Entrada"
            )}
            {renderFuncionarioList(
              "Entradas atrasadas hoje",
              "Funcionários que chegaram depois do horário previsto.",
              stats.funcionarios_entradas_atrasadas,
              "Entrada"
            )}
          </div>
        </>
      ) : (
        <p>Não foi possível carregar as estatísticas.</p>
      )}

      <div className={styles.actions}>
        <button className={styles.secondaryButton} onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? "Atualizando..." : "Atualizar"}
        </button>
        <button className={styles.button} onClick={onVoltar}>
          Voltar ao Histórico
        </button>
      </div>
    </div>
  );
}

function formatTime(time: string | null) {
  if (!time) return "--:--";
  return time.slice(0, 5);
}
