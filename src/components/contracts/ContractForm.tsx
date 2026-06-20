"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatFieldLabel } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

interface Props {
  fields: string[];
  templateName: string;
  contractType: string;
  templateId: string;
  onSubmit: (formData: Record<string, string>) => Promise<void>;
  loading: boolean;
}

const REQUIRED_FIELDS = [
  "NOME_CONTRATANTE", "NOME_CONTRATADO",
  "NOME_VENDEDOR", "NOME_COMPRADOR",
  "NOME_LOCADOR", "NOME_LOCATARIO",
  "DESCRICAO_SERVICO", "VALOR", "FORMA_PAGAMENTO", "CIDADE",
  "CIDADE_IMOVEL", "ESTADO_IMOVEL", "PRAZO_MESES", "DESPESAS_LOCATARIO", "RESPONSAVEL_IPTU",
  "CPF_CNPJ_COMODANTE", "ENDERECO_COMODANTE", "CPF_CNPJ_COMODATARIO", "ENDERECO_COMODATARIO",
  "NOME_COMODANTE", "NOME_COMODATARIO",
  "CPF_CNPJ_CONTRATANTE", "CPF_CNPJ_CONTRATADO",
  "CPF_CNPJ_VENDEDOR", "CPF_CNPJ_COMPRADOR",
  "CPF_CNPJ_LOCADOR", "CPF_CNPJ_LOCATARIO",
  "ENDERECO_VENDEDOR", "ENDERECO_COMPRADOR",
  "ENDERECO_CONTRATANTE", "ENDERECO_CONTRATADO",
  "ENDERECO_LOCADOR", "ENDERECO_LOCATARIO",
  "ENDERECO_TERRENO", "CIDADE_TERRENO", "ESTADO_TERRENO",
  "ENDERECO_IMOVEL",
  "VALOR_TOTAL", "VALOR_ALUGUEL",
  "VALOR_SALDO", "VALOR_PARCELA", "NUMERO_PARCELAS",
  "DIA_VENCIMENTO", "DATA_PRIMEIRA_PARCELA", "DATA_ULTIMA_PARCELA",
  "DATA_INICIO", "DATA_FIM",
  "DESCRICAO_BEM", "FINALIDADE_USO",
];

