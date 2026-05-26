import { useEffect, useState } from "react";
import styles from "./historicoPontos.module.css";
import { listarHistorico } from "../../services/api";
import type { RegistroPonto } from "../../types";

interface HistoricoRow {
  nome: string;
  data: string;
  entrada: string;
  saida: string;
}

interface HistoricoPontosProps {
  onVerEstatisticas: () => void;
}

const processRawData = (data: RegistroPonto[]): HistoricoRow[] => {
  const groups: Record<string, HistoricoRow> = {};

  data.forEach((registro) => {
    // data_hora format is like "2026-05-19T08:00:00"
    const dateObj = new Date(registro.data_hora);
    const dateStr = dateObj.toLocaleDateString("pt-BR");
    const timeStr = dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", hour12: false });
    
    const key = `${registro.id_funcionario}-${dateStr}`;

    if (!groups[key]) {
      groups[key] = {
        nome: registro.nome_funcionario,
        data: dateStr,
        entrada: "--:--",
        saida: "--:--"
      };
    }

    // The API returns records in descending order (newest first).
    if (registro.tipo === "ENTRADA") {
      // Only set the first time we see it to keep the newest ENTRADA (which appears first in the array)
      if (groups[key].entrada === "--:--") {
        groups[key].entrada = timeStr;
      }
    } else if (registro.tipo === "SAIDA") {
      // Only set the first time we see it to keep the newest SAIDA (which appears first in the array)
      if (groups[key].saida === "--:--") {
        groups[key].saida = timeStr;
      }
    }
  });

  // Sort by date descending
  return Object.values(groups).sort((a, b) => {
    const [dayA, monthA, yearA] = a.data.split("/");
    const [dayB, monthB, yearB] = b.data.split("/");
    const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
    const dateB = new Date(`${yearB}-${monthB}-${dayB}`);
    return dateB.getTime() - dateA.getTime();
  });
};

export function HistoricoPontos({ onVerEstatisticas }: HistoricoPontosProps) {
  const [historico, setHistorico] = useState<HistoricoRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await listarHistorico();
        if (response.ok) {
          const data: RegistroPonto[] = await response.json();
          setHistorico(processRawData(data));
        } else {
          console.error("Failed to fetch historico");
        }
      } catch (error) {
        console.error("Error fetching historico:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Histórico de Pontos</h1>
      </header>
      
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Funcionário</th>
                <th>Data</th>
                <th>Entrada</th>
                <th>Saída</th>
              </tr>
            </thead>
            <tbody>
              {historico.length > 0 ? (
                historico.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.nome}</td>
                    <td>{row.data}</td>
                    <td>{row.entrada}</td>
                    <td>{row.saida}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className={styles.empty}>Nenhum registro encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className={styles.actions}>
        <button className={styles.button} onClick={onVerEstatisticas}>
          Ver Estatísticas
        </button>
      </div>
    </div>
  );
}
