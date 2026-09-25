"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import {
  IconArrowLeft,
  IconBuildingStore,
  IconCalculator,
  IconChartBar,
  IconChevronRight,
  IconCircleCheck,
  IconHome,
  IconLogout,
  IconMapPin,
  IconMessage,
  IconMinus,
  IconPlant2,
  IconPlus,
  IconSend,
  IconSparkles,
  IconTrendingDown,
  IconTrendingUp,
  IconUserCircle,
  IconLeaf,
  IconShieldCheck,
} from "@tabler/icons-react";
import { CROPS, BUYER_DEMAND, t, translateCrop, getCropImage } from "@/lib/demo-data";
import type { Language, Listing, PriceSnapshot } from "@/lib/types";
import { supabase } from "@/lib/supabase";

type View = "home" | "prices" | "market" | "sms" | "calculator" | "advisor" | "profile";
type Chat = { role: "user" | "assistant"; content: string };
type Profile = {
  id?: string;
  name: string;
  village: string;
  taluka: string;
  district: string;
  preferred_language: Language;
  avatar_url?: string | null;
  email?: string | null;
};

const money = (amount: number) => `₹${Math.round(amount || 0).toLocaleString("en-IN")}`;

const cropLooks: Record<string, { mark: string; bg: string; fg: string; line: string; gradFrom: string; gradTo: string }> = {
  Onion:   { mark: "ON", bg: "#f7ede2", fg: "#8a4b19", line: "#c9792d", gradFrom: "#f7ede2", gradTo: "#f0ddc8" },
  Tomato:  { mark: "TO", bg: "#fde8e7", fg: "#b42318", line: "#e5483f", gradFrom: "#fde8e7", gradTo: "#f8d0cd" },
  Wheat:   { mark: "WH", bg: "#fff2cc", fg: "#8a6200", line: "#d49b16", gradFrom: "#fff2cc", gradTo: "#ffe8a3" },
  Cotton:  { mark: "CT", bg: "#eaf2ff", fg: "#2457a6", line: "#5b8def", gradFrom: "#eaf2ff", gradTo: "#d5e5ff" },
  Soybean: { mark: "SO", bg: "#eaf7df", fg: "#357a28", line: "#70ad47", gradFrom: "#eaf7df", gradTo: "#d4ecc5" },
  Potato:  { mark: "PO", bg: "#f0eadf", fg: "#6e5132", line: "#9a734c", gradFrom: "#f0eadf", gradTo: "#e2d7c5" },
};

const buyerDemand = [
  { buyer: "Sahyadri Fresh Foods", crop: "Tomato", quantity: "60 qtl", offer: 3180, location: "Pune collection centre" },
  { buyer: "Deccan Agro Traders", crop: "Onion", quantity: "100 qtl", offer: 4050, location: "Nashik APMC" },
  { buyer: "Vidarbha Cotton Co-op", crop: "Cotton", quantity: "80 qtl", offer: 7420, location: "Nagpur APMC" },
];

/* ─── SVG Crop Icons ─── */
function CropIcon({ crop, size = 24 }: { crop: string; size?: number }) {
  const s = size;
  switch (crop) {
    case "Onion":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <ellipse cx="12" cy="15" rx="7" ry="6.5" fill="#c9792d" opacity="0.85" />
          <ellipse cx="12" cy="14.5" rx="5" ry="5" fill="#e8a756" />
          <path d="M12 3c0 0-2 3-2 6s1.5 4 2 4 2-1 2-4-2-6-2-6z" fill="#6daa4f" />
          <path d="M11 3.5c-1 0.5-2.5 2-2 4" stroke="#4a8a35" strokeWidth="0.8" fill="none" />
        </svg>
      );
    case "Tomato":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="13" r="7" fill="#e5483f" />
          <circle cx="12" cy="13" r="5.5" fill="#f06b60" opacity="0.5" />
          <ellipse cx="12" cy="7.5" rx="3" ry="1.5" fill="#5daa4f" />
          <path d="M12 4v4" stroke="#4a8a35" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="9.5" cy="11.5" r="0.6" fill="#fff" opacity="0.3" />
        </svg>
      );
    case "Wheat":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M12 21V8" stroke="#d49b16" strokeWidth="1.5" strokeLinecap="round" />
          <ellipse cx="12" cy="6" rx="2" ry="3.5" fill="#e8b84a" />
          <ellipse cx="10" cy="7.5" rx="1.5" ry="2.5" fill="#d49b16" transform="rotate(-20 10 7.5)" />
          <ellipse cx="14" cy="7.5" rx="1.5" ry="2.5" fill="#d49b16" transform="rotate(20 14 7.5)" />
          <path d="M9 13l3-2 3 2" stroke="#c9a033" strokeWidth="0.8" fill="none" />
          <path d="M9.5 16l2.5-1.5 2.5 1.5" stroke="#c9a033" strokeWidth="0.8" fill="none" />
        </svg>
      );
    case "Cotton":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="11" r="4" fill="#f0f4ff" stroke="#b8ccef" strokeWidth="0.5" />
          <circle cx="9" cy="9.5" r="3" fill="#e8eef9" stroke="#b8ccef" strokeWidth="0.5" />
          <circle cx="15" cy="9.5" r="3" fill="#e8eef9" stroke="#b8ccef" strokeWidth="0.5" />
          <circle cx="10.5" cy="13" r="2.5" fill="#f0f4ff" stroke="#b8ccef" strokeWidth="0.5" />
          <circle cx="13.5" cy="13" r="2.5" fill="#f0f4ff" stroke="#b8ccef" strokeWidth="0.5" />
          <path d="M12 15v5" stroke="#5daa4f" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M10 17l2-2 2 2" stroke="#5daa4f" strokeWidth="0.8" fill="none" />
        </svg>
      );
    case "Soybean":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <ellipse cx="10" cy="13" rx="4" ry="5.5" fill="#8cc374" transform="rotate(-10 10 13)" />
          <ellipse cx="14" cy="13" rx="4" ry="5.5" fill="#70ad47" transform="rotate(10 14 13)" />
          <ellipse cx="10.5" cy="12" rx="1.5" ry="2" fill="#a3d48e" />
          <ellipse cx="13.5" cy="12" rx="1.5" ry="2" fill="#93c97a" />
          <path d="M12 4v4" stroke="#4a8a35" strokeWidth="1" strokeLinecap="round" />
          <path d="M10 5c1.5 0.5 2.5 2 2 3" stroke="#5daa4f" strokeWidth="0.8" fill="none" />
        </svg>
      );
    case "Potato":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <ellipse cx="12" cy="14" rx="7" ry="5" fill="#c4a46e" />
          <ellipse cx="12" cy="13.5" rx="5.5" ry="4" fill="#d4b882" />
          <circle cx="9" cy="12.5" r="0.7" fill="#b8975c" />
          <circle cx="14" cy="13" r="0.6" fill="#b8975c" />
          <circle cx="11" cy="15" r="0.5" fill="#b8975c" />
          <path d="M11 7c0 0 0.5-3 1-3s1 3 1 3" stroke="#6daa4f" strokeWidth="0.8" fill="none" />
        </svg>
      );
    default:
      return <IconLeaf size={s * 0.75} />;
  }
}

/* ─── Shared UI Primitives ─── */
function Panel({ children, className = "", accent = false }: { children: React.ReactNode; className?: string; accent?: boolean }) {
  return (
    <section className={`card-lift rounded-xl border bg-white p-5 shadow-card ${accent ? "border-kisan-terra-400/40" : "border-kisan-cream-400/80"} ${className}`}>
      {children}
    </section>
  );
}

function CropBadge({ crop, size = "normal" }: { crop: string; size?: "normal" | "small" }) {
  const look = cropLooks[crop] ?? { mark: crop.slice(0, 2).toUpperCase(), bg: "#ecf7ee", fg: "#26733b", line: "#4b9b5a", gradFrom: "#ecf7ee", gradTo: "#d4ecc5" };
  const dim = size === "small" ? "h-9 w-9" : "h-12 w-12";
  const iconSize = size === "small" ? 18 : 24;
  const imgSrc = getCropImage(crop);

  return (
    <span
      className={`relative flex ${dim} shrink-0 items-center justify-center overflow-hidden rounded-xl border border-kisan-cream-300 shadow-sm`}
      style={{ background: `linear-gradient(145deg, ${look.gradFrom}, ${look.gradTo})` }}
    >
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={crop}
          className="h-full w-full object-cover"
        />
      ) : (
        <CropIcon crop={crop} size={iconSize} />
      )}
      <span className="sr-only">{crop}</span>
    </span>
  );
}

