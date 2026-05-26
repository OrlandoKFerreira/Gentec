import type { FuncionarioPayload, TipoRegistroHumor } from "../types";

const API_URL = "http://localhost:8080";

export async function login(email: string, senha: string, ehGestor: boolean) {
  const response = await fetch(
    `${API_URL}/api/funcionarios/login?eh_gestor=${ehGestor}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        senha,
      }),
    }
  );

  return response;
}

export async function criarFuncionario(data: FuncionarioPayload) {
  const response = await fetch(
    "http://localhost:8080/api/funcionarios",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return response;
}

export async function listarSetores() {
  const response = await fetch(`${API_URL}/api/setores`);

  return response;
}

export async function listarFuncionarios() {
  const response = await fetch(`${API_URL}/api/funcionarios`);

  return response;
}

export async function deletarFuncionario(id: number) {
  const response = await fetch(
    `http://localhost:8080/api/funcionarios/${id}`,
    {
      method: "DELETE",
    }
  );

  return response;
}

export async function editarFuncionario(id: number, data: FuncionarioPayload) {
  const response = await fetch(
    `http://localhost:8080/api/funcionarios/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return response;
}

export async function consultarStatus(idFuncionario: number) {
  const response = await fetch(`${API_URL}/api/pontos/status?id_funcionario=${idFuncionario}`);
  return response;
}

export async function registrarEntrada(idFuncionario: number) {
  const response = await fetch(`${API_URL}/api/pontos/entrada`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id_funcionario: idFuncionario }),
  });
  return response;
}

export async function registrarSaida(idFuncionario: number) {
  const response = await fetch(`${API_URL}/api/pontos/saida`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id_funcionario: idFuncionario }),
  });
  return response;
}

interface HistoricoParams {
  id_funcionario?: number;
  data_inicio?: string;
  data_fim?: string;
}

export async function listarHistorico(params: HistoricoParams = {}) {
  const query = new URLSearchParams();

  if (params.id_funcionario) {
    query.set("id_funcionario", String(params.id_funcionario));
  }

  if (params.data_inicio) {
    query.set("data_inicio", params.data_inicio);
  }

  if (params.data_fim) {
    query.set("data_fim", params.data_fim);
  }

  const queryString = query.toString();
  const response = await fetch(`${API_URL}/api/pontos/historico${queryString ? `?${queryString}` : ""}`);
  return response;
}

export async function gerarEstatisticas() {
  const response = await fetch(`${API_URL}/api/pontos/estatisticas`);
  return response;
}

export async function registrarHumor(idFuncionario: number, humor: TipoRegistroHumor, comentario: string) {
  const response = await fetch(`${API_URL}/api/humor/registrar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id_funcionario: idFuncionario,
      humor,
      comentario,
    }),
  });

  return response;
}

export async function buscarHumorHoje(idFuncionario: number) {
  const response = await fetch(`${API_URL}/api/humor/funcionario-hoje/${idFuncionario}`);
  return response;
}

export async function listarHistoricoHumor() {
  const response = await fetch(`${API_URL}/api/humor/historico`);
  return response;
}

export async function listarHistoricoHumorFuncionario(idFuncionario: number) {
  const response = await fetch(`${API_URL}/api/humor/funcionario/${idFuncionario}`);
  return response;
}

export async function listarHistoricoHumorMensal() {
  const response = await fetch(`${API_URL}/api/humor/historico-mensal`);
  return response;
}
