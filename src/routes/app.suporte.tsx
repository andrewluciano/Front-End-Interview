import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Flag,
  Clock3,
  CreditCard,
  DollarSign,
  FileText,
  HeartHandshake,
  Info,
  Lightbulb,
  Mail,
  MessageCircle,
  MessageCircleQuestion,
  Minus,
  Plus,
  Rocket,
  User,
  Skull,
} from "lucide-react";
import { toast } from "sonner";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { PendencyLevelIcon } from "@/components/PendencyLevelIcon";

type SupportTicket = {
  id: string;
  status: "open" | "closed" | string;
  page_path: string;
  user_email: string;
  message: string;
  created_at: string;
  updated_at: string;
};

function badgeVariant(status: string) {
  if (status === "open") return "default" as const;
  if (status === "closed") return "secondary" as const;
  return "outline" as const;
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return "—";
  const ts = Date.parse(value);
  if (!Number.isFinite(ts)) return "—";
  return new Date(ts).toLocaleString("pt-BR");
}

const GETTING_STARTED_STEPS = [
  {
    title: "Adicione seu primeiro procedimento em Meu trabalho",
    description:
      'Preencha paciente, convênio, valor, número da guia e da carteirinha. Se faltar algum campo essencial, o procedimento entra como "dados irregulares" (veja abaixo).',
  },
  {
    title: "Suba seus extratos em Conciliação",
    description:
      "Quando o convênio enviar o demonstrativo, suba a foto ou PDF na tela de Conciliação. O sistema atrela ao procedimento e identifica glosas automaticamente.",
  },
  {
    title: "Cadastre seus convênios e procedimentos na guia de Configurações",
    description:
      "Adicione os convênios com que você trabalha e os procedimentos que costuma realizar. Isso permite que o sistema identifique pagamentos e faça melhores análises.",
  },
] as const;

const DOCS: Array<{ title: string; url: string; description: string }> = [
  {
    title: "Painel",
    url: "/app",
    description:
      "Visão geral, pendências, conciliação e procedimentos recentes.",
  },
  {
    title: "Meu trabalho",
    url: "/app/trabalho",
    description:
      "Lista e edição de consultas e procedimentos, status e pendências.",
  },
  {
    title: "Conciliação",
    url: "/app/conciliacao",
    description: "Acompanhe extratos enviados e procedimentos conciliados.",
  },
  {
    title: "Pacientes",
    url: "/app/pacientes",
    description: "Cadastro e busca de pacientes, histórico por pessoa.",
  },
  {
    title: "Arquivos",
    url: "/app/arquivos",
    description: "Gestão de arquivos enviados e workflows de processamento.",
  },
  {
    title: "Insights",
    url: "/app/insights",
    description: "KPIs e conversa com seus dados para análise rápida.",
  },
  {
    title: "Usuários",
    url: "/app/usuarios",
    description:
      "Convide secretária e contador. Cada um com nível de acesso próprio.",
  },
  {
    title: "Configurações",
    url: "/app/configuracoes",
    description: "Convênios, tabela de honorários, integrações e preferências.",
  },
  {
    title: "Perfil",
    url: "/app/perfil",
    description:
      "Seus dados profissionais (CRM, especialidade) e preferências.",
  },
];

const PENDENCY_LEVELS = [
  {
    pill: "30",
    tone: "bg-warning/15 text-warning-foreground border border-warning/30",
    icon: Flag,
    title: "Atenção",
    description:
      "Pagamento atrasou o prazo padrão. Verifique se o convênio confirmou o recebimento da guia e qual o status do faturamento.",
  },
  {
    pill: "60",
    tone: "bg-[oklch(0.94_0.06_55)] text-[oklch(0.42_0.12_55)] border border-[oklch(0.84_0.09_55)] dark:bg-[oklch(0.35_0.08_55)] dark:text-[oklch(0.88_0.09_55)] dark:border-[oklch(0.46_0.08_55)]",
    icon: AlertTriangle,
    title: "Crítico",
    description:
      "Hora de cobrar o convênio formalmente. Anote o número de protocolo da ligação ou e-mail e registre no procedimento.",
  },
  {
    pill: "90",
    tone: "bg-destructive/10 text-destructive border border-destructive/20",
    icon: Skull,
    title: "Risco de perda",
    description:
      "Acione canal jurídico ou auditoria do convênio. Alguns contratos permitem que o convênio alegue prescrição em prazos longos.",
  },
] as const;

