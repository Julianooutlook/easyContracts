import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFieldLabel(key: string): string {
  const specialLabels: Record<string, string> = {
    CIDADE_EMISSAO: "Cidade de Emissão do Contrato",
    CIDADE_FORO: "Cidade do Foro",
    ESTADO_FORO: "Estado do Foro",
    CPF_CNPJ_CONTRATANTE: "CPF/CNPJ do Contratante",
    CPF_CNPJ_CONTRATADO: "CPF/CNPJ do Contratado",
    CPF_CNPJ_VENDEDOR: "CPF/CNPJ do Vendedor",
    CPF_CNPJ_COMPRADOR: "CPF/CNPJ do Comprador",
    CPF_CNPJ_LOCADOR: "CPF/CNPJ do Locador",
    CPF_CNPJ_LOCATARIO: "CPF/CNPJ do Locatário",
    CPF_CNPJ_COMODANTE: "CPF/CNPJ do Comodante",
    CPF_CNPJ_COMODATARIO: "CPF/CNPJ do Comodatário",
    ANO_FABRICACAO: "Ano de Fabricação",
    ANO_MODELO: "Ano do Modelo",
    DATA_INICIO: "Data de Início",
    DATA_FIM: "Data de Término",
    DATA_HORA_INICIO: "Data e Hora de Início",
    DATA_HORA_FIM: "Data e Hora de Término",
    DATA_PRIMEIRA_PARCELA: "Data da Primeira Parcela",
    DATA_ULTIMA_PARCELA: "Data da Última Parcela",
    DATA_ENTREGA_VEICULO: "Data de Entrega do Veículo",
    DIA_VENCIMENTO: "Dia de Vencimento",
    NUMERO_PARCELAS: "Número de Parcelas",
    VALOR_TOTAL: "Valor Total (R$)",
    VALOR_ENTRADA: "Valor de Entrada (R$)",
    VALOR_SALDO: "Valor do Saldo Devedor (R$)",
    VALOR_PARCELA: "Valor da Parcela (R$)",
    VALOR_ALUGUEL: "Valor do Aluguel (R$)",
    VALOR_DIARIA: "Valor da Diária (R$)",
    VALOR_CAUCAO: "Valor da Caução (R$)",
    VALOR_MULTA: "Valor da Multa (R$)",
    VALOR_MINIMO_SEGURO: "Cobertura Mínima do Seguro (R$)",
    VALOR_POR_EXTENSO: "Valor Total por Extenso",
    ENTRADA_POR_EXTENSO: "Valor da Entrada por Extenso",
    VALOR_ALUGUEL_EXTENSO: "Valor do Aluguel por Extenso",
    INDICE_REAJUSTE: "Índice de Reajuste",
    PERCENTUAL_MULTA: "Percentual da Multa (%)",
    PERCENTUAL_DEPRECIACAO: "Percentual de Depreciação (%)",
    PERCENTUAL_TAXA_OCUPACAO: "Taxa de Ocupação Mensal (%)",
    PRAZO_MESES: "Prazo em Meses",
    PRAZO_ESCRITURA: "Prazo para Escritura (dias)",
    PRAZO_INADIMPLENCIA: "Prazo de Inadimplência (dias)",
    PRAZO_REGULARIZACAO: "Prazo para Regularização (dias)",
    PRAZO_NEGOCIACAO: "Prazo para Negociação Amigável (dias)",
    PRAZO_CONFIDENCIALIDADE: "Prazo de Confidencialidade (anos)",
    PRAZO_CURA: "Prazo para Cura (dias)",
    PRAZO_DOCUMENTACAO: "Prazo para Documentação (dias)",
    PRAZO_TRANSFERENCIA: "Prazo para Transferência (dias)",
    NUMERO_DIAS: "Número de Dias",
    KM_FRANQUIA: "Franquia de Quilometragem (km)",
    KM_ENTREGA: "Quilometragem na Entrega (km)",
    AREA_TOTAL: "Área Total (m²)",
    AREA_GEOGRAFICA: "Área Geográfica Permitida",
    AREA_GEOGRAFICA_PERMITIDA: "Área Geográfica Permitida",
  };

  if (specialLabels[key]) return specialLabels[key];

  return key
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function contractTypeLabel(type: string): string {
  const map: Record<string, string> = {
    compra_venda: "Compra e Venda",
    aluguel: "Locação",
    prestacao_servico: "Prestação de Serviço",
    comodato: "Comodato",
    outro: "Outro",
  };
  return map[type] ?? type;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