const FIELD_PLACEHOLDERS: Record<string, string> = {
  // Nomes
  NOME_CONTRATANTE: "Ex: João da Silva",
  NOME_CONTRATADO: "Ex: Maria Souza",
  NOME_VENDEDOR: "Ex: Carlos Oliveira",
  NOME_COMPRADOR: "Ex: Ana Costa",
  NOME_LOCADOR: "Ex: Pedro Santos",
  NOME_LOCATARIO: "Ex: Lucia Ferreira",
  NOME_COMODANTE: "Ex: Roberto Lima",
  NOME_COMODATARIO: "Ex: Fernanda Alves",

  // CPF/CNPJ
  CPF_CNPJ_CONTRATANTE: "Ex: 123.456.789-00 ou 12.345.678/0001-99",
  CPF_CNPJ_CONTRATADO: "Ex: 123.456.789-00 ou 12.345.678/0001-99",
  CPF_CNPJ_VENDEDOR: "Ex: 123.456.789-00 ou 12.345.678/0001-99",
  CPF_CNPJ_COMPRADOR: "Ex: 123.456.789-00 ou 12.345.678/0001-99",
  CPF_CNPJ_LOCADOR: "Ex: 123.456.789-00 ou 12.345.678/0001-99",
  CPF_CNPJ_LOCATARIO: "Ex: 123.456.789-00 ou 12.345.678/0001-99",
  CPF_CNPJ_COMODANTE: "Ex: 123.456.789-00 ou 12.345.678/0001-99",
  CPF_CNPJ_COMODATARIO: "Ex: 123.456.789-00 ou 12.345.678/0001-99",

  // RG
  RG_VENDEDOR: "Ex: 12.345.678-9",
  RG_COMPRADOR: "Ex: 12.345.678-9",
  RG_LOCADOR: "Ex: 12.345.678-9",
  RG_LOCATARIO: "Ex: 12.345.678-9",
  RG_COMODANTE: "Ex: 12.345.678-9",
  RG_COMODATARIO: "Ex: 12.345.678-9",
  RG_CONTRATANTE: "Ex: 12.345.678-9",
  RG_CONTRATADO: "Ex: 12.345.678-9",

  // Nacionalidade
  NACIONALIDADE_VENDEDOR: "Ex: Brasileiro(a)",
  NACIONALIDADE_COMPRADOR: "Ex: Brasileiro(a)",
  NACIONALIDADE_LOCADOR: "Ex: Brasileiro(a)",
  NACIONALIDADE_LOCATARIO: "Ex: Brasileiro(a)",
  NACIONALIDADE_COMODANTE: "Ex: Brasileiro(a)",
  NACIONALIDADE_COMODATARIO: "Ex: Brasileiro(a)",
  NACIONALIDADE_CONTRATANTE: "Ex: Brasileiro(a)",
  NACIONALIDADE_CONTRATADO: "Ex: Brasileiro(a)",

  // Estado civil
  ESTADO_CIVIL_VENDEDOR: "Ex: Casado(a), Solteiro(a), Divorciado(a)",
  ESTADO_CIVIL_COMPRADOR: "Ex: Casado(a), Solteiro(a), Divorciado(a)",
  ESTADO_CIVIL_LOCADOR: "Ex: Casado(a), Solteiro(a), Divorciado(a)",
  ESTADO_CIVIL_LOCATARIO: "Ex: Casado(a), Solteiro(a), Divorciado(a)",
  ESTADO_CIVIL_COMODANTE: "Ex: Casado(a), Solteiro(a), Divorciado(a)",
  ESTADO_CIVIL_COMODATARIO: "Ex: Casado(a), Solteiro(a), Divorciado(a)",
  ESTADO_CIVIL_CONTRATANTE: "Ex: Casado(a), Solteiro(a), Divorciado(a)",
  ESTADO_CIVIL_CONTRATADO: "Ex: Casado(a), Solteiro(a), Divorciado(a)",

  // Profissão
  PROFISSAO_VENDEDOR: "Ex: Comerciante, Engenheiro, Autônomo",
  PROFISSAO_COMPRADOR: "Ex: Comerciante, Engenheiro, Autônomo",
  PROFISSAO_LOCADOR: "Ex: Comerciante, Engenheiro, Autônomo",
  PROFISSAO_LOCATARIO: "Ex: Comerciante, Engenheiro, Autônomo",
  PROFISSAO_COMODANTE: "Ex: Comerciante, Engenheiro, Autônomo",
  PROFISSAO_COMODATARIO: "Ex: Comerciante, Engenheiro, Autônomo",

  // Endereços
  ENDERECO_CONTRATANTE: "Ex: Rua das Flores, 123, Apto 45",
  ENDERECO_CONTRATADO: "Ex: Rua das Flores, 123, Apto 45",
  ENDERECO_VENDEDOR: "Ex: Rua das Flores, 123, Apto 45",
  ENDERECO_COMPRADOR: "Ex: Rua das Flores, 123, Apto 45",
  ENDERECO_LOCADOR: "Ex: Rua das Flores, 123, Apto 45",
  ENDERECO_LOCATARIO: "Ex: Rua das Flores, 123, Apto 45",
  ENDERECO_COMODANTE: "Ex: Rua das Flores, 123, Apto 45",
  ENDERECO_COMODATARIO: "Ex: Rua das Flores, 123, Apto 45",
  ENDERECO_TERRENO: "Ex: Rua das Palmeiras, 500",
  ENDERECO_IMOVEL: "Ex: Av. Brasil, 200, Bloco B",

  // CEP
  CEP_VENDEDOR: "Ex: 89.789-700",
  CEP_COMPRADOR: "Ex: 89.789-700",
  CEP_LOCADOR: "Ex: 89.789-700",
  CEP_LOCATARIO: "Ex: 89.789-700",
  CEP_COMODANTE: "Ex: 89.789-700",
  CEP_COMODATARIO: "Ex: 89.789-700",
  CEP_CONTRATANTE: "Ex: 89.789-700",
  CEP_CONTRATADO: "Ex: 89.789-700",
  CEP_TERRENO: "Ex: 89.789-700",

  // Cidade/Estado
  CIDADE_VENDEDOR: "Ex: São Paulo",
  CIDADE_COMPRADOR: "Ex: São Paulo",
  CIDADE_LOCADOR: "Ex:São Paulo ",
  CIDADE_LOCATARIO: "Ex:São Paulo ",
  CIDADE_COMODANTE: "Ex:São Paulo ",
  CIDADE_COMODATARIO: "Ex:São Paulo ",
  CIDADE_TERRENO: "Ex:São Paulo ",
  CIDADE_IMOVEL: "Ex:São Paulo ",
  CIDADE_FORO: "Ex:São Paulo",
  CIDADE_EMISSAO: "Cidade onde o contrato é assinado",
  ESTADO_VENDEDOR: "Ex: SP",
  ESTADO_COMPRADOR: "Ex: SP",
  ESTADO_LOCADOR: "Ex: SP",
  ESTADO_LOCATARIO: "Ex: SP",
  ESTADO_COMODANTE: "Ex: SP",
  ESTADO_COMODATARIO: "Ex: SP",
  ESTADO_TERRENO: "Ex: SP",
  ESTADO_IMOVEL: "Ex: SP",
  ESTADO_FORO: "Ex: SP",

  // Bairros
  BAIRRO_TERRENO: "Ex: Centro, Vila Nova, Jardim América",
  BAIRRO_IMOVEL: "Ex: Centro, Vila Nova, Jardim América",
  BAIRRO_LOCADOR: "Ex: Centro, Vila Nova, Jardim América",
  BAIRRO_LOCATARIO: "Ex: Centro, Vila Nova, Jardim América",
  BAIRRO_COMODANTE: "Ex: Centro, Vila Nova, Jardim América",
  BAIRRO_COMODATARIO: "Ex: Centro, Vila Nova, Jardim América",

  // Bem móvel
  DESCRICAO_BEM: "Ex: Notebook Dell Inspiron 15, cor preta / Bicicleta elétrica aro 29",
  MARCA_MODELO: "Ex: Honda CG 160 / Samsung Galaxy S23 / Dell Inspiron",
  NUMERO_SERIE: "Ex: SN-1234567890 (número na etiqueta do produto)",
  COR: "Ex: Preto, Branco, Prata",
  VALOR_BEM: "Ex: 3500 (somente números, sem R$)",
  FINALIDADE_USO: "Ex: Uso pessoal, trabalho, estudo, transporte diário",

  // Prazo
  TIPO_PRAZO: "Ex: prazo determinado (preencha Número de Meses) ou prazo indeterminado (preencha Aviso Prévio)",
  NUMERO_MESES: "Ex: 6 — preencha APENAS se for prazo determinado",
  AVISO_PREVIO: "Ex: 30 — preencha APENAS se for prazo indeterminado",
  DATA_INICIO: "Ex: 01/07/2026",
  DATA_FIM: "Ex: 31/12/2026",
  DATA_HORA_INICIO: "Ex: 01/07/2026 às 08:00",
  DATA_HORA_FIM: "Ex: 31/07/2026 às 18:00",

  // Veículo
  PLACA: "Ex: ABC-1234 ou ABC1D23 (Mercosul)",
  CHASSI: "Ex: 9BWZZZ377VT004251 (17 caracteres no documento do veículo)",
  RENAVAM: "Ex: 12345678901 (11 dígitos no CRLV)",
  NUMERO_MOTOR: "Ex: ABC123456 (na etiqueta do motor)",
  COMBUSTIVEL: "Ex: Flex, Gasolina, Diesel, Elétrico",
  ANO_FABRICACAO: "Ex: 2022",
  ANO_MODELO: "Ex: 2023",
  CATEGORIA: "Ex: Particular, Comercial",
  NUMERO_DUT: "Ex: 123456789 (no DUT/ATPV)",
  NOME_PROPRIETARIO_ATUAL: "Ex: João da Silva (nome no documento do veículo)",
  CONDICOES_CONHECIDAS: "Ex: Arranhão no para-choque traseiro, ar-condicionado sem gás",
  DATA_ENTREGA_VEICULO: "Ex: 01/07/2026",

  // Imóvel/terreno
  AREA_TOTAL: "Ex: 250 (em m²)",
  TESTADA: "Ex: 10 (largura da frente em metros)",
  PROFUNDIDADE: "Ex: 25 (profundidade em metros)",
  MATRICULA: "Ex: 12345 (número no Cartório de Registro de Imóveis)",
  CARTORIO_REGISTRO_IMOVEIS: "Ex: 1º Cartório de Registro de Imóveis de Joinville",
  INSCRICAO_MUNICIPAL: "Ex: 123.456-7 (número do IPTU)",
  NORTE: "Ex: Rua das Flores / Lote 12 / Área verde",
  SUL: "Ex: Rua das Flores / Lote 12 / Área verde",
  LESTE: "Ex: Rua das Flores / Lote 12 / Área verde",
  OESTE: "Ex: Rua das Flores / Lote 12 / Área verde",
  FORMA_AQUISICAO_VENDEDOR: "Ex: compra e venda, herança, doação",

  // Valores e pagamento
  VALOR_TOTAL: "Ex: 50000 (somente números, sem R$)",
  VALOR_ALUGUEL: "Ex: 1500 (somente números, sem R$)",
  VALOR_SALDO: "Ex: 45000 (valor total menos a entrada, somente números)",
  VALOR_PARCELA: "Ex: 1500 (valor de cada parcela, somente números)",
  VALOR_ENTRADA: "Ex: 5000 (somente números, sem R$)",
  VALOR: "Ex: 3000 (somente números, sem R$)",
  NUMERO_PARCELAS: "Ex: 12 (quantidade de parcelas)",
  DIA_VENCIMENTO: "Ex: 10 (dia do mês)",
  DATA_PRIMEIRA_PARCELA: "Ex: 01/08/2026",
  DATA_ULTIMA_PARCELA: "Ex: 01/07/2027",
  FORMA_PAGAMENTO: "Ex: PIX, transferência bancária, boleto, dinheiro, cheque",
  DADOS_BANCARIOS: "Ex: Banco Itaú, Ag. 1234, C/C 56789-0 / PIX: 123.456.789-00",
  VALOR_POR_EXTENSO: "Ex: cinquenta mil reais",
  ENTRADA_POR_EXTENSO: "Ex: cinco mil reais",
  VALOR_ALUGUEL_EXTENSO: "Ex: mil e quinhentos reais",
  INDICE_REAJUSTE: "Ex: IGPM, IPCA, INPC",

  // Locação de imóvel
  PRAZO_MESES: "Ex: 12 (meses de contrato)",
  AREA: "Ex: 80 (área do imóvel em m²)",
  TIPO_GARANTIA: "Ex: caução, fiador, seguro-fiança",
  MESES_CAUCAO: "Ex: 3 (meses de aluguel como caução)",
  VALOR_CAUCAO: "Ex: 4500 (somente números, sem R$)",
  DESPESAS_LOCATARIO: "Ex: água, luz, gás, condomínio, IPTU",
  RESPONSAVEL_IPTU: "Ex: LOCATÁRIO ou LOCADOR",

  // Locação de veículo
  NUMERO_DIAS: "Ex: 7 (dias de locação)",
  NUMERO_DIAS_EXTENSO: "Ex: sete",
  VALOR_DIARIA: "Ex: 150 (valor por dia, somente números)",
  VALOR_DIARIA_EXTRA: "Ex: 200 (valor por dia extra, somente números)",
  KM_ENTREGA: "Ex: 45230 (quilometragem atual do veículo)",
  KM_FRANQUIA: "Ex: 200 (km incluídos por dia)",
  VALOR_KM_EXCEDENTE: "Ex: 1.50 (valor por km excedente)",
  LOCAL_ENTREGA: "Ex: Av. Brasil, 500, Joinville",
  LOCAL_DEVOLUCAO: "Ex: Av. Brasil, 500, Joinville",
  DATA_ENTREGA: "Ex: 01/07/2026",
  DATA_DEVOLUCAO: "Ex: 08/07/2026",
  MOMENTO_PAGAMENTO: "Ex: no ato da assinatura, na entrega do veículo",
  MEIO_PAGAMENTO: "Ex: PIX, cartão de débito, dinheiro",
  FORMA_CAUCAO: "Ex: depositado em conta, pago em dinheiro",
  PRAZO_DEVOLUCAO_CAUCAO: "Ex: 5 (dias após a devolução do veículo)",
  TAXA_ABASTECIMENTO: "Ex: 80 (somente números, sem R$)",
  TAXA_LIMPEZA: "Ex: 50 (somente números, sem R$)",
  AREA_GEOGRAFICA_PERMITIDA: "Ex: Estado de Santa Catarina, Brasil",
  AREA_GEOGRAFICA: "Ex: Estado de Santa Catarina, Brasil",
  NUMERO_APOLICE: "Ex: 123456789 (número da apólice do seguro)",
  NOME_SEGURADORA: "Ex: Porto Seguro, Bradesco Seguros",
  COBERTURAS_SEGURO: "Ex: roubo, furto, colisão e danos a terceiros",
  VALOR_FRANQUIA: "Ex: 2000 (somente números, sem R$)",
  PRAZO_SOLICITACAO_PRORROGACAO: "Ex: 24 (horas de antecedência)",
  PRAZO_TRANSFERENCIA: "Ex: 30 (dias após quitação)",

  // Prestação de serviço
  DESCRICAO_SERVICO: "Ex: Desenvolvimento de site institucional em WordPress",
  PROPRIEDADE_INTELECTUAL: "Ex: exclusiva da CONTRATANTE / compartilhada entre as partes",
  PRAZO_CONFIDENCIALIDADE: "Ex: 2 (anos após o término do contrato)",
  RESPONSAVEL_DESPESAS: "Ex: CONTRATANTE ou CONTRATADA",
  PRAZO_NOTIFICACAO_FORCA_MAIOR: "Ex: 5 (dias úteis)",
  PRAZO_FORCA_MAIOR: "Ex: 30 (dias)",

  // Prazos gerais
  PRAZO_NEGOCIACAO: "Ex: 15 (dias para tentativa de acordo amigável)",
  PRAZO_CURA: "Ex: 10 (dias para regularizar o descumprimento)",
  PRAZO_INADIMPLENCIA: "Ex: 30 (dias em atraso para rescisão)",
  PRAZO_ESCRITURA: "Ex: 60 (dias após a quitação para ir ao cartório)",
  PRAZO_REGULARIZACAO: "Ex: 30 (dias para regularizar débito ou vício)",
  PRAZO_DOCUMENTACAO: "Ex: 15 (dias para entregar documentos)",
  PRAZO_APRESENTACAO_SEGURO: "Ex: 15 (dias após assinar para apresentar apólice)",

  // Percentuais e multas
  PERCENTUAL_MULTA: "Ex: 10 (percentual sobre o valor total, sem %)",
  PERCENTUAL_DEPRECIACAO: "Ex: 2 (percentual mensal de depreciação, sem %)",
  PERCENTUAL_TAXA_OCUPACAO: "Ex: 1 (percentual mensal sobre o valor pago, sem %)",
  VALOR_MULTA: "Ex: 500 (somente números, sem R$)",
  VALOR_MINIMO_SEGURO: "Ex: 30000 (cobertura mínima exigida, somente números)",


  // Outros
  CONDICAO_TRANSFERENCIA: "Ex: pagamento integral do valor acordado",
  DATA_POSSE: "Ex: 01/07/2026",
};

