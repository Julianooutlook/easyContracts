"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { TemplateCard } from "@/components/contracts/TemplateCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FileText, Plus, History, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Template } from "@/types";
import { contractTypeLabel } from "@/lib/utils";

const TYPES = ["", "compra_venda", "aluguel", "prestacao_servico", "comodato"];

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api.getTemplates(filter || undefined)
      .then((d: any) => setTemplates(d.templates))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, filter]);

  const filtered = templates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
            Olá, {user.name.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Escolha um template para gerar seu contrato
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={user.plan === "pro" ? "green" : "zinc"}>
            {user.plan === "pro" ? "Pro" : "Grátis"}
          </Badge>
          <Link href="/historico">
            <Button variant="secondary" size="sm">
              <History className="w-4 h-4" />
              Histórico
            </Button>
          </Link>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar template..."
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`shrink-0 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                filter === type
                  ? "bg-brand-600 text-white"
                  : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-brand-300"
              }`}
            >
              {type === "" ? "Todos" : contractTypeLabel(type)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
          <p className="text-zinc-500">Nenhum template encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
          {filtered.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onClick={() => router.push(`/contratos/novo?templateId=${template.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
