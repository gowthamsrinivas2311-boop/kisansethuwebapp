"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  IconArrowLeft, IconBulb, IconBuildingStore, IconCalculator, IconChartBar,
  IconChevronRight, IconHome, IconMapPin, IconMessage, IconPlant2,
  IconPlus, IconSend, IconTrendingDown, IconTrendingUp, IconUserCircle,
} from "@tabler/icons-react";
import { CROPS, MARKETS } from "@/lib/demo-data";
import type { Language, Listing, PriceSnapshot } from "@/lib/types";

type View = "home" | "prices" | "market" | "sms" | "calculator" | "advisor";

const copy = {
  english: { greeting: "Good morning", prices: "Today’s prices", advisor: "AI advisor", calculate: "Calculate net profit", market: "Marketplace", sms: "SMS prices", ask: "Ask AI advisor", list: "List my crop", farmer: "Farmer", buyer: "Buyer", net: "Net profit", source: "Latest APMC price" },
  hindi: { greeting: "सुप्रभात", prices: "आज के भाव", advisor: "AI सलाहकार", calculate: "शुद्ध लाभ जानें", market: "बाज़ार", sms: "SMS भाव", ask: "AI सलाहकार से पूछें", list: "फसल सूचीबद्ध करें", farmer: "किसान", buyer: "खरीदार", net: "शुद्ध लाभ", source: "नवीनतम APMC भाव" },
  marathi: { greeting: "शुभ सकाळ", prices: "आजचे भाव", advisor: "AI सल्लागार", calculate: "निव्वळ नफा मोजा", market: "बाजारपेठ", sms: "SMS भाव", ask: "AI सल्लागाराला विचारा", list: "पीक नोंदवा", farmer: "शेतकरी", buyer: "खरेदीदार", net: "निव्वळ नफा", source: "नवीनतम APMC दर" },
} as const;

type Copy = (typeof copy)[Language];