const REQUIRED_FIELDS = [
  {
    title: "Número da carteirinha",
    description:
      "Identifica o paciente dentro do convênio. Sem ela, o pagamento pode entrar em outro CPF e não ser conciliado.",
    icon: CreditCard,
  },
  {
    title: "Número da guia",
    description:
      "Referência única do procedimento perante o convênio. É o que aparece no demonstrativo de pagamento e permite cruzar automaticamente.",
    icon: FileText,
  },
  {
    title: "Nome do paciente",
    description:
      "Registro mínimo para identificação humana e cruzamento com cadastro de pacientes.",
    icon: User,
  },
  {
    title: "Valor cobrado",
    description:
      "Necessário para detectar glosas. Sem valor cobrado registrado, o sistema não consegue comparar com o que o convênio pagou.",
    icon: DollarSign,
  },
] as const;

const FAQS: Array<{ question: string; answer: ReactNode }> = [
  {
    question: "Como adiciono um novo procedimento?",
    answer: (
      <p className="leading-6 text-muted-foreground">
        Vá em{" "}
        <Link
          to="/app/trabalho"
          className="font-semibold text-foreground underline underline-offset-4"
        >
          Meu trabalho
        </Link>{" "}
        e clique em{" "}
        <strong className="text-foreground">+ Adicionar procedimento</strong> no
        canto superior direito. Preencha paciente, convênio, valor, número da
        guia e da carteirinha. Você também pode usar o botão de câmera para
        fotografar a guia diretamente. O OCR extrai os campos para você.
      </p>
    ),
  },
  {
    question: "Meu procedimento apareceu com aviso amarelo. O que significa?",
    answer: (
      <p className="leading-6 text-muted-foreground">
        Significa que o procedimento foi cadastrado com algum campo essencial
        faltando: carteirinha, número da guia, nome do paciente ou valor. Clique
        no procedimento para abrir o formulário e completar os dados. Enquanto
        estiverem irregulares, o sistema não consegue garantir conciliação
        automática.
      </p>
    ),
  },
  {
    question: "Como conciliar um pagamento que recebi?",
    answer: (
      <p className="leading-6 text-muted-foreground">
        Em{" "}
        <Link
          to="/app/conciliacao"
          className="font-semibold text-foreground underline underline-offset-4"
        >
          Conciliação
        </Link>
        , suba o demonstrativo (foto, PDF ou XML TISS). O sistema cruza os dados
        com seus procedimentos cadastrados e propõe pares com nível de
        confiança. Confirme cada par com um clique. Quando o valor recebido for
        menor que o cobrado, o sistema gera automaticamente um alerta de glosa.
      </p>
    ),
  },
  {
    question: "Posso adicionar minha secretária ou contador?",
    answer: (
      <p className="leading-6 text-muted-foreground">
        Sim, em{" "}
        <Link
          to="/app/usuarios"
          className="font-semibold text-foreground underline underline-offset-4"
        >
          Usuários
        </Link>
        . Cada perfil tem nível de acesso próprio: secretária pode cadastrar e
        conciliar, mas não vê faturamento agregado; contador pode exportar
        relatórios, mas não edita procedimentos clínicos. Você sempre tem acesso
        total.
      </p>
    ),
  },
  {
    question: "Quais formatos de arquivo o OCR aceita?",
    answer: (
      <p className="leading-6 text-muted-foreground">
        Fotos em JPG/PNG, PDF de qualquer tamanho e XML TISS (padrão ANS). No
        XML TISS a conciliação é totalmente automática, sem necessidade de OCR.
        PDFs protegidos por senha precisam ser desbloqueados antes do envio.
      </p>
    ),
  },
  {
    question: "E se eu não usar o sistema por alguns dias?",
    answer: (
      <p className="leading-6 text-muted-foreground">
        Sem problema. Seus dados ficam salvos e nada se perde. Mas recomendamos
        capturar as guias no mesmo dia do procedimento; quanto mais tempo passa,
        maior o risco de a guia ser esquecida ou perdida. Você pode configurar
        lembretes diários em{" "}
        <Link
          to="/app/configuracoes"
          className="font-semibold text-foreground underline underline-offset-4"
        >
          Configurações
        </Link>
        .
      </p>
    ),
  },
];

