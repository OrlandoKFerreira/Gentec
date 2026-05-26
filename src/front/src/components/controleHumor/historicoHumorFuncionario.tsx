import { useEffect, useMemo, useState } from "react";
import { listarHistoricoHumorFuncionario } from "../../services/api";
import type { Employee, RegistroHumor } from "../../types";
import styles from "./controleHumor.module.css";
import { formatDate, formatHumor } from "./humorUtils";

interface HistoricoHumorFuncionarioProps {
  employee: Employee | null;
}

export default function HistoricoHumorFuncionario({ employee }: HistoricoHumorFuncionarioProps) {
  const [registros, setRegistros] = useState<RegistroHumor[]>([]);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function load() {
      if (!employee) {
        setLoading(false);
        return;
      }

      try {
        const response = await listarHistoricoHumorFuncionario(employee.id_funcionario);

        if (ignore) return;

        if (response.ok) {
          const data: RegistroHumor[] = await response.json();
          setRegistros(data);
          setError("");
        } else {
          setError("Nao foi possivel carregar seu historico de humor.");
        }
      } catch {
        if (!ignore) {
          setError("Erro de conexao ao carregar seu historico de humor.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      ignore = true;
    };
  }, [employee]);

  const registrosFiltrados = useMemo(() => {
    return registros
      .filter((registro) => !dataInicio || registro.dataRegistro >= dataInicio)
      .filter((registro) => !dataFim || registro.dataRegistro <= dataFim)
      .sort((a, b) => b.dataRegistro.localeCompare(a.dataRegistro));
  }, [dataFim, dataInicio, registros]);

  if (!employee) {
    return <div className={styles.container}>Usuario nao identificado.</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Meu Historico de Humor</h1>
          <p>Total de registros: {registrosFiltrados.length}</p>
        </div>
      </header>

      <section className={styles.panel}>
        <h2>Filtros</h2>
        <div className={styles.filters}>
          <div className={styles.field}>
            <label htmlFor="dataInicio">Data inicial</label>
            <input id="dataInicio" type="date" value={dataInicio} onChange={(event) => setDataInicio(event.target.value)} />
          </div>
          <div className={styles.field}>
            <label htmlFor="dataFim">Data final</label>
            <input id="dataFim" type="date" value={dataFim} onChange={(event) => setDataFim(event.target.value)} />
          </div>
          <button className={styles.ghostButton} type="button" onClick={() => { setDataInicio(""); setDataFim(""); }}>
            Limpar
          </button>
        </div>
      </section>

      {error && <p className={styles.error}>{error}</p>}

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Data</th>
                <th>Humor</th>
                <th>Comentario</th>
              </tr>
            </thead>
            <tbody>
              {registrosFiltrados.length > 0 ? (
                registrosFiltrados.map((registro) => (
                  <tr key={registro.id_registro_humor}>
                    <td>{formatDate(registro.dataRegistro)}</td>
                    <td>{formatHumor(registro.humor)}</td>
                    <td>{registro.comentario || "-"}</td>
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
