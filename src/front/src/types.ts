export interface Employee {
  id_funcionario: number;
  id_setor: number | null;
  nome_setor: string | null;
  eh_gestor?: boolean;
  nome: string;
  email?: string;
  cpf: string;
  cargo: string;
  inicio_expediente?: string | null;
  fim_expediente?: string | null;
}

export interface Sector {
  id_setor: number;
  nome: string;
  descricao: string;
}

export interface FuncionarioPayload {
  id_setor?: number;
  eh_gestor?: boolean;
  nome?: string;
  email?: string;
  senha?: string;
  cpf?: string;
  cargo?: string;
  inicio_expediente?: string;
  fim_expediente?: string;
}

export type AppAction =
  | { type: "SET_VIEW"; payload: string }
  | { type: "EDIT_EMPLOYEE"; payload: Employee };

export interface StatusPonto {
  id_funcionario: number;
  ultima_entrada: string | null;
  ultima_saida: string | null;
  status_atual: "EM_EXPEDIENTE" | "FORA_DO_EXPEDIENTE";
}

export interface RegistroPonto {
  id_registro_ponto: number;
  id_funcionario: number;
  nome_funcionario: string;
  tipo: "ENTRADA" | "SAIDA";
  data_hora: string;
}

export interface EstatisticasPonto {
  total_funcionarios: number;
  presentes_hoje: number;
  atrasados: number;
  atrasados_agora: number;
  entradas_atrasadas_hoje: number;
  funcionarios_presentes: FuncionarioPontoResumo[];
  funcionarios_atrasados_agora: FuncionarioPontoResumo[];
  funcionarios_entradas_atrasadas: FuncionarioPontoResumo[];
}

export interface FuncionarioPontoResumo {
  id_funcionario: number;
  nome: string;
  cargo: string;
  nome_setor: string | null;
  inicio_expediente: string | null;
  fim_expediente: string | null;
  horario_registro: string | null;
}

export type TipoRegistroHumor = "FELIZ" | "NEUTRO" | "TRISTE" | "ESTRESSADO";

export interface RegistroHumor {
  id_registro_humor: number;
  id_funcionario: number;
  humor: TipoRegistroHumor;
  comentario: string | null;
  dataRegistro: string;
}

export interface RegistroHumorMensal {
  mes: number;
  ano: number;
  registros: Partial<Record<TipoRegistroHumor, number>>;
}
