import { useState, useMemo, useEffect } from "react";
import { deletarFuncionario } from "../../services/api";
import type { AppAction, Employee } from "../../types";
import styles from "./ManageEmployees.module.css";



interface ManageEmployeesProps {
    dispatch: (action: AppAction) => void;
}

export default function ManageEmployees({ dispatch }: ManageEmployeesProps) {

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [sectorFilters, setSectorFilters] = useState<string[]>([]);
    const [roleFilters, setRoleFilters] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState("");
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
    const [deleting, setDeleting] = useState(false);

    const uniqueSectors = useMemo(() => Array.from(new Set(employees.map(emp => emp.nome_setor || "Sem setor"))), [employees]);
    const uniqueRoles = useMemo(() => Array.from(new Set(employees.map(emp => emp.cargo || ""))).filter(Boolean), [employees]);

    const toggleSectorFilter = (sector: string) => {
        setSectorFilters(prev => prev.includes(sector) ? prev.filter(s => s !== sector) : [...prev, sector]);
    };

    const toggleRoleFilter = (role: string) => {
        setRoleFilters(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]);
    };
    async function handleDelete() {
    if (!employeeToDelete) return;

    setDeleting(true);
    try {
        const response = await deletarFuncionario(employeeToDelete.id_funcionario);

        if (!response.ok) {
            setError("Não foi possível remover o funcionário.");
            return;
        }

        setEmployees(prev =>
            prev.filter(
                funcionario =>
                    funcionario.id_funcionario !== employeeToDelete.id_funcionario
            )
        );
        setEmployeeToDelete(null);
    } catch {
        setError("Não foi possível conectar ao backend.");
    } finally {
        setDeleting(false);
    }
}
    const filteredEmployees = employees.filter(emp => {
        const sectorName = emp.nome_setor || "Sem setor";
        const matchSector = sectorFilters.length === 0 || sectorFilters.includes(sectorName);
        const matchRole = roleFilters.length === 0 || roleFilters.includes(emp.cargo);
        const matchSearch = (emp.nome || "").toLowerCase().includes(searchQuery.toLowerCase());
        return matchSector && matchRole && matchSearch;
    });

    useEffect(() => {
    async function carregarFuncionarios() {
        try {
            const response = await fetch("http://localhost:8080/api/funcionarios");
            if (!response.ok) {
                setError("Não foi possível carregar os funcionários.");
                return;
            }
            const data = await response.json();

            setEmployees(Array.isArray(data) ? data : []);
            setError("");
        } catch {
            setError("Não foi possível conectar ao backend.");
        }
    }

    carregarFuncionarios();
}, []);

    return (
        <div className={styles.container}>
            <div className={styles.back} onClick={() => dispatch({ type: "SET_VIEW", payload: "dashboard" })}><i className="fa-solid fa-house"></i></div>
            <section className={styles.title}>
                <h1>Gerenciar Funcionários</h1>
                <h2>Mostrando {filteredEmployees.length} funcionários</h2>
            </section>
            {error && <p>{error}</p>}

            {showFilters && (
                <section className={styles.filters}>
                    <div className={styles.filterGroup}>
                        <h3>Setores:</h3>
                        <div className={styles.checkboxList}>
                            {uniqueSectors.map(s => (
                                <label key={s}>
                                    <input
                                        type="checkbox"
                                        checked={sectorFilters.includes(s)}
                                        onChange={() => toggleSectorFilter(s)}
                                    />
                                    {s}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className={styles.filterGroup}>
                        <h3>Cargos:</h3>
                        <div className={styles.checkboxList}>
                            {uniqueRoles.map(r => (
                                <label key={r}>
                                    <input
                                        type="checkbox"
                                        checked={roleFilters.includes(r)}
                                        onChange={() => toggleRoleFilter(r)}
                                    />
                                    {r}
                                </label>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section className={styles.table}>
                <div className={styles.tableActions}>
                    <button onClick={() => setShowFilters(!showFilters)}>
                        <i className="fa-solid fa-filter"></i> {showFilters ? 'Ocultar Filtros' : 'Filtros'}
                    </button>
                    <input
                        type="text"
                        placeholder="Buscar por nome..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchBar}
                    />
                    <button onClick={() => dispatch({ type: "SET_VIEW", payload: "adicionar" })}><i className="fa-solid fa-plus"></i> Adicionar Funcionário</button>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Cargo</th>
                            <th>Setor</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map(emp => (
                            <tr key={emp.id_funcionario}>
                                <td>{emp.nome}</td>
                                <td>{emp.cargo}</td>
                                <td>{emp.id_setor ? `${emp.id_setor} - ${emp.nome_setor}` : "Sem setor"}</td>
                                <td>
                                    <button
                                        style={{ backgroundColor: "#003d93" }}
                                        onClick={() => dispatch({ type: "EDIT_EMPLOYEE", payload: emp })}
                                    >Editar</button>
                                    <button
                                        style={{ backgroundColor: "#930000ff" }}
                                        onClick={() => setEmployeeToDelete(emp)}
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {employeeToDelete && (
                <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="deleteEmployeeTitle">
                    <div className={styles.modal}>
                        <h2 id="deleteEmployeeTitle">Confirmar exclusÃ£o</h2>
                        <p>
                            Tem certeza que deseja remover <strong>{employeeToDelete.nome}</strong>?
                        </p>
                        <div className={styles.modalActions}>
                            <button
                                type="button"
                                className={styles.cancelButton}
                                onClick={() => setEmployeeToDelete(null)}
                                disabled={deleting}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className={styles.deleteButton}
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                {deleting ? "Removendo..." : "Excluir"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
