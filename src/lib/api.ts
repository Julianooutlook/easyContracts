const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Erro desconhecido" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  register: (data: { name: string; email: string; password: string }) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(data) }),

  me: () => request("/me"),

  // Templates
  getTemplates: (contractType?: string) =>
    request(
      `/contracts/templates${contractType ? `?contractType=${contractType}` : ""}`,
    ),

  getTemplateFields: (id: string) =>
    request(`/contracts/templates/${id}/fields`),

  // Preferences
  updateFont: (pdf_font: string) =>
    request("/me/preferences", {
      method: "PUT",
      body: JSON.stringify({ pdf_font }),
    }),

  uploadLogo: (logo_base64: string) =>
    request("/me/logo", {
      method: "POST",
      body: JSON.stringify({ logo_base64 }),
    }),

  deleteLogo: () => request("/me/logo", { method: "DELETE" }),

  // Contracts
  generate: (data: {
    templateId: string;
    contractType: string;
    formData: Record<string, string>;
  }) =>
    request("/contracts/generate", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getContract: (id: string) => request(`/contracts/${id}`),

  downloadPDF: async (id: string): Promise<Blob> => {
    const token = getToken();
    const res = await fetch(`${API_URL}/contracts/${id}/pdf`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token ?? ""}` },
    });
    if (!res.ok) throw new Error("Erro ao gerar PDF");
    return res.blob();
  },

  getHistory: (page = 1) => request(`/contracts/history?page=${page}&limit=10`),

  saveEdit: (id: string, editedText: string) =>
    request(`/contracts/${id}`, {
      method: "PUT",
      body: JSON.stringify({ editedText }),
    }),
};
