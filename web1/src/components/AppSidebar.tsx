import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Briefcase,
  CalendarDays,
  Users,
  FileStack,
  UserCog,
  Sparkles,
  User,
  ArrowLeftRight,
  Settings,
  LifeBuoy,
  Bell,
  CircleDollarSign,
  FileSpreadsheet,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "./Logo";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const main = [
  { title: "Painel", url: "/app", icon: LayoutDashboard, exact: true },
  { title: "Meu trabalho", url: "/app/trabalho", icon: Briefcase },
  { title: "Agenda", url: "/app/agenda", icon: CalendarDays },
  { title: "Conciliação", url: "/app/conciliacao", icon: ArrowLeftRight },
  {
    title: "Extratos de pagamento",
    url: "/app/extratos-pagamento",
    icon: FileSpreadsheet,
  },
  { title: "Pacientes", url: "/app/pacientes", icon: Users },
  // { title: "Pendências de informação", url: "/app/pendencias-de-informacao", icon: Bell },
  // { title: "Prazo para pagamento", url: "/app/prazo-pagamento", icon: CircleDollarSign   },
  { title: "Arquivos", url: "/app/arquivos", icon: FileStack },
  { title: "Insights", url: "/app/insights", icon: Sparkles },
];

const admin = [
  { title: "Usuários", url: "/app/usuarios", icon: UserCog },
  { title: "Configurações", url: "/app/configuracoes", icon: Settings },
  { title: "Suporte", url: "/app/suporte", icon: LifeBuoy },
  { title: "Perfil", url: "/app/perfil", icon: User },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (url: string, exact?: boolean) =>
    exact ? path === url : path === url || path.startsWith(url + "/");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportText, setSupportText] = useState("");
  const [supportSending, setSupportSending] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem("fv_access_token");
      setIsLoggedIn(!!token);
    } catch {
      setIsLoggedIn(false);
    }
  }, [path]);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("fv_access_token");
        if (!token) {
          setUserEmail("");
          return;
        }
        const res = await fetch("/api/auth/me", {
          headers: {
            accept: "application/json",
            authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          setUserEmail("");
          return;
        }
        const json = (await res.json()) as { username?: string } | null;
        const email = String(json?.username ?? "").trim();
        setUserEmail(email);
      } catch {
        setUserEmail("");
      }
    };
    if (isLoggedIn) void load();
  }, [isLoggedIn]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center px-0.5 py-1.5">
          <Logo showText={!collapsed} size={28} className="min-w-[28px]" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {main.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url, item.exact)}
                  >
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Conta</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {admin.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <div
          className={
            collapsed
              ? "px-1 py-2 flex items-center justify-center"
              : "px-2 py-2"
          }
        >
          {collapsed ? (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setSupportOpen(true)}
              aria-label="Abrir suporte"
              title="Suporte"
            >
              <LifeBuoy className="h-4 w-4" />
            </Button>
          ) : (
            <div className="text-xs text-sidebar-foreground/60">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium text-sidebar-foreground">
                    Clínica Viva
                  </div>
                  <div>Plano Pro · 1.240 créditos</div>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${isLoggedIn ? "bg-success" : "bg-muted-foreground"}`}
                    />
                    <span>
                      Status: {isLoggedIn ? "Logado" : "Desconectado"}
                    </span>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setSupportOpen(true)}
                  aria-label="Abrir suporte"
                  title="Suporte"
                >
                  <LifeBuoy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </SidebarFooter>

      <Dialog open={supportOpen} onOpenChange={setSupportOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Suporte</DialogTitle>
          </DialogHeader>

          <div className="text-sm text-muted-foreground">
            Página:{" "}
            <span className="font-medium text-foreground/80">{path}</span>
            {userEmail ? (
              <>
                {" "}
                · Email:{" "}
                <span className="font-medium text-foreground/80">
                  {userEmail}
                </span>
              </>
            ) : null}
          </div>

          <Textarea
            value={supportText}
            onChange={(e) => setSupportText(e.target.value)}
            placeholder="Descreva o que aconteceu e o que você esperava..."
          />

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="secondary"
              disabled={supportSending}
              onClick={() => {
                setSupportOpen(false);
                setSupportText("");
              }}
            >
              Cancelar
            </Button>
            <Button
              className="bg-gradient-primary shadow-elegant"
              disabled={supportSending || !isLoggedIn || !supportText.trim()}
              onClick={async () => {
                const token = localStorage.getItem("fv_access_token") ?? "";
                if (!token) {
                  toast.error("Faça login para enviar uma solicitação");
                  return;
                }
                setSupportSending(true);
                try {
                  const res = await fetch("/api/suporte/tickets", {
                    method: "POST",
                    headers: {
                      accept: "application/json",
                      "content-type": "application/json",
                      authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      page_path: path,
                      user_email: userEmail || undefined,
                      message: supportText,
                    }),
                  });
                  if (!res.ok) {
                    toast.error("Não foi possível enviar sua solicitação");
                    return;
                  }
                  toast.success("Ticket enviado. Acompanhe em Suporte.");
                  setSupportText("");
                  setSupportOpen(false);
                } catch {
                  toast.error("Não foi possível enviar sua solicitação");
                } finally {
                  setSupportSending(false);
                }
              }}
            >
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
