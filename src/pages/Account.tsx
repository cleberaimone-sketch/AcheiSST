"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2, LogOut, ShieldCheck, BadgeCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type AccountType = "profissional" | "clinica" | "empresa_sst" | "empresa_epi";

const accountTypes: { value: AccountType; label: string }[] = [
  { value: "profissional", label: "Profissional autônomo" },
  { value: "clinica", label: "Clínica" },
  { value: "empresa_sst", label: "Empresa SST" },
  { value: "empresa_epi", label: "Empresa EPI" },
];

const profileSchema = z.object({
  display_name: z.string().trim().min(2, "Informe um nome").max(100),
  legal_name: z.string().trim().max(150).optional().or(z.literal("")),
  document: z.string().trim().max(20).optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  whatsapp: z.string().trim().max(30).optional().or(z.literal("")),
  public_email: z.string().trim().email("Email inválido").max(255).optional().or(z.literal("")),
  website: z.string().trim().url("URL inválida").max(255).optional().or(z.literal("")),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  state: z.string().trim().max(2).optional().or(z.literal("")),
  about: z.string().trim().max(2000).optional().or(z.literal("")),
});

const Account = () => {
  const navigate = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    display_name: "",
    legal_name: "",
    document: "",
    phone: "",
    whatsapp: "",
    public_email: "",
    website: "",
    city: "",
    state: "",
    about: "",
    account_type: "profissional" as AccountType,
    plan: "free" as "free" | "premium" | "pro",
    is_verified: false,
  });

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { replace: true });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) {
        toast.error("Erro ao carregar perfil");
      } else if (data) {
        setProfile({
          display_name: data.display_name ?? "",
          legal_name: data.legal_name ?? "",
          document: data.document ?? "",
          phone: data.phone ?? "",
          whatsapp: data.whatsapp ?? "",
          public_email: data.public_email ?? "",
          website: data.website ?? "",
          city: data.city ?? "",
          state: data.state ?? "",
          about: data.about ?? "",
          account_type: data.account_type as AccountType,
          plan: data.plan as "free" | "premium" | "pro",
          is_verified: data.is_verified,
        });
      }
      setLoading(false);
    })();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const parsed = profileSchema.safeParse(profile);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: profile.display_name,
        legal_name: profile.legal_name || null,
        document: profile.document || null,
        phone: profile.phone || null,
        whatsapp: profile.whatsapp || null,
        public_email: profile.public_email || null,
        website: profile.website || null,
        city: profile.city || null,
        state: profile.state ? profile.state.toUpperCase() : null,
        about: profile.about || null,
        account_type: profile.account_type,
      })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast.error("Erro ao salvar: " + error.message);
    } else {
      toast.success("Perfil atualizado!");
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const planBadge = {
    free: { label: "Plano Free", class: "bg-muted text-foreground" },
    premium: { label: "Premium", class: "bg-secondary/15 text-secondary" },
    pro: { label: "Pro", class: "bg-primary/15 text-primary" },
  }[profile.plan];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 md:pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          {/* Header card */}
          <div className="bg-gradient-hero border border-border rounded-2xl p-6 md:p-8 mb-8 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary mb-2">Minha conta</p>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Olá, {profile.display_name || "prestador"}
              </h1>
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${planBadge.class}`}>
                  {planBadge.label}
                </span>
                {profile.is_verified && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    Verificado
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {user?.email}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-primary transition-colors border border-border rounded-full px-4 py-2"
            >
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="bg-background border border-border rounded-2xl p-6 md:p-8 shadow-card space-y-5">
            <h2 className="font-display text-lg font-bold text-foreground">Dados do prestador</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Nome de exibição*">
                <input className={inputClass} value={profile.display_name} maxLength={100}
                  onChange={(e) => setProfile({ ...profile, display_name: e.target.value })} required />
              </Field>
              <Field label="Tipo de conta">
                <select className={inputClass} value={profile.account_type}
                  onChange={(e) => setProfile({ ...profile, account_type: e.target.value as AccountType })}>
                  {accountTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </Field>
              <Field label="Razão social / Nome legal">
                <input className={inputClass} value={profile.legal_name} maxLength={150}
                  onChange={(e) => setProfile({ ...profile, legal_name: e.target.value })} />
              </Field>
              <Field label="CNPJ ou CPF">
                <input className={inputClass} value={profile.document} maxLength={20}
                  onChange={(e) => setProfile({ ...profile, document: e.target.value })} />
              </Field>
              <Field label="Telefone">
                <input className={inputClass} value={profile.phone} maxLength={30}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="(11) 0000-0000" />
              </Field>
              <Field label="WhatsApp">
                <input className={inputClass} value={profile.whatsapp} maxLength={30}
                  onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })} placeholder="(11) 90000-0000" />
              </Field>
              <Field label="Email público (contato)">
                <input type="email" className={inputClass} value={profile.public_email} maxLength={255}
                  onChange={(e) => setProfile({ ...profile, public_email: e.target.value })} />
              </Field>
              <Field label="Site">
                <input type="url" className={inputClass} value={profile.website} maxLength={255}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })} placeholder="https://..." />
              </Field>
              <Field label="Cidade">
                <input className={inputClass} value={profile.city} maxLength={100}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })} />
              </Field>
              <Field label="Estado (UF)">
                <input className={inputClass} value={profile.state} maxLength={2}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value.toUpperCase() })} placeholder="SP" />
              </Field>
            </div>

            <Field label="Sobre">
              <textarea className={`${inputClass} min-h-[120px] resize-y`} value={profile.about} maxLength={2000}
                onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                placeholder="Conte um pouco sobre seus serviços, especialidades e diferenciais..." />
            </Field>

            <button type="submit" disabled={saving}
              className="bg-primary text-primary-foreground rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-60 inline-flex items-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Salvar alterações
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const inputClass = "w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-primary transition-colors";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="text-xs font-medium text-foreground/80">{label}</span>
    <div className="mt-1">{children}</div>
  </label>
);

export default Account;
