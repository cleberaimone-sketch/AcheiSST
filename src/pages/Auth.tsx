"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import logoText from "@/assets/acheisst-logo-text.png";

const accountTypes = [
  { value: "profissional", label: "Profissional autônomo" },
  { value: "clinica",      label: "Clínica" },
  { value: "empresa_sst",  label: "Empresa SST" },
  { value: "empresa_epi",  label: "Empresa EPI" },
] as const;

// Senha forte: mínimo 8 chars, 1 maiúscula, 1 número
const strongPassword = z
  .string()
  .min(8, "Mínimo de 8 caracteres")
  .max(72, "Máximo de 72 caracteres")
  .regex(/[A-Z]/, "Deve conter ao menos uma letra maiúscula")
  .regex(/[0-9]/, "Deve conter ao menos um número");

const signupSchema = z
  .object({
    display_name:  z.string().trim().min(2, "Informe seu nome").max(100),
    email:         z.string().trim().email("Email inválido").max(255).toLowerCase(),
    password:      strongPassword,
    confirmPassword: z.string(),
    account_type:  z.enum(["profissional", "clinica", "empresa_sst", "empresa_epi"]),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

const loginSchema = z.object({
  email:    z.string().trim().email("Email inválido").max(255).toLowerCase(),
  password: z.string().min(1, "Informe sua senha").max(72),
});

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ["", "Fraca", "Razoável", "Boa", "Forte"];
  const colors = ["", "bg-red-500", "bg-yellow-400", "bg-blue-500", "bg-green-500"];
  return (
    <div className="mt-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all ${i <= score ? colors[score] : "bg-border"}`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-1">{labels[score]}</p>
    </div>
  );
}

const AuthPage = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Rate limiting: bloqueia após 5 tentativas falhas por 60s
  const attempts = useRef(0);
  const lockedUntil = useRef<number>(0);

  const [email, setEmail]                     = useState("");
  const [password, setPassword]               = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName]         = useState("");
  const [accountType, setAccountType]         = useState<typeof accountTypes[number]["value"]>("profissional");

  useEffect(() => {
    if (!authLoading && user) router.replace("/conta");
  }, [user, authLoading, router]);

  const clearPasswords = () => {
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Rate limiting client-side
    if (Date.now() < lockedUntil.current) {
      const secs = Math.ceil((lockedUntil.current - Date.now()) / 1000);
      setError(`Muitas tentativas. Aguarde ${secs}s antes de tentar novamente.`);
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "signup") {
        const parsed = signupSchema.safeParse({
          display_name: displayName,
          email,
          password,
          confirmPassword,
          account_type: accountType,
        });
        if (!parsed.success) {
          setError(parsed.error.issues[0].message);
          return;
        }

        const { error: signUpError } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              display_name: parsed.data.display_name,
              account_type: parsed.data.account_type,
            },
          },
        });

        if (signUpError) {
          attempts.current += 1;
          if (attempts.current >= 5) {
            lockedUntil.current = Date.now() + 60_000;
            attempts.current = 0;
          }
          // Mensagem genérica para não vazar se o email já existe
          setError("Não foi possível criar a conta. Verifique os dados e tente novamente.");
          return;
        }

        // Sucesso: limpa estado e redireciona para página de confirmação
        attempts.current = 0;
        setEmail("");
        setDisplayName("");
        router.push("/cadastro-concluido");

      } else {
        const parsed = loginSchema.safeParse({ email, password });
        if (!parsed.success) {
          setError(parsed.error.issues[0].message);
          return;
        }

        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });

        if (loginError) {
          attempts.current += 1;
          if (attempts.current >= 5) {
            lockedUntil.current = Date.now() + 60_000;
            attempts.current = 0;
          }
          // Mensagem genérica — não revela se o email existe ou não
          setError("Email ou senha inválidos.");
          return;
        }

        attempts.current = 0;
        router.replace("/conta");
      }
    } finally {
      clearPasswords();
      setSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode((m) => (m === "login" ? "signup" : "login"));
    setError(null);
    clearPasswords();
    setEmail("");
    setDisplayName("");
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* Navbar mínima */}
      <div className="px-6 md:px-10 py-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-foreground/70 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>
        <Link href="/">
          <img src={logoText.src} alt="AcheiSST" className="h-7 w-auto" />
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 pb-12">
        <div className="w-full max-w-md bg-background border border-border rounded-2xl shadow-card p-8">

          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">
            {mode === "login" ? "Entrar na sua conta" : "Criar sua conta"}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {mode === "login"
              ? "Acesse seu painel e gerencie seu perfil."
              : "Cadastre-se para divulgar seus serviços de SST."}
          </p>

          {/* Google — desabilitado por ora */}
          <button
            type="button"
            disabled
            title="Em breve"
            className="w-full flex items-center justify-center gap-3 border border-border rounded-full py-2.5 text-sm font-medium opacity-40 cursor-not-allowed mb-1"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fbbc04" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar com Google
          </button>
          <p className="text-center text-xs text-muted-foreground mb-4">Em breve</p>

          <div className="relative my-4 text-center">
            <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
            <span className="relative bg-background px-3 text-xs text-muted-foreground">
              ou com email
            </span>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3" noValidate>
            {mode === "signup" && (
              <>
                <div>
                  <label className="text-xs font-medium text-foreground/80">Nome de exibição</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    maxLength={100}
                    autoComplete="name"
                    className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-primary transition-colors"
                    placeholder="Ex.: Dr. João Silva ou Clínica SaúdeMais"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground/80">Tipo de conta</label>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value as typeof accountType)}
                    className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-primary transition-colors"
                  >
                    {accountTypes.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-medium text-foreground/80">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                autoComplete="email"
                className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-primary transition-colors"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground/80">Senha</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  maxLength={72}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  className="w-full border border-border rounded-lg px-3 py-2 pr-10 text-sm bg-background focus:outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {mode === "signup" && <PasswordStrength password={password} />}
            </div>

            {mode === "signup" && (
              <div>
                <label className="text-xs font-medium text-foreground/80">Confirmar senha</label>
                <div className="relative mt-1">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    maxLength={72}
                    autoComplete="new-password"
                    className="w-full border border-border rounded-lg px-3 py-2 pr-10 text-sm bg-background focus:outline-none focus:border-primary transition-colors"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {mode === "login" && (
              <div className="text-right">
                <Link
                  href="/painel/redefinir-senha"
                  className="text-xs text-primary hover:underline"
                >
                  Esqueceu sua senha?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-primary-foreground rounded-full py-2.5 text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "login" ? "Entrar" : "Criar conta"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            {mode === "login" ? "Não tem conta?" : "Já tem conta?"}{" "}
            <button
              type="button"
              onClick={switchMode}
              className="text-primary font-semibold hover:underline"
            >
              {mode === "login" ? "Cadastre-se" : "Entrar"}
            </button>
          </p>

          {/* Selos de segurança */}
          <div className="mt-6 pt-5 border-t border-border flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            Dados protegidos com criptografia de ponta
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
