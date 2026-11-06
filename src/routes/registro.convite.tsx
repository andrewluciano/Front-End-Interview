import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type InvitePreview = {
  email: string;
  username: string;
  company_id: string;
  company_nome: string | null;
  expires_at: string;
};

type TokenResponse = {
  access_token: string;
  token_type: string;
};

const ACCESS_TOKEN_STORAGE_KEY = "fv_access_token";

export const Route = createFileRoute("/registro/convite")({
  component: InviteRegisterPage,
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === "string" ? search.token : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Convite — Fatura Viva" },
      {
        name: "description",
        content: "Complete seu cadastro usando um convite.",
      },
    ],
  }),
});

async function readErrorMessage(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (data && typeof data === "object") {
      if ("detail" in data && typeof (data as any).detail === "string")
        return (data as any).detail;
      if ("message" in data && typeof (data as any).message === "string")
        return (data as any).message;
      if ("error" in data && typeof (data as any).error === "string")
        return (data as any).error;
    }
    return JSON.stringify(data);
  } catch {
    try {
      return await res.text();
    } catch {
      return "Erro ao processar a requisição.";
    }
  }
}

function InviteRegisterPage() {
  const nav = useNavigate();
  const { token } = Route.useSearch();
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [invite, setInvite] = useState<InvitePreview | null>(null);
  const [form, setForm] = useState({ password: "", confirm: "" });

  useEffect(() => {
    if (!token) return;
    setPreviewLoading(true);
    fetch(`/api/invites/preview?token=${encodeURIComponent(token)}`, {
      headers: { accept: "application/json" },
    })
      .then(async (r) => {
        if (!r.ok) return null;
        return (await r.json()) as InvitePreview;
      })
      .then((data) => {
        if (data && typeof data.email === "string") setInvite(data);
      })
      .catch(() => {})
      .finally(() => setPreviewLoading(false));
  }, [token]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!token) {
      toast.error("Token inválido ou ausente.");
      return;
    }
    if (!form.password || form.password.length < 8) {
      toast.error("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (form.password !== form.confirm) {
      toast.error("A confirmação de senha não confere.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/invites/accept", {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: form.password,
          password_confirmation: form.confirm,
        }),
      });

      if (!res.ok) {
        toast.error("Não foi possível concluir o cadastro.", {
          description: await readErrorMessage(res),
        });
        return;
      }

      const out = (await res.json()) as TokenResponse;
      if (!out?.access_token) {
        toast.error("Resposta inválida do servidor.");
        return;
      }
      localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, out.access_token);
      toast.success("Cadastro concluído!");
      nav({ to: "/app" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-gradient-subtle">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-8">
          <Logo size={32} />
          <Link
            to="/login"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Voltar para login
          </Link>
        </div>

        <Card className="p-6 sm:p-8 shadow-elegant">
          <div>
            <h1 className="text-xl font-semibold">Convite</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Defina sua senha para acessar a plataforma.
            </p>
          </div>

          {!token ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-lg border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                O link de convite está inválido ou incompleto.
              </div>
              <Button
                asChild
                className="w-full bg-gradient-primary hover:opacity-90 shadow-elegant"
              >
                <Link to="/login">Ir para login</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="rounded-lg border border-border bg-muted/20 p-4 text-sm">
                {previewLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Carregando
                    convite…
                  </div>
                ) : invite ? (
                  <div className="space-y-1">
                    <div className="font-medium">{invite.username}</div>
                    <div className="text-xs text-muted-foreground">
                      {invite.email}
                    </div>
                    {invite.company_nome ? (
                      <div className="text-xs text-muted-foreground">
                        Clínica: {invite.company_nome}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="text-muted-foreground">
                    Convite não encontrado ou expirado.
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      password: (e.target as HTMLInputElement).value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm">Confirmar senha</Label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="Repita a senha"
                  required
                  value={form.confirm}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      confirm: (e.target as HTMLInputElement).value,
                    }))
                  }
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:opacity-90 shadow-elegant"
                disabled={loading || previewLoading || !invite}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Concluir cadastro
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