const money = (value: number) => `Rs ${Math.round(value).toLocaleString("en-IN")}`;

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-xl border border-slate-200 bg-white p-4 ${className}`}>{children}</section>;
}

function CropMark({ crop }: { crop: string }) {
  return <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-green-200 bg-green-50 text-green-700"><IconPlant2 size={21} stroke={1.7} /><span className="sr-only">{crop}</span></span>;
}

function PriceRow({ item, compact = false }: { item: PriceSnapshot; compact?: boolean }) {
  const rising = item.trend >= 0;
  return <div className={`flex items-center gap-3 ${compact ? "py-2" : "py-3"}`}>
    <CropMark crop={item.crop} />
    <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-slate-900">{item.crop}</p><p className="mt-0.5 truncate text-xs text-slate-500">{item.market}</p></div>
    <div className="text-right"><p className="text-sm font-medium text-slate-900">{money(item.price)}</p><p className="mt-0.5 text-xs text-slate-500">per {item.unit}</p></div>
    <span className={`flex w-12 items-center justify-end gap-0.5 text-xs font-medium ${rising ? "text-green-700" : "text-red-600"}`}>{rising ? <IconTrendingUp size={15} /> : <IconTrendingDown size={15} />}{Math.abs(item.trend)}%</span>
  </div>;
}

export function KisanSetuApp() {
  const [view, setView] = useState<View>("home");
  const [language, setLanguage] = useState<Language>("english");
  const [prices, setPrices] = useState<PriceSnapshot[]>([]);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const t = copy[language];

  useEffect(() => {
    fetch("/api/prices").then((response) => response.json()).then((data) => setPrices(toPriceSnapshots(Array.isArray(data) ? data : data.prices ?? []))).catch(() => undefined).finally(() => setLoadingPrices(false));
  }, []);

  const topCrop = useMemo(() => [...prices].sort((a, b) => b.trend - a.trend)[0] ?? null, [prices]);
  const goHome = () => setView("home");

  return <main className="mx-auto min-h-screen max-w-xl bg-[#f7f8f7] pb-24 text-slate-900">
    <header className="border-b border-slate-200 bg-white px-5 py-4">
      <div className="flex items-center justify-between gap-3">
        <div><p className="text-sm text-slate-500">{t.greeting},</p><h1 className="mt-0.5 text-lg font-medium">Aarav Patil</h1><p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><IconMapPin size={13} /> Nashik, Maharashtra</p></div>
        <div className="flex items-center gap-2"><select aria-label="Language" value={language} onChange={(event) => setLanguage(event.target.value as Language)} className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-600"><option value="english">EN</option><option value="hindi">HI</option><option value="marathi">MR</option></select><IconUserCircle size={35} className="text-slate-500" stroke={1.5} /></div>
      </div>
    </header>

    <div className="px-4 py-5">
      {view === "home" && <Dashboard prices={prices} loading={loadingPrices} topCrop={topCrop} t={t} setView={setView} />}
      {view === "prices" && <PricesView prices={prices} loading={loadingPrices} t={t} />}
      {view === "calculator" && <Calculator prices={prices} t={t} onBack={goHome} />}
      {view === "advisor" && <Advisor prices={prices} language={language} t={t} onBack={goHome} />}
      {view === "market" && <Market />}
      {view === "sms" && <SmsView prices={prices} />}
    </div>

    <nav aria-label="Main navigation" className="fixed bottom-0 left-0 right-0 z-10 border-t border-slate-200 bg-white"><div className="mx-auto grid max-w-xl grid-cols-4">
      <NavButton label="Home" active={view === "home"} onClick={() => setView("home")} icon={<IconHome size={20} stroke={1.6} />} />
      <NavButton label="Prices" active={view === "prices"} onClick={() => setView("prices")} icon={<IconChartBar size={20} stroke={1.6} />} />
      <NavButton label="Market" active={view === "market"} onClick={() => setView("market")} icon={<IconBuildingStore size={20} stroke={1.6} />} />
      <NavButton label="SMS" active={view === "sms"} onClick={() => setView("sms")} icon={<IconMessage size={20} stroke={1.6} />} />
    </div></nav>
  </main>;
}

function NavButton({ label, active, onClick, icon }: { label: string; active: boolean; onClick: () => void; icon: React.ReactNode }) {
  return <button onClick={onClick} className={`flex h-16 flex-col items-center justify-center gap-1 text-xs ${active ? "text-green-700" : "text-slate-500"}`}>{icon}<span>{label}</span></button>;
}

function toPriceSnapshots(rows: Array<Record<string, unknown>>): PriceSnapshot[] {
  const groups = new Map<string, Array<Record<string, unknown>>>();
  for (const row of rows) {
    const key = String(row.crop);
    groups.set(key, [...(groups.get(key) ?? []), row]);
  }
  return [...groups.entries()].map(([crop, group]) => {
    const days = new Map<string, Array<Record<string, unknown>>>();
    for (const row of group) {
      const date = String(row.date);
      days.set(date, [...(days.get(date) ?? []), row]);
    }
    const [currentDate, previousDate] = [...days.keys()].sort((a, b) => b.localeCompare(a));
    const current = days.get(currentDate) ?? [];
    const previous = previousDate ? days.get(previousDate) ?? [] : [];
    const average = (items: Array<Record<string, unknown>>) => items.reduce((sum, item) => sum + Number(item.price), 0) / items.length;
    const price = average(current);
    const previousPrice = previous.length ? average(previous) : null;
    return {
      crop, market: "Maharashtra market average", price,
      unit: String(current[0]?.unit ?? "quintal"), date: currentDate, source: String(current[0]?.source ?? "data.gov.in"),
      previousPrice, trend: previousPrice ? Number((((price - previousPrice) / previousPrice) * 100).toFixed(1)) : 0,
    };
  });
}

function Dashboard({ prices, loading, topCrop, t, setView }: { prices: PriceSnapshot[]; loading: boolean; topCrop: PriceSnapshot | null; t: Copy; setView: (view: View) => void }) {
  return <div className="space-y-4">
    <div className="flex items-center justify-between"><div><h2 className="text-base font-medium">{t.prices}</h2><p className="mt-1 text-xs text-slate-500">{t.source}</p></div><button onClick={() => setView("prices")} className="flex items-center gap-1 text-sm text-blue-700">View all <IconChevronRight size={16} /></button></div>
    {loading ? <Card><p className="py-4 text-sm text-slate-500">Loading market prices...</p></Card> : <div className="grid gap-3">{prices.map((item) => <Card key={item.crop}><PriceRow item={item} compact /></Card>)}</div>}
    <Card className="border-blue-200"><div className="flex gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-700"><IconBulb size={21} stroke={1.7} /></span><div className="min-w-0 flex-1"><div className="flex items-center justify-between"><h2 className="text-sm font-medium text-slate-900">{t.advisor}</h2><span className="text-xs text-blue-700">{topCrop ? topCrop.crop : ""}</span></div><p className="mt-1 text-sm leading-5 text-slate-600">{topCrop ? `${topCrop.crop} is up ${topCrop.trend}%. Compare nearby market offers before deciding your selling quantity.` : "Get a practical crop-selling recommendation in your language."}</p><button onClick={() => setView("advisor")} className="mt-3 text-sm font-medium text-blue-700">{t.ask}</button></div></div></Card>
    <button onClick={() => setView("calculator")} className="flex w-full items-center justify-center gap-2 rounded-xl border border-green-700 bg-green-700 px-4 py-3.5 text-sm font-medium text-white"><IconCalculator size={20} stroke={1.7} />{t.calculate}</button>
  </div>;
}

function PricesView({ prices, loading, t }: { prices: PriceSnapshot[]; loading: boolean; t: Copy }) {
  return <div className="space-y-4"><div><h2 className="text-base font-medium">{t.prices}</h2><p className="mt-1 text-xs text-slate-500">Updated 10 Sep 2026 from APMC reports</p></div><Card>{loading ? <p className="py-4 text-sm text-slate-500">Loading market prices...</p> : <div className="divide-y divide-slate-100">{prices.map((item) => <PriceRow item={item} key={`${item.crop}-${item.market}`} />)}</div>}</Card></div>;
}

function BackTitle({ title, onBack }: { title: string; onBack: () => void }) { return <div className="flex items-center gap-3"><button aria-label="Back" onClick={onBack} className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700"><IconArrowLeft size={19} /></button><h2 className="text-base font-medium">{title}</h2></div>; }

function Calculator({ prices, t, onBack }: { prices: PriceSnapshot[]; t: Copy; onBack: () => void }) {
  const [crop, setCrop] = useState("Onion"); const [quantity, setQuantity] = useState(10); const [market, setMarket] = useState("Nashik APMC"); const [distance, setDistance] = useState(25);
  const chosen = prices.find((item) => item.crop === crop && item.market === market) ?? prices.find((item) => item.crop === crop) ?? { price: 0 } as PriceSnapshot;
  const gross = chosen.price * quantity; const transport = distance * 8; const packaging = gross * 0.05; const net = gross - transport - packaging;
  return <div className="space-y-4"><BackTitle title={t.calculate} onBack={onBack} /><Card><div className="space-y-4"><Field label="Crop"><select value={crop} onChange={(e) => setCrop(e.target.value)}>{CROPS.map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Quantity (qtl)"><input type="number" min="0" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} /></Field><Field label="Market"><select value={market} onChange={(e) => setMarket(e.target.value)}>{MARKETS.map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Distance (km)"><input type="number" min="0" value={distance} onChange={(e) => setDistance(Number(e.target.value))} /></Field></div></Card><Card><p className="text-xs text-slate-500">Market price used</p><p className="mt-1 text-lg font-medium">{money(chosen.price)} <span className="text-sm font-normal text-slate-500">per quintal</span></p><div className="mt-4 space-y-3 border-t border-slate-100 pt-4 text-sm"><Line label="Gross value" value={money(gross)} /><Line label="Transport (Rs 8/km)" value={`-${money(transport)}`} /><Line label="Packaging (5% gross)" value={`-${money(packaging)}`} /><div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-medium"><span>{t.net}</span><span className="text-green-700">{money(net)}</span></div></div></Card></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block text-sm text-slate-700"><span className="mb-1.5 block">{label}</span>{children && <span className="block [&_input]:h-11 [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-slate-200 [&_input]:bg-white [&_input]:px-3 [&_select]:h-11 [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-slate-200 [&_select]:bg-white [&_select]:px-3">{children}</span>}</label>; }
function Line({ label, value }: { label: string; value: string }) { return <div className="flex justify-between text-slate-600"><span>{label}</span><span>{value}</span></div>; }

function Advisor({ prices, language, t, onBack }: { prices: PriceSnapshot[]; language: Language; t: Copy; onBack: () => void }) {
  const [crop, setCrop] = useState("Onion"); const [advice, setAdvice] = useState(""); const [pending, setPending] = useState(false);
  const selected = prices.find((item) => item.crop === crop) ?? prices[0];
  async function ask() {
    if (!selected) return;
    setPending(true);
    try { const response = await fetch("/api/advise", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ crop, price: selected.price, trend: selected.trend, language }) }); const data = await response.json(); setAdvice(data.advice ?? "Unable to get advice right now."); } finally { setPending(false); }
  }
  return <div className="space-y-4"><BackTitle title={t.advisor} onBack={onBack} /><Card><p className="text-xs text-slate-500">Choose a crop for a practical selling recommendation.</p><div className="mt-3 flex gap-2"><select value={crop} onChange={(e) => setCrop(e.target.value)} className="h-11 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm">{CROPS.map((item) => <option key={item}>{item}</option>)}</select><button onClick={ask} disabled={pending || !selected} className="rounded-lg border border-blue-700 bg-blue-700 px-3 text-sm font-medium text-white disabled:opacity-60">{pending ? "Thinking..." : t.ask}</button></div></Card><div className="space-y-3"><div className="flex justify-end"><div className="max-w-[84%] rounded-xl rounded-br-sm border border-green-200 bg-green-50 px-3 py-2.5 text-sm leading-5 text-slate-700">What should I do with {crop} today?</div></div>{advice ? <div className="flex gap-2"><span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-700"><IconBulb size={15} /></span><div className="max-w-[84%] rounded-xl rounded-tl-sm border border-blue-200 bg-white px-3 py-2.5 text-sm leading-5 text-slate-700">{advice}</div></div> : <div className="flex gap-2"><span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-700"><IconBulb size={15} /></span><div className="max-w-[84%] rounded-xl rounded-tl-sm border border-slate-200 bg-white px-3 py-2.5 text-sm leading-5 text-slate-500">Select a crop, then ask for advice in {language}.</div></div>}</div></div>;
}

function Market() {
  const [mode, setMode] = useState<"buyer" | "farmer">("buyer"); const [listings, setListings] = useState<Listing[]>([]); const [status, setStatus] = useState("");
  const [form, setForm] = useState({ farmer_name: "", crop: "Onion", quantity: "", price: "", location: "", phone: "" });
  useEffect(() => { fetch("/api/listings").then((r) => r.json()).then((data) => setListings(data.listings ?? [])).catch(() => setStatus("Listings are unavailable right now.")); }, []);
  async function submit(event: FormEvent) {
    event.preventDefault(); setStatus("");
    const response = await fetch("/api/listings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); const data = await response.json();
    if (!response.ok) { setStatus(data.error ?? "Could not add your listing."); return; }
    setListings((current) => [data.listing, ...current]); setForm({ farmer_name: "", crop: "Onion", quantity: "", price: "", location: "", phone: "" }); setStatus("Your crop is listed in the marketplace."); setMode("buyer");
  }
  return <div className="space-y-4"><div><h2 className="text-base font-medium">Marketplace</h2><p className="mt-1 text-xs text-slate-500">Connect directly with farmers and buyers.</p></div><div className="grid grid-cols-2 rounded-lg border border-slate-200 bg-white p-1"><button onClick={() => setMode("buyer")} className={`h-9 rounded-md text-sm ${mode === "buyer" ? "bg-slate-900 text-white" : "text-slate-600"}`}>Buyer</button><button onClick={() => setMode("farmer")} className={`h-9 rounded-md text-sm ${mode === "farmer" ? "bg-slate-900 text-white" : "text-slate-600"}`}>Farmer</button></div>{status && <p className={`text-sm ${status.startsWith("Your") ? "text-green-700" : "text-red-600"}`}>{status}</p>}{mode === "buyer" ? <div className="space-y-3">{listings.map((listing) => <Card key={listing.id}><div className="flex gap-3"><CropMark crop={listing.crop} /><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div><p className="font-medium">{listing.crop}</p><p className="mt-1 text-xs text-slate-500">{listing.quantity} qtl · {listing.location}</p></div><p className="text-sm font-medium">{money(listing.price)}<span className="block text-right text-xs font-normal text-slate-500">/ qtl</span></p></div><a href={`https://wa.me/${listing.phone}`} target="_blank" rel="noreferrer" className="mt-3 flex h-10 items-center justify-center gap-2 rounded-lg border border-green-700 text-sm font-medium text-green-700"><IconMessage size={17} />Contact via WhatsApp</a></div></div></Card>)}</div> : <Card><form className="space-y-4" onSubmit={submit}><p className="text-sm text-slate-600">Make your crop available to verified local buyers.</p><Field label="Your name"><input value={form.farmer_name} onChange={(e) => setForm({ ...form, farmer_name: e.target.value })} placeholder="Farmer name" /></Field><Field label="Crop"><select value={form.crop} onChange={(e) => setForm({ ...form, crop: e.target.value })}>{CROPS.map((item) => <option key={item}>{item}</option>)}</select></Field><div className="grid grid-cols-2 gap-3"><Field label="Quantity (qtl)"><input type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></Field><Field label="Expected price / qtl"><input type="number" min="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></Field></div><Field label="Location"><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Village, district" /></Field><Field label="WhatsApp number"><input inputMode="numeric" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="91XXXXXXXXXX" /></Field><button className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-green-700 bg-green-700 text-sm font-medium text-white"><IconPlus size={18} />List my crop</button></form></Card>}</div>;
}

