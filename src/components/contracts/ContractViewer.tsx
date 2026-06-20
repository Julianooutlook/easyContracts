"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { api } from "@/lib/api";
import { downloadBlob } from "@/lib/utils";
import { Download, Copy, Check, AlertTriangle } from "lucide-react";

interface Props {
  id: string;
  contractText: string;
  missingFields?: string[];
  warning?: string;
}

export function ContractViewer({ id, contractText, missingFields, warning }: Props) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const blob = await api.downloadPDF(id);
      downloadBlob(blob, `contrato-${id.slice(0, 8)}.pdf`);
    } catch (e) {
      alert("Erro ao gerar PDF. Tente novamente.");
    } finally {
      setDownloading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(contractText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {warning && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">{warning}</p>
            {missingFields && missingFields.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {missingFields.map((f) => (
                  <code key={f} className="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded font-mono">
                    [{f}]
                  </code>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Contrato Gerado</h2>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleCopy}>
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copiado!" : "Copiar"}
          </Button>
          <Button size="sm" onClick={handleDownload} loading={downloading}>
            <Download className="w-4 h-4" />
            Baixar PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardBody>
          <pre className="text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap font-mono leading-relaxed">
            {contractText}
          </pre>
        </CardBody>
      </Card>
    </div>
  );
}
