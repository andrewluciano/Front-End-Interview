import {
  createFileRoute,
  Outlet,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { maskCpfInput, maskMoneyInput, parseBRL } from "@/lib/mock-data";
import { requestOpenEncounter } from "@/lib/open-encounter";
import {
  Bell,
  CalendarPlus,
  Check,
  ChevronsUpDown,
  Loader2,
  LogOut,
  Plus,
  Upload,
  UserPlus,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app")({
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("fv_access_token");
    if (!token) {
      sessionStorage.setItem(
        "fv_auth_notice",
        "Você precisa entrar para acessar a plataforma. Redirecionando…",
      );
      throw redirect({ to: "/login" });
    }

    try {
      const res = await fetch("/api/auth/me", {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("fv_access_token");
          sessionStorage.setItem(
            "fv_auth_notice",
            "Sessão expirada ou sem permissão. Redirecionando para o login…",
          );
          throw redirect({ to: "/login" });
        }
        return;
      }
    } catch (err) {
      if (
        err &&
        typeof err === "object" &&
        "name" in err &&
        (err as { name?: string }).name === "AbortError"
      ) {
        return;
      }
      if (err instanceof TypeError) {
        return;
      }
      localStorage.removeItem("fv_access_token");
      sessionStorage.setItem(
        "fv_auth_notice",
        "Não foi possível validar a sessão. Redirecionando para o login…",
      );
      throw redirect({ to: "/login" });
    }
  },
  component: AppLayout,
});