export function ContractForm({ fields, templateName, templateId, onSubmit, loading }: Props) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [prefilled, setPrefilled] = useState(false);

  useEffect(() => {
    if (!templateId) return;
    try {
      const raw = sessionStorage.getItem(`prefill_${templateId}`);
      if (raw) {
        const saved = JSON.parse(raw);
        setFormData(saved);
        setPrefilled(true);
        sessionStorage.removeItem(`prefill_${templateId}`);
      }
    } catch {
      // ignora erro de parse
    }
  }, [templateId]);

  const required = fields.filter((f) => REQUIRED_FIELDS.includes(f));
  const optional = fields.filter((f) => !REQUIRED_FIELDS.includes(f));

  const validate = () => {
    const errs: Record<string, string> = {};
    required.forEach((f) => {
      if (!formData[f]?.trim()) errs[f] = "Campo obrigatório";
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  const renderField = (field: string) => {

    const isHidden =
      (field === 'NUMERO_MESES' && !!formData['AVISO_PREVIO']?.trim()) ||
      (field === 'AVISO_PREVIO' && !!formData['NUMERO_MESES']?.trim());

    if (isHidden) return null;

    const isLongField = [
      'DESCRICAO_SERVICO', 'DESCRICAO_BEM', 'FINALIDADE_USO',
      'CONDICOES_CONHECIDAS', 'DESPESAS_LOCATARIO',
    ].includes(field);

    const isSmallField = [
      'CPF_CNPJ_VENDEDOR', 'CPF_CNPJ_COMPRADOR', 'CPF_CNPJ_LOCADOR',
      'CPF_CNPJ_LOCATARIO', 'CPF_CNPJ_COMODANTE', 'CPF_CNPJ_COMODATARIO',
      'CPF_CNPJ_CONTRATANTE', 'CPF_CNPJ_CONTRATADO',
      'RG_VENDEDOR', 'RG_COMPRADOR', 'RG_LOCADOR', 'RG_LOCATARIO',
      'RG_COMODANTE', 'RG_COMODATARIO', 'PLACA', 'RENAVAM',
      'ANO_FABRICACAO', 'ANO_MODELO', 'DIA_VENCIMENTO', 'NUMERO_PARCELAS',
      'CEP_VENDEDOR', 'CEP_COMPRADOR', 'CEP_LOCADOR', 'CEP_LOCATARIO',
      'CEP_COMODANTE', 'CEP_COMODATARIO',
    ].includes(field);

    const maxLength = isLongField ? 2000 : isSmallField ? 20 : 500;

    return (
      <Input
        key={field}
        label={formatFieldLabel(field)}
        value={formData[field] ?? ""}
        onChange={(e) => setFormData((p) => ({ ...p, [field]: e.target.value }))}
        placeholder={FIELD_PLACEHOLDERS[field] ?? `Ex: ${formatFieldLabel(field)}`}
        error={errors[field]}
        maxLength={maxLength}
      />
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {prefilled && (
        <div className="flex items-center gap-2 px-4 py-3 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800/40 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
          <p className="text-xs text-brand-700 dark:text-brand-400">
            Campos preenchidos com os dados do contrato anterior. Altere o que precisar e gere novamente.
          </p>
        </div>
      )}

      {required.length > 0 && (
        <section>
          <h3 className="text-sm font-bold text-slate-700 dark:text-neutral-100 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-500 inline-block" />
            Campos obrigatórios
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {required.map(renderField)}
          </div>
        </section>
      )}

      {optional.length > 0 && (
        <section>
          <h3 className="text-sm font-bold text-slate-700 dark:text-neutral-300 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-300 dark:bg-yellow-600 inline-block" />
            Campos opcionais
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {optional.map(renderField)}
          </div>
        </section>
      )}

      <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40 rounded-xl">
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-400">
          Campos não preenchidos aparecerão como <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 rounded">[PLACEHOLDER]</code> no contrato. Você poderá editar depois (plano Pro).
        </p>
      </div>

      <Button type="submit" loading={loading} size="lg" className="w-full">
        Gerar Contrato — {templateName}
      </Button>
    </form>
  );
}