import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/reset-senha/confirm")({
  component: ResetPasswordConfirmRedirectPage,
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === "string" ? search.token : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Redefinir senha — Fatura Viva" },
      { name: "description", content: "Defina uma nova senha para sua conta." },
    ],
  }),
});

function ResetPasswordConfirmRedirectPage() {
  const nav = useNavigate();
  const { token } = Route.useSearch();

  useEffect(() => {
    nav({
      to: "/nova-senha",
      search: { token },
      replace: true,
    });
  }, [nav, token]);

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
            <h1 className="text-xl font-semibold">Redirecionando…</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Abrindo a página para criar uma nova senha.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
