import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, FileSpreadsheet, Loader2, Trash2 } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatBRL, safeMoney } from "@/lib/mock-data";

type ApiExtratoPagamento = {
  id: string;
  numero_guia_convenio?: string | null;
  nome_paciente?: string | null;
  nome_procedimento?: string | null;
  medico?: string | null;
  convenio_utilizado?: string | null;
  numero_carteira?: string | null;
  data_evento?: string | null;
  data_encontro?: string | null;
  valor_receber?: number | null;
  valor_recebido?: number | null;
  usado_conciliacao?: boolean | null;
};

export const Route = createFileRoute("/app/extratos-pagamento")({
  component: ExtratosPagamento,
  head: () => ({ meta: [{ title: "Extratos de pagamento — Fatura Viva" }] }),
});

function formatDatePtBR(iso: string | null | undefined): string {
  if (!iso) return "—";
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "—";
  return new Date(t).toLocaleDateString("pt-BR");
}

async function readErrorMessage(res: Response): Promise<string> {
  if (res.status === 401) return "Sessão expirada. Faça login novamente.";
  try {
    const payload = (await res.json()) as unknown;
    if (payload && typeof payload === "object" && "detail" in payload) {
      const detail = (payload as { detail?: unknown }).detail;
      if (typeof detail === "string" && detail) return detail;
    }
    return JSON.stringify(payload);
  } catch {
    try {
      const text = await res.text();
      return text || "Erro ao processar a requisição.";
    } catch {
      return "Erro ao processar a requisição.";
    }
  }
}

