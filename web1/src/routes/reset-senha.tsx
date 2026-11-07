import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-senha")({
  component: ResetPasswordPage,
  head: () => ({
    meta: [
      { title: "Recuperar senha — Fatura Viva" },
      {
        name: "description",
        content: "Receba um link para redefinir sua senha.",
      },
    ],
  }),
});

function ResetPasswordPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/password/reset/request", {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        toast.error("Não foi possível solicitar a redefinição.");
        return;
      }

      toast.success("Solicitação enviada", {
        description:
          "Se o e-mail existir, você receberá instruções para redefinir a senha.",
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
            <h1 className="text-xl font-semibold">Recuperar senha</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Enviaremos um link de redefinição para o seu e-mail.
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="voce@clinica.com.br"
                required
                value={email}
                onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:opacity-90 shadow-elegant"
              loading={loading}
            >
              {loading ? "Enviando..." : "Enviar link"}
            </Button>
          </form>

          <div className="mt-6 text-sm text-muted-foreground">
            Lembrou a senha?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Entrar
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
