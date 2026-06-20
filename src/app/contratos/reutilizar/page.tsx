"use client";
import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

function ReutilizarContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!id || !user) return;

    api.getContract(id).then((c: any) => {
      // Salva os dados no sessionStorage para o formulário pegar
      sessionStorage.setItem(
        `prefill_${c.template_id}`,
        JSON.stringify(c.form_data)
      );
      router.replace(`/contratos/novo?templateId=${c.template_id}`);
    }).catch(() => {
      router.replace("/historico");
    });
  }, [id, user]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function ReutilizarPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ReutilizarContent />
    </Suspense>
  );
}