import type { RegistroHumor, TipoRegistroHumor } from "../../types";

export const humorOptions: Array<{ value: TipoRegistroHumor; label: string }> = [
  { value: "FELIZ", label: "Feliz" },
  { value: "NEUTRO", label: "Neutro" },
  { value: "TRISTE", label: "Triste" },
  { value: "ESTRESSADO", label: "Estressado" },
];

export function formatHumor(humor: TipoRegistroHumor) {
  return humorOptions.find((option) => option.value === humor)?.label ?? humor;
}

export function formatDate(dateString: string) {
  const [year, month, day] = dateString.split("-");

  if (year && month && day) {
    return `${day}/${month}/${year}`;
  }

  return dateString;
}

export function getTodayISO() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function countByHumor(registros: RegistroHumor[]) {
  return humorOptions.reduce<Record<TipoRegistroHumor, number>>((acc, option) => {
    acc[option.value] = registros.filter((registro) => registro.humor === option.value).length;
    return acc;
  }, {
    FELIZ: 0,
    NEUTRO: 0,
    TRISTE: 0,
    ESTRESSADO: 0,
  });
}
