export type EncounterStatus =
  | "agendado"
  | "produzido"
  | "pago"
  | "parcial"
  | "glosado";

export interface Encounter {
  id: string;
  patient: string;
  procedure: string;
  date: string;
  data_encontro: string;
  value: number;
  paid: number;
  status: EncounterStatus;
  payer: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  encounters: number;
  totalBilled: number;
  lastVisit: string;
  insurance: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: "TISS" | "Extrato" | "PDF" | "XML";
  uploadedAt: string;
  status: "processado" | "processando" | "erro";
  encountersExtracted: number;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Médico" | "Financeiro";
  lastActive: string;
  credits: number;
}

export const statusLabels: Record<EncounterStatus, string> = {
  agendado: "Agendado",
  produzido: "Produzido",
  pago: "Pago",
  parcial: "Pago parcial",
  glosado: "Glosado",
};

export const encounters: Encounter[] = [
  {
    id: "E-1042",
    patient: "Maria Silva",
    procedure: "Consulta Cardiológica",
    date: "2026-05-06",
    value: 450,
    paid: 450,
    status: "pago",
    payer: "Unimed",
  },
  {
    id: "E-1041",
    patient: "João Pereira",
    procedure: "Eletrocardiograma",
    date: "2026-05-06",
    value: 280,
    paid: 0,
    status: "produzido",
    payer: "Bradesco Saúde",
  },
  {
    id: "E-1040",
    patient: "Ana Costa",
    procedure: "Holter 24h",
    date: "2026-05-05",
    value: 620,
    paid: 310,
    status: "parcial",
    payer: "Amil",
  },
  {
    id: "E-1039",
    patient: "Carlos Mendes",
    procedure: "Ecocardiograma",
    date: "2026-05-05",
    value: 540,
    paid: 0,
    status: "glosado",
    payer: "SulAmérica",
  },
  {
    id: "E-1038",
    patient: "Luísa Almeida",
    procedure: "Consulta Retorno",
    date: "2026-05-07",
    value: 250,
    paid: 0,
    status: "agendado",
    payer: "Particular",
  },
  {
    id: "E-1037",
    patient: "Roberto Dias",
    procedure: "Teste Ergométrico",
    date: "2026-05-08",
    value: 480,
    paid: 0,
    status: "agendado",
    payer: "Unimed",
  },
  {
    id: "E-1036",
    patient: "Fernanda Rocha",
    procedure: "MAPA 24h",
    date: "2026-05-04",
    value: 590,
    paid: 590,
    status: "pago",
    payer: "Bradesco Saúde",
  },
  {
    id: "E-1035",
    patient: "Pedro Henrique",
    procedure: "Consulta Cardiológica",
    date: "2026-05-03",
    value: 450,
    paid: 0,
    status: "glosado",
    payer: "Amil",
  },
];

export const patients: Patient[] = [
  {
    id: "P-001",
    name: "Maria Silva",
    age: 58,
    encounters: 12,
    totalBilled: 5400,
    lastVisit: "2026-05-06",
    insurance: "Unimed",
  },
  {
    id: "P-002",
    name: "João Pereira",
    age: 64,
    encounters: 8,
    totalBilled: 3200,
    lastVisit: "2026-05-06",
    insurance: "Bradesco Saúde",
  },
  {
    id: "P-003",
    name: "Ana Costa",
    age: 47,
    encounters: 15,
    totalBilled: 8900,
    lastVisit: "2026-05-05",
    insurance: "Amil",
  },
  {
    id: "P-004",
    name: "Carlos Mendes",
    age: 71,
    encounters: 6,
    totalBilled: 2700,
    lastVisit: "2026-05-05",
    insurance: "SulAmérica",
  },
  {
    id: "P-005",
    name: "Luísa Almeida",
    age: 39,
    encounters: 4,
    totalBilled: 1100,
    lastVisit: "2026-05-02",
    insurance: "Particular",
  },
  {
    id: "P-006",
    name: "Roberto Dias",
    age: 55,
    encounters: 9,
    totalBilled: 4350,
    lastVisit: "2026-04-28",
    insurance: "Unimed",
  },
];

