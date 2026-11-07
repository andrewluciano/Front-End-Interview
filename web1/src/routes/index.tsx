import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import logo from "@/assets/leaf-logo.png";
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  FileSearch,
  Instagram,
  LineChart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "Fatura Viva — Redução de glosas com inteligência artificial" },
      {
        name: "description",
        content:
          "Auditoria médica e faturamento hospitalar com inteligência artificial para reduzir glosas médicas, automatizar auditoria de contas e aumentar receita de clínicas e hospitais.",
      },
      {
        property: "og:title",
        content: "Fatura Viva — Redução de glosas com inteligência artificial",
      },
      {
        property: "og:description",
        content:
          "Auditoria médica e faturamento hospitalar com IA para reduzir glosas, automatizar auditoria de contas e aumentar receita de clínicas e hospitais.",
      },
      { property: "og:url", content: "https://faturaviva.com.br/" },
      {
        property: "og:image",
        content: "https://faturaviva.com.br/og-image.png",
      },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Fatura Viva — Redução de glosas com IA",
      },
      {
        name: "twitter:description",
        content:
          "Auditoria médica e faturamento hospitalar com IA para reduzir glosas e aumentar receita de clínicas.",
      },
      {
        name: "twitter:image",
        content: "https://faturaviva.com.br/og-image.png",
      },
    ],
    links: [{ rel: "canonical", href: "https://faturaviva.com.br/" }],
  }),
});

