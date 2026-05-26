import { useEffect, useMemo, useState } from "react";
import { listarHistoricoHumor, listarHistoricoHumorMensal } from "../../services/api";
import type { RegistroHumor, RegistroHumorMensal, TipoRegistroHumor } from "../../types";
import styles from "./controleHumor.module.css";
import { countByHumor, formatHumor, getTodayISO, humorOptions } from "./humorUtils";

interface DashboardHumorRHProps {
  onVerRegistros: () => void;
  onVerMensal: () => void;
}

export default function DashboardHumorRH({ onVerRegistros, onVerMensal }: DashboardHumorRHProps) {
  const [registros, setRegistros] = useState<RegistroHumor[]>([]);
  const [mensal, setMensal] = useState<RegistroHumorMensal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const [historicoResponse, mensalResponse] = await Promise.all([
          listarHistoricoHumor(),
          listarHistoricoHumorMensal(),
        ]);

        if (ignore) return;

        if (historicoResponse.ok) {
          setRegistros(await historicoResponse.json());
        }

        if (mensalResponse.ok) {
          setMensal(await mensalResponse.json());
        }

        if (!historicoResponse.ok || !mensalResponse.ok) {
          setError("Algumas informações de humor nao puderam ser carregadas.");
        }
      } catch {
        if (!ignore) {
          setError("Erro de conexao ao carregar controle de humor.");
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

  const resumoDiario = useMemo(() => {
    return countByHumor(registros.filter((registro) => registro.dataRegistro === getTodayISO()));
  }, [registros]);

  const resumoMensal = useMemo(() => {
    const ultimoMes = [...mensal].sort((a, b) => (b.ano - a.ano) || (b.mes - a.mes))[0];

    return humorOptions.reduce<Record<TipoRegistroHumor, number>>((acc, option) => {
      acc[option.value] = Number(ultimoMes?.registros?.[option.value] ?? 0);
      return acc;
    }, {
      FELIZ: 0,
      NEUTRO: 0,
      TRISTE: 0,
      ESTRESSADO: 0,
    });
  }, [mensal]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Bem-estar dos Funcionarios</h1>
          <p>Visao geral dos registros de humor.</p>
        </div>
      </header>

      {error && <p className={styles.error}>{error}</p>}

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <section className={styles.grid}>
            <div className={styles.card}>
              <h2>Resumo Diario</h2>
              <div className={styles.statusList}>
                {humorOptions.map((option) => (
                  <p key={option.value}><span>{formatHumor(option.value)}</span><strong>{resumoDiario[option.value]}</strong></p>
                ))}
              </div>
            </div>

            <div className={styles.card}>
              <h2>Resumo Mensal</h2>
              <div className={styles.statusList}>
                {humorOptions.map((option) => (
                  <p key={option.value}><span>{formatHumor(option.value)}</span><strong>{resumoMensal[option.value]}</strong></p>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.panel}>
            <h2>Ações</h2>
            <div className={styles.actions}>
              <button className={styles.secondaryButton} type="button" onClick={onVerRegistros}>
                Ver Registros
              </button>
              <button className={styles.button} type="button" onClick={onVerMensal}>
                Ver Historico Mensal
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
