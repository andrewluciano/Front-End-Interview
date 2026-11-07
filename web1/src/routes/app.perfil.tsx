import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ArrowRight, ExternalLink, Loader2, Sparkles } from "lucide-react";
import { maskCrmInput } from "@/lib/mock-data";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/perfil")({
  component: Perfil,
  head: () => ({ meta: [{ title: "Perfil — Fatura Viva" }] }),
});

const completion = [
  { label: "Dados da empresa", done: true },
  { label: "Convênios cadastrados", done: true },
  { label: "Tabela de procedimentos", done: false },
  { label: "Conta bancária para conciliação", done: false },
  { label: "Equipe convidada", done: false },
];

function Perfil() {
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [nome, setNome] = useState("");
  const [crm, setCrm] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [companyNome, setCompanyNome] = useState("");

  const [creditsLoading, setCreditsLoading] = useState(true);
  const [credits, setCredits] = useState<{
    balance: number;
    consumo_atual: number;
    usage_per_day: Array<{ date: string; used: number }>;
  } | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const isTokenExpiredText = (text: string) => {
    const t = text.toLowerCase();
    return (
      t.includes("token expired") ||
      t.includes('"token expired"') ||
      t.includes("token expirado")
    );
  };

  useEffect(() => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) return;
    setProfileLoading(true);
    fetch("/api/auth/profile", {
      headers: { accept: "application/json", authorization: `Bearer ${token}` },
    })
      .then(async (r) => {
        if (!r.ok) return null;
        return (await r.json()) as any;
      })
      .then((data) => {
        if (!data) return;
        if (typeof data.username === "string") setNome(data.username);
        if (typeof data.crm === "string") setCrm(data.crm);
        if (typeof data.email === "string") setEmail(data.email);
        if (typeof data.telefone === "string") setTelefone(data.telefone);
        if (typeof data.company_nome === "string")
          setCompanyNome(data.company_nome);
      })
      .catch(() => {})
      .finally(() => setProfileLoading(false));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) return;
    setCreditsLoading(true);
    fetch("/api/credits/me", {
      headers: { accept: "application/json", authorization: `Bearer ${token}` },
    })
      .then(async (r) => {
        if (!r.ok) return null;
        return (await r.json()) as any;
      })
      .then((data) => {
        if (!data) return;
        if (
          typeof data.balance === "number" &&
          typeof data.consumo_atual === "number" &&
          Array.isArray(data.usage_per_day)
        ) {
          setCredits({
            balance: data.balance,
            consumo_atual: data.consumo_atual,
            usage_per_day: data.usage_per_day,
          });
        }
      })
      .catch(() => {})
      .finally(() => setCreditsLoading(false));
  }, []);

  const saveProfile = async () => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) return;
    if (!nome.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }
    setProfileSaving(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: nome,
          crm,
          telefone,
        }),
      });
      if (!res.ok) {
        const bodyText = await res.text().catch(() => "");
        if (res.status === 401 && isTokenExpiredText(bodyText)) {
          toast.error("Sessão expirada. Faça login novamente.");
          return;
        }
        toast.error("Falha ao salvar", {
          description: bodyText || "Não foi possível atualizar seus dados.",
        });
        return;
      }
      const updated = (await res.json()) as any;
      toast.success("Dados atualizados");
      if (updated && typeof updated.username === "string")
        setNome(updated.username);
      if (updated && typeof updated.crm === "string") setCrm(updated.crm);
      if (updated && typeof updated.telefone === "string")
        setTelefone(updated.telefone);
      if (updated && typeof updated.company_nome === "string")
        setCompanyNome(updated.company_nome);
      if (updated && typeof updated.email === "string") setEmail(updated.email);
    } finally {
      setProfileSaving(false);
    }
  };

  const canSubmit = useMemo(() => {
    if (!currentPassword.trim()) return false;
    if (!newPassword) return false;
    if (!newPasswordConfirmation) return false;
    if (newPassword !== newPasswordConfirmation) return false;
    if (newPassword.length < 8) return false;
    return true;
  }, [currentPassword, newPassword, newPasswordConfirmation]);

  const submit = async () => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) return;
    setSaving(true);
    try {
      const res = await fetch("/api/auth/password/change", {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: newPasswordConfirmation,
        }),
      });

      if (!res.ok) {
        const bodyText = await res.text().catch(() => "");
        const message =
          res.status === 401
            ? isTokenExpiredText(bodyText)
              ? "Sessão expirada. Faça login novamente."
              : "Senha atual incorreta."
            : res.status === 403
              ? "Sua conta não tem permissão para trocar a senha"
              : bodyText
                ? bodyText
                : "Não foi possível trocar a senha";
        toast.error("Falha ao trocar senha", { description: message });
        return;
      }

      toast.success("Senha atualizada");
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirmation("");
      setConfirmOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const chartData = useMemo(() => {
    const items = credits?.usage_per_day ?? [];
    return items
      .slice(-14)
      .map((d) => ({ date: d.date.slice(5), used: Number(d.used ?? 0) }));
  }, [credits?.usage_per_day]);

  const filled = completion.filter((c) => c.done).length;
  const completionPct = Math.round((filled / completion.length) * 100);

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Meu perfil</h1>
        <p className="text-muted-foreground text-sm">
          Atualize seus dados e gerencie créditos.
        </p>
      </div>

      <Card className="p-5 sm:p-6 bg-gradient-primary text-primary-foreground shadow-elegant">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-sm opacity-80">
                <Sparkles className="h-4 w-4" /> Créditos de IA
              </div>
              <div className="text-3xl font-semibold tabular-nums mt-1">
                {creditsLoading
                  ? "—"
                  : (credits?.consumo_atual ?? 0).toLocaleString("pt-BR")}
              </div>
              <div className="text-xs opacity-75 mt-1">
                Consumo do mês atual · uso diário (últimos 14 dias)
              </div>
            </div>
            <Button
              variant="secondary"
              className="bg-background/95 text-foreground hover:bg-background"
              asChild
            >
              <a
                href="https://pay.hotmart.com/K106271091F?checkoutMode=10"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Assinar plataforma
              </a>
            </Button>
          </div>

          <div className="rounded-lg bg-background/10 border border-white/15 p-3">
            <ChartContainer
              className="h-[160px] w-full"
              config={{
                used: { label: "Usado", color: "rgba(255,255,255,0.9)" },
              }}
            >
              <AreaChart data={chartData} margin={{ left: 8, right: 8 }}>
                <CartesianGrid
                  vertical={false}
                  stroke="rgba(255,255,255,0.15)"
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  stroke="rgba(255,255,255,0.6)"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="used"
                  stroke="rgba(255,255,255,0.9)"
                  fill="rgba(255,255,255,0.25)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>
      </Card>

      <Card className="p-5 sm:p-6 shadow-elegant">
        <h2 className="font-semibold mb-4">Dados pessoais</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={profileLoading || profileSaving}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="crm">CRM</Label>
            <Input
              id="crm"
              value={crm}
              onChange={(e) => setCrm(maskCrmInput(e.target.value))}
              placeholder="123456/SP"
              disabled={profileLoading || profileSaving}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" value={email} readOnly disabled />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              disabled={profileLoading || profileSaving}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="company">Empresa</Label>
            <Input id="company" value={companyNome} readOnly disabled />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button
            className="bg-gradient-primary shadow-elegant"
            disabled={profileLoading || profileSaving || !nome.trim()}
            onClick={saveProfile}
          >
            {profileSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            Salvar alterações
          </Button>
        </div>
      </Card>

      <Card className="p-5 sm:p-6 shadow-elegant">
        <h2 className="font-semibold mb-4">Segurança</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="cur">Senha atual</Label>
            <Input
              id="cur"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <div />
          <div className="space-y-1.5">
            <Label htmlFor="new">Nova senha</Label>
            <Input
              id="new"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cnf">Confirmar</Label>
            <Input
              id="cnf"
              type="password"
              value={newPasswordConfirmation}
              onChange={(e) => setNewPasswordConfirmation(e.target.value)}
              autoComplete="new-password"
            />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button
            variant="outline"
            disabled={!canSubmit || saving}
            onClick={() => {
              if (!canSubmit) {
                toast.message("Revise os campos", {
                  description:
                    "A nova senha deve ter 8+ caracteres e confirmar corretamente.",
                });
                return;
              }
              setConfirmOpen(true);
            }}
          >
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Atualizar senha
          </Button>
        </div>
      </Card>

      <Card className="p-5 bg-gradient-hero text-primary-foreground shadow-elevated overflow-hidden relative">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-primary-glow/30 blur-3xl" />
        <div className="relative flex flex-wrap gap-4 items-center justify-between">
          <div>
            <div className="text-xs opacity-80">
              Seu perfil está {completionPct}% completo
            </div>
            <div className="text-2xl font-semibold mt-1">
              Desbloqueie previsões mais precisas
            </div>
            <p className="text-sm opacity-85 mt-1 max-w-md">
              Cadastre os itens que faltam para a IA cruzar mais dados e
              antecipar pendências.
            </p>
          </div>
          <Button
            variant="secondary"
            className="bg-background/95 text-foreground hover:bg-background"
          >
            Continuar cadastro <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <div className="relative mt-5 h-2 rounded-full bg-primary-foreground/20 overflow-hidden">
          <div
            className="h-full bg-primary-foreground transition-smooth"
            style={{ width: `${completionPct}%` }}
          />
        </div>
        <ul className="relative mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
          {completion.map((c) => (
            <li key={c.label} className="flex items-center gap-2 opacity-95">
              <span
                className={`h-4 w-4 rounded-full border-2 flex items-center justify-center text-[10px] ${c.done ? "bg-primary-foreground text-primary border-primary-foreground" : "border-primary-foreground/50"}`}
              >
                {c.done && "✓"}
              </span>
              {c.label}
            </li>
          ))}
        </ul>
      </Card>

      <AlertDialog
        open={confirmOpen}
        onOpenChange={(open) => (saving ? null : setConfirmOpen(open))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar troca de senha</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação vai alterar sua senha de acesso. Confirme para
              continuar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancelar</AlertDialogCancel>
            <AlertDialogAction disabled={saving} onClick={submit}>
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}

function Field({
  id,
  label,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
    </div>
  );
}
