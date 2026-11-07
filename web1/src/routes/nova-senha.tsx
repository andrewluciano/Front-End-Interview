import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";

export const Route = createFileRoute("/nova-senha")({
  component: NewPasswordPage,
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === "string" ? search.token : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Nova senha — Fatura Viva" },
      {
        name: "description",
        content: "Crie uma nova senha usando seu token de redefinição.",
      },
    ],
  }),
});

function NewPasswordPage() {
  const nav = useNavigate();
  const { token } = Route.useSearch();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ password: "", confirm: "" });

  const readErrorMessage = async (res: Response): Promise<string> => {
    try {
      const payload = await res.json();
      if (
        payload &&
        typeof payload === "object" &&
        "detail" in payload &&
        typeof (payload as any).detail === "string"
      ) {
        return (payload as any).detail;
      }
      if (
        payload &&
        typeof payload === "object" &&
        "message" in payload &&
        typeof (payload as any).message === "string"
      ) {
        return (payload as any).message;
      }
      return JSON.stringify(payload);
    } catch {
      try {
        return await res.text();
      } catch {
        return "Erro ao processar a requisição.";
      }
    }
  };

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
      const res = await fetch("/api/auth/password/reset/confirm", {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          token,
          new_password: form.password,
          new_password_confirmation: form.confirm,
        }),
      });

      if (!res.ok) {
        toast.error("Não foi possível redefinir a senha.", {
          description: await readErrorMessage(res),
        });
        return;
      }

      toast.success("Senha atualizada", {
        description: "Você já pode entrar com a nova senha.",
      });
      nav({ to: "/login" });
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
            <h1 className="text-xl font-semibold">Nova senha</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Crie uma nova senha para sua conta.
            </p>
          </div>

          {!token ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-lg border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                O link de redefinição está inválido ou incompleto.
              </div>
              <Button
                asChild
                className="w-full bg-gradient-primary hover:opacity-90 shadow-elegant"
              >
                <Link to="/reset-senha">Solicitar novo link</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="password">Nova senha</Label>
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
                loading={loading}
              >
                {loading ? "Atualizando..." : "Atualizar senha"}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
