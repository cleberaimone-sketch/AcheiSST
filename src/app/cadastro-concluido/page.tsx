import Link from "next/link";
import { CheckCircle2, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import Logo from "@/components/Logo";

export const metadata = {
  title: "Cadastro Concluído — AcheiSST",
  robots: { index: false },
};

export default function CadastroConcluido() {
  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* Navbar mínima */}
      <div className="px-6 md:px-10 py-6 max-w-7xl mx-auto w-full">
        <Link href="/">
          <Logo textClassName="text-2xl" />
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-lg text-center">

          {/* Ícone de sucesso */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
          </div>

          {/* Título */}
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Conta criada com sucesso!
          </h1>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">
            Bem-vindo ao <strong>AcheiSST</strong>. Sua conta foi registrada com segurança em nossa plataforma.
          </p>

          {/* Card de instrução de email */}
          <div className="bg-background border border-border rounded-2xl shadow-card p-6 mb-8 text-left">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground mb-1">Confirme seu email</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Enviamos um link de confirmação para o seu endereço de email. Verifique sua caixa de entrada — e também a pasta de spam.
                </p>
              </div>
            </div>
          </div>

          {/* Próximos passos */}
          <div className="bg-background border border-border rounded-2xl shadow-card p-6 mb-8 text-left">
            <h2 className="font-semibold text-foreground mb-4">Próximos passos</h2>
            <ul className="space-y-3">
              {[
                { step: "1", text: "Confirme seu email clicando no link que enviamos" },
                { step: "2", text: "Faça login com suas credenciais" },
                { step: "3", text: "Complete seu perfil para aparecer nas buscas" },
              ].map(({ step, text }) => (
                <li key={step} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                    {step}
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-8 py-3 text-sm font-semibold hover:bg-primary/90 transition-all"
          >
            Fazer login agora
            <ArrowRight className="w-4 h-4" />
          </Link>

          <p className="mt-4 text-xs text-muted-foreground">
            Não recebeu o email?{" "}
            <Link href="/auth" className="text-primary hover:underline">
              Tente novamente
            </Link>
          </p>

          {/* Segurança */}
          <div className="mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            Seus dados são protegidos com criptografia de ponta
          </div>
        </div>
      </div>
    </div>
  );
}
