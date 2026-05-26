import { useEffect, useMemo, useState } from "react";
import { listarFuncionarios, listarHistoricoHumor, listarHistoricoHumorFuncionario } from "../../services/api";
import type { Employee, RegistroHumor } from "../../types";
import styles from "./controleHumor.module.css";
import { formatDate, formatHumor } from "./humorUtils";

interface RegistrosHumorRHProps {
  selectedEmployee: Employee | null;
  onSelectEmployee: (employee: Employee) => void;
  onBackToList: () => void;
}

export default function RegistrosHumorRH({ selectedEmployee, onSelectEmployee, onBackToList }: RegistrosHumorRHProps) {
  const [registros, setRegistros] = useState<RegistroHumor[]>([]);
  const [funcionarios, setFuncionarios] = useState<Employee[]>([]);
  const [data, setData] = useState("");
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);

      try {
        const registrosRequest = selectedEmployee
          ? listarHistoricoHumorFuncionario(selectedEmployee.id_funcionario)
          : listarHistoricoHumor();

        const [registrosResponse, funcionariosResponse] = await Promise.all([
          registrosRequest,
          listarFuncionarios(),
        ]);

        if (ignore) return;

        if (registrosResponse.ok) {
          setRegistros(await registrosResponse.json());
        } else {
          setError("Nao foi possivel carregar os registros de humor.");
        }

        if (funcionariosResponse.ok) {
          setFuncionarios(await funcionariosResponse.json());
        }
      } catch {
        if (!ignore) {
          setError("Erro de conexao ao carregar registros de humor.");
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
  }, [selectedEmployee]);

  const funcionariosPorId = useMemo(() => {
    return new Map(funcionarios.map((funcionario) => [funcionario.id_funcionario, funcionario]));
  }, [funcionarios]);

  const registrosFiltrados = useMemo(() => {
    const nomeBusca = nome.trim().toLowerCase();

    return registros
      .filter((registro) => !data || registro.dataRegistro === data)
      .filter((registro) => {
        if (!nomeBusca || selectedEmployee) return true;

        const funcionario = funcionariosPorId.get(registro.id_funcionario);
        return funcionario?.nome.toLowerCase().includes(nomeBusca);
      })
      .sort((a, b) => b.dataRegistro.localeCompare(a.dataRegistro));
  }, [data, funcionariosPorId, nome, registros, selectedEmployee]);

  const getNomeFuncionario = (idFuncionario: number) => {
    return funcionariosPorId.get(idFuncionario)?.nome ?? `Funcionario #${idFuncionario}`;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>{selectedEmployee ? `Historico - ${selectedEmployee.nome}` : "Registros de Humor"}</h1>
          <p>Total de registros: {registrosFiltrados.length}</p>
        </div>
        {selectedEmployee && (
          <button className={styles.ghostButton} type="button" onClick={onBackToList}>
            Voltar
          </button>
        )}
      </header>

      {!selectedEmployee && (
        <section className={styles.panel}>
          <h2>Filtros</h2>
          <div className={styles.filters}>
            <div className={styles.field}>
              <label htmlFor="filtroDataHumor">Data</label>
              <input id="filtroDataHumor" type="date" value={data} onChange={(event) => setData(event.target.value)} />
            </div>
            <div className={styles.field}>
              <label htmlFor="filtroFuncionarioHumor">Funcionario</label>
              <input
                id="filtroFuncionarioHumor"
                type="text"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                placeholder="Nome do funcionario"
              />
            </div>
            <button className={styles.ghostButton} type="button" onClick={() => { setData(""); setNome(""); }}>
              Limpar
            </button>
          </div>
        </section>
      )}

      {error && <p className={styles.error}>{error}</p>}

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                {!selectedEmployee && <th>Funcionario</th>}
                <th>Data</th>
                <th>Humor</th>
                <th>Comentario</th>
                {!selectedEmployee && <th>Historico</th>}
              </tr>
            </thead>
            <tbody>
              {registrosFiltrados.length > 0 ? (
                registrosFiltrados.map((registro) => {
                  const funcionario = funcionariosPorId.get(registro.id_funcionario);

                  return (
                    <tr key={registro.id_registro_humor}>
                      {!selectedEmployee && <td>{getNomeFuncionario(registro.id_funcionario)}</td>}
                      <td>{formatDate(registro.dataRegistro)}</td>
                      <td>{formatHumor(registro.humor)}</td>
                      <td>{registro.comentario || "-"}</td>
                      {!selectedEmployee && (
                        <td>
                          <button
                            className={styles.ghostButton}
                            type="button"
                            disabled={!funcionario}
                            onClick={() => funcionario && onSelectEmployee(funcionario)}
                          >
                            Visualizar
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={selectedEmployee ? 3 : 5} className={styles.empty}>Nenhum registro encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
