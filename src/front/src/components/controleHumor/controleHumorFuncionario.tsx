import { useCallback, useEffect, useState } from "react";
import { buscarHumorHoje, registrarHumor } from "../../services/api";
import type { Employee, RegistroHumor, TipoRegistroHumor } from "../../types";
import styles from "./controleHumor.module.css";
import { formatDate, formatHumor, getTodayISO, humorOptions } from "./humorUtils";

interface ControleHumorFuncionarioProps {
  employee: Employee | null;
  onVerHistorico: () => void;
}

export default function ControleHumorFuncionario({ employee, onVerHistorico }: ControleHumorFuncionarioProps) {
  const [humorHoje, setHumorHoje] = useState<RegistroHumor | null>(null);
  const [humor, setHumor] = useState<TipoRegistroHumor>("FELIZ");
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const carregarHumorHoje = useCallback(async () => {
    if (!employee) return;

    try {
      const response = await buscarHumorHoje(employee.id_funcionario);

      if (response.ok) {
        const data: RegistroHumor = await response.json();
        setHumorHoje(data);
        setError("");
      } else {
        setHumorHoje(null);
      }
    } catch {
      setHumorHoje(null);
    } finally {
      setLoading(false);
    }
  }, [employee]);

  useEffect(() => {
    let ignore = false;

    async function load() {
      if (!employee) {
        setLoading(false);
        return;
      }

      try {
        const response = await buscarHumorHoje(employee.id_funcionario);

        if (ignore) return;

        if (response.ok) {
          const data: RegistroHumor = await response.json();
          setHumorHoje(data);
        } else {
          setHumorHoje(null);
        }
      } catch {
        if (!ignore) {
          setHumorHoje(null);
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!employee) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await registrarHumor(employee.id_funcionario, humor, comentario.trim());

      if (response.ok) {
        const data: RegistroHumor = await response.json();
        setHumorHoje(data);
        setComentario("");
        setSuccess("Humor registrado com sucesso.");
        await carregarHumorHoje();
      } else {
        const data = await response.json().catch(() => null);
        setError(data?.message || "Nao foi possivel registrar seu humor.");
      }
    } catch {
      setError("Erro de conexao ao registrar humor.");
    } finally {
      setSaving(false);
    }
  };

  if (!employee) {
    return <div className={styles.container}>Usuario nao identificado.</div>;
  }

  if (loading) {
    return <div className={styles.container}>Carregando...</div>;
  }

  const jaRegistrado = Boolean(humorHoje);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Controle de Humor</h1>
          <p>Resumo do seu bem-estar diario.</p>
        </div>
      </header>

      <section className={styles.grid}>
        <div className={styles.card}>
          <h2>Registro de Hoje</h2>
          <div className={styles.statusList}>
            <p><span>Data</span><strong>{formatDate(getTodayISO())}</strong></p>
            <p>
              <span>Status</span>
              <strong>{jaRegistrado ? formatHumor(humorHoje!.humor) : "Ainda nao registrado"}</strong>
            </p>
            {humorHoje?.comentario && (
              <p><span>Comentario</span><strong>{humorHoje.comentario}</strong></p>
            )}
          </div>
        </div>

        <div className={styles.card}>
          <h2>Ações</h2>
          <p>{jaRegistrado ? "Voce ja registrou seu humor hoje." : "Registre como voce esta se sentindo hoje."}</p>
          <div className={styles.actions}>
            <button className={styles.secondaryButton} type="button" onClick={onVerHistorico}>
              Ver Historico
            </button>
          </div>
        </div>
      </section>

      {!jaRegistrado && (
        <section className={styles.panel}>
          <h2>Registrar Humor</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="humor">Como voce esta se sentindo hoje?</label>
              <select
                id="humor"
                value={humor}
                onChange={(event) => setHumor(event.target.value as TipoRegistroHumor)}
                required
              >
                {humorOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="comentario">Comentario (opcional)</label>
              <textarea
                id="comentario"
                value={comentario}
                onChange={(event) => setComentario(event.target.value)}
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}

            <div className={styles.actions}>
              <button className={styles.button} type="submit" disabled={saving}>
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
