import { useEffect, useMemo, useState } from "react";
import { listarHistoricoHumorMensal } from "../../services/api";
import type { RegistroHumorMensal } from "../../types";
import styles from "./controleHumor.module.css";
import { formatHumor, humorOptions } from "./humorUtils";

const nomesMeses = [
  "Janeiro",
  "Fevereiro",
  "Marco",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export default function HistoricoHumorMensalRH() {
  const [registros, setRegistros] = useState<RegistroHumorMensal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const response = await listarHistoricoHumorMensal();

        if (ignore) return;

        if (response.ok) {
          setRegistros(await response.json());
        } else {
          setError("Nao foi possivel carregar o historico mensal.");
        }
      } catch {
        if (!ignore) {
          setError("Erro de conexao ao carregar o historico mensal.");
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
  }, []);

  const registrosOrdenados = useMemo(() => {
    return [...registros].sort((a, b) => (b.ano - a.ano) || (b.mes - a.mes));
  }, [registros]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Historico Mensal de Bem-estar</h1>
          <p>Total de meses: {registrosOrdenados.length}</p>
        </div>
      </header>

      {error && <p className={styles.error}>{error}</p>}

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mes</th>
                {humorOptions.map((option) => (
                  <th key={option.value}>{formatHumor(option.value)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {registrosOrdenados.length > 0 ? (
                registrosOrdenados.map((registro) => (
                  <tr key={`${registro.ano}-${registro.mes}`}>
                    <td>{nomesMeses[registro.mes - 1]}/{registro.ano}</td>
                    {humorOptions.map((option) => (
                      <td key={option.value}>{registro.registros?.[option.value] ?? 0}</td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className={styles.empty}>Nenhum registro encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