const CONTACTS = [
  {
    title: "WhatsApp",
    value: "(21) 99999-0000",
    href: "https://wa.me/5521999990000",
    icon: MessageCircle,
    ariaLabel: "Abrir conversa no WhatsApp com o suporte do Fatura Viva",
  },
  {
    title: "E-mail",
    value: "suporte@faturaviva.com.br",
    href: "mailto:suporte@faturaviva.com.br",
    icon: Mail,
    ariaLabel: "Enviar e-mail para suporte@faturaviva.com.br",
  },
] as const;

export const Route = createFileRoute("/app/suporte")({
  component: Suporte,
  head: () => ({ meta: [{ title: "Suporte — Fatura Viva" }] }),
  loader: async () => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("fv_access_token")
          : null;
      const headers = {
        accept: "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      };
      const res = await fetch("/api/suporte/tickets", { headers });
      if (!res.ok) return [] as SupportTicket[];
      const json = (await res.json()) as unknown;
      return Array.isArray(json)
        ? (json as SupportTicket[])
        : ([] as SupportTicket[]);
    } catch {
      return [] as SupportTicket[];
    }
  },
});

function Suporte() {
  const initial = Route.useLoaderData();
  const [tickets, setTickets] = useState<SupportTicket[]>(initial);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [ticketsCollapsed, setTicketsCollapsed] = useState(false);
  const [newTicketOpen, setNewTicketOpen] = useState(false);
  const [newTicketMessage, setNewTicketMessage] = useState("");
  const [creatingTicket, setCreatingTicket] = useState(false);

  const sorted = useMemo(() => {
    return tickets
      .slice()
      .sort(
        (a, b) =>
          Date.parse(b.created_at ?? "") - Date.parse(a.created_at ?? ""),
      );
  }, [tickets]);

  return (
    <>
      <Dialog open={newTicketOpen} onOpenChange={setNewTicketOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Abrir novo ticket</DialogTitle>
          </DialogHeader>

          <Textarea
            value={newTicketMessage}
            onChange={(event) => setNewTicketMessage(event.target.value)}
            placeholder="Descreva sua dúvida ou o problema encontrado..."
            className="min-h-32"
          />

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="secondary"
              disabled={creatingTicket}
              onClick={() => {
                setNewTicketOpen(false);
                setNewTicketMessage("");
              }}
            >
              Cancelar
            </Button>
            <Button
              className="bg-gradient-primary shadow-elegant"
              disabled={creatingTicket || !newTicketMessage.trim()}
              onClick={async () => {
                const token = localStorage.getItem("fv_access_token") ?? "";
                if (!token) {
                  toast.error("Faça login para abrir um ticket");
                  return;
                }

                setCreatingTicket(true);
                try {
                  const res = await fetch("/api/suporte/tickets", {
                    method: "POST",
                    headers: {
                      accept: "application/json",
                      "content-type": "application/json",
                      authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      page_path: "/app/suporte",
                      message: newTicketMessage.trim(),
                    }),
                  });

                  if (!res.ok) {
                    toast.error("Não foi possível abrir o ticket");
                    return;
                  }

                  const created = (await res.json()) as SupportTicket;
                  setTickets((prev) => [created, ...prev]);
                  setTicketsCollapsed(false);
                  setNewTicketMessage("");
                  setNewTicketOpen(false);
                  toast.success("Ticket aberto com sucesso");
                } catch {
                  toast.error("Não foi possível abrir o ticket");
                } finally {
                  setCreatingTicket(false);
                }
              }}
            >
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-6 max-w-6xl mx-auto">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Suporte</h1>
          <p className="text-muted-foreground text-sm">
            Documentação rápida, guias de uso e seus tickets.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="space-y-6">
            <Card className="shadow-elegant">
              <CardHeader className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Rocket className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle>Como começar em 3 passos</CardTitle>
                    <CardDescription>
                      Se é seu primeiro dia, comece por aqui.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4">
                {GETTING_STARTED_STEPS.map((step, index) => (
                  <div
                    key={step.title}
                    className="flex items-start gap-4 rounded-xl border border-border bg-background/70 p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                      {index + 1}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">
                        {step.title}
                      </p>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Documentação por página</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-1">
                {DOCS.map((doc) => (
                  <div
                    key={doc.url}
                    className="flex flex-col gap-3 rounded-xl border border-border bg-background/70 p-4 md:flex-row md:items-start md:justify-between"
                  >
                    <div className="min-w-0">
                      <Link
                        to={doc.url}
                        className="font-semibold text-foreground hover:underline"
                      >
                        {doc.title}
                      </Link>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {doc.description}
                      </p>
                    </div>
                    <code className="shrink-0 rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                      {doc.url}
                    </code>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warning/15 text-warning-foreground">
                    <Clock3 className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle>Entendendo pendências</CardTitle>
                    <CardDescription className="leading-6">
                      Procedimentos que ainda não foram pagos pelo convênio. O
                      sistema classifica a urgência pelo tempo decorrido desde a
                      realização.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="overflow-hidden rounded-full border border-border bg-muted/60">
                  <div className="grid h-2 grid-cols-3">
                    <div className="bg-warning/55" />
                    <div className="bg-[oklch(0.84_0.1_55)]" />
                    <div className="bg-destructive/40" />
                  </div>
                </div>

                <div className="space-y-3">
                  {PENDENCY_LEVELS.map((level) => (
                    <div
                      key={level.pill}
                      className="rounded-xl border border-border bg-background/70 p-4"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start">
                        <PendencyLevelIcon
                          icon={level.icon}
                          tone={level.tone}
                          pill={level.pill}
                        />

                        <p className="text-sm leading-6 text-muted-foreground">
                          <span className="font-semibold text-foreground">
                            {level.title}
                          </span>{" "}
                          {level.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-start gap-3 border-t border-border pt-4 text-sm text-muted-foreground">
                  <Info
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <p className="leading-6">
                    Você pode ver e filtrar todas as pendências em{" "}
                    <Link
                      to="/app/trabalho"
                      className="font-semibold text-foreground underline underline-offset-4"
                    >
                      Meu trabalho
                    </Link>
                    , com filtro de status por idade.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[oklch(0.95_0.04_55)] text-[oklch(0.5_0.14_55)] dark:bg-[oklch(0.35_0.08_55)] dark:text-[oklch(0.88_0.09_55)]">
                    <AlertCircle className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle>Entendendo dados irregulares</CardTitle>
                    <CardDescription className="leading-6">
                      Procedimentos cadastrados com informações essenciais
                      faltando. Sem esses campos, não conseguimos garantir
                      conciliação correta nem gerar recursos de glosa quando
                      necessário.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Campos obrigatórios
                </p>

                <div className="space-y-3">
                  {REQUIRED_FIELDS.map((field) => {
                    const Icon = field.icon;
                    return (
                      <div
                        key={field.title}
                        className="flex items-start gap-3 rounded-xl border border-border bg-background/70 p-4"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <p className="text-sm leading-6 text-muted-foreground">
                          <span className="font-semibold text-foreground">
                            {field.title}
                          </span>{" "}
                          {field.description}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-primary/15 bg-primary/5 p-4 text-sm text-foreground">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background text-primary shadow-sm">
                    <Lightbulb className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <p className="leading-6 text-muted-foreground">
                    <strong className="text-foreground">Como resolver:</strong>{" "}
                    Procedimentos com dados irregulares aparecem destacados em{" "}
                    <Link
                      to="/app/trabalho"
                      className="font-semibold text-foreground underline underline-offset-4"
                    >
                      Meu trabalho
                    </Link>
                    . Clique no procedimento, preencha os campos faltantes e o
                    status atualiza automaticamente.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MessageCircleQuestion
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="min-w-0">
                    <CardTitle>Perguntas frequentes</CardTitle>
                    <CardDescription>
                      Respostas curtas para as dúvidas mais comuns.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion
                  type="single"
                  collapsible
                  defaultValue="faq-0"
                  className="rounded-xl border border-border bg-background/70 px-4"
                >
                  {FAQS.map((item, index) => (
                    <AccordionItem key={item.question} value={`faq-${index}`}>
                      <AccordionTrigger className="gap-4 py-5 text-base font-semibold hover:no-underline">
                        <span>{item.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-elegant">
              <Collapsible
                open={!ticketsCollapsed}
                onOpenChange={(open) => setTicketsCollapsed(!open)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-base">Meus tickets</CardTitle>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={
                          ticketsCollapsed
                            ? "Expandir tickets"
                            : "Recolher tickets"
                        }
                      >
                        {ticketsCollapsed ? (
                          <Plus className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Minus className="h-4 w-4" aria-hidden="true" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </CardHeader>

                <CollapsibleContent>
                  <CardContent className="space-y-3">
                    {sorted.length ? (
                      sorted.map((ticket) => (
                        <div
                          key={ticket.id}
                          className="rounded-xl border border-border bg-background/70 p-4"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={badgeVariant(ticket.status)}
                                  className="capitalize"
                                >
                                  {ticket.status}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  #{ticket.id.slice(0, 8)}
                                </span>
                              </div>
                              <p className="mt-2 text-xs text-muted-foreground">
                                Página:{" "}
                                <span className="font-medium text-foreground/80">
                                  {ticket.page_path || "—"}
                                </span>
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                Criado em {formatDateTime(ticket.created_at)} ·
                                Atualizado em{" "}
                                {formatDateTime(ticket.updated_at)}
                              </p>
                            </div>

                            <Button
                              size="sm"
                              variant="secondary"
                              disabled={updatingId === ticket.id}
                              onClick={async () => {
                                const next =
                                  ticket.status === "closed"
                                    ? "open"
                                    : "closed";
                                const token =
                                  localStorage.getItem("fv_access_token") ?? "";
                                if (!token) {
                                  toast.error(
                                    "Faça login para atualizar um ticket",
                                  );
                                  return;
                                }
                                setUpdatingId(ticket.id);
                                try {
                                  const res = await fetch(
                                    "/api/suporte/tickets",
                                    {
                                      method: "PATCH",
                                      headers: {
                                        accept: "application/json",
                                        "content-type": "application/json",
                                        authorization: `Bearer ${token}`,
                                      },
                                      body: JSON.stringify({
                                        ticket_id: ticket.id,
                                        status: next,
                                      }),
                                    },
                                  );
                                  if (!res.ok) {
                                    toast.error(
                                      "Não foi possível atualizar o ticket",
                                    );
                                    return;
                                  }
                                  const updated =
                                    (await res.json()) as SupportTicket;
                                  setTickets((prev) =>
                                    prev.map((item) =>
                                      item.id === updated.id ? updated : item,
                                    ),
                                  );
                                } catch {
                                  toast.error(
                                    "Não foi possível atualizar o ticket",
                                  );
                                } finally {
                                  setUpdatingId(null);
                                }
                              }}
                            >
                              {ticket.status === "closed"
                                ? "Reabrir"
                                : "Encerrar"}
                            </Button>
                          </div>

                          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-foreground">
                            {ticket.message}
                          </p>
                          {ticket.user_email ? (
                            <p className="mt-2 text-xs text-muted-foreground">
                              {ticket.user_email}
                            </p>
                          ) : null}
                        </div>
                      ))
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground">
                          Nenhum ticket aberto no momento.
                        </p>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setNewTicketOpen(true)}
                        >
                          <Plus className="h-4 w-4" aria-hidden="true" />
                          Abrir novo ticket
                        </Button>
                      </>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            <Card className="border-primary/15 bg-gradient-card shadow-elegant">
              <CardHeader className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <HeartHandshake className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle>Precisa de ajuda direta?</CardTitle>
                    <CardDescription className="leading-6">
                      Fale com nosso time. Respondemos em até 4h em dias úteis.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {CONTACTS.map((contact) => {
                  const Icon = contact.icon;
                  return (
                    <a
                      key={contact.title}
                      href={contact.href}
                      aria-label={contact.ariaLabel}
                      className="flex items-center gap-3 rounded-xl border border-primary/10 bg-background/90 p-4 transition-colors hover:bg-background"
                      target={
                        contact.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        contact.href.startsWith("http")
                          ? "noreferrer noopener"
                          : undefined
                      }
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background text-primary shadow-sm">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">
                          {contact.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {contact.value}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