function SmsView({ prices }: { prices: PriceSnapshot[] }) {
  const [message, setMessage] = useState("ONION"); const [reply, setReply] = useState("");
  const onion = prices.find((item) => item.crop === "Onion");
  function send() { const crop = CROPS.find((item) => message.toLowerCase().includes(item.toLowerCase())); const price = prices.find((item) => item.crop === crop) ?? onion; setReply(price ? `${price.crop}: ${money(price.price)}/${price.unit} at ${price.market}. Trend ${price.trend >= 0 ? "+" : ""}${price.trend}%.` : "Send ONION, TOMATO, WHEAT, COTTON, SOYBEAN, or POTATO."); }
  return <div className="space-y-4"><div><h2 className="text-base font-medium">SMS price service</h2><p className="mt-1 text-xs text-slate-500">Text a crop name for the latest available market price.</p></div><Card className="space-y-4"><div className="flex justify-end"><p className="rounded-xl rounded-br-sm border border-green-200 bg-green-50 px-3 py-2 text-sm">ONION</p></div><div className="flex"><p className="max-w-[88%] rounded-xl rounded-tl-sm border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-5">{onion ? `ONION: ${money(onion.price)}/quintal at ${onion.market}. Trend +${onion.trend}%.` : "Loading latest Onion price..."}</p></div>{reply && <><div className="flex justify-end"><p className="rounded-xl rounded-br-sm border border-green-200 bg-green-50 px-3 py-2 text-sm">{message}</p></div><div className="flex"><p className="max-w-[88%] rounded-xl rounded-tl-sm border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-5">{reply}</p></div></>}<div className="flex gap-2 border-t border-slate-100 pt-4"><input value={message} onChange={(e) => setMessage(e.target.value.toUpperCase())} className="h-11 min-w-0 flex-1 rounded-lg border border-slate-200 px-3 text-sm" placeholder="Type crop name" /><button onClick={send} aria-label="Send SMS request" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-blue-700 bg-blue-700 text-white"><IconSend size={18} /></button></div></Card><Card><p className="text-sm font-medium">Twilio webhook ready</p><p className="mt-1 text-sm leading-5 text-slate-600">Point your Twilio number’s incoming-message URL to <span className="font-medium text-slate-800">/api/sms-webhook</span>. It accepts crop keywords and returns TwiML.</p></Card></div>;
}
