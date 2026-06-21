"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BG2 from "../image/BG2.png";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Erro ao entrar");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">

      <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8">

        <div className="hidden lg:flex flex-1 justify-center max-w-xl mx-10" >
          <Image
            src={BG2}
            alt="BG"
            width={1000}
            height={800}
            className="w-full h-auto"
          />
        </div>

        <div className="w-full max-w-sm animate-slide-up">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
              Bem-vindo de volta
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Entre na sua conta para continuar
            </p>
          </div>


          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {error && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <Button type="submit" loading={loading} size="lg" className="w-full mt-2">
              Entrar
            </Button>
          </form>

          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-6">
            Não tem conta?{" "}
            <Link href="/registro" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">
              Cadastre-se grátis
            </Link>
          </p>
        </div>

      </div>

    </div>
  );
}