function Landing() {
  const instagramHandle = "faturaviva";
  const instagramUrl = `https://instagram.com/${instagramHandle}`;

  const faqs = [
    {
      q: "O que é o Fatura Viva?",
      a: "O Fatura Viva é uma plataforma de inteligência para faturamento médico e auditoria de contas médicas. Ela usa inteligência artificial para identificar inconsistências, reduzir glosas médicas, apoiar auditoria hospitalar e oferecer indicadores financeiros para clínicas.",
    },
    {
      q: "Como funciona a auditoria automática?",
      a: "Você importa dados (CSV, Excel, APIs ou arquivos operacionais). O sistema valida regras, detecta divergências e aponta inconsistências antes do envio, reduzindo retrabalho e perda de receita por glosa.",
    },
    {
      q: "O sistema substitui meu software atual?",
      a: "Não necessariamente. O Fatura Viva pode atuar como camada de auditoria e controle de faturamento médico, recebendo dados do seu processo atual para validar, sugerir correções e monitorar indicadores.",
    },
    {
      q: "Quanto tempo leva a implantação?",
      a: "A adoção costuma começar por importação de arquivos e pode evoluir para integrações via APIs. O tempo exato depende do volume, formatos e rotinas da operação.",
    },
    {
      q: "Quais arquivos podem ser importados?",
      a: "A plataforma aceita arquivos como CSV e Excel, além de integrações via APIs e sistemas de gestão/ERPs e plataformas hospitalares, conforme a disponibilidade dos seus dados.",
    },
    {
      q: "Como a inteligência artificial realiza as análises?",
      a: "A IA identifica padrões e inconsistências com base em regras e sinais dos seus dados operacionais e financeiros, sugerindo correções e priorizando riscos de glosa e falhas de preenchimento.",
    },
    {
      q: "É necessário treinamento?",
      a: "O fluxo é guiado por alertas e recomendações. Quando necessário, orientamos a equipe para padronizar importações e interpretação dos indicadores.",
    },
    {
      q: "Como funciona o suporte?",
      a: "O suporte acompanha o uso e resolve dúvidas, e a plataforma registra eventos e histórico para rastreabilidade. Você também pode falar conosco pelo Instagram.",
    },
    {
      q: "Os dados ficam seguros?",
      a: "A plataforma adota controles de acesso, criptografia, auditoria de atividades e histórico de alterações. A operação segue princípios de segurança e adequação à LGPD.",
    },
    {
      q: "Existe integração com sistemas já utilizados?",
      a: "Sim. É possível integrar por arquivos (CSV/Excel) e por APIs, além de receber dados de sistemas de gestão, ERPs e plataformas hospitalares, conforme a sua operação.",
    },
  ] as const;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Fatura Viva",
        url: "https://faturaviva.com.br",
        sameAs: [instagramUrl],
      },
      {
        "@type": "SoftwareApplication",
        name: "Fatura Viva",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: "https://faturaviva.com.br",
        description:
          "Plataforma de inteligência artificial para faturamento médico, auditoria médica e redução de glosas médicas, com indicadores financeiros em tempo real.",
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <header className="px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <Logo size={36} />
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="rounded-full">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[15px]"
            >
              <Instagram className="h-[18px] w-[18px]" />
              <span className="hidden sm:inline">@{instagramHandle}</span>
            </a>
          </Button>
          <Button
            asChild
            className="rounded-full bg-primary text-primary-foreground shadow-elegant"
          >
            <Link to="/registro">
              Iniciar sem custo agora! <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full hidden sm:inline-flex">
            <a href="#plataforma">Conhecer a plataforma</a>
          </Button>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link to="/login">Entrar</Link>
          </Button>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-primary-glow/25 blur-3xl" />
          <div className="absolute -bottom-48 -left-48 h-[620px] w-[620px] rounded-full bg-primary-glow/15 blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-6 pt-14 pb-16 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-background/70 border border-border px-3 py-1 text-xs font-medium text-foreground">
                <Sparkles className="h-3 w-3 text-primary" />
                Auditoria médica com inteligência artificial
              </div>
              <h1 className="mt-6 text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.05] max-w-xl">
                Reduza glosas e aumente a receita da sua instituição com
                inteligência artificial.
              </h1>
              <p className="mt-5 text-lg text-foreground max-w-xl">
                Automatize auditorias, identifique erros antes do envio e
                acompanhe indicadores financeiros em tempo real para gestão de
                glosas e controle de faturamento médico.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-primary text-primary-foreground shadow-elegant"
                >
                  <Link to="/registro">
                    Iniciar sem custo agora! <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full">
                  <a href="#plataforma">Conhecer a plataforma</a>
                </Button>
              </div>

              <div className="mt-8 text-sm text-foreground/80">
                Atendimento e conteúdo no Instagram:{" "}
                <a
                  className="font-medium underline underline-offset-4"
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  @{instagramHandle}
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[28px] bg-background/20 blur-2xl" />
              <div className="relative rounded-[28px] border border-border bg-background/70 shadow-elevated overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <div className="font-medium">Dashboard financeiro</div>
                  <div className="text-xs text-muted-foreground">
                    Indicadores em tempo real
                  </div>
                </div>
                <div className="p-5 grid gap-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-border bg-background p-3">
                      <div className="text-xs text-muted-foreground">
                        A receber
                      </div>
                      <div className="mt-1 font-semibold tabular-nums">
                        R$ 238.400
                      </div>
                    </div>
                    <div className="rounded-xl border border-border bg-background p-3">
                      <div className="text-xs text-muted-foreground">
                        Recebido
                      </div>
                      <div className="mt-1 font-semibold tabular-nums">
                        R$ 412.900
                      </div>
                    </div>
                    <div className="rounded-xl border border-border bg-background p-3">
                      <div className="text-xs text-muted-foreground">
                        Glosas
                      </div>
                      <div className="mt-1 font-semibold tabular-nums">
                        R$ 38.200
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-background p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-medium">Alertas de inconsistência</div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          Campos ausentes e divergências antes do envio.
                        </div>
                      </div>
                      <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
                    </div>
                    <div className="mt-4 grid gap-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Guia do convênio faltando
                        </span>
                        <span className="font-medium tabular-nums">12</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Procedimento divergente
                        </span>
                        <span className="font-medium tabular-nums">7</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Data de atendimento inválida
                        </span>
                        <span className="font-medium tabular-nums">5</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-background p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium">Indicadores</div>
                      <LineChart className="h-5 w-5 text-primary" />
                    </div>
                    <div className="mt-4 grid gap-2">
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full w-[62%] bg-primary" />
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Conformidade de envio</span>
                        <span className="tabular-nums">62%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-center">
                <img
                  src={logo}
                  alt=""
                  width={260}
                  height={260}
                  className="animate-leaf-sway drop-shadow-2xl opacity-90 w-full max-w-[180px] sm:max-w-[260px]"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="problemas" className="max-w-6xl mx-auto px-6 py-14">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight">
              Sua operação de faturamento enfrenta algum destes desafios?
            </h2>
            <p className="mt-3 text-muted-foreground">
              No faturamento hospitalar e no controle de faturamento médico,
              inconsistências pequenas viram glosas médicas, atrasos e retrabalho.
            </p>
          </div>

          <div className="mt-8 grid lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-background/70 overflow-hidden divide-y divide-border shadow-elegant">
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <FileSearch className="h-5 w-5 text-primary mt-0.5" />
                  <div className="min-w-0">
                    <div className="font-medium">Dados incompletos</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Informações ausentes que geram rejeições e redução de
                      glosas.
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                  <div className="min-w-0">
                    <div className="font-medium">Guias incorretas</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Campos preenchidos incorretamente, com impacto direto em
                      auditoria de contas médicas.
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <LineChart className="h-5 w-5 text-primary mt-0.5" />
                  <div className="min-w-0">
                    <div className="font-medium">Procedimentos divergentes</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Diferenças entre execução e faturamento, com risco de glosa
                      evitável.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background/70 overflow-hidden divide-y divide-border shadow-elegant">
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <CalendarClock className="h-5 w-5 text-primary mt-0.5" />
                  <div className="min-w-0">
                    <div className="font-medium">Prazos perdidos</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Perda de receita por atraso nos processos e janelas de
                      recurso.
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
                  <div className="min-w-0">
                    <div className="font-medium">Falta de auditoria</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Erros passam despercebidos até a glosa, com baixa
                      rastreabilidade.
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                  <div className="min-w-0">
                    <div className="font-medium">Retrabalho constante</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Horas desperdiçadas corrigindo problemas evitáveis, sem
                      automação de faturamento.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="impacto" className="max-w-6xl mx-auto px-6 py-14">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight">
              Pequenos erros podem gerar grandes perdas financeiras.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Glosas evitáveis, receitas não faturadas e horas operacionais
              desperdiçadas tendem a se acumular. O objetivo é visibilidade: o
              que está travando, por quê, e quanto custa.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-background/70 shadow-elegant overflow-hidden">
            <div className="p-6 sm:p-8 grid lg:grid-cols-2 gap-8 items-start">
              <div className="min-w-0">
                <div className="text-sm font-medium">Exemplo visual</div>
                <div className="mt-2 text-muted-foreground">
                  Uma operação com R$ 1.000.000/mês, com 3% em glosas médicas e
                  1% em receita não faturada.
                </div>

                <div className="mt-6 grid gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Glosas evitáveis
                    </span>
                    <span className="text-sm font-semibold tabular-nums">
                      R$ 30.000
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-[60%] bg-primary" />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Receita não faturada
                    </span>
                    <span className="text-sm font-semibold tabular-nums">
                      R$ 10.000
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-[20%] bg-primary" />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Retrabalho operacional
                    </span>
                    <span className="text-sm font-semibold tabular-nums">
                      120 horas/mês
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-[45%] bg-primary" />
                  </div>
                </div>
              </div>

              <div className="min-w-0">
                <div className="rounded-2xl border border-border bg-background p-6">
                  <div className="font-medium">O que o Fatura Viva ajuda a evitar</div>
                  <ul className="mt-4 grid gap-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                      Inconsistências antes do envio (redução de glosas).
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                      Perda por prazos e janelas de recurso.
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                      Falhas recorrentes por falta de auditoria hospitalar.
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                      Gargalos invisíveis na operação de faturamento médico.
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Button
                      asChild
                      className="rounded-full bg-primary text-primary-foreground"
                    >
                      <Link to="/registro">
                        Iniciar sem custo agora! <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="plataforma" className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <h2 className="text-2xl font-semibold tracking-tight">
                Uma plataforma de inteligência para faturamento médico.
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl">
                O Fatura Viva analisa dados operacionais e financeiros para
                identificar inconsistências, reduzir glosas médicas, apoiar
                auditoria médica e fornecer indicadores para tomada de decisão.
                O resultado é mais previsibilidade financeira, menos retrabalho
                e processos escaláveis para clínicas, hospitais e empresas de
                faturamento.
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-border bg-background/70 shadow-elegant p-6">
                <div className="font-medium">Mensagem central</div>
                <p className="mt-3 text-sm text-muted-foreground">
                  O Fatura Viva utiliza inteligência artificial na saúde para
                  identificar inconsistências, reduzir glosas, automatizar
                  auditorias e aumentar a receita de clínicas e hospitais.
                </p>
                <div className="mt-6 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1">
                    auditoria de contas médicas
                  </span>
                  <span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1">
                    gestão de glosas
                  </span>
                  <span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1">
                    automação de faturamento
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="max-w-6xl mx-auto px-6 py-14">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight">Como funciona</h2>
            <p className="mt-3 text-muted-foreground">
              Um fluxo claro da importação ao monitoramento, com auditoria
              inteligente e recomendações.
            </p>
          </div>

          <ol className="mt-8 grid gap-4">
            {[
              {
                title: "Importação",
                desc: "Recebimento dos dados da operação por arquivos ou APIs.",
              },
              {
                title: "Processamento",
                desc: "Validação automática de regras e normalização dos dados.",
              },
              {
                title: "Auditoria inteligente",
                desc: "Detecção de inconsistências e risco de glosa antes do envio.",
              },
              {
                title: "Recomendações",
                desc: "Sugestões de correção e priorização do que dá retorno.",
              },
              {
                title: "Monitoramento",
                desc: "Acompanhamento contínuo de indicadores financeiros e operacionais.",
              },
            ].map((step, idx) => (
              <li
                key={step.title}
                className="rounded-2xl border border-border bg-background/70 shadow-elegant p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold shrink-0">
                      {idx + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium">{step.title}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {step.desc}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground hidden sm:block mt-2" />
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="recursos" className="max-w-6xl mx-auto px-6 py-14">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight">
              Recursos da plataforma
            </h2>
            <p className="mt-3 text-muted-foreground">
              Funcionalidades pensadas para auditoria hospitalar, faturamento
              médico e gestão financeira de clínicas, com foco em reduzir glosas
              e aumentar a receita.
            </p>
          </div>

          <div className="mt-8 grid lg:grid-cols-2 gap-6">
            {[
              {
                title: "Auditoria inteligente",
                desc: "Validação automática de registros e regras de negócio.",
                benefits: ["Menos erros", "Menos retrabalho", "Mais controle"],
              },
              {
                title: "Detecção de glosas",
                desc: "Identificação preventiva de situações de risco.",
                benefits: ["Redução de perdas", "Maior previsibilidade financeira"],
              },
              {
                title: "Gestão de prazos",
                desc: "Monitoramento de datas críticas e janelas de recurso.",
                benefits: ["Evita perda de faturamento", "Mantém conformidade operacional"],
              },
              {
                title: "Dashboard financeiro",
                desc: "Indicadores em tempo real para a tomada de decisão.",
                benefits: ["Visão gerencial", "Indicadores confiáveis"],
              },
              {
                title: "Relatórios operacionais",
                desc: "Análises detalhadas da operação e rastreabilidade.",
                benefits: ["Transparência", "Histórico completo"],
              },
              {
                title: "Inteligência artificial",
                desc: "Análise contínua dos dados e recomendações automáticas.",
                benefits: ["Identificação de padrões", "Aprendizado contínuo"],
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-border bg-background/70 shadow-elegant p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-medium">{f.title}</div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {f.desc}
                    </div>
                  </div>
                  <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {f.benefits.map((b) => (
                    <span
                      key={b}
                      className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="beneficios" className="max-w-6xl mx-auto px-6 py-14">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight">
              O que sua instituição ganha com o Fatura Viva?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Resultados financeiros e operacionais traduzidos em decisões mais
              rápidas, com auditoria de contas médicas e indicadores confiáveis.
            </p>
          </div>

          <div className="mt-8 grid lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-background/70 shadow-elegant p-6">
              <div className="font-medium">Resultados</div>
              <ul className="mt-4 grid gap-3 text-sm text-muted-foreground">
                {[
                  "Redução de glosas",
                  "Mais receita recuperada",
                  "Maior produtividade",
                  "Processos escaláveis",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-background/70 shadow-elegant p-6">
              <div className="font-medium">Controle</div>
              <ul className="mt-4 grid gap-3 text-sm text-muted-foreground">
                {[
                  "Menos retrabalho",
                  "Mais controle operacional",
                  "Indicadores confiáveis",
                  "Decisões baseadas em dados",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="casos-de-uso" className="max-w-6xl mx-auto px-6 py-14">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight">Casos de uso</h2>
            <p className="mt-3 text-muted-foreground">
              A mesma base de auditoria médica e automação se adapta ao volume e
              à complexidade de cada operação.
            </p>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Clínicas",
                desc: "Controle e auditoria do faturamento, com indicadores financeiros para clínicas.",
              },
              {
                title: "Hospitais",
                desc: "Monitoramento de grandes volumes operacionais e auditoria hospitalar.",
              },
              {
                title: "Centros de diagnóstico",
                desc: "Validação de procedimentos e cobranças, reduzindo divergências.",
              },
              {
                title: "Empresas de faturamento",
                desc: "Aumento da eficiência operacional e rastreabilidade para múltiplos clientes.",
              },
            ].map((u) => (
              <div
                key={u.title}
                className="rounded-2xl border border-border bg-background/70 shadow-elegant p-6"
              >
                <div className="font-medium">{u.title}</div>
                <div className="mt-2 text-sm text-muted-foreground">{u.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="seguranca" className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <h2 className="text-2xl font-semibold tracking-tight">
                Segurança desde a origem dos dados.
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl">
                Para auditoria de contas médicas e controle de faturamento médico,
                segurança e conformidade precisam ser padrão, com histórico e
                rastreabilidade.
              </p>
              <ul className="mt-6 grid gap-3 text-sm text-muted-foreground">
                {[
                  "Adequação à LGPD",
                  "Controle de acesso",
                  "Criptografia",
                  "Auditoria de atividades",
                  "Backup automático",
                  "Histórico completo das alterações",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary mt-0.5" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-border bg-background/70 shadow-elegant p-6">
                <div className="flex items-center gap-2 font-medium">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  Conformidade e rastreabilidade
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  Permissões por perfil, trilha de auditoria e histórico,
                  reduzindo risco operacional.
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Segurança e conformidade
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="integracoes" className="max-w-6xl mx-auto px-6 py-14">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight">Integrações</h2>
            <p className="mt-3 text-muted-foreground">
              A plataforma pode receber informações por arquivos e integrações,
              facilitando a adoção sem troca imediata de sistemas.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-background/70 shadow-elegant p-6 sm:p-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              {[
                "Arquivos CSV",
                "Excel",
                "APIs",
                "Sistemas de gestão",
                "ERPs",
                "Plataformas hospitalares",
              ].map((t) => (
                <div
                  key={t}
                  className="rounded-xl border border-border bg-background px-4 py-3 flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="max-w-6xl mx-auto px-6 py-14">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight">
              Perguntas frequentes (FAQ)
            </h2>
            <p className="mt-3 text-muted-foreground">
              Respostas objetivas para auditoria médica, glosas médicas e adoção
              do Fatura Viva.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-background/70 shadow-elegant overflow-hidden">
            <Accordion type="single" collapsible>
              {faqs.map((item, idx) => (
                <AccordionItem key={item.q} value={`faq-${idx}`}>
                  <AccordionTrigger className="px-4">{item.q}</AccordionTrigger>
                  <AccordionContent className="px-4 text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-14">
          <div className="rounded-3xl bg-gradient-hero border border-border overflow-hidden shadow-elevated">
            <div className="p-8 sm:p-10 grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                  Descubra quanto sua operação pode recuperar.
                </h2>
                <p className="mt-3 text-foreground/85 max-w-2xl">
                  Solicite uma demonstração e veja como o Fatura Viva pode ajudar
                  sua equipe a reduzir glosas, aumentar a produtividade e melhorar
                  os resultados financeiros.
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-wrap gap-3 lg:justify-end">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-primary text-primary-foreground shadow-elegant"
                >
                  <Link to="/registro">
                    Iniciar sem custo agora! <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full">
                  <a href="#problemas">Ver problemas</a>
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Segurança, LGPD e trilha de auditoria
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Auditoria de contas médicas, redução de glosas e indicadores
            </div>
          </div>
        </section>
      </main>

      <footer className="max-w-6xl mx-auto px-6 py-8 mt-4 border-t border-border flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
        <div>© {new Date().getFullYear()} Fatura Viva. Todos os direitos reservados.</div>
        <div className="flex flex-wrap gap-4">
          <Link to="/login">Entrar</Link>
          <a href={instagramUrl} target="_blank" rel="noreferrer">
            Instagram
          </a>
        </div>
      </footer>
    </div>
  );
}