function AppLayout() {
  const nav = useNavigate();
  const [, setGlobalSettingsVersion] = useState(0);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [patientOpen, setPatientOpen] = useState(false);
  const [encounterOpen, setEncounterOpen] = useState(false);
  const [patientPickerOpen, setPatientPickerOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [apiPatients, setApiPatients] = useState<string[]>([]);
  const [apiPendencies, setApiPendencies] = useState<
    Array<{
      encontro_id: string;
      status:
        | "agendado"
        | "produzido"
        | "pago"
        | "glosado_total"
        | "glosado_parcialmente";
      reasons: string[];
      missing_fields: string[];
      suggested_next_status?:
        | "agendado"
        | "produzido"
        | "pago"
        | "glosado_total"
        | "glosado_parcialmente"
        | null;
    }>
  >([]);
  const [createdPatients, setCreatedPatients] = useState<string[]>([]);
  const [patientForm, setPatientForm] = useState({
    doc: "",
    name: "",
    email: "",
    phone: "",
  });
  const [patientQuery, setPatientQuery] = useState("");
  const [encounterForm, setEncounterForm] = useState({
    patient: "",
    doc: "",
    procedure: "",
    payer: "",
    guide: "",
    date: "",
    value: "",
    notes: "",
  });

  const refreshPatients = async () => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) return;
    try {
      const res = await fetch("/api/pacientes", {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data))
        setApiPatients(data.filter((s) => typeof s === "string"));
    } catch {
      return;
    }
  };

  useEffect(() => {
    refreshPatients();
  }, []);

  useEffect(() => {
    const bump = () => setGlobalSettingsVersion((v) => v + 1);
    const onStorage = (e: StorageEvent) => {
      if (e.key === "fv_global_settings") bump();
    };
    window.addEventListener("fv:global-settings-changed", bump);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("fv:global-settings-changed", bump);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    const load = async () => {
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
        const json = await res.text();
        if (!json) return;
        localStorage.setItem("fv_global_settings", json);
        window.dispatchEvent(new Event("fv:global-settings-changed"));
      } catch {
        return;
      }
    };
    load().catch(() => {});
  }, []);

  useEffect(() => {
    const handler = () => setPatientOpen(true);
    window.addEventListener("fv:open-patient-modal", handler);
    return () => window.removeEventListener("fv:open-patient-modal", handler);
  }, []);

  useEffect(() => {
    if (!bellOpen) return;
    const token = localStorage.getItem("fv_access_token");
    if (!token) return;

    fetch("/api/pendencias", {
      headers: { accept: "application/json", authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data || typeof data !== "object") return;
        const items = (data as any).items;
        if (!Array.isArray(items)) return;
        setApiPendencies(items);
      })
      .catch(() => {});
  }, [bellOpen]);

  const patientNames = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const p of apiPatients) {
      const key = p.trim().toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(p.trim());
    }
    for (const name of createdPatients) {
      const key = name.trim().toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(name.trim());
    }
    return out.sort((a, b) =>
      a.localeCompare(b, "pt-BR", { sensitivity: "base" }),
    );
  }, [apiPatients, createdPatients]);

  const addPatient = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setCreatedPatients((prev) => {
      const key = trimmed.toLowerCase();
      if (prev.some((p) => p.trim().toLowerCase() === key)) return prev;
      return [...prev, trimmed];
    });
  };

  const patientQueryTrimmed = patientQuery.trim();
  const filteredPatientNames = useMemo(() => {
    if (!patientQueryTrimmed) return patientNames.slice(0, 8);
    const q = patientQueryTrimmed.toLowerCase();
    return patientNames.filter((n) => n.toLowerCase().includes(q)).slice(0, 8);
  }, [patientNames, patientQueryTrimmed]);

  const hasExactPatientMatch = useMemo(() => {
    if (!patientQueryTrimmed) return false;
    const q = patientQueryTrimmed.toLowerCase();
    return patientNames.some((n) => n.toLowerCase() === q);
  }, [patientNames, patientQueryTrimmed]);

  const canSubmitPatient = useMemo(
    () => patientForm.name.trim().length > 0,
    [patientForm.name],
  );
  const canSubmitEncounter = useMemo(
    () =>
      encounterForm.patient.trim().length > 0 &&
      encounterForm.procedure.trim().length > 0 &&
      encounterForm.payer.trim().length > 0 &&
      encounterForm.date.trim().length > 0,
    [
      encounterForm.date,
      encounterForm.payer,
      encounterForm.patient,
      encounterForm.procedure,
    ],
  );

  const pendencies = useMemo(() => {
    const mapTone = (status: string) => {
      if (status === "glosado_total" || status === "glosado_parcialmente")
        return "bg-destructive";
      if (status === "agendado") return "bg-info";
      if (status === "produzido") return "bg-primary";
      return "bg-warning";
    };
    return apiPendencies.slice(0, 8).map((p) => ({
      color: mapTone(p.status),
      title: p.reasons?.[0] ?? "Pendência",
      desc: p.missing_fields?.length
        ? `${p.missing_fields.length} campos faltando`
        : "Revisar Consulta/Procedimento",
      encontroId: p.encontro_id,
      payload: p,
    }));
  }, [apiPendencies]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        <div className="hidden md:block">
          <AppSidebar />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between gap-2 border-b border-border bg-card/60 backdrop-blur px-3 md:px-4 sticky top-0 z-30">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="hidden md:inline-flex" />
              <div className="md:hidden">
                <Logo size={26} />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Popover open={bellOpen} onOpenChange={setBellOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-warning text-[10px] leading-4 text-warning-foreground text-center tabular-nums">
                      {apiPendencies.length}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-96 p-0">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                    <div className="font-medium">Pendências</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setBellOpen(false);
                      }}
                      asChild
                    >
                      <Link to="/app">Ver painel</Link>
                    </Button>
                  </div>
                  <div className="p-2">
                    <div className="space-y-1">
                      {pendencies.map((p) => (
                        <Button
                          key={p.title}
                          variant="ghost"
                          className="w-full justify-start h-auto py-2 px-2"
                          onClick={() => {
                            setBellOpen(false);
                            requestOpenEncounter({
                              encontroId: p.encontroId,
                              pendency: p.payload,
                            });
                            nav({ to: "/app/trabalho" });
                          }}
                        >
                          <span
                            className={cn(
                              "mt-1.5 h-2 w-2 rounded-full shrink-0",
                              p.color,
                            )}
                          />
                          <span className="min-w-0 text-left">
                            <span className="block text-sm font-medium truncate">
                              {p.title}
                            </span>
                            <span className="block text-xs text-muted-foreground truncate">
                              {p.desc}
                            </span>
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  localStorage.removeItem("fv_access_token");
                  nav({ to: "/login" });
                }}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">
            <Outlet />
          </main>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                className="fixed right-4 bottom-24 md:bottom-6 z-40 h-12 w-12 rounded-full shadow-elegant bg-gradient-primary"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={12} className="w-56">
              <DropdownMenuItem
                onSelect={() => {
                  setUploadFile(null);
                  setUploadOpen(true);
                }}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload de arquivo
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setEncounterOpen(true);
                  setPatientPickerOpen(false);
                  setPatientQuery("");
                }}
              >
                <CalendarPlus className="mr-2 h-4 w-4" />
                Adicionar Procedimento
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <MobileNav />
        </div>
      </div>

      <Dialog
        open={uploadOpen}
        onOpenChange={(open) => {
          if (uploading) return;
          setUploadOpen(open);
          if (!open) {
            setUploadFile(null);
            setUploading(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Upload de arquivo</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="upload-file">Arquivo</Label>
              <Input
                id="upload-file"
                type="file"
                disabled={uploading}
                onChange={(e) => setUploadFile(e.target.files?.item(0) ?? null)}
              />
              {uploadFile ? (
                <div className="text-xs text-muted-foreground">
                  Selecionado: {uploadFile.name}
                </div>
              ) : null}
              {uploading ? (
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Enviando...
                </div>
              ) : null}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              disabled={uploading}
              onClick={() => {
                setUploadOpen(false);
              }}
            >
              Cancelar
            </Button>
            <Button
              disabled={!uploadFile || uploading}
              onClick={async () => {
                if (!uploadFile || uploading) return;
                const token = localStorage.getItem("fv_access_token");
                if (!token) {
                  toast.error("Sessão expirada. Faça login novamente.");
                  nav({ to: "/login" });
                  return;
                }
                setUploading(true);
                const body = new FormData();
                body.set("file", uploadFile);
                try {
                  const res = await fetch("/api/arquivo/upload", {
                    method: "POST",
                    headers: { authorization: `Bearer ${token}` },
                    body,
                  });
                  if (!res.ok) {
                    toast.error("Falha no upload");
                    return;
                  }
                  toast.success("Upload enviado", {
                    description: uploadFile.name,
                  });
                  setUploadOpen(false);
                  setUploadFile(null);
                } finally {
                  setUploading(false);
                }
              }}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando
                </>
              ) : (
                "Enviar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={encounterOpen} onOpenChange={setEncounterOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Novo procedimento/consulta</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="encounter-patient">Paciente</Label>
              <Popover
                open={patientPickerOpen}
                onOpenChange={(open) => {
                  setPatientPickerOpen(open);
                  if (open) {
                    setPatientQuery(encounterForm.patient);
                  }
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={patientPickerOpen}
                    className="w-full justify-between font-normal"
                  >
                    <span
                      className={cn(
                        "truncate",
                        !encounterForm.patient && "text-muted-foreground",
                      )}
                    >
                      {encounterForm.patient
                        ? encounterForm.patient
                        : "Selecione um paciente"}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[--radix-popover-trigger-width] p-0"
                  align="start"
                >
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Buscar paciente..."
                      value={patientQuery}
                      onValueChange={(value) => setPatientQuery(value)}
                    />
                    <CommandList>
                      {filteredPatientNames.length === 0 &&
                      !patientQueryTrimmed ? (
                        <CommandEmpty>Nenhum paciente disponível.</CommandEmpty>
                      ) : null}

                      {filteredPatientNames.length === 0 &&
                      patientQueryTrimmed ? (
                        <CommandEmpty>Nenhum paciente encontrado.</CommandEmpty>
                      ) : null}

                      {filteredPatientNames.length > 0 ? (
                        <CommandGroup>
                          {filteredPatientNames.map((name) => (
                            <CommandItem
                              key={name}
                              value={name}
                              onSelect={() => {
                                setEncounterForm((s) => ({
                                  ...s,
                                  patient: name,
                                }));
                                setPatientPickerOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  encounterForm.patient === name
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              <span className="truncate">{name}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ) : null}

                      {patientQueryTrimmed && !hasExactPatientMatch ? (
                        <CommandGroup>
                          <CommandItem
                            value={`__add__${patientQueryTrimmed}`}
                            onSelect={() => {
                              addPatient(patientQueryTrimmed);
                              setEncounterForm((s) => ({
                                ...s,
                                patient: patientQueryTrimmed,
                              }));
                              toast.success("Paciente adicionado", {
                                description: patientQueryTrimmed,
                              });
                              setPatientPickerOpen(false);
                            }}
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Adicionar “{patientQueryTrimmed}”
                          </CommandItem>
                        </CommandGroup>
                      ) : null}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="encounter-date">Data</Label>
                <Input
                  id="encounter-date"
                  type="date"
                  value={encounterForm.date}
                  onChange={(e) =>
                    setEncounterForm((s) => ({ ...s, date: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="encounter-value">Valor</Label>
                <Input
                  id="encounter-value"
                  value={encounterForm.value}
                  onChange={(e) =>
                    setEncounterForm((s) => ({
                      ...s,
                      value: maskMoneyInput(e.target.value),
                    }))
                  }
                  placeholder="Ex: 250,00"
                  inputMode="decimal"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="encounter-procedure">Procedimento</Label>
                <Input
                  id="encounter-procedure"
                  value={encounterForm.procedure}
                  onChange={(e) =>
                    setEncounterForm((s) => ({
                      ...s,
                      procedure: e.target.value,
                    }))
                  }
                  placeholder="Ex: Consulta"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="encounter-payer">Convênio</Label>
                <Input
                  id="encounter-payer"
                  value={encounterForm.payer}
                  onChange={(e) =>
                    setEncounterForm((s) => ({ ...s, payer: e.target.value }))
                  }
                  placeholder="Ex: Unimed"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="encounter-guide">
                Número da guia do convênio
              </Label>
              <Input
                id="encounter-guide"
                value={encounterForm.guide}
                onChange={(e) =>
                  setEncounterForm((s) => ({ ...s, guide: e.target.value }))
                }
                placeholder="Ex: 1234567890"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="encounter-notes">Observações</Label>
              <Textarea
                id="encounter-notes"
                value={encounterForm.notes}
                onChange={(e) =>
                  setEncounterForm((s) => ({ ...s, notes: e.target.value }))
                }
                placeholder="Procedimentos, convênio, anexos..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => {
                setEncounterOpen(false);
              }}
            >
              Cancelar
            </Button>
            <Button
              disabled={!canSubmitEncounter}
              onClick={async () => {
                const token = localStorage.getItem("fv_access_token");
                if (!token) {
                  toast.error("Sessão expirada. Faça login novamente.");
                  nav({ to: "/login" });
                  return;
                }

                const payload = {
                  nome_paciente: encounterForm.patient.trim(),
                  nome_procedimento: encounterForm.procedure.trim(),
                  convenio_utilizado: encounterForm.payer.trim(),
                  numero_guia_convenio: encounterForm.guide.trim() || null,
                  data_encontro: encounterForm.date
                    ? new Date(encounterForm.date).toISOString()
                    : null,
                  valor_receber: parseBRL(encounterForm.value),
                };

                const res = await fetch("/api/encontros", {
                  method: "POST",
                  headers: {
                    accept: "application/json",
                    "content-type": "application/json",
                    authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(payload),
                });

                if (!res.ok) {
                  toast.error("Falha ao criar Consulta/Procedimento");
                  return;
                }

                toast.success("Consulta/Procedimento criado", {
                  description: `${encounterForm.patient} • ${encounterForm.date}`,
                });
                setEncounterForm({
                  patient: "",
                  procedure: "",
                  payer: "",
                  guide: "",
                  date: "",
                  value: "",
                  notes: "",
                });
                setEncounterOpen(false);
              }}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={patientOpen} onOpenChange={setPatientOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Novo paciente</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="patient-doc">CPF</Label>
              <Input
                id="patient-doc"
                value={patientForm.doc}
                onChange={(e) =>
                  setPatientForm((s) => ({
                    ...s,
                    doc: maskCpfInput(e.target.value),
                  }))
                }
                placeholder="CPF"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="patient-name">Nome</Label>
              <Input
                id="patient-name"
                value={patientForm.name}
                onChange={(e) =>
                  setPatientForm((s) => ({ ...s, name: e.target.value }))
                }
                placeholder="Nome completo"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="patient-email">Email</Label>
                <Input
                  id="patient-email"
                  type="email"
                  value={patientForm.email}
                  onChange={(e) =>
                    setPatientForm((s) => ({ ...s, email: e.target.value }))
                  }
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="patient-phone">Telefone</Label>
                <Input
                  id="patient-phone"
                  value={patientForm.phone}
                  onChange={(e) =>
                    setPatientForm((s) => ({ ...s, phone: e.target.value }))
                  }
                  placeholder="(11) 99999-9999"
                  inputMode="tel"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => {
                setPatientOpen(false);
              }}
            >
              Cancelar
            </Button>
            <Button
              disabled={!canSubmitPatient}
              onClick={async () => {
                const token = localStorage.getItem("fv_access_token");
                if (!token) {
                  toast.error("Sessão expirada. Faça login novamente.");
                  nav({ to: "/login" });
                  return;
                }

                const nome = patientForm.name.trim();
                const key = nome.toLowerCase();
                const existing = patientNames.find(
                  (n) => n.trim().toLowerCase() === key,
                );
                if (existing) {
                  toast.message("Paciente já existe", {
                    description: existing,
                  });
                  addPatient(existing);
                  setEncounterForm((s) => ({ ...s, patient: existing }));
                  setPatientForm({ doc: "", name: "", email: "", phone: "" });
                  setPatientOpen(false);
                  return;
                }

                const payload = {
                  nome,
                  email: patientForm.email.trim() || null,
                  telefone: patientForm.phone.trim() || null,
                };

                const res = await fetch("/api/pacientes", {
                  method: "POST",
                  headers: {
                    accept: "application/json",
                    "content-type": "application/json",
                    authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(payload),
                });

                if (!res.ok) {
                  toast.error("Falha ao criar paciente");
                  return;
                }

                const data = (await res.json()) as any;
                const createdName =
                  typeof data?.nome === "string" && data.nome.trim()
                    ? data.nome.trim()
                    : nome;
                addPatient(createdName);
                await refreshPatients();
                window.dispatchEvent(new Event("fv:patients-changed"));
                setEncounterForm((s) => ({ ...s, patient: createdName }));
                toast.success("Paciente criado", { description: createdName });
                setPatientForm({ doc: "", name: "", email: "", phone: "" });
                setPatientOpen(false);
              }}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
