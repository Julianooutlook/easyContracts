# EasyContracts — Frontend

Next.js 14 + TypeScript + Tailwind CSS

## Setup

```bash
npm install
cp .env.example .env.local
# Edite .env.local com a URL da API
npm run dev
```

## Variáveis de ambiente

```
NEXT_PUBLIC_API_URL=https://apicontratos.pacejucodes.online
```

## Deploy na Vercel

1. Push para o GitHub
2. Importe o repositório na Vercel
3. Configure `NEXT_PUBLIC_API_URL` nas variáveis de ambiente da Vercel
4. Deploy automático

## Estrutura

```
src/
  app/
    login/          → Tela de login
    registro/       → Cadastro
    dashboard/      → Lista de templates
    contratos/novo/ → Formulário + contrato gerado
    historico/      → Histórico de contratos
  components/
    ui/             → Button, Input, Card, Badge
    layout/         → Navbar
    contracts/      → TemplateCard, ContractForm, ContractViewer
  hooks/            → useAuth, useTheme
  lib/              → api.ts, utils.ts
  types/            → index.ts
```
