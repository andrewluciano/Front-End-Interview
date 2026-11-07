import { createFileRoute } from "@tanstack/react-router";
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
import { maskCpfInput } from "@/lib/mock-data";
import { Ban, Copy, Loader2, Plus, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/usuarios")({
  component: Usuarios,
  head: () => ({ meta: [{ title: "Usuários — Fatura Viva" }] }),
});

type ApiUser = {
  email: string;
  username: string;
  is_verified: boolean;
  doc: string;
  is_blocked: boolean;
  is_enabled: boolean;
  is_admin: boolean;
};

function Usuarios() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [forbidden, setForbidden] = useState(false);
  const [me, setMe] = useState<{ username: string; is_admin: boolean } | null>(
    null,
  );
  const [blockingEmail, setBlockingEmail] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: "", email: "" });
  const [inviteToken, setInviteToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) return;
    fetch("/api/auth/me", {
      headers: { accept: "application/json", authorization: `Bearer ${token}` },
    })
      .then(async (r) => {
        if (!r.ok) return null;
        return (await r.json()) as any;
      })
      .then((data) => {
        if (data && typeof data.username === "string")
          setMe({ username: data.username, is_admin: data.is_admin === true });
      })
      .catch(() => {});
    fetch("/api/users", {
      headers: { accept: "application/json", authorization: `Bearer ${token}` },
    })
      .then(async (r) => {
        if (r.status === 403) {
          setForbidden(true);
          return null;
        }
        if (!r.ok) return null;
        return (await r.json()) as unknown;
      })
      .then((data) => {
        if (Array.isArray(data)) setUsers(data as ApiUser[]);
      })
      .catch(() => {});
  }, []);

  const readErrorMessage = async (res: Response): Promise<string> => {
    if (res.status === 401) return "Sessão expirada. Faça login novamente.";
    try {
      const data = (await res.json()) as any;
      if (data && typeof data === "object") {
        if (typeof data.detail === "string") return data.detail;
        if (typeof data.error === "string") return data.error;
      }
      return JSON.stringify(data);
    } catch {
      try {
        return await res.text();
      } catch {
        return "Erro ao processar a requisição.";
      }
    }
  };

  const toggleBlock = async (email: string, nextBlocked: boolean) => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) return;
    setBlockingEmail(email);
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(email)}/block`, {
        method: "PATCH",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_blocked: nextBlocked }),
      });
      if (!res.ok) {
        toast.error("Falha ao atualizar usuário");
        return;
      }
      const updated = (await res.json()) as ApiUser;
      setUsers((prev) =>
        prev.map((u) => (u.email === updated.email ? updated : u)),
      );
      toast.success(
        updated.is_blocked ? "Usuário bloqueado" : "Usuário desbloqueado",
      );
    } finally {
      setBlockingEmail(null);
    }
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Usuários</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie acessos e consumo de créditos da equipe.
          </p>
        </div>
        <Button
          className="bg-gradient-primary shadow-elegant"
          disabled={!me?.is_admin}
          onClick={() => {
            setInviteToken(null);
            setInviteForm({ name: "", email: "" });
            setInviteOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1" /> Convidar
        </Button>
      </div>

      {forbidden ? (
        <Card className="p-4 shadow-elegant text-sm text-muted-foreground">
          Acesso restrito: apenas administradores podem ver usuários.
        </Card>
      ) : null}

      <div className="space-y-2">
        {users.map((u) => (
          <Card
            key={u.email}
            className="p-4 shadow-elegant flex flex-wrap items-center gap-3"
          >
            <div className="h-10 w-10 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center font-semibold shrink-0">
              {u.username
                .split(" ")
                .filter(Boolean)
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium">{u.username}</div>
              <div className="text-xs text-muted-foreground">{u.email}</div>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${u.is_admin ? "bg-primary/10 text-primary" : "bg-muted text-foreground"}`}
            >
              <Shield className="inline h-3 w-3 mr-1" />
              {u.is_admin ? "Admin" : "Usuário"}
            </span>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">
                {u.is_verified ? "Verificado" : "Não verificado"}
              </div>
              <div className="text-xs text-muted-foreground">
                {u.is_enabled ? "Ativo" : "Desativado"}
              </div>
              <div className="text-xs text-muted-foreground">
                {u.is_blocked ? "Bloqueado" : "Liberado"}
              </div>
            </div>
            {me?.is_admin && u.email !== me.username ? (
              <Button
                variant={u.is_blocked ? "outline" : "destructive"}
                className="ml-auto"
                disabled={blockingEmail === u.email}
                onClick={() => toggleBlock(u.email, !u.is_blocked)}
              >
                {blockingEmail === u.email ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Ban className="h-4 w-4 mr-2" />
                )}
                {u.is_blocked ? "Desbloquear" : "Bloquear"}
              </Button>
            ) : null}
          </Card>
        ))}
      </div>

      <Dialog
        open={inviteOpen}
        onOpenChange={(open) => {
          if (inviteLoading) return;
          setInviteOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Convidar usuário</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="invite-name">Nome</Label>
              <Input
                id="invite-name"
                value={inviteForm.name}
                onChange={(e) =>
                  setInviteForm((s) => ({
                    ...s,
                    name: (e.target as HTMLInputElement).value,
                  }))
                }
                placeholder="Nome completo"
                disabled={inviteLoading || inviteToken != null}
              />
              <Input
                id="invite-doc"
                value={inviteForm.doc}
                onChange={(e) =>
                  setInviteForm((s) => ({
                    ...s,
                    doc: maskCpfInput((e.target as HTMLInputElement).value),
                  }))
                }
                placeholder="CPF"
                disabled={inviteLoading || inviteToken != null}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="invite-email">E-mail</Label>
              <Input
                id="invite-email"
                type="email"
                value={inviteForm.email}
                onChange={(e) =>
                  setInviteForm((s) => ({
                    ...s,
                    email: (e.target as HTMLInputElement).value,
                  }))
                }
                placeholder="email@dominio.com"
                disabled={inviteLoading || inviteToken != null}
              />
            </div>

            {inviteToken ? (
              <div className="grid gap-2">
                <Label htmlFor="invite-link">Link do convite</Label>
                <div className="flex gap-2">
                  <Input
                    id="invite-link"
                    readOnly
                    value={`${window.location.origin}/registro/convite?token=${encodeURIComponent(inviteToken)}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={async () => {
                      const link = `${window.location.origin}/registro/convite?token=${encodeURIComponent(inviteToken)}`;
                      try {
                        await navigator.clipboard.writeText(link);
                        toast.success("Link copiado");
                      } catch {
                        toast.message("Copie manualmente o link.");
                      }
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setInviteOpen(false)}
              disabled={inviteLoading}
            >
              Fechar
            </Button>
            {!inviteToken ? (
              <Button
                className="bg-gradient-primary shadow-elegant"
                disabled={
                  inviteLoading ||
                  !inviteForm.name.trim() ||
                  !inviteForm.email.trim()
                }
                onClick={async () => {
                  const token = localStorage.getItem("fv_access_token");
                  if (!token) {
                    toast.error("Sessão expirada. Faça login novamente.");
                    return;
                  }
                  setInviteLoading(true);
                  try {
                    const res = await fetch("/api/invites", {
                      method: "POST",
                      headers: {
                        accept: "application/json",
                        "content-type": "application/json",
                        authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        username: inviteForm.name.trim(),
                        email: inviteForm.email.trim(),
                      }),
                    });
                    if (!res.ok) {
                      toast.error("Não foi possível criar o convite.", {
                        description: await readErrorMessage(res),
                      });
                      return;
                    }
                    const data = (await res.json()) as any;
                    if (data && typeof data.token === "string") {
                      setInviteToken(data.token);
                      toast.success("Convite criado");
                    } else {
                      toast.error("Resposta inválida do servidor.");
                    }
                  } finally {
                    setInviteLoading(false);
                  }
                }}
              >
                {inviteLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Criar convite
              </Button>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