export const files: FileItem[] = [
  {
    id: "F-201",
    name: "guia-tiss-mai-2026.xml",
    type: "TISS",
    uploadedAt: "2026-05-06 09:14",
    status: "processado",
    encountersExtracted: 23,
  },
  {
    id: "F-200",
    name: "extrato-unimed-abr.pdf",
    type: "Extrato",
    uploadedAt: "2026-05-05 16:42",
    status: "processado",
    encountersExtracted: 41,
  },
  {
    id: "F-199",
    name: "lote-bradesco-04-2026.pdf",
    type: "Extrato",
    uploadedAt: "2026-05-05 11:08",
    status: "processando",
    encountersExtracted: 0,
  },
  {
    id: "F-198",
    name: "demonstrativo-amil.pdf",
    type: "PDF",
    uploadedAt: "2026-05-04 14:30",
    status: "erro",
    encountersExtracted: 0,
  },
];

export const users: AppUser[] = [
  {
    id: "U-1",
    name: "Dr. Henrique Souza",
    email: "henrique@clinicaviva.com.br",
    role: "Admin",
    lastActive: "Agora",
    credits: 1240,
  },
  {
    id: "U-2",
    name: "Dra. Beatriz Lima",
    email: "beatriz@clinicaviva.com.br",
    role: "Médico",
    lastActive: "há 12 min",
    credits: 480,
  },
  {
    id: "U-3",
    name: "Marcos Tavares",
    email: "marcos@clinicaviva.com.br",
    role: "Financeiro",
    lastActive: "há 2 h",
    credits: 200,
  },
];

export const GLOBAL_SETTINGS_STORAGE_KEY = "fv_global_settings";

export function isPrivacyHideValuesEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(GLOBAL_SETTINGS_STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { privacy_hide_values?: boolean } | null;
    return parsed?.privacy_hide_values === true;
  } catch {
    return false;
  }
}

export function getConveniosAtendidos(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GLOBAL_SETTINGS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { convenios_atendidos?: unknown } | null;
    const arr = parsed?.convenios_atendidos;
    if (!Array.isArray(arr)) return [];
    const out: string[] = [];
    const seen = new Set<string>();
    for (const v of arr) {
      if (typeof v !== "string") continue;
      const trimmed = v.replace(/\s+/g, " ").trim();
      if (!trimmed) continue;
      const key = trimmed.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(trimmed);
    }
    return out.sort((a, b) =>
      a.localeCompare(b, "pt-BR", { sensitivity: "base" }),
    );
  } catch {
    return [];
  }
}

export const formatBRL = (v: number) => {
  if (isPrivacyHideValuesEnabled()) return "R$ ••••";
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export const parseBRL = (value: string): number => {
  const cleaned = value.replace(/[^\d,.-]/g, "");
  const normalized = cleaned
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatMoneyInput = (v: number): string => {
  return v.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const maskMoneyInput = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";

  const padded = digits.padStart(3, "0");
  const cents = padded.slice(-2);
  const whole = padded.slice(0, -2).replace(/^0+(?=\d)/, "") || "0";
  const groupedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${groupedWhole},${cents}`;
};

export const maskCpfInput = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

export const maskCnpjInput = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8)
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  }
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
};

export const maskCpfOrCnpjInput = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  return digits.length <= 11 ? maskCpfInput(digits) : maskCnpjInput(digits);
};

export const maskCrmInput = (value: string): string => {
  const normalized = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const firstLetterIndex = normalized.search(/[A-Z]/);

  const crmNumber =
    firstLetterIndex === -1
      ? normalized.replace(/\D/g, "")
      : normalized.slice(0, firstLetterIndex).replace(/\D/g, "");

  if (!crmNumber) return "";

  const uf =
    firstLetterIndex === -1
      ? ""
      : normalized
          .slice(firstLetterIndex)
          .replace(/[^A-Z]/g, "")
          .slice(0, 2);

  return uf ? `${crmNumber}/${uf}` : crmNumber;
};

export const maskPhoneInput = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

export const safeMoney = (value: unknown): number => {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(n, 0) : 0;
};

export const dateTimeBRFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export const formatDateTimeBR = (
  value: string | number | Date | null | undefined,
) => {
  if (value === null || typeof value === "undefined" || value === "")
    return "—";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  const parts = Object.fromEntries(
    dateTimeBRFormatter
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return `${parts.day}/${parts.month}/${parts.year} ${parts.hour}:${parts.minute}`;
};
