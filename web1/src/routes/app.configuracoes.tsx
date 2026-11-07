import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Settings, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/app/configuracoes")({
  component: Configuracoes,
  head: () => ({ meta: [{ title: "Configurações — Fatura Viva" }] }),
});

type GlobalSettings = {
  notifications_enabled: boolean;
  conciliation_auto_mark_paid: boolean;
  privacy_hide_values: boolean;
  convenios_atendidos: string[];
  alert_desfecho_days_default: number;
  alert_desfecho_days_by_convenio: Record<string, number>;
};

type ServicoItem = {
  codigo: string;
  tipo: string;
  nome: string;
  descricao?: string | null;
};

const DEFAULT_SETTINGS: GlobalSettings = {
  notifications_enabled: true,
  conciliation_auto_mark_paid: true,
  privacy_hide_values: false,
  convenios_atendidos: [],
  alert_desfecho_days_default: 7,
  alert_desfecho_days_by_convenio: {},
};

const STORAGE_KEY = "fv_global_settings";

function normalizeConvenio(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function clampDays(value: number) {
  if (!Number.isFinite(value)) return 7;
  const v = Math.round(value);
  return Math.max(0, Math.min(3650, v));
}

function normalizeAlertMap(
  map: Record<string, number>,
  allowedConvenios: string[],
) {
  const allowed = new Set(allowedConvenios.map((c) => c.toLowerCase()));
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(map ?? {})) {
    const key = normalizeConvenio(k);
    if (!key) continue;
    if (allowed.size && !allowed.has(key.toLowerCase())) continue;
    out[key] = clampDays(Number(v));
  }
  return Object.fromEntries(
    Object.entries(out).sort((a, b) =>
      a[0].localeCompare(b[0], "pt-BR", { sensitivity: "base" }),
    ),
  );
}

function mergeConvenios(existing: string[], toAdd: string[]) {
  const map = new Map<string, string>();
  for (const v of existing) {
    const normalized = normalizeConvenio(v);
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (!map.has(key)) map.set(key, normalized);
  }
  for (const v of toAdd) {
    const normalized = normalizeConvenio(v);
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (!map.has(key)) map.set(key, normalized);
  }
  return Array.from(map.values()).sort((a, b) =>
    a.localeCompare(b, "pt-BR", { sensitivity: "base" }),
  );
}

