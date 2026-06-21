"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { api } from "@/lib/api";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import {
  FileText, History, Download, RotateCcw, Pencil
} from "lucide-react";
import { useRouter } from "next/navigation";

interface HistoryItem {
  id: string;
  type: string;
  contract_type: string;
  template_name: string;
  is_edited: boolean;
  edited_at: string | null;
  created_at: string;
}

export default function HistoricoPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api.getHistory(1)
      .then((d: any) => setItems(d.analyses))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const handleDownload = async (id: string, name: string) => {
    setDownloading(id);
    try {
      const blob = await api.downloadPDF(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name.replace(/\s+/g, "-").toLowerCase()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(null);
    }
  };

  const handleReuse = (id: string) => {
    router.push(`/contratos/reutilizar?id=${id}`);
  };

  if (authLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center">
          <History className="w-5 h-5 text-brand-600 dark:text-brand-400" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-zinc-900 dark:text-white">
            Histórico
          </h1>
          <p className="text-sm text-zinc-500">
            Últimos {items.length} contrato{items.length !== 1 ? "s" : ""} gerados
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
          <p className="text-zinc-500 mb-4">Nenhum contrato ainda</p>
          <Button onClick={() => router.push("/dashboard")}>
            Gerar primeiro contrato
          </Button>
        </div>
      ) : (
        <div className="space-y-3 animate-fade-in">
          {items.map((item) => (
            <Card key={item.id}>
              <CardBody className="flex items-center gap-4 py-4">
                {/* Ícone */}
                <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-zinc-500" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                      {item.template_name ?? "Contrato"}
                    </span>
                    {item.is_edited && (
                      <Badge variant="amber">
                        <Pencil className="w-3 h-3 mr-1" />
                        Editado
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {formatDate(item.created_at)}
                  </p>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Usar novamente"
                    onClick={() => handleReuse(item.id)}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    title="Baixar PDF"
                    loading={downloading === item.id}
                    onClick={() => handleDownload(item.id, item.template_name ?? "contrato")}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {items.length === 5 && (
        <p className="text-center text-xs text-zinc-400 mt-6">
          Apenas os 5 contratos mais recentes são salvos no histórico.
        </p>
      )}
    </div>
  );
}