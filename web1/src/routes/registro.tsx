import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  maskCpfInput,
  maskCpfOrCnpjInput,
  maskCrmInput,
  maskPhoneInput,
} from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/registro")({
  component: RegisterPage,
  head: () => ({
    meta: [
      { title: "Criar conta — Fatura Viva" },
      {
        name: "description",
        content: "Crie sua conta Fatura Viva em poucos passos.",
      },
    ],
  }),
});

const steps = ["Conta", "Empresa", "Contato", "Pagamento"] as const;

type RegisterResponse = {
  message: string;
  verification_token: string;
  company_id: string;
};

type TokenResponse = {
  access_token: string;
  token_type: string;
};

const ACCESS_TOKEN_STORAGE_KEY = "fv_access_token";

async function readErrorMessage(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (data && typeof data === "object") {
      if ("detail" in data && typeof (data as any).detail === "string")
        return (data as any).detail;
      if ("message" in data && typeof (data as any).message === "string")
        return (data as any).message;
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

function RegisterPage() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [bypassPaymentConfirmation] = useState(true);
  const [form, setForm] = useState({
    name: "",
    doc: "",
    crm: "",
    email: "",
    password: "",
    confirm: "",
    company: "",
    cnpj: "",
    size: "",
    city: "",
    state: "",
    address: "",
    phone: "",
    whatsapp: "",
    billing_email: "",
  });
  const canFinishRegistration = paymentConfirmed || bypassPaymentConfirmation;

  const paymentIframeSrc = useMemo(() => {
    const baseUrl = "https://pay.hotmart.com/K106271091F?checkoutMode=10";
    const params = new URLSearchParams();
    const phoneDigits = (form.whatsapp || form.phone).replace(/\D/g, "");
    const normalizedPhone =
      phoneDigits.startsWith("55") && phoneDigits.length > 11
        ? phoneDigits.slice(2)
        : phoneDigits;

    if (form.name.trim()) params.set("name", form.name.trim());
    if (form.email.trim()) params.set("email", form.email.trim());
    if (normalizedPhone) {
      params.set("phonecheckout", "55");
      params.set("phonenumber", normalizedPhone);
    }

    const query = params.toString();
    return query ? `${baseUrl}&${query}` : baseUrl;
  }, [form.email, form.name, form.phone, form.whatsapp]);

  useEffect(() => {
    setPaymentConfirmed(false);
  }, [paymentIframeSrc]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const allowedOrigins = new Set([
        window.location.origin,
        "https://pay.hotmart.com",
        "https://checkout.hotmart.com",
      ]);
      if (!allowedOrigins.has(event.origin)) return;

      const payload = event.data;
      const serialized =
        typeof payload === "string" ? payload.toLowerCase() : "";
      const eventType =
        payload && typeof payload === "object" && "type" in payload
          ? String((payload as { type?: unknown }).type ?? "").toLowerCase()
          : "";

      if (
        eventType.includes("success") ||
        eventType.includes("approved") ||
        eventType === "hotmart_payment_success" ||
        serialized.includes("success") ||
        serialized.includes("approved")
      ) {
        setPaymentConfirmed(true);
        toast.success("Pagamento identificado com sucesso.");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const prev = () => setStep((s) => Math.max(s - 1, 0));
  const handleExecutionSubmit = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const companyEndereco = [
        form.address.trim(),
        `${form.city.trim()}${form.state.trim() ? `/${form.state.trim()}` : ""}`,
      ]
        .filter(Boolean)
        .join(" — ");

      const registerPayload = {
        email: form.email.trim(),
        username: form.name.trim(),
        company_nome: form.company.trim(),
        company_documento: form.cnpj.trim(),
        company_telefone: form.phone.trim(),
        company_endereco:
          companyEndereco || `${form.city.trim()}/${form.state.trim()}`,
        password: form.password,
        password_confirmation: form.confirm,
      };

      const registerRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify(registerPayload),
      });

      if (!registerRes.ok) {
        toast.error("Não foi possível criar sua conta.", {
          description: await readErrorMessage(registerRes),
        });
        return;
      }

      const registered = (await registerRes.json()) as RegisterResponse;

      const verifyRes = await fetch("/api/auth/verify/confirm", {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          token: registered.verification_token,
          company_id: registered.company_id,
        }),
      });

      if (!verifyRes.ok) {
        toast.message("Conta criada", {
          description: "Confirme seu e-mail para ativar o acesso.",
        });
        nav({ to: "/login" });
        return;
      }

      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          identifier: form.email.trim(),
          password: form.password,
        }),
      });

      if (!loginRes.ok) {
        toast.message("Conta criada", {
          description: "Faça login para continuar.",
        });
        nav({ to: "/login" });
        return;
      }

      const token = (await loginRes.json()) as TokenResponse;
      localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token.access_token);
      toast.success("Conta criada com sucesso!");
      nav({ to: "/app" });
    } catch {
      toast.error("Erro ao finalizar o cadastro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (step === 0) {
      if (
        !form.name.trim() ||
        !form.doc.trim() ||
        !form.email.trim() ||
        !form.password ||
        !form.confirm
      ) {
        toast.error("Preencha os campos obrigatórios.");
        return;
      }
      if (form.password.length < 8) {
        toast.error("A senha deve ter no mínimo 8 caracteres.");
        return;
      }
      if (form.password !== form.confirm) {
        toast.error("A confirmação de senha não confere.");
        return;
      }
      next();
      return;
    }

    if (step === 1) {
      const docDigits = form.cnpj.replace(/\D/g, "");
      if (
        !form.company.trim() ||
        !docDigits ||
        !form.city.trim() ||
        !form.state.trim()
      ) {
        toast.error("Preencha os campos obrigatórios da empresa.");
        return;
      }
      if (docDigits.length !== 11 && docDigits.length !== 14) {
        toast.error("CNPJ/CPF inválido. Informe 11 ou 14 dígitos.");
        return;
      }
      next();
      return;
    }

    if (!form.phone.trim()) {
      toast.error("Informe um telefone para contato.");
      return;
    }

    if (step === 2) {
      next();
      return;
    }

    if (!canFinishRegistration) {
      toast.error("Aguarde a confirmação do pagamento para criar a conta.");
      return;
    }

    handleExecutionSubmit();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-gradient-subtle">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <Logo size={32} />
          <Link
            to="/login"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Já tenho conta
          </Link>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-6">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold border transition-smooth",
                  i < step &&
                    "bg-success text-success-foreground border-success",
                  i === step &&
                    "bg-primary text-primary-foreground border-primary shadow-glow",
                  i > step && "bg-muted text-muted-foreground border-border",
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-sm font-medium",
                  i === step ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {s}
              </span>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-px",
                    i < step ? "bg-success" : "bg-border",
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <Card className="p-6 sm:p-8 shadow-elegant">
          <form onSubmit={submit} className="space-y-5">
            {step === 0 && (
              <>
                <div>
                  <h2 className="text-xl font-semibold">Sua conta</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Como você acessa a plataforma.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field
                    id="doc"
                    label="CPF"
                    placeholder="000.000.000-00"
                    required
                    value={form.doc}
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        doc: maskCpfInput((e.target as HTMLInputElement).value),
                      }))
                    }
                  />
                  <Field
                    id="name"
                    label="Nome completo"
                    placeholder="Dr. Henrique Souza"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        name: (e.target as HTMLInputElement).value,
                      }))
                    }
                  />
                  <Field
                    id="crm"
                    label="CRM (opcional)"
                    placeholder="123456/SP"
                    value={form.crm}
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        crm: maskCrmInput((e.target as HTMLInputElement).value),
                      }))
                    }
                  />
                  <Field
                    id="email"
                    type="email"
                    label="E-mail"
                    placeholder="voce@clinica.com.br"
                    required
                    className="sm:col-span-2"
                    value={form.email}
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        email: (e.target as HTMLInputElement).value,
                      }))
                    }
                  />
                  <Field
                    id="password"
                    type="password"
                    label="Senha"
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
                  <Field
                    id="confirm"
                    type="password"
                    label="Confirmar senha"
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
              </>
            )}
            {step === 1 && (
              <>
                <div>
                  <h2 className="text-xl font-semibold">Sua empresa</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Dados da clínica ou consultório.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field
                    id="company"
                    label="Nome da empresa"
                    placeholder="Clínica Viva"
                    required
                    className="sm:col-span-2"
                    value={form.company}
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        company: (e.target as HTMLInputElement).value,
                      }))
                    }
                  />
                  <Field
                    id="cnpj"
                    label="CNPJ"
                    placeholder="00.000.000/0001-00"
                    required
                    value={form.cnpj}
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        cnpj: maskCpfOrCnpjInput(
                          (e.target as HTMLInputElement).value,
                        ),
                      }))
                    }
                  />
                  <Field
                    id="size"
                    label="Nº de profissionais"
                    placeholder="Ex: 5"
                    type="number"
                    value={form.size}
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        size: (e.target as HTMLInputElement).value,
                      }))
                    }
                  />
                  <Field
                    id="city"
                    label="Cidade"
                    placeholder="São Paulo"
                    required
                    value={form.city}
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        city: (e.target as HTMLInputElement).value,
                      }))
                    }
                  />
                  <Field
                    id="state"
                    label="Estado"
                    placeholder="SP"
                    required
                    value={form.state}
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        state: (e.target as HTMLInputElement).value,
                      }))
                    }
                  />
                  <Field
                    id="address"
                    label="Endereço"
                    placeholder="Av. Paulista, 1000"
                    className="sm:col-span-2"
                    value={form.address}
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        address: (e.target as HTMLInputElement).value,
                      }))
                    }
                  />
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <div>
                  <h2 className="text-xl font-semibold">Contato</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Para suporte e notificações importantes.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field
                    id="phone"
                    label="Telefone"
                    placeholder="(11) 99999-9999"
                    required
                    value={form.phone}
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        phone: maskPhoneInput(
                          (e.target as HTMLInputElement).value,
                        ),
                      }))
                    }
                  />
                  <Field
                    id="whatsapp"
                    label="WhatsApp"
                    placeholder="(11) 99999-9999"
                    value={form.whatsapp}
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        whatsapp: maskPhoneInput(
                          (e.target as HTMLInputElement).value,
                        ),
                      }))
                    }
                  />
                  <Field
                    id="billing_email"
                    type="email"
                    label="E-mail financeiro"
                    placeholder="financeiro@clinica.com.br"
                    className="sm:col-span-2"
                    value={form.billing_email}
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        billing_email: (e.target as HTMLInputElement).value,
                      }))
                    }
                  />
                </div>
                <div className="rounded-lg bg-accent/50 border border-accent p-4 text-sm text-accent-foreground">
                  <strong>Pronto!</strong> Ao criar sua conta você ganha{" "}
                  <span className="text-primary font-semibold">
                    200 créditos
                  </span>{" "}
                  para processar arquivos com IA.
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <div>
                  <h2 className="text-xl font-semibold">Pagamento</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Finalize a assinatura para concluir seu cadastro.
                  </p>
                </div>
                <div className="bg-background overflow-hidden">
                  <iframe
                    title="Pagamento Hotmart"
                    src={paymentIframeSrc}
                    className="h-[620px] w-full"
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
                  {bypassPaymentConfirmation
                    ? "Modo de teste ativo. O cadastro pode ser concluido sem retorno do pagamento."
                    : paymentConfirmed
                    ? "Pagamento confirmado. Agora voce ja pode criar a conta."
                    : "Aguardando confirmacao do pagamento para habilitar o botao final."}
                </div>
              </>
            )}

            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={prev}
                disabled={step === 0 || loading} // Desabilita botão se estiver salvando
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
              </Button>
              <Button
                type="submit"
                className="bg-gradient-primary hover:opacity-90 shadow-elegant"
                loading={loading}
                disabled={(step === 3 && !canFinishRegistration) || loading}
              >
                {step < 3
                  ? "Continuar"
                  : loading
                    ? "Criando..."
                    : "Criar conta"}
                {!loading && <ArrowRight className="h-4 w-4 ml-1" />}
              </Button>
            </div>
          </form>
        </Card>
      </div>
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
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} {...props} />
    </div>
  );
}