function readSettings(): GlobalSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<GlobalSettings> | null;
    if (!parsed || typeof parsed !== "object") return DEFAULT_SETTINGS;
    const convenios = Array.isArray(parsed.convenios_atendidos)
      ? mergeConvenios(
          [],
          parsed.convenios_atendidos.filter(
            (v): v is string => typeof v === "string",
          ),
        )
      : DEFAULT_SETTINGS.convenios_atendidos;
    return {
      notifications_enabled:
        typeof parsed.notifications_enabled === "boolean"
          ? parsed.notifications_enabled
          : DEFAULT_SETTINGS.notifications_enabled,
      conciliation_auto_mark_paid:
        typeof parsed.conciliation_auto_mark_paid === "boolean"
          ? parsed.conciliation_auto_mark_paid
          : DEFAULT_SETTINGS.conciliation_auto_mark_paid,
      privacy_hide_values:
        typeof parsed.privacy_hide_values === "boolean"
          ? parsed.privacy_hide_values
          : DEFAULT_SETTINGS.privacy_hide_values,
      convenios_atendidos: convenios,
      alert_desfecho_days_default: clampDays(
        typeof parsed.alert_desfecho_days_default === "number"
          ? parsed.alert_desfecho_days_default
          : Number(
              parsed.alert_desfecho_days_default ??
                DEFAULT_SETTINGS.alert_desfecho_days_default,
            ),
      ),
      alert_desfecho_days_by_convenio:
        parsed.alert_desfecho_days_by_convenio &&
        typeof parsed.alert_desfecho_days_by_convenio === "object" &&
        !Array.isArray(parsed.alert_desfecho_days_by_convenio)
          ? normalizeAlertMap(
              parsed.alert_desfecho_days_by_convenio as Record<string, number>,
              convenios,
            )
          : DEFAULT_SETTINGS.alert_desfecho_days_by_convenio,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function writeSettings(value: GlobalSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

function Configuracoes() {
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [convenioDraft, setConvenioDraft] = useState("");
  const [acceleratorConfirmOpen, setAcceleratorConfirmOpen] = useState(false);
  const [pendingAutoConciliationValue, setPendingAutoConciliationValue] =
    useState<boolean | null>(null);
  const [servicos, setServicos] = useState<ServicoItem[]>([]);
  const [servicosLoading, setServicosLoading] = useState(false);
  const [servicoDraft, setServicoDraft] = useState<ServicoItem>({
    codigo: "",
    tipo: "consulta",
    nome: "",
    descricao: "",
  });

  const patchRemote = async (patch: Partial<GlobalSettings>) => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) return null;
    const res = await fetch("/api/configuracoes", {
      method: "PATCH",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(patch),
    });
    if (!res.ok) return null;
    return (await res.json()) as Partial<GlobalSettings>;
  };

  const loadServicos = async () => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) return;
    setServicosLoading(true);
    try {
      const res = await fetch("/api/configuracoes/servicos", {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) return;
      const data = (await res.json()) as unknown;
      if (Array.isArray(data)) setServicos(data as ServicoItem[]);
    } finally {
      setServicosLoading(false);
    }
  };

  useEffect(() => {
    const local = readSettings();
    setSettings(local);

    const loadRemote = async () => {
      const token = localStorage.getItem("fv_access_token");
      if (!token) return;
      try {
        const res = await fetch("/api/configuracoes", {
          headers: {
            accept: "application/json",
            authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) return;
        const remote = (await res.json()) as Partial<GlobalSettings> | null;
        if (!remote || typeof remote !== "object") return;
        const remoteConvenios = Array.isArray(remote.convenios_atendidos)
          ? mergeConvenios(
              [],
              remote.convenios_atendidos.filter(
                (v): v is string => typeof v === "string",
              ),
            )
          : local.convenios_atendidos;
        const merged: GlobalSettings = {
          notifications_enabled:
            typeof remote.notifications_enabled === "boolean"
              ? remote.notifications_enabled
              : local.notifications_enabled,
          conciliation_auto_mark_paid:
            typeof remote.conciliation_auto_mark_paid === "boolean"
              ? remote.conciliation_auto_mark_paid
              : local.conciliation_auto_mark_paid,
          privacy_hide_values:
            typeof remote.privacy_hide_values === "boolean"
              ? remote.privacy_hide_values
              : local.privacy_hide_values,
          convenios_atendidos: remoteConvenios,
          alert_desfecho_days_default: clampDays(
            typeof remote.alert_desfecho_days_default === "number"
              ? remote.alert_desfecho_days_default
              : Number(
                  remote.alert_desfecho_days_default ??
                    local.alert_desfecho_days_default,
                ),
          ),
          alert_desfecho_days_by_convenio:
            remote.alert_desfecho_days_by_convenio &&
            typeof remote.alert_desfecho_days_by_convenio === "object" &&
            !Array.isArray(remote.alert_desfecho_days_by_convenio)
              ? normalizeAlertMap(
                  remote.alert_desfecho_days_by_convenio as Record<
                    string,
                    number
                  >,
                  remoteConvenios,
                )
              : normalizeAlertMap(
                  local.alert_desfecho_days_by_convenio,
                  remoteConvenios,
                ),
        };
        setSettings(merged);
        writeSettings(merged);
      } catch {
        return;
      }
    };

    loadRemote().catch(() => {});
    loadServicos().catch(() => {});
  }, []);

  const dirty = useMemo(() => {
    if (!settings) return false;
    const current = readSettings();
    return (
      settings.notifications_enabled !== current.notifications_enabled ||
      settings.conciliation_auto_mark_paid !==
        current.conciliation_auto_mark_paid ||
      settings.privacy_hide_values !== current.privacy_hide_values ||
      JSON.stringify(settings.convenios_atendidos) !==
        JSON.stringify(current.convenios_atendidos) ||
      clampDays(settings.alert_desfecho_days_default) !==
        clampDays(current.alert_desfecho_days_default) ||
      JSON.stringify(
        normalizeAlertMap(
          settings.alert_desfecho_days_by_convenio,
          settings.convenios_atendidos,
        ),
      ) !==
        JSON.stringify(
          normalizeAlertMap(
            current.alert_desfecho_days_by_convenio,
            current.convenios_atendidos,
          ),
        )
    );
  }, [settings]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" /> Configurações globais
        </h1>
        <p className="text-muted-foreground text-sm">
          Preferências da plataforma para a sua conta.
        </p>
      </div>

      <Card className="p-5 shadow-elegant">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <Label className="text-sm">Notificações</Label>
            <div className="text-xs text-muted-foreground mt-1">
              Mostra avisos sobre pendências e atualizações de conciliação.
            </div>
          </div>
          <Switch
            checked={!!settings?.notifications_enabled}
            onCheckedChange={async (checked) => {
              const base = settings ?? readSettings();
              const optimistic: GlobalSettings = {
                ...base,
                notifications_enabled: checked,
              };
              setSettings(optimistic);
              writeSettings(optimistic);
              window.dispatchEvent(new Event("fv:global-settings-changed"));
              const remote = await patchRemote({
                notifications_enabled: checked,
              });
              if (remote && typeof remote.notifications_enabled === "boolean") {
                const merged: GlobalSettings = {
                  ...optimistic,
                  notifications_enabled: remote.notifications_enabled,
                };
                setSettings(merged);
                writeSettings(merged);
                window.dispatchEvent(new Event("fv:global-settings-changed"));
              }
            }}
          />
        </div>
      </Card>

      <Card className="p-5 shadow-elegant">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <Label className="text-sm">Conciliação automática</Label>
            <div className="text-xs text-muted-foreground mt-1">
              Quando houver match, marcar encontro como pago automaticamente.
            </div>
          </div>
          <Switch
            checked={!!settings?.conciliation_auto_mark_paid}
            onCheckedChange={async (checked) => {
              if (checked) {
                setPendingAutoConciliationValue(true);
                setAcceleratorConfirmOpen(true);
                return;
              }
              const base = settings ?? readSettings();
              const optimistic: GlobalSettings = {
                ...base,
                conciliation_auto_mark_paid: checked,
              };
              setSettings(optimistic);
              writeSettings(optimistic);
              window.dispatchEvent(new Event("fv:global-settings-changed"));
              const remote = await patchRemote({
                conciliation_auto_mark_paid: checked,
              });
              if (
                remote &&
                typeof remote.conciliation_auto_mark_paid === "boolean"
              ) {
                const merged: GlobalSettings = {
                  ...optimistic,
                  conciliation_auto_mark_paid:
                    remote.conciliation_auto_mark_paid,
                };
                setSettings(merged);
                writeSettings(merged);
                window.dispatchEvent(new Event("fv:global-settings-changed"));
              }
            }}
          />
        </div>
      </Card>

      <Card className="p-5 shadow-elegant">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <Label className="text-sm">Privacidade</Label>
            <div className="text-xs text-muted-foreground mt-1">
              Ocultar valores financeiros em listas e cards.
            </div>
          </div>
          <Switch
            checked={!!settings?.privacy_hide_values}
            onCheckedChange={async (checked) => {
              const base = settings ?? readSettings();
              const optimistic: GlobalSettings = {
                ...base,
                privacy_hide_values: checked,
              };
              setSettings(optimistic);
              writeSettings(optimistic);
              window.dispatchEvent(new Event("fv:global-settings-changed"));
              const remote = await patchRemote({
                privacy_hide_values: checked,
              });
              if (remote && typeof remote.privacy_hide_values === "boolean") {
                const merged: GlobalSettings = {
                  ...optimistic,
                  privacy_hide_values: remote.privacy_hide_values,
                };
                setSettings(merged);
                writeSettings(merged);
                window.dispatchEvent(new Event("fv:global-settings-changed"));
              }
            }}
          />
        </div>
      </Card>

      <Card className="p-5 shadow-elegant">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Label className="text-sm">Convênios atendidos</Label>
            <div className="text-xs text-muted-foreground mt-1">
              Use esta lista para validar dados e alertar quando algo estiver
              fora do seu escopo de atendimento.
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <Input
            value={convenioDraft}
            onChange={(e) => setConvenioDraft(e.target.value)}
            placeholder="Ex.: Unimed"
          />
          <Button
            className="bg-gradient-primary shadow-elegant"
            disabled={!settings || !convenioDraft.trim()}
            onClick={async () => {
              if (!settings) return;
              const parts = convenioDraft
                .split(/[,;\n]/g)
                .map((p) => p.trim())
                .filter(Boolean);
              if (!parts.length) return;

              const token = localStorage.getItem("fv_access_token");
              if (!token) {
                const next = mergeConvenios(
                  settings.convenios_atendidos,
                  parts,
                );
                const updated = {
                  ...settings,
                  convenios_atendidos: next,
                  alert_desfecho_days_by_convenio: normalizeAlertMap(
                    settings.alert_desfecho_days_by_convenio,
                    next,
                  ),
                };
                setSettings(updated);
                writeSettings(updated);
                window.dispatchEvent(new Event("fv:global-settings-changed"));
                setConvenioDraft("");
                return;
              }

              try {
                const res = await fetch("/api/configuracoes", {
                  method: "PATCH",
                  headers: {
                    accept: "application/json",
                    "content-type": "application/json",
                    authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ add_convenios_atendidos: parts }),
                });
                if (!res.ok) {
                  toast.error("Não foi possível salvar os convênios");
                  return;
                }
                const remote =
                  (await res.json()) as Partial<GlobalSettings> | null;
                const convenios = Array.isArray(remote?.convenios_atendidos)
                  ? mergeConvenios(
                      [],
                      remote?.convenios_atendidos.filter(
                        (v): v is string => typeof v === "string",
                      ),
                    )
                  : mergeConvenios(settings.convenios_atendidos, parts);

                const updated: GlobalSettings = {
                  notifications_enabled:
                    typeof remote?.notifications_enabled === "boolean"
                      ? remote.notifications_enabled
                      : settings.notifications_enabled,
                  conciliation_auto_mark_paid:
                    typeof remote?.conciliation_auto_mark_paid === "boolean"
                      ? remote.conciliation_auto_mark_paid
                      : settings.conciliation_auto_mark_paid,
                  privacy_hide_values:
                    typeof remote?.privacy_hide_values === "boolean"
                      ? remote.privacy_hide_values
                      : settings.privacy_hide_values,
                  convenios_atendidos: convenios,
                  alert_desfecho_days_default: clampDays(
                    typeof remote?.alert_desfecho_days_default === "number"
                      ? remote.alert_desfecho_days_default
                      : Number(
                          remote?.alert_desfecho_days_default ??
                            settings.alert_desfecho_days_default,
                        ),
                  ),
                  alert_desfecho_days_by_convenio:
                    remote?.alert_desfecho_days_by_convenio &&
                    typeof remote.alert_desfecho_days_by_convenio ===
                      "object" &&
                    !Array.isArray(remote.alert_desfecho_days_by_convenio)
                      ? normalizeAlertMap(
                          remote.alert_desfecho_days_by_convenio as Record<
                            string,
                            number
                          >,
                          convenios,
                        )
                      : normalizeAlertMap(
                          settings.alert_desfecho_days_by_convenio,
                          convenios,
                        ),
                };

                setSettings(updated);
                writeSettings(updated);
                window.dispatchEvent(new Event("fv:global-settings-changed"));
                setConvenioDraft("");
              } catch {
                toast.error("Não foi possível salvar os convênios");
              }
            }}
          >
            <Plus className="h-4 w-4 mr-1" /> Adicionar
          </Button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {settings?.convenios_atendidos?.length ? (
            settings.convenios_atendidos.map((c) => (
              <Badge key={c} variant="secondary" className="gap-1 pr-1">
                <span className="truncate max-w-[240px]">{c}</span>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-sm hover:bg-accent px-1"
                  aria-label={`Remover ${c}`}
                  onClick={async () => {
                    if (!settings) return;
                    const key = c.toLowerCase();
                    const nextConvenios = settings.convenios_atendidos.filter(
                      (x) => x.toLowerCase() !== key,
                    );
                    const optimistic = {
                      ...settings,
                      convenios_atendidos: nextConvenios,
                      alert_desfecho_days_by_convenio: normalizeAlertMap(
                        settings.alert_desfecho_days_by_convenio,
                        nextConvenios,
                      ),
                    };
                    setSettings(optimistic);
                    writeSettings(optimistic);
                    window.dispatchEvent(
                      new Event("fv:global-settings-changed"),
                    );

                    const token = localStorage.getItem("fv_access_token");
                    if (!token) return;
                    try {
                      const res = await fetch("/api/configuracoes", {
                        method: "PATCH",
                        headers: {
                          accept: "application/json",
                          "content-type": "application/json",
                          authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          convenios_atendidos: nextConvenios,
                        }),
                      });
                      if (!res.ok) {
                        toast.error("Não foi possível salvar os convênios");
                        return;
                      }
                      const remote =
                        (await res.json()) as Partial<GlobalSettings> | null;
                      if (
                        remote &&
                        typeof remote === "object" &&
                        Array.isArray(remote.convenios_atendidos)
                      ) {
                        const updatedConvenios = mergeConvenios(
                          [],
                          remote.convenios_atendidos.filter(
                            (v): v is string => typeof v === "string",
                          ),
                        );
                        const updated = {
                          ...optimistic,
                          convenios_atendidos: updatedConvenios,
                          alert_desfecho_days_default: clampDays(
                            typeof remote.alert_desfecho_days_default ===
                              "number"
                              ? remote.alert_desfecho_days_default
                              : Number(
                                  remote.alert_desfecho_days_default ??
                                    optimistic.alert_desfecho_days_default,
                                ),
                          ),
                          alert_desfecho_days_by_convenio:
                            remote.alert_desfecho_days_by_convenio &&
                            typeof remote.alert_desfecho_days_by_convenio ===
                              "object" &&
                            !Array.isArray(
                              remote.alert_desfecho_days_by_convenio,
                            )
                              ? normalizeAlertMap(
                                  remote.alert_desfecho_days_by_convenio as Record<
                                    string,
                                    number
                                  >,
                                  updatedConvenios,
                                )
                              : normalizeAlertMap(
                                  optimistic.alert_desfecho_days_by_convenio,
                                  updatedConvenios,
                                ),
                        };
                        setSettings(updated);
                        writeSettings(updated);
                        window.dispatchEvent(
                          new Event("fv:global-settings-changed"),
                        );
                      }
                    } catch {
                      toast.error("Não foi possível salvar os convênios");
                    }
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </Badge>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">
              Nenhum convênio configurado.
            </div>
          )}
        </div>
      </Card>

      <Card className="p-5 shadow-elegant">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Label className="text-sm">Alerta de desfecho</Label>
            <div className="text-xs text-muted-foreground mt-1">
              Defina em quantos dias o sistema deve alertar quando um encontro
              ainda não tiver desfecho (pago, glosado total ou glosado parcial).
            </div>
          </div>
        </div>

        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              Padrão (geral)
            </div>
            <Input
              type="number"
              min={0}
              max={3650}
              step={1}
              value={String(
                settings?.alert_desfecho_days_default ??
                  DEFAULT_SETTINGS.alert_desfecho_days_default,
              )}
              onChange={(e) => {
                const value = e.target.value;
                const parsed =
                  value === ""
                    ? DEFAULT_SETTINGS.alert_desfecho_days_default
                    : Number(value);
                setSettings((prev) =>
                  prev
                    ? {
                        ...prev,
                        alert_desfecho_days_default: clampDays(parsed),
                      }
                    : DEFAULT_SETTINGS,
                );
              }}
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-xs text-muted-foreground mb-2">
            Por convênio (opcional)
          </div>
          {settings?.convenios_atendidos?.length ? (
            <div className="space-y-2">
              {settings.convenios_atendidos.map((c) => {
                const current = settings.alert_desfecho_days_by_convenio?.[c];
                return (
                  <div
                    key={c}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="text-sm font-medium truncate">{c}</div>
                    <Input
                      type="number"
                      min={0}
                      max={3650}
                      step={1}
                      className="w-[160px]"
                      value={current == null ? "" : String(current)}
                      placeholder={`Usar geral (${settings.alert_desfecho_days_default}d)`}
                      onChange={(e) => {
                        const raw = e.target.value;
                        setSettings((prev) => {
                          if (!prev) return DEFAULT_SETTINGS;
                          const nextMap = {
                            ...(prev.alert_desfecho_days_by_convenio ?? {}),
                          };
                          if (!raw.trim()) {
                            delete nextMap[c];
                            return {
                              ...prev,
                              alert_desfecho_days_by_convenio:
                                normalizeAlertMap(
                                  nextMap,
                                  prev.convenios_atendidos,
                                ),
                            };
                          }
                          nextMap[c] = clampDays(Number(raw));
                          return {
                            ...prev,
                            alert_desfecho_days_by_convenio: normalizeAlertMap(
                              nextMap,
                              prev.convenios_atendidos,
                            ),
                          };
                        });
                      }}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Adicione convênios atendidos para configurar regras por convênio.
            </div>
          )}
        </div>
      </Card>

      <Card className="p-5 shadow-elegant">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Label className="text-sm">
              Serviços (procedimentos e consultas)
            </Label>
            <div className="text-xs text-muted-foreground mt-1">
              Cadastre código, tipo, nome e descrição para validações e relações
              de dados quando um novo arquivo for incluído.
            </div>
          </div>
          <Button
            variant="secondary"
            disabled={servicosLoading}
            onClick={() => loadServicos().catch(() => {})}
          >
            Atualizar
          </Button>
        </div>

        <div className="mt-4 grid md:grid-cols-4 gap-2">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Código</div>
            <Input
              value={servicoDraft.codigo}
              onChange={(e) =>
                setServicoDraft((p) => ({ ...p, codigo: e.target.value }))
              }
              placeholder="Ex.: 10101012"
            />
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Tipo</div>
            <Select
              value={servicoDraft.tipo}
              onValueChange={(v) => setServicoDraft((p) => ({ ...p, tipo: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consulta">Consulta</SelectItem>
                <SelectItem value="procedimento">Procedimento</SelectItem>
                <SelectItem value="exame">Exame</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <div className="text-xs text-muted-foreground mb-1">Nome</div>
            <Input
              value={servicoDraft.nome}
              onChange={(e) =>
                setServicoDraft((p) => ({ ...p, nome: e.target.value }))
              }
              placeholder="Ex.: Consulta Cardiológica"
            />
          </div>
          <div className="md:col-span-4">
            <div className="text-xs text-muted-foreground mb-1">
              Descrição do encontro
            </div>
            <Textarea
              value={String(servicoDraft.descricao ?? "")}
              onChange={(e) =>
                setServicoDraft((p) => ({ ...p, descricao: e.target.value }))
              }
              placeholder="Ex.: Consulta de retorno, inclui avaliação e conduta."
            />
          </div>
        </div>

        <div className="mt-3 flex justify-end">
          <Button
            className="bg-gradient-primary shadow-elegant"
            disabled={
              !servicoDraft.codigo.trim() ||
              !servicoDraft.tipo.trim() ||
              !servicoDraft.nome.trim()
            }
            onClick={async () => {
              const token = localStorage.getItem("fv_access_token");
              if (!token) {
                toast.error("Sessão expirada. Faça login novamente.");
                return;
              }
              try {
                const res = await fetch("/api/configuracoes/servicos", {
                  method: "POST",
                  headers: {
                    accept: "application/json",
                    "content-type": "application/json",
                    authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    codigo: servicoDraft.codigo,
                    tipo: servicoDraft.tipo,
                    nome: servicoDraft.nome,
                    descricao: String(servicoDraft.descricao ?? ""),
                  }),
                });
                if (!res.ok) {
                  toast.error("Não foi possível salvar o serviço");
                  return;
                }
                const data = (await res.json()) as unknown;
                if (Array.isArray(data)) setServicos(data as ServicoItem[]);
                setServicoDraft({
                  codigo: "",
                  tipo: "consulta",
                  nome: "",
                  descricao: "",
                });
                toast.success("Serviço salvo");
              } catch {
                toast.error("Não foi possível salvar o serviço");
              }
            }}
          >
            <Plus className="h-4 w-4 mr-1" /> Adicionar serviço
          </Button>
        </div>

        <div className="mt-4 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
              <tr>
                <th className="text-left px-3 py-2 font-medium">Código</th>
                <th className="text-left px-3 py-2 font-medium">Tipo</th>
                <th className="text-left px-3 py-2 font-medium">Nome</th>
                <th className="text-left px-3 py-2 font-medium">Descrição</th>
                <th className="text-right px-3 py-2 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {servicos.length ? (
                servicos.map((s) => (
                  <tr key={s.codigo} className="border-t border-border">
                    <td className="px-3 py-2 tabular-nums">{s.codigo}</td>
                    <td className="px-3 py-2 text-muted-foreground capitalize">
                      {s.tipo}
                    </td>
                    <td className="px-3 py-2 font-medium">{s.nome}</td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {s.descricao || "—"}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          const token = localStorage.getItem("fv_access_token");
                          if (!token) return;
                          try {
                            const url = new URL(
                              "/api/configuracoes/servicos",
                              window.location.origin,
                            );
                            url.searchParams.set("codigo", s.codigo);
                            const res = await fetch(url.toString(), {
                              method: "DELETE",
                              headers: {
                                accept: "application/json",
                                authorization: `Bearer ${token}`,
                              },
                            });
                            if (!res.ok) {
                              toast.error("Não foi possível remover o serviço");
                              return;
                            }
                            const data = (await res.json()) as unknown;
                            if (Array.isArray(data))
                              setServicos(data as ServicoItem[]);
                            toast.success("Serviço removido");
                          } catch {
                            toast.error("Não foi possível remover o serviço");
                          }
                        }}
                      >
                        Remover
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-6 text-center text-sm text-muted-foreground"
                  >
                    {servicosLoading
                      ? "Carregando..."
                      : "Nenhum serviço cadastrado."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex justify-end gap-2">
        <Button
          variant="secondary"
          disabled={!settings || saving || !dirty}
          onClick={() => setSettings(readSettings())}
        >
          Descartar
        </Button>
        <Button
          className="bg-gradient-primary shadow-elegant"
          disabled={!settings || saving || !dirty}
          onClick={async () => {
            if (!settings || saving) return;
            setSaving(true);
            try {
              const normalizedConvenios = mergeConvenios(
                [],
                settings.convenios_atendidos,
              );
              const localSaved = {
                ...settings,
                convenios_atendidos: normalizedConvenios,
                alert_desfecho_days_default: clampDays(
                  settings.alert_desfecho_days_default,
                ),
                alert_desfecho_days_by_convenio: normalizeAlertMap(
                  settings.alert_desfecho_days_by_convenio,
                  normalizedConvenios,
                ),
              };
              writeSettings(localSaved);
              window.dispatchEvent(new Event("fv:global-settings-changed"));

              const token = localStorage.getItem("fv_access_token");
              if (token) {
                const res = await fetch("/api/configuracoes", {
                  method: "PUT",
                  headers: {
                    accept: "application/json",
                    "content-type": "application/json",
                    authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(localSaved),
                });
                if (res.ok) {
                  const remote =
                    (await res.json()) as Partial<GlobalSettings> | null;
                  if (remote && typeof remote === "object") {
                    const remoteConvenios = Array.isArray(
                      remote.convenios_atendidos,
                    )
                      ? mergeConvenios(
                          [],
                          remote.convenios_atendidos.filter(
                            (v): v is string => typeof v === "string",
                          ),
                        )
                      : localSaved.convenios_atendidos;
                    const merged: GlobalSettings = {
                      notifications_enabled:
                        typeof remote.notifications_enabled === "boolean"
                          ? remote.notifications_enabled
                          : localSaved.notifications_enabled,
                      conciliation_auto_mark_paid:
                        typeof remote.conciliation_auto_mark_paid === "boolean"
                          ? remote.conciliation_auto_mark_paid
                          : localSaved.conciliation_auto_mark_paid,
                      privacy_hide_values:
                        typeof remote.privacy_hide_values === "boolean"
                          ? remote.privacy_hide_values
                          : localSaved.privacy_hide_values,
                      convenios_atendidos: remoteConvenios,
                      alert_desfecho_days_default: clampDays(
                        typeof remote.alert_desfecho_days_default === "number"
                          ? remote.alert_desfecho_days_default
                          : Number(
                              remote.alert_desfecho_days_default ??
                                localSaved.alert_desfecho_days_default,
                            ),
                      ),
                      alert_desfecho_days_by_convenio:
                        remote.alert_desfecho_days_by_convenio &&
                        typeof remote.alert_desfecho_days_by_convenio ===
                          "object" &&
                        !Array.isArray(remote.alert_desfecho_days_by_convenio)
                          ? normalizeAlertMap(
                              remote.alert_desfecho_days_by_convenio as Record<
                                string,
                                number
                              >,
                              remoteConvenios,
                            )
                          : normalizeAlertMap(
                              localSaved.alert_desfecho_days_by_convenio,
                              remoteConvenios,
                            ),
                    };
                    setSettings(merged);
                    writeSettings(merged);
                    window.dispatchEvent(
                      new Event("fv:global-settings-changed"),
                    );
                  }
                } else {
                  toast.warning("Configurações salvas localmente", {
                    description: "Não foi possível sincronizar com o servidor.",
                  });
                  return;
                }
              }

              toast.success("Configurações salvas");
            } finally {
              setSaving(false);
            }
          }}
        >
          Salvar
        </Button>
      </div>

      <AlertDialog
        open={acceleratorConfirmOpen}
        onOpenChange={(open) => {
          setAcceleratorConfirmOpen(open);
          if (!open) setPendingAutoConciliationValue(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ativar IA aceleradora?</AlertDialogTitle>
            <AlertDialogDescription>
              Ao habilitar a conciliação automática, o sistema ativa o modelo de
              IA acelerador com custo extra de{" "}
              <span className="font-medium text-foreground">
                2,3 créditos por arquivo incluído
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setAcceleratorConfirmOpen(false);
                setPendingAutoConciliationValue(null);
              }}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-gradient-primary shadow-elegant"
              onClick={async (ev) => {
                ev.preventDefault();
                const checked = pendingAutoConciliationValue === true;
                if (!checked) {
                  setAcceleratorConfirmOpen(false);
                  setPendingAutoConciliationValue(null);
                  return;
                }

                const base = settings ?? readSettings();
                const optimistic: GlobalSettings = {
                  ...base,
                  conciliation_auto_mark_paid: true,
                };
                setSettings(optimistic);
                writeSettings(optimistic);
                window.dispatchEvent(new Event("fv:global-settings-changed"));

                const remote = await patchRemote({
                  conciliation_auto_mark_paid: true,
                });
                if (
                  remote &&
                  typeof remote.conciliation_auto_mark_paid === "boolean"
                ) {
                  const merged: GlobalSettings = {
                    ...optimistic,
                    conciliation_auto_mark_paid:
                      remote.conciliation_auto_mark_paid,
                  };
                  setSettings(merged);
                  writeSettings(merged);
                  window.dispatchEvent(new Event("fv:global-settings-changed"));
                }

                toast.success("Conciliação automática ativada");
                setAcceleratorConfirmOpen(false);
                setPendingAutoConciliationValue(null);
              }}
            >
              Aprovar e ativar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
