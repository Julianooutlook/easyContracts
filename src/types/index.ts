export interface User {
  id: string;
  name: string;
  email: string;
  plan: "free" | "pro";
  logo_url?: string;
  pdf_font?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface Template {
  id: string;
  name: string;
  contract_type: string;
  description: string;
  fields: string[];
}

export interface GenerateResponse {
  id: string;
  contractText: string;
  tokensUsed: number;
  canEdit: boolean;
  warning?: string;
  missingFields?: string[];
}

export interface HistoryItem {
  id: string;
  type: "analyze" | "summarize" | "generate";
  contract_type: string;
  input_type: string;
  tokens_used: number;
  is_edited: boolean;
  edited_at: string | null;
  created_at: string;
}
