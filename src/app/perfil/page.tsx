"use client";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useRouter } from "next/navigation";
import { Upload, Trash2, Check, Type, ImageIcon, User } from "lucide-react";

const FONTS = [
  { value: "Helvetica", label: "Helvetica", preview: "Contrato de Prestação de Serviços" },
  { value: "Times-Roman", label: "Times New Roman", preview: "Contrato de Prestação de Serviços" },
  { value: "Courier", label: "Courier", preview: "Contrato de Prestação de Serviços" },
];

export default function PerfilPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [selectedFont, setSelectedFont] = useState("Helvetica");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [savingFont, setSavingFont] = useState(false);
  const [savingLogo, setSavingLogo] = useState(false);
  const [deletingLogo, setDeletingLogo] = useState(false);
  const [fontSaved, setFontSaved] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
    if (user) {
      setSelectedFont(user.pdf_font ?? "Helvetica");
      setLogoPreview(user.logo_url ?? null);
    }
  }, [user, authLoading, router]);

  const handleFontSave = async () => {
    setSavingFont(true);
    setError("");
    try {
      await (api as any).updateFont(selectedFont);
      setFontSaved(true);
      setTimeout(() => setFontSaved(false), 2500);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSavingFont(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      setError("Logo muito grande. Máximo 500KB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setLogoPreview(base64);
      setSavingLogo(true);
      setError("");
      try {
        await (api as any).uploadLogo(base64);
      } catch (e: any) {
        setError(e.message);
        setLogoPreview(user?.logo_url ?? null);
      } finally {
        setSavingLogo(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogoDelete = async () => {
    setDeletingLogo(true);
    setError("");
    try {
      await (api as any).deleteLogo();
      setLogoPreview(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setDeletingLogo(false);
    }
  };

  if (authLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center">
          <User className="w-5 h-5 text-brand-600 dark:text-brand-400" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-zinc-900 dark:text-white">Perfil</h1>
          <p className="text-sm text-zinc-500">Personalize seus contratos em PDF</p>
        </div>
      </div>

      {/* Info */}
      <Card>
        <CardBody className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-brand-700 dark:text-brand-400 font-bold text-lg">
            {user.name[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">{user.name}</p>
            <p className="text-sm text-zinc-500 truncate">{user.email}</p>
          </div>
          <Badge variant={user.plan === "pro" ? "green" : "zinc"}>
            {user.plan === "pro" ? "Pro" : "Grátis"}
          </Badge>
        </CardBody>
      </Card>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-xl">
          {error}
        </p>
      )}

      {/* Logo */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-zinc-500" />
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Logo da empresa</h2>
          </div>
          <p className="text-xs text-zinc-500 mt-1">Aparece no cabeçalho de todos os PDFs gerados</p>
        </CardHeader>
        <CardBody className="space-y-4">
          {logoPreview ? (
            <div className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
              <img
                src={logoPreview}
                alt="Logo"
                className="h-12 max-w-[160px] object-contain"
              />
              <div className="flex-1" />
              <Button
                variant="danger"
                size="sm"
                onClick={handleLogoDelete}
                loading={deletingLogo}
              >
                <Trash2 className="w-4 h-4" />
                Remover
              </Button>
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl p-8 text-center cursor-pointer hover:border-brand-400 dark:hover:border-brand-600 transition-colors"
            >
              <Upload className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
              <p className="text-sm text-zinc-500">Clique para fazer upload</p>
              <p className="text-xs text-zinc-400 mt-1">PNG, JPG ou WebP — máx. 500KB</p>
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleLogoUpload}
          />

          {!logoPreview && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileRef.current?.click()}
              loading={savingLogo}
            >
              <Upload className="w-4 h-4" />
              Escolher imagem
            </Button>
          )}
        </CardBody>
      </Card>

      {/* Fonte */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-zinc-500" />
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Fonte do PDF</h2>
          </div>
          <p className="text-xs text-zinc-500 mt-1">Escolha a tipografia dos contratos gerados</p>
        </CardHeader>
        <CardBody className="space-y-3">
          {FONTS.map((font) => (
            <div
              key={font.value}
              onClick={() => setSelectedFont(font.value)}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedFont === font.value
                  ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                  : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600"
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                selectedFont === font.value
                  ? "border-brand-500 bg-brand-500"
                  : "border-zinc-300 dark:border-zinc-600"
              }`}>
                {selectedFont === font.value && <Check className="w-3 h-3 text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{font.label}</p>
                <p className="text-sm text-zinc-400 mt-0.5 truncate italic">{font.preview}</p>
              </div>
            </div>
          ))}

          <Button
            onClick={handleFontSave}
            loading={savingFont}
            className="w-full mt-2"
          >
            {fontSaved ? <><Check className="w-4 h-4" /> Salvo!</> : "Salvar fonte"}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
