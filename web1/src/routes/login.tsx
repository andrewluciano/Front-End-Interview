import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import logo from "@/assets/leaf-logo.png";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Entrar — Fatura Viva" },
      {
        name: "description",
        content:
          "Acesse sua conta Fatura Viva e gerencie a saúde financeira da sua clínica.",
      },
    ],
  }),
});

import { BaseUrl } from "@/APIs/BaseApis";

console.log("BaseUrl", BaseUrl);

function LoginPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    identifier: "demo@clinicaviva.com.br",
    password: "demo1234",
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(BaseUrl + "/auth/login", {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        toast.error("Falha ao entrar. Verifique suas credenciais e tente novamente.");
        return;
      }
      const data = (await res.json()) as { access_token?: string };
      if (!data.access_token) {
        toast.error("Resposta inválida do servidor.");
        return;
      }
      localStorage.setItem("fv_access_token", data.access_token);
      nav({ to: "/app" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Esquerda: gradiente + folha */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-hero overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary-glow/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary-glow/20 blur-3xl" />
        <Logo
          showText
          size={32}
          className="relative text-primary-foreground [&_span]:text-primary-foreground [&_.text-primary]:text-primary-foreground/80"
        />
        <div className="relative flex-1 flex items-center justify-center">
          <img
            src={logo}
            alt=""
            width={320}
            height={320}
            className="animate-leaf-sway drop-shadow-2xl"
          />
        </div>
        <div className="relative text-primary-foreground/95 max-w-md">
          <h2 className="text-3xl font-semibold leading-tight">
            A saúde financeira da sua clínica em um só lugar.
          </h2>
          <p className="mt-3 text-primary-foreground/75 text-sm">
            Processe TISS, extratos e PDFs com IA. Acompanhe encontros do
            agendamento ao recebimento.
          </p>
        </div>
      </div>

      {/* Direita: form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo size={36} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Bem-vindo de volta
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Entre para continuar gerenciando seus encontros.
          </p>

          <Card className="mt-8 p-6 shadow-elegant border-border/60">
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="voce@clinica.com.br"
                  required
                  value={form.identifier}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      identifier: (e.target as HTMLInputElement).value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link
                    to="/reset-senha"
                    className="text-xs text-primary hover:underline"
                  >
                    Esqueci
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
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
              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:opacity-90 transition-smooth shadow-elegant"
                loading={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
                {!loading && <ArrowRight className="ml-1 h-4 w-4" />}
              </Button>
            </form>
          </Card>

          <p className="mt-6 text-sm text-center text-muted-foreground">
            Novo por aqui?{" "}
            <Link
              to="/registro"
              className="text-primary font-medium hover:underline"
            >
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
