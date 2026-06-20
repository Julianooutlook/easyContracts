"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { ContractForm } from "@/components/contracts/ContractForm";
import { ContractViewer } from "@/components/contracts/ContractViewer";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import type { GenerateResponse } from "@/types";

function NovoContratoContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("templateId");

  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!templateId || !user) return;
    api.getTemplateFields(templateId)
      .then((d: any) => setTemplate(d))
      .catch(() => setError("Template não encontrado"))
      .finally(() => setLoading(false));
  }, [templateId, user]);

  const handleGenerate = async (formData: Record<string, string>) => {
    if (!template) return;
    setGenerating(true);
    setError("");
    try {
      const res: any = await api.generate({
        templateId: template.id,
        contractType: template.contract_type ?? "outro",
        formData,
      });
      setResult(res);
    } catch (err: any) {
      setError(err.message ?? "Erro ao gerar contrato");
    } finally {
      setGenerating(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !template) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Link href="/dashboard"><Button variant="secondary">Voltar</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center">
            <FileText className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h1 className="font-display font-bold text-zinc-900 dark:text-white text-lg leading-tight">
              {template?.name}
            </h1>
            <p className="text-xs text-zinc-500">{template?.description}</p>
          </div>
        </div>
      </div>

      {result ? (
        <div className="animate-slide-up">
          <ContractViewer
            id={result.id}
            contractText={result.contractText}
            missingFields={result.missingFields}
            warning={result.warning}
          />
          <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <Button variant="secondary" onClick={() => setResult(null)}>
              ← Editar dados
            </Button>
          </div>
        </div>
      ) : (
        <div className="animate-slide-up">
          {error && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg mb-4">
              {error}
            </p>
          )}
          {template && (
            <ContractForm
              fields={template.fields}
              templateName={template.name}
              contractType={template.contract_type}
              templateId={template.id}
              onSubmit={handleGenerate}
              loading={generating}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default function NovoContratoPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <NovoContratoContent />
    </Suspense>
  );
}