function Trend({ value }: { value: number }) {
  if (value === 0) return <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500"><IconMinus size={13} />0.0%</span>;
  const up = value > 0;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${up ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
      {up ? <IconTrendingUp size={14} /> : <IconTrendingDown size={14} />}
      {up ? "+" : ""}{Math.abs(value).toFixed(1)}%
    </span>
  );
}

/* ─── Real Time-Series Sparkline ─── */
function Sparkline({ item }: { item: PriceSnapshot }) {
  const up = item.trend >= 0;
  const strokeColor = up ? "#1b6e34" : "#dc2626";

  // Use real history array if provided, otherwise extrapolate from trend
  let values = (item.history && item.history.length > 0) ? [...item.history] : [];
  if (values.length === 0) {
    const prev = item.previousPrice ?? item.price;
    values = [prev, item.price];
  }
  if (values.length === 1) {
    values = [values[0], values[0]];
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = max - min || 1;
  const count = values.length;

  const points = values
    .map((val, idx) => `${(idx / (count - 1)) * 100},${30 - ((val - min) / spread) * 22}`)
    .join(" ");

  const areaPoints = `0,33 ${points} 100,33`;
  const endY = 30 - ((values[count - 1] - min) / spread) * 22;

  return (
    <svg aria-label={`${item.crop} trend`} viewBox="0 0 100 38" className="h-12 w-full overflow-visible">
      <defs>
        <linearGradient id={`grad-${item.crop.replace(/\W+/g, "-")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      {/* Baseline */}
      <line x1="0" y1="33" x2="100" y2="33" stroke="#e0e7de" strokeWidth="0.8" strokeDasharray="2 2" />
      {/* Gradient Area Fill */}
      <polygon fill={`url(#grad-${item.crop.replace(/\W+/g, "-")})`} points={areaPoints} />
      {/* High-contrast Trend Line */}
      <polyline fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
      {/* Highlighted End Dot */}
      <circle cx="100" cy={endY} r="3.5" fill={strokeColor} stroke="#ffffff" strokeWidth="1.2" />
      {/* Dynamic timeline tick markers */}
      {values.map((_, i) => (
        <circle key={i} cx={(i / (count - 1)) * 100} cy="33" r="1" fill="#bbb4a4" />
      ))}
    </svg>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-kisan-cream-400/60 bg-white p-5 shadow-card">
      <div className="flex items-start gap-3">
        <div className="skeleton h-12 w-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-20 rounded-md" />
          <div className="skeleton h-3 w-32 rounded-md" />
        </div>
        <div className="skeleton h-5 w-14 rounded-full" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="skeleton h-3 w-16 rounded-md" />
        <div className="skeleton h-8 w-28 rounded-md" />
      </div>
      <div className="mt-3 skeleton h-10 w-full rounded-md" />
    </div>
  );
}

function SkeletonStat() {
  return (
    <div className="rounded-xl border border-kisan-cream-400/60 bg-white p-4 shadow-card">
      <div className="skeleton h-3 w-16 rounded-md" />
      <div className="skeleton mt-2 h-5 w-12 rounded-md" />
    </div>
  );
}

function PriceCard({ item, lang = "english" }: { item: PriceSnapshot; lang?: Language }) {
  const cropLabel = translateCrop(item.crop, lang);
  return (
    <Panel>
      <div className="flex items-start gap-3">
        <CropBadge crop={item.crop} />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-bold text-[#18251b]">{cropLabel}</p>
          <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-kisan-cream-200 px-2 py-0.5 text-[11px] font-medium text-kisan-cream-800">
            <IconMapPin size={11} />{item.market}
          </span>
        </div>
        <Trend value={item.trend} />
      </div>
      <div className="mt-4">
        <p className="text-[10px] uppercase tracking-[0.1em] font-semibold text-kisan-cream-700">{t("per quintal", lang)}</p>
        <p className="mt-1 font-mono text-[28px] font-extrabold leading-none tabular-nums text-[#0d3519]">
          {money(item.price)}
        </p>
      </div>
      <div className="mt-3">
        <Sparkline item={item} />
      </div>
    </Panel>
  );
}

/* ─── Main App Shell ─── */
export function KisanSetuApp() {
  const [view, setView] = useState<View>("home");
  const [sessionReady, setSessionReady] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [prices, setPrices] = useState<PriceSnapshot[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize session & handle auth state changes
  useEffect(() => {
    async function loadAuth() {
      if (!supabase) {
        // Fallback for dev environment without env vars
        const saved = window.localStorage.getItem("kisansetu-profile");
        if (saved) setProfile(JSON.parse(saved) as Profile);
        setSessionReady(true);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        await processSession(session);
      } catch (err) {
        console.error("Auth session check error:", err);
      } finally {
        setSessionReady(true);
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        await processSession(session);
        setSessionReady(true);
      });

      return () => subscription.unsubscribe();
    }

    loadAuth();
  }, []);

  async function processSession(session: Session | null) {
    if (!session?.user) {
      setAuthUser(null);
      setProfile(null);
      setNeedsOnboarding(false);
      return;
    }

    setAuthUser(session.user);

    if (supabase) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (data) {
        setProfile({
          id: data.id,
          name: data.name,
          village: data.village || "",
          taluka: data.taluka || "",
          district: data.district || "",
          preferred_language: (data.preferred_language as Language) || "english",
          avatar_url: data.avatar_url || session.user.user_metadata?.avatar_url || null,
          email: data.email || session.user.email || null,
        });
        setNeedsOnboarding(false);
      } else {
        // User logged in via Google OAuth, but profile row does not exist yet -> trigger Onboarding
        setNeedsOnboarding(true);
        setProfile(null);
      }
    }
  }

  useEffect(() => {
    fetch("/api/prices")
      .then((r) => r.json())
      .then((rows) => setPrices(toCropPrices(Array.isArray(rows) ? rows : [])))
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  const leader = useMemo(() => [...prices].sort((a, b) => b.trend - a.trend)[0], [prices]);
  const language = profile?.preferred_language ?? "english";

  // 1. Session check loading screen (prevents flash of landing page for returning users)
  if (!sessionReady) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-kisan-cream-100 text-sm text-kisan-cream-700">
        <div className="flex flex-col items-center gap-3 animate-fade-in">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-kisan-green-500 to-kisan-green-700 text-white shadow-btn">
            <IconPlant2 size={28} />
          </span>
          <span className="font-bold text-kisan-green-800">Checking KisanSetu session…</span>
        </div>
      </main>
    );
  }

  // 2. Logged in via Google OAuth but needs onboarding info (village, taluka, language)
  if (needsOnboarding && authUser) {
    return (
      <OnboardingScreen
        user={authUser}
        onComplete={(newProfile) => {
          setProfile(newProfile);
          setNeedsOnboarding(false);
        }}
      />
    );
  }

  // 3. Not logged in -> Landing page with Google OAuth
  if (!profile) {
    return (
      <Landing
        onDevLogin={(name) => {
          const devProfile = { name, village: "", taluka: "", district: "", preferred_language: "english" as Language };
          window.localStorage.setItem("kisansetu-profile", JSON.stringify(devProfile));
          setProfile(devProfile);
        }}
      />
    );
  }

  // 4. Authenticated & Onboarded -> Main Dashboard
  return (
    <main className="min-h-screen bg-kisan-cream-100 text-[#18251b]">
      {/* Top accent bar — gradient */}
      <div className="h-1 bg-gradient-to-r from-kisan-green-700 via-kisan-green-500 to-kisan-terra-500" aria-hidden="true" />

      <div className="mx-auto flex min-h-[calc(100vh-4px)] w-full max-w-[1440px] lg:px-0">
        {/* ─── Sidebar ─── */}
        <aside className="topo-pattern sticky top-0 hidden h-screen w-[270px] shrink-0 border-r border-kisan-cream-400 bg-gradient-to-b from-kisan-cream-50 to-kisan-cream-200 lg:flex lg:flex-col">
          {/* Brand block */}
          <div className="px-5 pt-6 pb-5 border-b border-kisan-cream-400">
            <Brand />
            <p className="mt-2 text-[11px] leading-4 text-kisan-cream-700">Live market prices &amp; verified buyer access for Maharashtra farmers</p>
          </div>

          {/* Nav links */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {(["home", "prices", "market", "sms"] as View[]).map((item) => (
              <SideNav key={item} view={item} active={view === item} language={language} onClick={() => setView(item)} />
            ))}
          </nav>

          {/* Sidebar footer */}
          <div className="px-5 py-4 border-t border-kisan-cream-400">
            <button onClick={() => setView("advisor")} className="flex w-full items-center gap-2.5 rounded-xl bg-gradient-to-r from-kisan-terra-50 to-kisan-terra-100 border border-kisan-terra-200 px-3 py-2.5 text-left transition hover:shadow-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-kisan-terra-400 text-white">
                <IconSparkles size={16} />
              </span>
              <div>
                <p className="text-xs font-bold text-kisan-terra-800">{t("Market Assistant", language)}</p>
                <p className="text-[10px] text-kisan-terra-600">{language === "marathi" ? "बाजाराबद्दल विचारा" : language === "hindi" ? "बाज़ार प्रश्न पूछें" : "Ask market questions"}</p>
              </div>
            </button>
          </div>
        </aside>

        {/* ─── Content ─── */}
        <div className="min-w-0 flex-1 pb-24 lg:pb-10">
          <Header profile={profile} language={language} setView={setView} />
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
            {view === "home" && <Home prices={prices} loading={loading} leader={leader} language={language} go={setView} />}
            {view === "prices" && <Prices prices={prices} loading={loading} language={language} />}
            {view === "market" && <Market prices={prices} language={language} />}
            {view === "sms" && <Sms prices={prices} language={language} />}
            {view === "calculator" && <Calculator prices={prices} language={language} onBack={() => setView("home")} />}
            {view === "advisor" && <Advisor prices={prices} language={language} onBack={() => setView("home")} />}
            {view === "profile" && (
              <ProfileScreen
                profile={profile}
                language={language}
                onSave={setProfile}
                onLogout={async () => {
                  if (supabase) {
                    await supabase.auth.signOut();
                  }
                  window.localStorage.removeItem("kisansetu-profile");
                  setProfile(null);
                  setAuthUser(null);
                  setNeedsOnboarding(false);
                  setView("home");
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* ─── Mobile bottom nav ─── */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-kisan-cream-400 bg-white/95 backdrop-blur-md lg:hidden">
        <div className="mx-auto grid max-w-xl grid-cols-4">
          <Nav label={t("Dashboard", language)} active={view === "home"} icon={<IconHome size={22} />} onClick={() => setView("home")} />
          <Nav label={t("Price Board", language)} active={view === "prices"} icon={<IconChartBar size={22} />} onClick={() => setView("prices")} />
          <Nav label={t("Market Linkage", language)} active={view === "market"} icon={<IconBuildingStore size={22} />} onClick={() => setView("market")} />
          <Nav label={t("SMS Service", language)} active={view === "sms"} icon={<IconMessage size={22} />} onClick={() => setView("sms")} />
        </div>
      </nav>
    </main>
  );
}

/* ─── Brand ─── */
function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-kisan-green-500 to-kisan-green-700 text-white shadow-btn">
        <IconPlant2 size={21} />
      </span>
      <div>
        <p className="text-[15px] font-extrabold tracking-tight text-kisan-green-800">KisanSetu</p>
        <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-kisan-cream-700">Maharashtra</p>
      </div>
    </div>
  );
}

/* ─── Header ─── */
function Header({ profile, language, setView }: { profile: Profile; language: Language; setView: (view: View) => void }) {
  const fallbackLoc = language === "marathi" ? "शेतीचे ठिकाण सेट करा" : language === "hindi" ? "खेत का स्थान सेट करें" : "Set your farm location";
  const location = [profile.village, profile.taluka, profile.district].filter(Boolean).join(", ") || fallbackLoc;
  const hour = new Date().getHours();
  const greeting = language === "marathi"
    ? (hour < 12 ? "शुभ प्रभात" : hour < 17 ? "शुभ दुपार" : "शुभ संध्याकाळ")
    : language === "hindi"
    ? (hour < 12 ? "शुभ प्रभात" : hour < 17 ? "शुभ दोपहर" : "शुभ संध्या")
    : (hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening");

  return (
    <header className="border-b border-kisan-cream-400 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="lg:hidden"><Brand /></div>
        <div className="hidden lg:block">
          <p className="text-xs font-medium text-kisan-cream-700">{greeting},</p>
          <h1 className="text-2xl font-bold text-kisan-green-900">{profile.name}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-kisan-cream-800">
            <IconMapPin size={15} className="text-kisan-terra-500" />{location}
          </p>
        </div>
        <button onClick={() => setView("profile")} className="group flex items-center gap-2.5 rounded-full border border-kisan-cream-400 bg-white p-1 pr-3.5 text-sm font-medium transition hover:border-kisan-terra-400 hover:shadow-elevated">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.name} className="h-9 w-9 rounded-full object-cover border border-kisan-green-300" />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-kisan-green-50 to-kisan-green-100 text-kisan-green-600 transition group-hover:from-kisan-green-100 group-hover:to-kisan-green-200">
              <IconUserCircle size={22} />
            </span>
          )}
          <span className="hidden sm:inline text-kisan-green-800">{t("Account", language)}</span>
        </button>
      </div>
      {/* Mobile greeting sub-header */}
      <div className="px-4 pb-4 sm:px-6 lg:hidden">
        <p className="text-xs font-medium text-kisan-cream-700">{greeting},</p>
        <h1 className="text-xl font-bold text-kisan-green-900">{profile.name}</h1>
        <p className="mt-1 flex items-center gap-1 text-xs text-kisan-cream-800">
          <IconMapPin size={13} className="text-kisan-terra-500" />{location}
        </p>
      </div>
    </header>
  );
}

/* ─── Navigation ─── */
function Nav({ label, icon, active, onClick }: { label: string; icon: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex h-[60px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${active ? "text-kisan-green-600" : "text-kisan-cream-700 hover:text-kisan-green-500"}`}>
      <span className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${active ? "bg-kisan-green-50 shadow-sm" : ""}`}>{icon}</span>
      <span className={active ? "font-bold" : ""}>{label}</span>
      {active && <span className="h-0.5 w-4 rounded-full bg-kisan-green-500 mt-0.5" />}
    </button>
  );
}

function SideNav({ view, active, language, onClick }: { view: View; active: boolean; language: Language; onClick: () => void }) {
  const icons = {
    home: <IconHome size={19} />,
    prices: <IconChartBar size={19} />,
    market: <IconBuildingStore size={19} />,
    sms: <IconMessage size={19} />,
  } as Record<string, React.ReactNode>;

  const labels: Record<string, string> = {
    home: "Dashboard",
    prices: "Price Board",
    market: "Market Linkage",
    sms: "SMS Service",
  };

  const label = t(labels[view] ?? view, language);

  return (
    <button onClick={onClick} className={`group flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all ${active ? "tab-active text-white shadow-sm" : "text-kisan-cream-800 hover:bg-kisan-cream-300/60 hover:text-kisan-green-700"}`}>
      <span className={active ? "" : "text-kisan-cream-700 group-hover:text-kisan-green-600"}>{icons[view]}</span>
      {label}
      {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/70" />}
    </button>
  );
}

/* ─── Shared Sub-Components ─── */
function Title({ title, detail, back }: { title: string; detail: string; back?: () => void }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      {back && (
        <button aria-label="Back" onClick={back} className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl border border-kisan-cream-400 bg-white shadow-card transition hover:border-kisan-green-300 hover:shadow-elevated">
          <IconArrowLeft size={18} />
        </button>
      )}
      <div>
        <h2 className="text-xl font-bold text-kisan-green-900">{title}</h2>
        <p className="mt-1 text-sm text-kisan-cream-700">{detail}</p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-[#304133]">
      <span className="mb-1.5 block text-[13px]">{label}</span>
      <span className="block [&_input]:h-11 [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-kisan-cream-400 [&_input]:bg-white [&_input]:px-3.5 [&_input]:text-sm [&_input]:transition [&_select]:h-11 [&_select]:w-full [&_select]:rounded-xl [&_select]:border [&_select]:border-kisan-cream-400 [&_select]:bg-white [&_select]:px-3.5 [&_select]:text-sm [&_select]:transition">
        {children}
      </span>
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between text-sm text-kisan-cream-800"><span>{label}</span><span className="font-medium">{value}</span></div>;
}

function Tab({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`min-w-0 rounded-xl px-2 py-2.5 text-xs font-medium transition-all ${active ? "tab-active text-white" : "text-kisan-cream-800 hover:bg-kisan-cream-300/50"}`}>
      {children}
    </button>
  );
}

function LanguageSelect({ value, onChange }: { value: Language; onChange: (value: Language) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {(["english", "hindi", "marathi"] as Language[]).map((item) => (
        <button type="button" key={item} onClick={() => onChange(item)}
          className={`h-11 rounded-xl border text-sm capitalize transition-all ${value === item ? "border-kisan-green-500 bg-kisan-green-50 font-bold text-kisan-green-700 shadow-glow-green" : "border-kisan-cream-400 bg-white text-kisan-cream-800 hover:border-kisan-green-300"}`}>
          {item}
        </button>
      ))}
    </div>
  );
}


/* ════════════════════════════════════════
     SCREEN 0 — Landing Page with Google OAuth
   ════════════════════════════════════════ */
function Landing({ onDevLogin }: { onDevLogin: (name: string) => void }) {
  const [signingIn, setSigningIn] = useState(false);
  const [devName, setDevName] = useState("");
  const [showDevLogin, setShowDevLogin] = useState(!supabase);

  async function handleGoogleSignIn() {
    if (!supabase) {
      setShowDevLogin(true);
      return;
    }

    setSigningIn(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });
      if (error) throw error;
    } catch (err) {
      console.error("Google sign in error:", err);
      setSigningIn(false);
    }
  }

  function handleDevSubmit(e: FormEvent) {
    e.preventDefault();
    if (devName.trim()) {
      onDevLogin(devName.trim());
    }
  }

  return (
    <main className="relative min-h-screen text-[#18251b] overflow-hidden">
      {/* ── Hero Background Image ── */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-farmer.jpg"
          alt=""
          className="h-full w-full object-cover object-top"
        />
        {/* Desktop overlay: semi-transparent cream so content is readable */}
        <div className="absolute inset-0 hidden lg:block bg-gradient-to-r from-[rgba(255,252,245,0.88)] via-[rgba(255,252,245,0.82)] to-[rgba(255,252,245,0.65)]" />
        {/* Mobile overlay: dark gradient from bottom for white text readability */}
        <div className="absolute inset-0 lg:hidden bg-gradient-to-t from-[rgba(15,23,12,0.85)] via-[rgba(15,23,12,0.5)] to-[rgba(15,23,12,0.15)]" />
      </div>

      {/* ── Top accent bar ── */}
      <div className="relative z-10 h-1 bg-gradient-to-r from-kisan-green-700 via-kisan-green-500 to-kisan-terra-500" />

      {/* ── Content ── */}
      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-4px)] max-w-6xl items-center gap-12 px-5 py-10 lg:grid-cols-[1fr_1fr]">
        
        {/* Left Column — Title & Google OAuth CTA */}
        <div className="animate-fade-in">
          {/* Brand — dark on desktop, white on mobile */}
          <div className="lg:block hidden"><Brand /></div>
          <div className="lg:hidden block [&_span]:text-white [&_svg]:text-white"><Brand /></div>

          <h1 className="mt-10 max-w-2xl text-4xl font-extrabold leading-tight sm:text-5xl text-white lg:text-kisan-green-900 drop-shadow-sm lg:drop-shadow-none">
            Daily market clarity for <span className="text-kisan-terra-400 lg:text-kisan-terra-500">Maharashtra</span> farmers.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/90 lg:text-kisan-cream-800">
            Check live mandi prices, connect with verified buyers, calculate net returns, and get instant AI advice in Marathi &amp; Hindi.
          </p>

          <div className="mt-8 max-w-sm space-y-4">
            {/* Real Google OAuth Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={signingIn}
              className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-white border-2 border-kisan-cream-400 px-5 text-base font-bold text-kisan-green-900 shadow-card transition-all hover:border-kisan-green-500 hover:shadow-elevated hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
            >
              {signingIn ? (
                <span className="flex items-center gap-2 text-sm font-semibold text-kisan-green-700">
                  <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" /> Connecting to Google…
                </span>
              ) : (
                <>
                  <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            <p className="text-center text-xs text-white/70 lg:text-kisan-cream-700">
              Sign in with Google — no passwords, fast &amp; secure access.
            </p>

            {/* Fallback Dev Login if Supabase env vars not detected */}
            {showDevLogin && (
              <div className="mt-4 pt-4 border-t border-white/20 lg:border-kisan-cream-300">
                <p className="text-xs font-semibold text-kisan-terra-400 lg:text-kisan-terra-600 mb-2">Dev Mode: Direct Login</p>
                <form onSubmit={handleDevSubmit} className="space-y-2">
                  <input
                    value={devName}
                    onChange={(e) => setDevName(e.target.value)}
                    placeholder="Enter name (e.g. Aarav Patil)"
                    className="h-10 w-full rounded-xl border border-kisan-cream-400 px-3 text-sm bg-white/90"
                  />
                  <button className="h-9 w-full rounded-xl bg-kisan-green-600 text-xs font-bold text-white">
                    Enter Prototype Dashboard
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Mobile trust badges — white text */}
          <div className="mt-8 lg:hidden space-y-2.5">
            <p className="text-xs font-bold text-white/90 flex items-center gap-1.5">
              <IconShieldCheck size={17} className="text-kisan-terra-400" />
              Trusted by farmers across Nashik, Pune, Nagpur, &amp; Solapur
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-white/80">
              <div className="flex items-center gap-1.5 rounded-xl bg-white/10 backdrop-blur-sm p-2 border border-white/20">
                <IconCircleCheck size={14} className="text-kisan-green-400 shrink-0" />
                <span>Instant Google OAuth</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl bg-white/10 backdrop-blur-sm p-2 border border-white/20">
                <IconSparkles size={14} className="text-kisan-terra-400 shrink-0" />
                <span>AI Marathi/Hindi advisor</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column — Redesigned Hero Preview Panel with Stacked Cards */}
        <div className="relative animate-fade-in">
          <div className="relative rounded-3xl border border-kisan-cream-400/80 bg-gradient-to-br from-kisan-cream-200/95 via-white/95 to-kisan-cream-100/95 backdrop-blur-md p-6 shadow-elevated overflow-hidden">
            
            {/* Background glowing gradient highlights */}
            <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-gradient-to-br from-kisan-green-100/60 to-kisan-terra-100/40 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-gradient-to-tr from-kisan-ochre-100/60 to-kisan-green-100/30 blur-2xl pointer-events-none" />

            {/* Preview header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-kisan-cream-300/80 mb-5">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-kisan-green-900 uppercase tracking-wider">Live Mandi Board</span>
              </div>
              <span className="text-[11px] font-medium text-kisan-cream-700">Maharashtra APMCs</span>
            </div>

            {/* Layered Stacked Price Cards Deck */}
            <div className="relative space-y-3">
              {/* Primary Anchor Card (Onion) */}
              <div className="relative z-10 rounded-2xl border border-kisan-cream-300 bg-white p-5 shadow-elevated card-lift transition-transform">
                <PriceCard item={{ crop: "Onion", market: "Nashik APMC", price: 4043, unit: "quintal", date: "2026-09-24", source: "APMC Bulletin", previousPrice: 3980, trend: 11.2, history: [3800, 3850, 3920, 3980, 4010, 4030, 4043] }} />
              </div>

              {/* Offset Second Layered Card (Tomato) */}
              <div className="relative z-0 -mt-6 rounded-2xl border border-kisan-cream-300/90 bg-white/95 p-5 shadow-card transform translate-y-2 opacity-95 card-lift transition-transform">
                <PriceCard item={{ crop: "Tomato", market: "Pune APMC", price: 3180, unit: "quintal", date: "2026-09-24", source: "APMC Bulletin", previousPrice: 2840, trend: 11.8, history: [2600, 2700, 2840, 2950, 3050, 3120, 3180] }} />
              </div>
            </div>

            {/* Trust Badges & Value Proposition Callouts — desktop only */}
            <div className="mt-6 border-t border-kisan-cream-300/80 pt-4 space-y-2.5 hidden lg:block">
              <p className="text-xs font-bold text-kisan-green-900 flex items-center gap-1.5">
                <IconShieldCheck size={17} className="text-kisan-terra-500" />
                Trusted by farmers across Nashik, Pune, Nagpur, &amp; Solapur
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-kisan-cream-800">
                <div className="flex items-center gap-1.5 rounded-xl bg-kisan-cream-50/90 p-2 border border-kisan-cream-300/60">
                  <IconCircleCheck size={14} className="text-kisan-green-600 shrink-0" />
                  <span>Instant Google OAuth</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl bg-kisan-cream-50/90 p-2 border border-kisan-cream-300/60">
                  <IconSparkles size={14} className="text-kisan-terra-500 shrink-0" />
                  <span>AI Marathi/Hindi advisor</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </section>
    </main>
  );
}

/* ════════════════════════════════════════
     SCREEN 0.5 — Onboarding Screen (New Google Users)
   ════════════════════════════════════════ */
function OnboardingScreen({ user, onComplete }: { user: User; onComplete: (profile: Profile) => void }) {
  const defaultName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "";
  const [form, setForm] = useState({
    name: defaultName,
    village: "",
    taluka: "",
    district: "",
    preferred_language: "english" as Language,
  });
  const [saving, setSaving] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const newProfile: Profile = {
      id: user.id,
      name: form.name.trim() || "Farmer",
      village: form.village.trim(),
      taluka: form.taluka.trim(),
      district: form.district.trim(),
      preferred_language: form.preferred_language,
      avatar_url: user.user_metadata?.avatar_url || null,
      email: user.email || null,
    };

    if (supabase) {
      const { error } = await supabase.from("profiles").upsert([
        {
          id: user.id,
          name: newProfile.name,
          village: newProfile.village,
          taluka: newProfile.taluka,
          district: newProfile.district,
          preferred_language: newProfile.preferred_language,
          avatar_url: newProfile.avatar_url,
          email: newProfile.email,
          onboarded_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
      if (error) {
        console.error("Error saving profile to Supabase:", error.message);
      }
    } else {
      window.localStorage.setItem("kisansetu-profile", JSON.stringify(newProfile));
    }

    onComplete(newProfile);
    setSaving(false);
  }

  return (
    <main className="min-h-screen bg-kisan-cream-100 text-[#18251b] flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl border border-kisan-cream-400 bg-white p-6 shadow-elevated animate-fade-in">
        <div className="flex items-center gap-3 pb-4 border-b border-kisan-cream-300">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-kisan-green-500 to-kisan-green-700 text-white shadow-btn">
            <IconPlant2 size={24} />
          </span>
          <div>
            <h2 className="text-xl font-bold text-kisan-green-900">Welcome to KisanSetu 🙏</h2>
            <p className="text-xs text-kisan-cream-700">Set up your farm profile to get personalized mandi rates.</p>
          </div>
        </div>

        <form onSubmit={submit} className="mt-5 space-y-4">
          <Field label="Your Name">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Aarav Patil" />
          </Field>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Village"><input value={form.village} onChange={(e) => setForm({ ...form, village: e.target.value })} placeholder="e.g. Niphad" /></Field>
            <Field label="Taluka"><input value={form.taluka} onChange={(e) => setForm({ ...form, taluka: e.target.value })} placeholder="e.g. Niphad" /></Field>
            <Field label="District"><input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} placeholder="e.g. Nashik" /></Field>
          </div>
          <Field label="Preferred Language">
            <LanguageSelect value={form.preferred_language} onChange={(preferred_language) => setForm({ ...form, preferred_language })} />
          </Field>
          <button disabled={saving} className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-kisan-green-500 to-kisan-green-600 text-sm font-bold text-white shadow-btn transition-all hover:shadow-elevated hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60">
            {saving ? "Saving profile…" : "Complete setup & view rates →"}
          </button>
        </form>
      </div>
    </main>
  );
}

/* ════════════════════════════════════════
     SCREEN 1 — Home Dashboard
   ════════════════════════════════════════ */
function Home({ prices, loading, leader, language, go }: { prices: PriceSnapshot[]; loading: boolean; leader?: PriceSnapshot; language: Language; go: (view: View) => void }) {
  const leaderCrop = leader ? translateCrop(leader.crop, language) : "";
  const leaderText = leader
    ? language === "marathi"
      ? <><strong className="text-kisan-green-700">{leaderCrop}</strong> मध्ये आज सर्वात मोठी हालचाल आहे (<strong className="text-kisan-terra-600">{Math.abs(leader.trend).toFixed(1)}%</strong>). विक्री, साठवणूक, खरेदीदार किंवा निव्वळ नफ्याबद्दल विचारा.</>
      : language === "hindi"
      ? <><strong className="text-kisan-green-700">{leaderCrop}</strong> में आज सबसे बड़ा उतार-चढ़ाव है (<strong className="text-kisan-terra-600">{Math.abs(leader.trend).toFixed(1)}%</strong>). बिक्री, भंडारण, खरीदार या शुद्ध मुनाफे के बारे में पूछें।</>
      : <><strong className="text-kisan-green-700">{leader.crop}</strong> has the strongest movement today at <strong className="text-kisan-terra-600">{Math.abs(leader.trend).toFixed(1)}%</strong>. Ask about selling, storage, nearby buyers, or net returns.</>
    : language === "marathi"
    ? "विक्री, साठवणूक, खरेदीदार किंवा निव्वळ नफ्याबद्दल विचारा."
    : language === "hindi"
    ? "बिक्री, भंडारण, खरीदार या शुद्ध मुनाफे के बारे में पूछें।"
    : "Ask about selling, storage, nearby buyers, or net returns.";

  return (
    <div className="space-y-6">
      {/* Hero: AI assistant callout — the ONE hero moment */}
      <Panel accent className="border-kisan-terra-300/50 bg-gradient-to-br from-kisan-terra-50 via-white to-kisan-ochre-50 !p-0 overflow-hidden">
        <div className="flex gap-4 p-5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-kisan-terra-400 to-kisan-terra-600 text-white shadow-btn-terra">
            <IconSparkles size={24} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-[15px] font-bold text-kisan-green-900">{t("Market Assistant", language)}</p>
              <span className="rounded-full bg-kisan-green-50 border border-kisan-green-200 px-2 py-0.5 text-[10px] font-bold text-kisan-green-600 uppercase tracking-wider">AI</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-kisan-cream-800">
              {leaderText}
            </p>
            <button onClick={() => go("advisor")} className="group mt-3 inline-flex items-center gap-1.5 rounded-lg bg-kisan-green-600 px-4 py-2 text-sm font-bold text-white shadow-btn transition-all hover:bg-kisan-green-500 hover:-translate-y-0.5 active:translate-y-0">
              {t("Talk to assistant", language)} <IconChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
        {/* Subtle bottom decorative bar */}
        <div className="h-1 bg-gradient-to-r from-kisan-terra-400 via-kisan-ochre-300 to-kisan-green-400" />
      </Panel>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 lg:gap-4">
        {loading ? (
          <>
            <SkeletonStat />
            <SkeletonStat />
            <SkeletonStat />
          </>
        ) : (
          <>
            <Status icon={<IconChartBar size={16} />} label={t("Market records", language)} value={`${prices.length} ${t("crops", language)}`} color="green" />
            <Status icon={<IconBuildingStore size={16} />} label={t("Buyer requests", language)} value={`12 ${t("open", language)}`} color="terra" />
            <Status icon={<IconCircleCheck size={16} />} label={t("Verified sellers", language)} value={`48 ${t("active", language)}`} color="ochre" />
          </>
        )}
      </div>

      {/* Today's prices */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-lg font-bold text-kisan-green-900">{t("Today's crop prices", language)}</h2>
          <p className="mt-1 text-xs text-kisan-cream-700">{t("Maharashtra weighted market average", language)}</p>
        </div>
        <button onClick={() => go("prices")} className="group flex items-center gap-1 text-sm font-bold text-kisan-green-600 transition hover:text-kisan-green-500">
          {t("All prices", language)} <IconChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {prices.slice(0, 6).map((item) => <PriceCard key={item.crop} item={item} lang={language} />)}
        </div>
      )}

      {/* Quick action cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ActionButton onClick={() => go("market")} icon={<IconBuildingStore size={22} />} title={t("Find a buyer", language)} text={t("Live demand from local traders", language)} actionLabel={t("Open", language)} />
        <ActionButton onClick={() => go("calculator")} icon={<IconCalculator size={22} />} title={t("Net return", language)} text={t("Calculate travel & packing costs", language)} actionLabel={t("Open", language)} />
      </div>
    </div>
  );
}

function Status({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: "green" | "terra" | "ochre" }) {
  const styles = {
    green: "border-kisan-green-100 bg-gradient-to-br from-white to-kisan-green-50 [&_.icon]:text-kisan-green-500 [&_.val]:text-kisan-green-800",
    terra: "border-kisan-terra-100 bg-gradient-to-br from-white to-kisan-terra-50 [&_.icon]:text-kisan-terra-500 [&_.val]:text-kisan-terra-800",
    ochre: "border-kisan-ochre-100 bg-gradient-to-br from-white to-kisan-ochre-50 [&_.icon]:text-kisan-ochre-500 [&_.val]:text-kisan-ochre-700",
  };
  return (
    <div className={`rounded-xl border p-3.5 shadow-card transition hover:shadow-elevated ${styles[color]}`}>
      <div className="flex items-center gap-1.5">
        <span className="icon">{icon}</span>
        <p className="text-[11px] font-medium leading-4 text-kisan-cream-700 uppercase tracking-wide">{label}</p>
      </div>
      <p className="val mt-1.5 text-base font-bold">{value}</p>
    </div>
  );
}

function ActionButton({ onClick, icon, title, text, actionLabel = "Open" }: { onClick: () => void; icon: React.ReactNode; title: string; text: string; actionLabel?: string }) {
  return (
    <button onClick={onClick} className="group card-lift rounded-xl border border-kisan-cream-400 bg-white p-5 text-left shadow-card transition-all hover:border-kisan-terra-300 hover:shadow-elevated">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-kisan-green-50 to-kisan-green-100 text-kisan-green-600 transition group-hover:from-kisan-green-100 group-hover:to-kisan-green-200 group-hover:text-kisan-green-700">
        {icon}
      </span>
      <p className="mt-3 text-[15px] font-bold text-kisan-green-900">{title}</p>
      <p className="mt-1 text-xs leading-4 text-kisan-cream-700">{text}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-kisan-terra-500 opacity-0 transition-opacity group-hover:opacity-100">
        {actionLabel} <IconChevronRight size={13} />
      </span>
    </button>
  );
}


/* ════════════════════════════════════════
     SCREEN 2 — Market Linkage
   ════════════════════════════════════════ */
function Market({ prices, language }: { prices: PriceSnapshot[]; language: Language }) {
  const [mode, setMode] = useState<"buyers" | "sellers" | "list">("buyers");
  const [listings, setListings] = useState<Listing[]>([]);
  const [notice, setNotice] = useState("");
  const availableCrops = Array.from(new Set([...prices.map((p) => p.crop), ...CROPS])).filter(Boolean);
  const [form, setForm] = useState({ farmer_name: "", crop: availableCrops[0] || "Onion", quantity: "", price: "", location: "", phone: "" });

  useEffect(() => {
    fetch("/api/listings")
      .then((r) => r.json())
      .then((data) => setListings(data.listings ?? []))
      .catch(() => setNotice(t("Marketplace data is temporarily unavailable.", language)));
  }, [language]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/listings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await response.json();
    if (!response.ok) { setNotice(data.error ?? "Could not publish the listing."); return; }
    setListings((current) => [data.listing, ...current]);
    setForm({ farmer_name: "", crop: availableCrops[0] || "Onion", quantity: "", price: "", location: "", phone: "" });
    setNotice(t("Listing published for buyers in your region.", language));
    setMode("sellers");
  }

  return (
    <div className="space-y-5">
      <Title title={t("Market linkage", language)} detail={t("Verified buyer demand and farmer supply in one place.", language)} />

      {/* Tabs */}
      <div className="grid grid-cols-3 rounded-xl border border-kisan-cream-400 bg-kisan-cream-200/50 p-1 gap-1">
        <Tab active={mode === "buyers"} onClick={() => setMode("buyers")}>{t("Buyer demand", language)}</Tab>
        <Tab active={mode === "sellers"} onClick={() => setMode("sellers")}>{t("Farmer supply", language)}</Tab>
        <Tab active={mode === "list"} onClick={() => setMode("list")}>{t("List crop", language)}</Tab>
      </div>

      {notice && (
        <div className="flex items-center gap-2 rounded-xl bg-kisan-green-50 border border-kisan-green-200 px-4 py-2.5 text-sm font-medium text-kisan-green-700">
          <IconCircleCheck size={16} />{notice}
        </div>
      )}

      {/* Buyer demand */}
      {mode === "buyers" && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {BUYER_DEMAND.map((demand, idx) => (
            <Panel key={`${demand.buyer}-${idx}`}>
              <div className="flex items-start gap-3">
                <CropBadge crop={demand.crop} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[15px] font-bold text-kisan-green-900">{demand.buyer}</p>
                      <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-kisan-ochre-100 to-kisan-ochre-50 border border-kisan-ochre-200 px-2 py-0.5 text-[10px] font-bold text-kisan-terra-700 uppercase tracking-wide">
                        <IconCircleCheck size={11} />{t("Verified", language)}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xl font-extrabold text-kisan-green-800">{money(demand.offer)}</p>
                      <p className="text-[10px] font-medium text-kisan-cream-700 uppercase">{t("offer / qtl", language)}</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 border-t border-kisan-cream-300 pt-3 text-xs text-kisan-cream-800">
                    <span className="flex items-center gap-1"><IconLeaf size={12} className="text-kisan-green-400" />{translateCrop(demand.crop, language)} · {demand.quantity}</span>
                    <span className="flex items-center gap-1 justify-end"><IconMapPin size={12} className="text-kisan-terra-400" />{demand.location}</span>
                  </div>
                  <button className="group mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-kisan-terra-400 to-kisan-terra-500 text-sm font-bold text-white shadow-btn-terra transition-all hover:shadow-elevated hover:-translate-y-0.5 active:translate-y-0">
                    <IconMessage size={16} />{t("Request buyer contact", language)}
                  </button>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}

      {/* Farmer supply */}
      {mode === "sellers" && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {listings.map((listing) => (
            <Panel key={listing.id}>
              <div className="flex gap-3">
                <CropBadge crop={listing.crop} />
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2">
                    <div>
                      <p className="text-[15px] font-bold text-kisan-green-900">{translateCrop(listing.crop, language)} <span className="font-normal text-kisan-cream-800">{t("from", language)} {listing.farmer_name}</span></p>
                      <span className="mt-1 inline-flex items-center gap-1 text-xs text-kisan-cream-700">
                        <IconMapPin size={12} className="text-kisan-terra-400" />{listing.quantity} {t("qtl", language)} · {listing.location}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-lg font-extrabold text-kisan-green-800">{money(listing.price)}</p>
                      <p className="text-[10px] text-kisan-cream-700">/ {t("qtl", language)}</p>
                    </div>
                  </div>
                  <a href={`https://wa.me/${listing.phone}`} target="_blank" rel="noreferrer" className="mt-3 flex h-10 items-center justify-center gap-2 rounded-xl border-2 border-kisan-green-500 text-sm font-bold text-kisan-green-600 transition-all hover:bg-kisan-green-50 hover:shadow-sm">
                    <IconMessage size={16} />{t("Contact farmer", language)}
                  </a>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}

      {/* List crop form */}
      {mode === "list" && (
        <Panel>
          <form className="space-y-4" onSubmit={submit}>
            <div className="flex items-start gap-3 pb-4 border-b border-kisan-cream-300">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-kisan-green-50 text-kisan-green-600">
                <IconPlus size={20} />
              </span>
              <div>
                <p className="font-bold text-kisan-green-900">{t("Publish your crop", language)}</p>
                <p className="mt-0.5 text-sm text-kisan-cream-700">{t("Available for nearby verified buyers", language)}</p>
              </div>
            </div>
            <Field label={t("Farmer name", language)}><input value={form.farmer_name} onChange={(e) => setForm({ ...form, farmer_name: e.target.value })} /></Field>
            <Field label={t("Crop", language)}>
              <select value={form.crop} onChange={(e) => setForm({ ...form, crop: e.target.value })}>
                {availableCrops.map((item) => <option key={item} value={item}>{translateCrop(item, language)}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label={t("Quantity (qtl)", language)}><input type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></Field>
              <Field label={t("Expected ₹ / qtl", language)}><input type="number" min="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></Field>
            </div>
            <Field label={t("Village / district", language)}><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></Field>
            <Field label={t("WhatsApp number", language)}><input inputMode="numeric" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
            <button className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-kisan-green-500 to-kisan-green-600 text-sm font-bold text-white shadow-btn transition-all hover:shadow-elevated hover:-translate-y-0.5 active:translate-y-0">
              <IconPlus size={17} />{t("Publish crop listing", language)}
            </button>
          </form>
        </Panel>
      )}
    </div>
  );
}


/* ════════════════════════════════════════
     SCREEN 3 — AI Market Advisor
   ════════════════════════════════════════ */
function Advisor({ prices, language, onBack }: { prices: PriceSnapshot[]; language: Language; onBack: () => void }) {
  const availableCrops = Array.from(new Set([...prices.map((p) => p.crop), ...CROPS])).filter(Boolean);
  const [crop, setCrop] = useState(availableCrops[0] || "Onion");
  const [question, setQuestion] = useState("");
  const [waiting, setWaiting] = useState(false);

  const initialGreeting =
    language === "marathi"
      ? "नमस्कार 🙏 मी तुम्हाला बाजारभावाची तुलना करणे, आज विकावे की थांबावे, वाहतूक व साठवण खर्च मोजणे यात मदत करू शकतो."
      : language === "hindi"
      ? "नमस्कार 🙏 मैं आपको मंडियों के भाव की तुलना करने, आज बेचें या प्रतीक्षा करें, तथा शुद्ध मुनाफे का अनुमान लगाने में मदद कर सकता हूँ।"
      : "Namaskar 🙏 I can help you compare prices, decide whether to sell or wait, calculate a likely net return, or find the right market question to ask a buyer.";

  const [messages, setMessages] = useState<Chat[]>([{ role: "assistant", content: initialGreeting }]);
  const selected = prices.find((item) => item.crop === crop) ?? prices[0];

  async function send(text = question) {
    const clean = text.trim();
    if (!clean || !selected || waiting) return;
    const next = [...messages, { role: "user" as const, content: clean }];
    setMessages(next);
    setQuestion("");
    setWaiting(true);
    try {
      const response = await fetch("/api/advise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: getAdvisorSessionId(), crop, price: selected.price, trend: selected.trend, language, question: clean }),
      });
      const data = await response.json();
      const fallbackMsg =
        language === "marathi"
          ? "सध्या उत्तर देता आले नाही. कृपया पुन्हा प्रयत्न करा."
          : language === "hindi"
          ? "वर्तमान में उत्तर नहीं दिया जा सका। कृपया पुनः प्रयास करें।"
          : "I could not answer that just now. Please try again.";
      setMessages((current) => [...current, { role: "assistant", content: data.advice ?? fallbackMsg }]);
    } finally {
      setWaiting(false);
    }
  }

  const quick = [
    t("Should I sell today?", language),
    t("What price should I ask buyers?", language),
    t("Is storage worth the cost?", language),
  ];

  return (
    <div className="max-w-3xl space-y-4">
      <Title title={t("Market assistant", language)} detail={t("Ask about prices, buyers, selling time, storage, or transport.", language)} back={onBack} />

      {/* Crop selector bar */}
      <Panel className="!p-3">
        <div className="flex items-center gap-3">
          <CropBadge crop={crop} size="small" />
          <select value={crop} onChange={(e) => setCrop(e.target.value)} className="h-10 min-w-0 flex-1 rounded-xl border border-kisan-cream-400 bg-white px-3 text-sm font-medium">
            {availableCrops.map((item) => (
              <option key={item} value={item}>{translateCrop(item, language)}</option>
            ))}
          </select>
          {selected && (
            <div className="text-right">
              <span className="text-sm font-bold text-kisan-green-700">{money(selected.price)}</span>
              <span className="block text-[10px] text-kisan-cream-700">/{t("qtl", language)}</span>
            </div>
          )}
        </div>
      </Panel>

      {/* Chat messages */}
      <ChatMessages messages={messages} waiting={waiting} />

      {/* Quick action chips */}
      <div className="flex flex-wrap gap-2">
        {quick.map((item) => (
          <button key={item} onClick={() => send(item)} className="rounded-full border border-kisan-cream-400 bg-white px-3.5 py-2 text-xs font-medium text-kisan-green-700 transition-all hover:border-kisan-terra-300 hover:bg-kisan-terra-50 hover:text-kisan-terra-700 hover:shadow-sm">
            {item}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="flex gap-2 border-t border-kisan-cream-400 pt-4">
        <input value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }} placeholder={t("Ask a market question…", language)} className="h-12 min-w-0 flex-1 rounded-xl border border-kisan-cream-400 bg-white px-4 text-sm transition" />
        <button onClick={() => send()} aria-label="Send question" className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-kisan-green-500 to-kisan-green-600 text-white shadow-btn transition-all hover:shadow-elevated hover:-translate-y-0.5 active:translate-y-0">
          <IconSend size={18} />
        </button>
      </div>

      <p className="text-[11px] leading-4 text-kisan-cream-700">
        {t("Advice is informational. Verify live offers and weigh quality, transport, and storage before you sell.", language)}
      </p>
    </div>
  );
}

function getAdvisorSessionId() {
  const key = "kisansetu-advisor-session";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const created = crypto.randomUUID();
  window.localStorage.setItem(key, created);
  return created;
}

function ChatMessages({ messages, waiting }: { messages: Chat[]; waiting?: boolean }) {
  return (
    <div className="rounded-xl border border-kisan-cream-400 bg-kisan-cream-50 p-4 chat-scroll max-h-[50vh] overflow-y-auto">
      <div className="space-y-3">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
            {message.role === "assistant" && (
              <span className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-kisan-green-400 to-kisan-green-600 text-white shadow-sm">
                <IconSparkles size={13} />
              </span>
            )}
            <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
              message.role === "user"
                ? "rounded-br-md bg-gradient-to-br from-kisan-green-500 to-kisan-green-600 text-white"
                : "rounded-bl-md bg-white border border-kisan-cream-300 text-[#354239]"
            }`}>
              {message.content}
            </div>
          </div>
        ))}
        {waiting && (
          <div className="flex animate-fade-in">
            <span className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-kisan-green-400 to-kisan-green-600 text-white shadow-sm">
              <IconSparkles size={13} />
            </span>
            <div className="rounded-2xl rounded-bl-md bg-white border border-kisan-cream-300 px-4 py-3 shadow-sm">
              <span className="flex items-center gap-1.5">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


/* ════════════════════════════════════════
     SCREEN 4 — SMS Market Service
   ════════════════════════════════════════ */
function Sms({ prices, language }: { prices: PriceSnapshot[]; language: Language }) {
  const [query, setQuery] = useState("ONION");
  const [sent, setSent] = useState(false);
  const found = prices.find((item) => item.crop.toUpperCase() === query.trim().toUpperCase());

  const messages: Chat[] = [
    { role: "user", content: "ONION" },
    { role: "assistant", content: `ONION: ${prices[0] ? `${money(prices.find((item) => item.crop === "Onion")?.price ?? 0)}/quintal. Reply with another crop name.` : "Loading latest record..."}` },
    ...(sent ? [
      { role: "user" as const, content: query },
      { role: "assistant" as const, content: found ? `${found.crop}: ${money(found.price)}/quintal, ${found.trend > 0 ? "up" : found.trend < 0 ? "down" : "flat"} ${Math.abs(found.trend).toFixed(1)}%.` : "No record found. Try ONION, TOMATO, WHEAT, COTTON, SOYBEAN or POTATO." },
    ] : []),
  ];

  return (
    <div className="max-w-3xl space-y-5">
      <Title title={t("SMS market service", language)} detail={t("Farmers can text a crop name to receive one latest price.", language)} />

      {/* SMS simulator */}
      <Panel>
        <ChatMessages messages={messages} />
        <div className="mt-4 flex gap-2 border-t border-kisan-cream-300 pt-4">
          <input value={query} onChange={(e) => setQuery(e.target.value.toUpperCase())} placeholder={t("Type a crop name…", language)} className="h-11 min-w-0 flex-1 rounded-xl border border-kisan-cream-400 bg-white px-3.5 text-sm transition" />
          <button onClick={() => setSent(true)} className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-kisan-green-500 to-kisan-green-600 text-white shadow-btn transition-all hover:shadow-elevated hover:-translate-y-0.5 active:translate-y-0">
            <IconSend size={18} />
          </button>
        </div>
      </Panel>

      {/* Integration status */}
      <Panel>
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-kisan-green-50 text-kisan-green-600">
            <IconCircleCheck size={20} />
          </span>
          <div>
            <p className="font-bold text-kisan-green-900">{t("SMS integration is active", language)}</p>
            <p className="mt-1 text-sm leading-relaxed text-kisan-cream-700">Your Twilio webhook returns a current Supabase price for crop keywords sent to the service number.</p>
          </div>
        </div>
      </Panel>
    </div>
  );
}


/* ════════════════════════════════════════
     SCREEN 5 — Price Board
   ════════════════════════════════════════ */
function Prices({ prices, loading, language }: { prices: PriceSnapshot[]; loading: boolean; language: Language }) {
  return (
    <>
      <Title title={t("Mandi price board", language)} detail={t("Daily prices averaged across reporting markets", language)} />
      {loading ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {prices.map((item) => <PriceCard key={item.crop} item={item} lang={language} />)}
        </div>
      )}
    </>
  );
}


/* ════════════════════════════════════════
     SCREEN 6 — Net Return Calculator
   ════════════════════════════════════════ */
function Calculator({ prices, language, onBack }: { prices: PriceSnapshot[]; language: Language; onBack: () => void }) {
  const availableCrops = Array.from(new Set([...prices.map((p) => p.crop), ...CROPS])).filter(Boolean);
  const [crop, setCrop] = useState(availableCrops[0] || "Onion");
  const [quantity, setQuantity] = useState(10);
  const [distance, setDistance] = useState(25);
  const chosen = prices.find((item) => item.crop === crop);
  const gross = (chosen?.price ?? 0) * quantity;
  const transport = distance * 8;
  const packing = gross * 0.05;
  const net = gross - transport - packing;

  return (
    <div className="max-w-3xl space-y-5">
      <Title title={t("Net return calculator", language)} detail={t("Estimate your sale value before you transport.", language)} back={onBack} />

      {/* Inputs */}
      <Panel>
        <div className="space-y-4">
          <Field label={t("Crop", language)}>
            <select value={crop} onChange={(e) => setCrop(e.target.value)}>
              {availableCrops.map((item) => <option key={item} value={item}>{translateCrop(item, language)}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("Quantity (qtl)", language)}>
              <input type="number" min="0" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
            </Field>
            <Field label={t("Distance (km)", language)}>
              <input type="number" min="0" value={distance} onChange={(e) => setDistance(Number(e.target.value))} />
            </Field>
          </div>
        </div>
      </Panel>

      {/* Result breakdown */}
      <Panel accent className="border-kisan-green-200 bg-gradient-to-br from-white to-kisan-green-50">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-kisan-green-100">
          <IconCalculator size={18} className="text-kisan-green-500" />
          <p className="text-xs font-bold text-kisan-cream-800 uppercase tracking-wide">
            {chosen ? money(chosen.price) : "current price"}/{t("qtl", language)}
          </p>
        </div>
        <div className="space-y-3">
          <Row label={t("Gross sale value", language)} value={money(gross)} />
          <Row label={t("Transport (₹8/km)", language)} value={`−${money(transport)}`} />
          <Row label={t("Packing (5%)", language)} value={`−${money(packing)}`} />
          <div className="flex justify-between border-t border-kisan-green-200 pt-3">
            <span className="text-base font-bold text-kisan-green-900">{t("Expected net return", language)}</span>
            <span className="font-mono text-xl font-extrabold text-kisan-green-600">{money(net)}</span>
          </div>
        </div>
      </Panel>
    </div>
  );
}


/* ════════════════════════════════════════
     SCREEN 7 — Profile (Connected to Supabase)
   ════════════════════════════════════════ */
function ProfileScreen({ profile, language, onSave, onLogout }: { profile: Profile; language: Language; onSave: (profile: Profile) => void; onLogout: () => void }) {
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true);

    if (supabase && profile.id) {
      const { error } = await supabase.from("profiles").update({
        name: form.name.trim(),
        village: form.village.trim(),
        taluka: form.taluka.trim(),
        district: form.district.trim(),
        preferred_language: form.preferred_language,
        updated_at: new Date().toISOString(),
      }).eq("id", profile.id);

      if (error) {
        console.error("Error updating profile in Supabase:", error.message);
      }
    } else {
      window.localStorage.setItem("kisansetu-profile", JSON.stringify(form));
    }

    onSave(form);
    setSaved(true);
    setSaving(false);
  }

  return (
    <div className="max-w-2xl">
      <Title title={t("Profile", language)} detail={t("Manage your KisanSetu farm profile & language preferences.", language)} />
      <Panel>
        <form onSubmit={save} className="space-y-5">
          {/* Avatar / name header */}
          <div className="flex items-center gap-4 pb-4 border-b border-kisan-cream-300">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.name} className="h-16 w-16 rounded-2xl object-cover border-2 border-kisan-green-400 shadow-card" />
            ) : (
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-kisan-green-50 to-kisan-green-100 text-kisan-green-600 shadow-card">
                <IconUserCircle size={40} />
              </span>
            )}
            <div>
              <p className="text-lg font-bold text-kisan-green-900">{profile.name}</p>
              <p className="text-xs text-kisan-cream-700">
                {profile.email ? profile.email : t("Verified Farm Account", language)}
              </p>
            </div>
          </div>

          <Field label={t("Name", language)}><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label={t("Village", language)}><input value={form.village} onChange={(e) => setForm({ ...form, village: e.target.value })} /></Field>
            <Field label={t("Taluka", language)}><input value={form.taluka} onChange={(e) => setForm({ ...form, taluka: e.target.value })} /></Field>
            <Field label={t("District", language)}><input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} /></Field>
          </div>
          <Field label={t("Language", language)}><LanguageSelect value={form.preferred_language} onChange={(preferred_language) => setForm({ ...form, preferred_language })} /></Field>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button disabled={saving} className="flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-kisan-green-500 to-kisan-green-600 px-5 text-sm font-bold text-white shadow-btn transition-all hover:shadow-elevated hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60">
              {saving ? t("Saving…", language) : t("Save profile", language)}
            </button>
            <button type="button" onClick={onLogout} className="flex h-11 items-center gap-2 rounded-xl border-2 border-kisan-cream-400 px-4 text-sm font-bold text-kisan-cream-800 transition hover:border-red-300 hover:text-red-600">
              <IconLogout size={17} />{t("Logout", language)}
            </button>
            {saved && (
              <span className="flex items-center gap-1 text-sm font-bold text-kisan-green-600 animate-fade-in">
                <IconCircleCheck size={16} />{t("Saved", language)}
              </span>
            )}
          </div>
        </form>
      </Panel>
    </div>
  );
}


/* ─── Data transform & Trend Calculation ─── */
function toCropPrices(rows: Array<Record<string, unknown>>): PriceSnapshot[] {
  if (!rows || rows.length === 0) return [];

  // If already formatted PriceSnapshot from /api/prices
  if (rows[0] && Array.isArray(rows[0].history) && typeof rows[0].price === "number") {
    return rows as unknown as PriceSnapshot[];
  }

  const groups = new Map<string, Array<Record<string, unknown>>>();
  for (const row of rows) {
    const crop = String(row.crop || "").trim();
    if (!crop) continue;
    groups.set(crop, [...(groups.get(crop) ?? []), row]);
  }

  return [...groups.entries()].map(([crop, records]) => {
    const dayMap = new Map<string, Array<Record<string, unknown>>>();
    for (const row of records) {
      const date = String(row.date || "");
      if (!date) continue;
      dayMap.set(date, [...(dayMap.get(date) ?? []), row]);
    }

    // Sort dates descending: newest first
    const sortedDates = [...dayMap.keys()].sort((a, b) => b.localeCompare(a));
    const mean = (items: Array<Record<string, unknown>>) =>
      items.reduce((total, item) => total + Number(item.price || 0), 0) / (items.length || 1);

    const dailyAverages = sortedDates.map((date) => ({
      date,
      avg: Math.round(mean(dayMap.get(date) ?? [])),
    }));

    const latest = dailyAverages[0]?.date ?? new Date().toISOString().split("T")[0];
    const price = dailyAverages[0]?.avg ?? 0;
    const previousPrice = dailyAverages.length > 1 ? dailyAverages[1].avg : null;

    let trend = 0;
    if (previousPrice !== null && previousPrice > 0) {
      trend = Number((((price - previousPrice) / previousPrice) * 100).toFixed(1));
    }

    // Oldest to newest for sparkline (up to 7 days)
    const history = dailyAverages.slice(0, 7).reverse().map((d) => d.avg);

    const firstRow = records[0] ?? {};
    return {
      crop,
      market: "Maharashtra APMC avg",
      price,
      unit: String(firstRow.unit ?? "quintal"),
      date: latest,
      source: String(firstRow.source ?? "Agmarknet (data.gov.in)"),
      previousPrice,
      trend,
      history: history.length > 0 ? history : [price],
    };
  });
}
