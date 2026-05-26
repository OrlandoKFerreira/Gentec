import { useEffect, useMemo, useState } from "react";
import styles from "./RhDashboard.module.css";
import { LinearProgress, Box, Typography } from "@mui/material";
import { PieChart } from '@mui/x-charts';
import { listarFuncionarios } from "../../services/api";
import type { AppAction, Employee } from "../../types";

interface RhDashboardProps {
    dispatch: (action: AppAction) => void;
}

export default function RhDashboard({ dispatch }: RhDashboardProps) {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadEmployees() {
            try {
                const response = await listarFuncionarios();
                if (!response.ok) {
                    setError("Não foi possível carregar os dados do dashboard.");
                    return;
                }

                const data = await response.json();
                setEmployees(Array.isArray(data) ? data : []);
                setError("");
            } catch {
                setError("Não foi possível conectar ao backend.");
            }
        }

        loadEmployees();
    }, []);

    const totalEmployees = employees.length;
    const managerCount = employees.filter(employee => employee.eh_gestor).length;
    const collaboratorCount = totalEmployees - managerCount;
    const managerPercentage = totalEmployees === 0 ? 0 : (managerCount / totalEmployees) * 100;

    const sectorData = useMemo(() => {
        const counts = employees.reduce<Record<string, number>>((acc, employee) => {
            const sectorName = employee.nome_setor || "Sem setor";
            acc[sectorName] = (acc[sectorName] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(counts).map(([label, value], index) => ({
            id: index,
            value,
            label,
        }));
    }, [employees]);

    return (
        <div className={styles.container}>
            <section className={styles.title}>
                <h1>Dashboard RH</h1>
                <p>Visão geral da gestão de funcionários</p>
            </section>

            <div className={styles.dashboardGrid}>
                <section className={styles.summary}>
                    <h2>Resumo Geral</h2>
                    <div className={styles.block}>
                        <ul>
                            <li><span className={styles.bold}>Total de funcionários: </span>{totalEmployees}</li>
                            <li><span className={styles.bold}>Colaboradores: </span>{collaboratorCount}</li>
                            <li><span className={styles.bold}>Gestores/RH: </span>{managerCount}</li>
                        </ul>
                        {error && <p>{error}</p>}

                        <Box sx={{ width: '100%', mt: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                    Percentual de Gestores/RH
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                                    {managerPercentage.toFixed(1)}%
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={managerPercentage}
                                sx={{
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: '#edf2f7',
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: '#003d93',
                                        borderRadius: 5,
                                    }
                                }}
                            />
                        </Box>
                    </div>
                </section>

                <section className={styles.distribution}>
                    <h2>Distribuição por Setor</h2>
                    <div className={styles.chartBlock}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%', height: 200 }}>
                            {sectorData.length > 0 ? (
                                <PieChart
                                    series={[
                                        {
                                            data: sectorData,
                                            innerRadius: 30,
                                            outerRadius: 80,
                                            paddingAngle: 5,
                                            cornerRadius: 5,
                                        },
                                    ]}
                                    width={300}
                                    height={200}
                                    slotProps={{
                                        legend: {
                                            position: { vertical: 'middle', horizontal: 'end' },
                                        },
                                    }}
                                />
                            ) : (
                                <p>Nenhum funcionário cadastrado.</p>
                            )}

                        </Box>
                    </div>
                </section>
            </div>

            <section className={styles.actions}>
                <h2>Ações rápidas</h2>
                <div className={styles.block}>
                    <button onClick={() => dispatch({ type: "SET_VIEW", payload: "funcionarios" })}>
                        Gerenciar funcionários
                    </button>
                    <button onClick={() => dispatch({ type: "SET_VIEW", payload: "adicionar" })}>
                        Adicionar funcionário
                    </button>
                </div>
            </section>
        </div>
    );
}
