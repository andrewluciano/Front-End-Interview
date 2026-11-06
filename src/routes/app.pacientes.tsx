import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/app/pacientes")({
  component: Pacientes,
  head: () => ({ meta: [{ title: "Pacientes — Fatura Viva" }] }),
});

function Pacientes() {
  const [q, setQ] = useState("");
  const [patients, setPatients] = useState<string[]>([]);

  useEffect(() => {
    const load = () => {
      const token = localStorage.getItem("fv_access_token");
      if (!token) return;
      fetch("/api/pacientes", {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${token}`,
        },
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (Array.isArray(data))
            setPatients(data.filter((s) => typeof s === "string"));
        })
        .catch(() => {});
    };

    const onChanged = () => load();

    load();
    window.addEventListener("fv:patients-changed", onChanged);
    return () => window.removeEventListener("fv:patients-changed", onChanged);
  }, []);

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return patients;
    return patients.filter((p) => p.toLowerCase().includes(query));
  }, [patients, q]);

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pacientes</h1>
          <p className="text-muted-foreground text-sm">
            {patients.length} cadastrados
          </p>
        </div>
        <Button
          className="bg-gradient-primary shadow-elegant"
          onClick={() =>
            window.dispatchEvent(new Event("fv:open-patient-modal"))
          }
        >
          <UserPlus className="h-4 w-4 mr-1" /> Novo paciente
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Buscar paciente..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {list.map((name) => (
          <Card
            key={name}
            className="p-4 shadow-elegant transition-smooth hover:shadow-elevated"
          >
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center font-semibold">
                {name
                  .split(" ")
                  .filter(Boolean)
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="min-w-0">
                <div className="font-medium truncate">{name}</div>
                <div className="text-xs text-muted-foreground">
                  Histórico via encontros
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
