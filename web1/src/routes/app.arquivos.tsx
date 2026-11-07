import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { ArquivoWorkflowContent } from "@/routes/app.arquivos.$fileId";
import {
  Upload,
  FileText,
  Sparkles,
  Loader2,
  ChevronRight,
  Trash2,
  Plus,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { maskMoneyInput, parseBRL } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/app/arquivos")({
  component: Arquivos,
  head: () => ({ meta: [{ title: "Gestão de arquivos — Fatura Viva" }] }),
});

type ApiFile = {
  id: string;
  original_filename: string;
  content_type?: string | null;
  size_bytes?: number | null;
  uploaded_by?: string | null;
  created_at?: string | null;
};

function Arquivos() {
  const [drag, setDrag] = useState(false);
  const [files, setFiles] = useState<ApiFile[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [workflowFileId, setWorkflowFileId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiFile | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteAllOpen, setDeleteAllOpen] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState(
    "Você precisa entrar para continuar.",
  );
  const [manualExtratoOpen, setManualExtratoOpen] = useState(false);
  const [manualExtratoSaving, setManualExtratoSaving] = useState(false);
  const [manualExtratoForm, setManualExtratoForm] = useState({
    patient: "",
    procedure: "",
    payer: "",
    guide: "",
    date: "",
    paid: "",
  });

  const accept =
    ".pdf,.png,.pne,.jpg,.jpeg,.xml,.csv,.xls,.xlsx,application/pdf,image/png,image/jpeg,application/xml,text/xml,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  const selectedSummary = useMemo(() => {
    if (!selectedFiles.length) return "Nenhum arquivo selecionado.";
    return `${selectedFiles.length} arquivo(s) selecionado(s).`;
  }, [selectedFiles.length]);

  const requireToken = (message?: string) => {
    const token = localStorage.getItem("fv_access_token");
    if (token) return token;
    setAuthModalMessage(message ?? "Sessão expirada. Faça login novamente.");
    setAuthModalOpen(true);
    return null;
  };

  const handleUnauthorized = (message?: string) => {
    localStorage.removeItem("fv_access_token");
    setAuthModalMessage(
      message ?? "Sessão expirada ou sem permissão. Faça login novamente.",
    );
    setAuthModalOpen(true);
  };

  const addManualExtratoPagamento = async () => {
    const token = requireToken();
    if (!token) return;

    const paid = parseBRL(manualExtratoForm.paid ?? "");
    const payload = {
      tipo_encontro: "extrato-pagamento",
      nome_paciente: manualExtratoForm.patient.trim() || null,
      nome_procedimento: manualExtratoForm.procedure.trim() || null,
      convenio_utilizado: manualExtratoForm.payer.trim() || null,
      numero_guia_convenio: manualExtratoForm.guide.trim() || null,
      data_encontro: manualExtratoForm.date.trim() || null,
      valor_recebido: Number.isFinite(paid) ? paid : null,
    };

    setManualExtratoSaving(true);
    try {
      const res = await fetch("/api/encontros", {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        return;
      }
      if (!res.ok) {
        let message = "Falha ao adicionar extrato.";
        try {
          const body = (await res.json()) as any;
          if (body?.detail) message = String(body.detail);
          if (body?.error) message = String(body.error);
        } catch {
          try {
            const text = await res.text();
            if (text) message = text;
          } catch {}
        }
        toast.error("Não foi possível adicionar", { description: message });
        return;
      }

      toast.success("Extrato adicionado", {
        description: "1 linha criada manualmente.",
      });
      setManualExtratoOpen(false);
      setManualExtratoForm({
        patient: "",
        procedure: "",
        payer: "",
        guide: "",
        date: "",
        paid: "",
      });
      window.dispatchEvent(new Event("fv:encontros-changed"));
    } finally {
      setManualExtratoSaving(false);
    }
  };

  const refresh = async () => {
    const token = requireToken();
    if (!token) return;
    const res = await fetch("/api/arquivo", {
      headers: { accept: "application/json", authorization: `Bearer ${token}` },
    });
    if (res.status === 401 || res.status === 403) {
      handleUnauthorized();
      return;
    }
    if (!res.ok) return;
    const data = (await res.json()) as unknown;
    if (!Array.isArray(data)) return;
    setFiles(data as ApiFile[]);
  };

  const deleteFile = async (file: ApiFile) => {
    const token = requireToken();
    if (!token) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/arquivo/${encodeURIComponent(file.id)}`, {
        method: "DELETE",
        headers: {
          accept: "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        return;
      }
      if (!res.ok) {
        let message = "Falha ao excluir arquivo.";
        try {
          const body = (await res.json()) as any;
          if (body?.detail) message = String(body.detail);
          if (body?.error) message = String(body.error);
        } catch {
          const text = await res.text();
          if (text) message = text;
        }
        toast.error("Não foi possível excluir", { description: message });
        return;
      }

      toast.success("Arquivo excluído");
      setDeleteTarget(null);
      await refresh();
    } finally {
      setDeleting(false);
    }
  };

  const deleteAllFiles = async () => {
    const token = requireToken();
    if (!token) return;

    setDeletingAll(true);
    try {
      const toDelete = [...files];
      let deleted = 0;
      let failed = 0;

      for (const file of toDelete) {
        const res = await fetch(`/api/arquivo/${encodeURIComponent(file.id)}`, {
          method: "DELETE",
          headers: {
            accept: "application/json",
            authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 401 || res.status === 403) {
          handleUnauthorized();
          return;
        }
        if (!res.ok) {
          failed += 1;
          continue;
        }
        deleted += 1;
      }

      if (deleted > 0 && failed === 0) {
        toast.success("Arquivos excluídos", {
          description: `${deleted} arquivo(s)`,
        });
      } else if (deleted > 0 && failed > 0) {
        toast.warning("Exclusão parcial", {
          description: `${deleted} excluído(s), ${failed} falhou(aram)`,
        });
      } else {
        toast.error("Não foi possível excluir", {
          description: "Falha ao excluir arquivos.",
        });
        return;
      }

      setDeleteAllOpen(false);
      setDeleteTarget(null);
      setWorkflowFileId(null);
      await refresh();
    } finally {
      setDeletingAll(false);
    }
  };

  const uploadMany = async (incoming: File[]) => {
    const token = requireToken();
    if (!token) return;

    const filesToUpload = [...incoming];
    const total = filesToUpload.length;
    if (total === 0) return;

    setPickerOpen(false);
    setSelectedFiles([]);
    toast.message("Arquivos enviados", {
      description: `${total} arquivo(s) serão processados em seguida.`,
    });
    if (fileRef.current) fileRef.current.value = "";

    for (const file of filesToUpload) {
      const body = new FormData();
      body.set("file", file);
      const res = await fetch("/api/arquivo/upload", {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
        body,
      });
      if (res.status === 401 || res.status === 403) {
        await refresh();
        handleUnauthorized();
        return;
      }
      if (!res.ok) {
        await refresh();
        toast.error("Falha no upload", { description: file.name });
        return;
      }
      await refresh();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) {
      requireToken(
        "Você está desconectado. Faça login para acessar os arquivos.",
      );
      return;
    }
    const onChanged = () => {
      refresh().catch(() => {});
    };

    refresh().catch(() => {});
    window.addEventListener("fv:files-changed", onChanged);
    return () => {
      window.removeEventListener("fv:files-changed", onChanged);
    };
  }, []);

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Gestão de arquivos
        </h1>
        <p className="text-muted-foreground text-sm">
          Envie guias TISS, extratos e PDFs. A IA extrai os encontros
          automaticamente.
        </p>
      </div>

      <Card
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const dropped = Array.from(e.dataTransfer.files ?? []);
          if (dropped.length) {
            setSelectedFiles(dropped);
            setPickerOpen(true);
          }
        }}
        className={cn(
          "p-8 sm:p-4 border-2 border-dashed transition-smooth text-center",
          drag
            ? "border-primary bg-primary/5 shadow-glow"
            : "border-border bg-gradient-card",
        )}
      >
        <div className="mx-auto h-12 w-12 rounded-[0.6rem] bg-gradient-primary text-primary-foreground flex items-center justify-center shadow-elegant">
          <Upload className="h-5 w-5" />
        </div>
        <h2 className="mt-2 text-base font-semibold">Arraste arquivos aqui</h2>
        <p className="text-xs text-muted-foreground mt-1">
          ou clique para selecionar · PDF, PNG/JPEG, XML, CSV, Excel
        </p>
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          multiple
          className="hidden"
          onChange={(e) => {
            const picked = Array.from(e.target.files ?? []);
            if (picked.length) {
              setSelectedFiles(picked);
              setPickerOpen(true);
            }
          }}
        />
        <Button
          className="mt-4 bg-gradient-primary shadow-elegant"
          onClick={() => fileRef.current?.click()}
        >
          <Sparkles className="h-4 w-4 mr-1" /> Selecionar arquivos
        </Button>
        <div className="mt-3 text-xs text-muted-foreground">
          Cada arquivo consome ~10 créditos de IA
        </div>
      </Card>

      <Dialog
        open={pickerOpen}
        onOpenChange={(open) => {
          setPickerOpen(open);
          if (!open) {
            setSelectedFiles([]);
            if (fileRef.current) fileRef.current.value = "";
          }
        }}
      >
        <DialogContent className="sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle>Selecionar arquivos</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="files-modal-input">Arquivos</Label>
              <Input
                id="files-modal-input"
                className="pt-1.5"
                type="file"
                accept={accept}
                multiple
                onChange={(e) => {
                  const picked = Array.from(e.target.files ?? []);
                  setSelectedFiles(picked);
                }}
              />
              <div className="text-xs text-muted-foreground">
                {selectedSummary}
              </div>
            </div>
            {selectedFiles.length ? (
              <div className="max-h-48 overflow-auto border rounded-md">
                <div className="divide-y">
                  {selectedFiles.map((f) => (
                    <div
                      key={`${f.name}-${f.size}-${f.lastModified}`}
                      className="px-3 py-2 text-sm truncate"
                    >
                      {f.name}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => {
                setPickerOpen(false);
              }}
            >
              Cancelar
            </Button>
            <Button
              disabled={!selectedFiles.length}
              onClick={() => uploadMany(selectedFiles).catch(() => {})}
            >
              Enviar
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setManualExtratoOpen(true)}
              aria-label="Adicionar extrato pagamento manual"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={manualExtratoOpen}
        onOpenChange={(open) => {
          if (manualExtratoSaving) return;
          setManualExtratoOpen(open);
          if (!open) {
            setManualExtratoForm({
              patient: "",
              procedure: "",
              payer: "",
              guide: "",
              date: "",
              paid: "",
            });
          }
        }}
      >
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Adicionar extrato pagamento</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="manual-extrato-patient">Paciente</Label>
              <Input
                id="manual-extrato-patient"
                value={manualExtratoForm.patient}
                disabled={manualExtratoSaving}
                onChange={(e) =>
                  setManualExtratoForm((s) => ({
                    ...s,
                    patient: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="manual-extrato-proc">Procedimento</Label>
              <Input
                id="manual-extrato-proc"
                value={manualExtratoForm.procedure}
                disabled={manualExtratoSaving}
                onChange={(e) =>
                  setManualExtratoForm((s) => ({
                    ...s,
                    procedure: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="manual-extrato-payer">Convênio</Label>
              <Input
                id="manual-extrato-payer"
                value={manualExtratoForm.payer}
                disabled={manualExtratoSaving}
                onChange={(e) =>
                  setManualExtratoForm((s) => ({ ...s, payer: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="manual-extrato-guide">Guia</Label>
              <Input
                id="manual-extrato-guide"
                value={manualExtratoForm.guide}
                disabled={manualExtratoSaving}
                onChange={(e) =>
                  setManualExtratoForm((s) => ({ ...s, guide: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="manual-extrato-date">Data</Label>
              <Input
                id="manual-extrato-date"
                type="date"
                value={manualExtratoForm.date}
                disabled={manualExtratoSaving}
                onChange={(e) =>
                  setManualExtratoForm((s) => ({ ...s, date: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="manual-extrato-paid">Valor recebido</Label>
              <Input
                id="manual-extrato-paid"
                inputMode="decimal"
                placeholder="0,00"
                value={manualExtratoForm.paid}
                disabled={manualExtratoSaving}
                onChange={(e) =>
                  setManualExtratoForm((s) => ({
                    ...s,
                    paid: maskMoneyInput(e.target.value),
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              disabled={manualExtratoSaving}
              onClick={() => setManualExtratoOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={manualExtratoSaving}
              onClick={() => addManualExtratoPagamento().catch(() => {})}
            >
              {manualExtratoSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando
                </>
              ) : (
                "Adicionar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={workflowFileId != null}
        onOpenChange={(open) => {
          if (!open) setWorkflowFileId(null);
        }}
      >
        <DialogContent className="sm:max-w-[1040px] max-h-[90vh] overflow-auto">
          {workflowFileId ? (
            <ArquivoWorkflowContent fileId={workflowFileId} mode="modal" />
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={authModalOpen}
        onOpenChange={(open) => {
          setAuthModalOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Você está desconectado</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            {authModalMessage}
          </div>
          <DialogFooter>
            <Button asChild className="bg-gradient-primary shadow-elegant">
              <Link to="/login">Ir para o login</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteTarget != null}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir arquivo?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget ? (
                <>
                  O arquivo{" "}
                  <span className="font-medium">
                    {deleteTarget.original_filename}
                  </span>{" "}
                  será removido e não poderá ser recuperado. Encontros já
                  criados a partir dele não são removidos.
                </>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleting || !deleteTarget}
              onClick={(e) => {
                e.preventDefault();
                if (!deleteTarget) return;
                deleteFile(deleteTarget).catch(() => {});
              }}
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Excluindo
                </>
              ) : (
                "Excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={deleteAllOpen}
        onOpenChange={(open) => {
          if (!open && !deletingAll) setDeleteAllOpen(false);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir todos os arquivos?</AlertDialogTitle>
            <AlertDialogDescription>
              {files.length ? (
                <>
                  Isso irá excluir{" "}
                  <span className="font-medium">{files.length}</span> arquivo(s)
                  e limpar o histórico de processamento. Encontros já criados
                  não são removidos.
                </>
              ) : (
                "Não há arquivos para excluir."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingAll}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deletingAll || files.length === 0}
              onClick={(e) => {
                e.preventDefault();
                if (!files.length) return;
                deleteAllFiles().catch(() => {});
              }}
            >
              {deletingAll ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Excluindo
                </>
              ) : (
                "Excluir tudo"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="font-semibold">Histórico de processamento</h2>
          <Button
            variant="outline"
            disabled={!files.length || deletingAll || deleting}
            onClick={() => setDeleteAllOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-1" /> Excluir todos
          </Button>
        </div>
        <div className="space-y-2">
          {files.map((f) => (
            <Card
              key={f.id}
              className="p-4 shadow-elegant flex items-center gap-3 cursor-pointer hover:bg-muted/30 transition-smooth"
              onClick={() => {
                setWorkflowFileId(f.id);
              }}
            >
              <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0 bg-muted text-foreground">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm truncate">
                  {f.original_filename}
                </div>
                <div className="text-xs text-muted-foreground">
                  {f.content_type ?? "Arquivo"} ·{" "}
                  {f.created_at
                    ? new Date(f.created_at).toLocaleString("pt-BR")
                    : "—"}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs text-muted-foreground">Enviado</div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                disabled={deletingAll}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDeleteTarget(f);
                }}
              >
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