function ExtratosPagamento() {
  const [items, setItems] = useState<ApiExtratoPagamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<ApiExtratoPagamento | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);
  const [deleteSelectionOpen, setDeleteSelectionOpen] = useState(false);
  const [deletingSelection, setDeletingSelection] = useState(false);
  const [deleteAllOpen, setDeleteAllOpen] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);

  const refresh = async () => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/conciliacao/extratos-pagamento", {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) return;
      const data = (await res.json()) as unknown;
      if (Array.isArray(data)) setItems(data as ApiExtratoPagamento[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh().catch(() => {});
  }, []);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...items].sort((a, b) => {
      const at = a.data_encontro ?? a.data_evento ?? "";
      const bt = b.data_encontro ?? b.data_evento ?? "";
      return (Date.parse(bt) || 0) - (Date.parse(at) || 0);
    });
    if (!q) return sorted;
    return sorted.filter((item) => {
      const blob = [
        item.nome_paciente,
        item.nome_procedimento,
        item.convenio_utilizado,
        item.numero_guia_convenio,
        item.medico,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return blob.includes(q);
    });
  }, [items, query]);

  const allVisibleSelected =
    filteredItems.length > 0 &&
    filteredItems.every((item) => checkedIds.includes(item.id));

  const toggleSelectVisible = () => {
    const ids = filteredItems.map((item) => item.id);
    setCheckedIds((prev) =>
      allVisibleSelected ? prev.filter((id) => !ids.includes(id)) : ids,
    );
  };

  const deleteOne = async (item: ApiExtratoPagamento) => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch(
        `/api/conciliacao/extratos-pagamento/${encodeURIComponent(item.id)}`,
        {
          method: "DELETE",
          headers: {
            accept: "application/json",
            authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) {
        toast.error("Não foi possível excluir o registro", {
          description: await readErrorMessage(res),
        });
        return;
      }
      toast.success("Registro excluído");
      setDeleteTarget(null);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setCheckedIds((prev) => prev.filter((id) => id !== item.id));
    } finally {
      setDeleting(false);
    }
  };

  const deleteSelected = async () => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }
    const idsToDelete = [...checkedIds];
    if (!idsToDelete.length) return;
    setDeletingSelection(true);
    try {
      const res = await fetch("/api/conciliacao/extratos-pagamento/lote", {
        method: "DELETE",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ extrato_ids: idsToDelete }),
      });
      if (!res.ok) {
        toast.error("Não foi possível excluir os registros selecionados", {
          description: await readErrorMessage(res),
        });
        return;
      }
      const result = (await res.json()) as { deleted: number };
      toast.success("Registros excluídos", {
        description: `${result.deleted} registro(s) removido(s)`,
      });
      setItems((prev) => prev.filter((i) => !idsToDelete.includes(i.id)));
      setCheckedIds([]);
      setDeleteSelectionOpen(false);
    } finally {
      setDeletingSelection(false);
    }
  };

  const deleteAll = async () => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }
    const idsToDelete = items.map((item) => item.id);
    if (!idsToDelete.length) return;
    setDeletingAll(true);
    try {
      const res = await fetch(
        "/api/conciliacao/extratos-pagamento?confirm=true",
        {
          method: "DELETE",
          headers: {
            accept: "application/json",
            authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) {
        toast.error("Não foi possível limpar os extratos de pagamento", {
          description: await readErrorMessage(res),
        });
        return;
      }
      const result = (await res.json()) as { deleted: number };
      toast.success("Extratos de pagamento removidos", {
        description: `${result.deleted} registro(s) removido(s)`,
      });
      setItems([]);
      setCheckedIds([]);
      setDeleteAllOpen(false);
    } finally {
      setDeletingAll(false);
    }
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" /> Extratos de
            pagamento
          </h1>
          <p className="text-muted-foreground text-sm">
            Veja todos os registros carregados de extrato de pagamento e
            remova individualmente ou em massa para limpar o sistema.
          </p>
        </div>
        <Button
          variant="outline"
          className="border-destructive/40 text-destructive hover:bg-destructive/10"
          disabled={!items.length || deletingAll || loading}
          onClick={() => setDeleteAllOpen(true)}
        >
          <Trash2 className="h-4 w-4 mr-1" /> Excluir todos
        </Button>
      </div>

      <Card className="p-4 shadow-elegant">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Input
            placeholder="Buscar por paciente, procedimento, convênio ou guia..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={toggleSelectVisible}
              disabled={!filteredItems.length}
            >
              {allVisibleSelected ? "Retirar seleção" : "Selecionar visíveis"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="border-destructive/40 text-destructive hover:bg-destructive/10"
              disabled={!checkedIds.length || deletingSelection}
              onClick={() => setDeleteSelectionOpen(true)}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Excluir selecionados ({checkedIds.length})
            </Button>
          </div>
        </div>

        <div className="mt-4">
          {loading ? (
            <div className="px-3 py-10 text-center text-sm text-muted-foreground">
              <div className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Carregando registros
              </div>
            </div>
          ) : filteredItems.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={allVisibleSelected}
                      onCheckedChange={toggleSelectVisible}
                      aria-label="Selecionar todos os visíveis"
                    />
                  </TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Procedimento</TableHead>
                  <TableHead>Convênio</TableHead>
                  <TableHead>Guia</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const checked = checkedIds.includes(item.id);
                  const value = safeMoney(
                    item.valor_recebido ?? item.valor_receber,
                  );
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(v) => {
                            const next = !!v;
                            setCheckedIds((prev) => {
                              if (next && !prev.includes(item.id))
                                return [...prev, item.id];
                              if (!next)
                                return prev.filter((id) => id !== item.id);
                              return prev;
                            });
                          }}
                          aria-label="Selecionar registro"
                        />
                      </TableCell>
                      <TableCell className="whitespace-nowrap tabular-nums">
                        {formatDatePtBR(item.data_encontro ?? item.data_evento)}
                      </TableCell>
                      <TableCell className="max-w-[180px] truncate">
                        {item.nome_paciente || "—"}
                      </TableCell>
                      <TableCell className="max-w-[220px] truncate">
                        {item.nome_procedimento || "—"}
                      </TableCell>
                      <TableCell className="max-w-[160px] truncate">
                        {item.convenio_utilizado || "—"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {item.numero_guia_convenio || "—"}
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-medium">
                        {formatBRL(value)}
                      </TableCell>
                      <TableCell>
                        {item.usado_conciliacao ? (
                          <Badge
                            variant="outline"
                            className="bg-success/15 text-success border-success/30"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                            Conciliado
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Pendente</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(item)}
                          aria-label="Excluir registro"
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="px-3 py-10 text-center text-sm text-muted-foreground">
              Nenhum registro de extrato de pagamento encontrado.
            </div>
          )}
        </div>
      </Card>

      <AlertDialog
        open={deleteTarget != null}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir registro?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget ? (
                <>
                  O registro de{" "}
                  <span className="font-medium">
                    {deleteTarget.nome_paciente || "extrato de pagamento"}
                  </span>{" "}
                  será removido e não poderá ser recuperado.
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
                deleteOne(deleteTarget).catch(() => {});
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
        open={deleteSelectionOpen}
        onOpenChange={(open) => {
          if (!open && !deletingSelection) setDeleteSelectionOpen(false);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir registros selecionados?</AlertDialogTitle>
            <AlertDialogDescription>
              Isso irá excluir{" "}
              <span className="font-medium">{checkedIds.length}</span>{" "}
              registro(s) de extrato de pagamento. Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingSelection}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deletingSelection || !checkedIds.length}
              onClick={(e) => {
                e.preventDefault();
                deleteSelected().catch(() => {});
              }}
            >
              {deletingSelection ? (
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
            <AlertDialogTitle>
              Excluir todos os extratos de pagamento?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {items.length ? (
                <>
                  Isso irá excluir{" "}
                  <span className="font-medium">{items.length}</span>{" "}
                  registro(s) e limpar todo o histórico de extratos de
                  pagamento carregados. Esta ação não pode ser desfeita.
                </>
              ) : (
                "Não há registros para excluir."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingAll}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deletingAll || !items.length}
              onClick={(e) => {
                e.preventDefault();
                deleteAll().catch(() => {});
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
    </div>
  );
}
