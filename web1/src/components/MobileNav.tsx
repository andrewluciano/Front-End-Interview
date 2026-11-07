import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Briefcase,
  CalendarDays,
  Users,
  FileStack,
  Sparkles,
  ArrowLeftRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { url: "/app", label: "Início", icon: LayoutDashboard, exact: true },
  { url: "/app/trabalho", label: "Trabalho", icon: Briefcase },
  { url: "/app/agenda", label: "Agenda", icon: CalendarDays },
  { url: "/app/conciliacao", label: "Concil.", icon: ArrowLeftRight },
  { url: "/app/pacientes", label: "Pacientes", icon: Users },
  { url: "/app/arquivos", label: "Arquivos", icon: FileStack },
  { url: "/app/insights", label: "Insights", icon: Sparkles },
];

export function MobileNav() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur border-t border-border">
      <ul className="grid grid-cols-7">
        {items.map((it) => {
          const active = it.exact
            ? path === it.url
            : path === it.url || path.startsWith(it.url + "/");
          return (
            <li key={it.url}>
              <Link
                to={it.url}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[11px] transition-smooth",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <it.icon className="h-5 w-5" />
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
