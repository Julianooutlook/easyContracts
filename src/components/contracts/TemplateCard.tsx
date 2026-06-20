import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { contractTypeLabel } from "@/lib/utils";
import { FileText, ArrowRight } from "lucide-react";
import type { Template } from "@/types";

const typeVariant: Record<string, "green" | "blue" | "amber" | "zinc"> = {
  compra_venda: "blue",
  aluguel: "amber",
  prestacao_servico: "green",
  comodato: "zinc",
};

interface Props {
  template: Template;
  onClick: () => void;
}

export function TemplateCard({ template, onClick }: Props) {
  return (
    <Card hover onClick={onClick} className="group">
      <CardBody className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          </div>
          <Badge variant={typeVariant[template.contract_type] ?? "zinc"}>
            {contractTypeLabel(template.contract_type)}
          </Badge>
        </div>
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm leading-snug">
            {template.name}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1 line-clamp-2">
            {template.description}
          </p>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-zinc-400">{template.fields.length} campos</span>
          <ArrowRight className="w-4 h-4 text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0 duration-200" />
        </div>
      </CardBody>
    </Card>
  );
}
