import { useEffect, useState } from "react";
import { listarHistorico } from "../../services/api";
import type { Employee, RegistroPonto } from "../../types";
import styles from "../historicoPontos/historicoPontos.module.css";

interface HistoricoFuncionarioRow {
  data: string;
  entrada: string;
  saida: string;
}

interface HistoricoPontoFuncionarioProps {
  employee: Employee | null;
}

const processRawData = (data: RegistroPonto[]): HistoricoFuncionarioRow[] => {
  const groups: Record<string, HistoricoFuncionarioRow> = {};

  data.forEach((registro) => {
    const dateObj = new Date(registro.data_hora);
    const dateStr = dateObj.toLocaleDateString("pt-BR");
    const timeStr = dateObj.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    if (!groups[dateStr]) {
      groups[dateStr] = {
        data: dateStr,
        entrada: "--:--",
        saida: "--:--",
      };
    }

    if (registro.tipo === "ENTRADA" && groups[dateStr].entrada === "--:--") {
      groups[dateStr].entrada = timeStr;
    }

    if (registro.tipo === "SAIDA" && groups[dateStr].saida === "--:--") {
      groups[dateStr].saida = timeStr;
    }
  });

  return Object.values(groups).sort((a, b) => {
    const [dayA, monthA, yearA] = a.data.split("/");
    const [dayB, monthB, yearB] = b.data.split("/");
    const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
    const dateB = new Date(`${yearB}-${monthB}-${dayB}`);

    return dateB.getTime() - dateA.getTime();
  });
};

export default function HistoricoPontoFuncionario({ employee }: HistoricoPontoFuncionarioProps) {
  const [historico, setHistorico] = useState<HistoricoFuncionarioRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      if (!employee) {
        setLoading(false);
        return;
      }

      try {
        const response = await listarHistorico({ id_funcionario: employee.id_funcionario });

        if (ignore) return;

        if (response.ok) {
          const data: RegistroPonto[] = await response.json();
          setHistorico(processRawData(data));
          setError("");
        } else {
          setError("Não foi possível carregar seu histórico de pontos.");
        }
      } catch {
        if (!ignore) {
          setError("Erro de conexão ao carregar seu histórico de pontos.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void fetchData();

    return () => {
      ignore = true;
    };
  }, [employee]);

  if (!employee) {
    return <div className={styles.container}>Usuário não identificado.</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Meu Histórico de Ponto</h1>
      </header>

      {error && <p>{error}</p>}

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Data</th>
                <th>Entrada</th>
                <th>Saída</th>
              </tr>
            </thead>
            <tbody>
              {historico.length > 0 ? (
                historico.map((row) => (
                  <tr key={row.data}>
                    <td>{row.data}</td>
                    <td>{row.entrada}</td>
                    <td>{row.saida}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className={styles.empty}>Nenhum registro encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
