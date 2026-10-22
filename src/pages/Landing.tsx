import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import {
  SITE,
  NAV_LINKS,
  USPS,
  SITE_SERVICES,
  SITE_REVIEWS,
  CLIENTS_STRIP,
  SITE_FAQS,
  HOW_STEPS,
  FURNITURE_SIZES,
  CITIES,
} from "@contracts/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import {
  Truck,
  Phone,
  MessageCircle,
  Menu,
  Star,
  ShieldCheck,
  Wrench,
  Package,
  Route,
  Warehouse,
  ArrowUpFromLine,
  BadgePercent,
  Users,
  MapPin,
  Clock,
  Mail,
  CheckCircle2,
  Loader2,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";

const SERVICE_ICONS: Record<string, typeof Wrench> = {
  wrench: Wrench,
  package: Package,
  truck: Truck,
  route: Route,
  crane: ArrowUpFromLine,
  warehouse: Warehouse,
};

const USP_ICONS = [Truck, Users, ShieldCheck, BadgePercent];

const HERO_STATS = [
  { value: "24/7", label: "خدمة العملاء" },
  { value: "+13", label: "منطقة مغطاة بالمملكة" },
  { value: "100%", label: "ضمان الجودة" },
];

const waLink = `https://wa.me/${SITE.whatsapp}`;
const telLink = `tel:${SITE.phone}`;

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Services />
      <About />
      <WhyUs />
      <HowWeWork />
      <Fleet />
      <Reviews />
      <ClientsStrip />
      <QuoteForm />
      <Faq />
      <Footer />
      {/* زر واتساب عائم */}
      <a
        href={waLink}
        target="_blank"
        rel="noreferrer"
        aria-label="تواصل عبر واتساب"
        className="fixed bottom-5 left-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-xl transition-transform hover:scale-110"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-3 px-4">
        <a href="#hero" className="flex items-center gap-2.5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-400 text-white shadow-lg shadow-red-400/30">
            <Truck className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-black text-white">{SITE.name}</span>
            <span className="block text-[11px] font-medium text-slate-300">
              لنقل العفش والأثاث — القصيم وجميع أنحاء المملكة
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-bold text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={telLink}
            className="hidden min-h-[44px] items-center gap-2 rounded-xl bg-red-400 px-5 text-sm font-black text-red-950 shadow-lg shadow-red-400/30 transition-colors hover:bg-red-500 sm:flex"
          >
            <Phone className="h-4 w-4" />
            اتصل الآن
          </a>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="فتح القائمة"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">القائمة الرئيسية</SheetTitle>
              <nav className="mt-8 flex flex-col gap-1">
                {NAV_LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-[48px] items-center rounded-lg px-4 text-base font-bold text-slate-700 hover:bg-slate-100"
                  >
                    {l.label}
                  </a>
                ))}
                <a
                  href={telLink}
                  onClick={() => setOpen(false)}
                  className="mt-3 flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-red-400 font-black text-red-950"
                >
                  <Phone className="h-4 w-4" />
                  اتصل الآن
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="hero" className="relative flex min-h-[92vh] items-center overflow-hidden bg-navy text-white">
      <div className="absolute inset-0">
        <img
          src="/images/wrapping.jpg"
          alt="فنيون محترفون يغلفون الأثاث بتغليف محكم داخل منزل — شركة التابل بالقصيم"
          className="h-full w-full object-cover"
        />
      </div>
      <Header />
      <div className="relative mx-auto w-full max-w-4xl px-4 pb-16 pt-28 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-bold text-slate-100 ring-1 ring-white/20 backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-red-400" />
          أفضل شركة نقل أثاث ببريدة
        </span>
        <h1 className="mt-5 text-3xl font-black leading-snug sm:text-5xl sm:leading-tight">
          نقل أثاثك بأمان
          <br />
          <span className="text-red-300">في جميع أنحاء المملكة</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
          خدمات نقل وفك وتركيب الأثاث الاحترافية بتركيز خاص على بريدة وجميع مدن القصيم،
          وتغطية شاملة تصل لجميع أنحاء المملكة. فريق محترف، أرخص الأسعار، وضمان كامل على
          جميع المنقولات.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="#quote"
            className="flex min-h-[52px] items-center gap-2 rounded-xl bg-red-400 px-7 text-base font-black text-red-950 shadow-xl shadow-red-400/30 transition-all hover:scale-105 hover:bg-red-500"
          >
            احصل على عرض سعر مجاني
            <ChevronLeft className="h-5 w-5" />
          </a>
          <a
            href={telLink}
            className="flex min-h-[52px] items-center gap-2 rounded-xl border-2 border-white/30 px-7 text-base font-black text-white backdrop-blur transition-colors hover:bg-white/10"
          >
            <Phone className="h-5 w-5" />
            اتصل بنا الآن
          </a>
        </div>
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-3 sm:gap-4">
          {HERO_STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/15 bg-white/10 px-3 py-3 backdrop-blur"
            >
              <div className="text-xl font-black text-red-300 sm:text-2xl">{s.value}</div>
              <div className="mt-0.5 text-[11px] font-bold text-slate-300 sm:text-xs">{s.label}</div>
            </div>
          ))}
        </div>
        <a
          href="#services"
          aria-label="انتقل إلى الخدمات"
          className="mx-auto mt-8 flex h-10 w-10 animate-bounce items-center justify-center rounded-full border border-white/20 text-white/70"
        >
          <ChevronDown className="h-5 w-5" />
        </a>
      </div>
    </section>
  );
}

function SectionHead({ tag, title, desc }: { tag: string; title: string; desc?: string }) {
  return (
    <div className="text-center">
      <span className="inline-block rounded-full bg-red-50 px-4 py-1 text-sm font-black text-red-800">
        {tag}
      </span>
      <h2 className="mt-3 text-2xl font-black text-navy sm:text-3xl">{title}</h2>
      {desc && <p className="mx-auto mt-3 max-w-xl text-slate-500">{desc}</p>}
    </div>
  );
}

function Services() {
  return (
    <section id="services" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
      <SectionHead
        tag="خدماتنا المتميزة"
        title="خدمات شاملة من الباب إلى الباب"
        desc="نقدم مجموعة متكاملة من خدمات نقل وتركيب الأثاث لتلبية جميع احتياجاتك"
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SITE_SERVICES.map((s) => {
          const Icon = SERVICE_ICONS[s.icon] ?? Wrench;
          return (
            <div
              key={s.title}
              className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-red-200 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-800 transition-colors group-hover:bg-red-400 group-hover:text-white">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-3 text-base font-black text-navy sm:text-lg">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="scroll-mt-20 bg-slate-50 py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2">
        <div>
          <span className="inline-block rounded-full bg-red-50 px-4 py-1 text-sm font-black text-red-800">
            عن الشركة
          </span>
          <h2 className="mt-3 text-2xl font-black text-navy sm:text-3xl">
            التابل.. خبرة تتحرك معك
          </h2>
          <p className="mt-4 leading-loose text-slate-600">
            منذ أكثر من عشر سنوات ونحن في <strong>شركة التابل</strong> ننقل بيوت أهل القصيم
            وذكرياتهم بعناية فائقة. نؤمن أن العفش ليس مجرد قطع خشبية، بل قيمة وذكريات تستحق
            الحماية؛ لذلك نلتزم بالدقة في المواعيد، ونهتم بأدق التفاصيل — من أول مسمار يُفك
            حتى آخر قطعة تُرتّب في منزلك الجديد.
          </p>
          <ul className="mt-5 space-y-2.5">
            {[
              "فريق عمل بخبرة طويلة وبزي موحد وأدوات حديثة",
              "التزام كامل بالمواعيد المتفق عليها",
              "عروض أسعار شفافة بدون رسوم مخفية",
              "خدمة عملاء ترد عليك خلال دقائق",
            ].map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-red-300" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <img
            src="/images/wrapping.jpg"
            alt="فنيون محترفون يغلفون الأثاث بتغليف محكم داخل منزل — شركة التابل بالقصيم"
            className="w-full rounded-2xl object-cover shadow-2xl"
            loading="lazy"
          />
          <div className="absolute -bottom-5 right-5 rounded-2xl bg-red-400 px-5 py-3 text-white shadow-xl shadow-red-400/40">
            <div className="text-2xl font-black">+10 سنوات</div>
            <div className="text-xs font-bold">خبرة في نقل العفش بالقصيم</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  return (
    <section id="why" className="scroll-mt-20 bg-navy py-16 text-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-black text-red-300 ring-1 ring-white/15">
            لماذا نحن
          </span>
          <h2 className="mt-3 text-2xl font-black sm:text-3xl">مميزات تجعلنا خيارك الأول</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">
            أربعة أسباب تجعل أهل القصيم يثقون بالتابل في كل نقلة
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {USPS.map((u, i) => {
            const Icon = USP_ICONS[i];
            return (
              <div
                key={u.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition-colors hover:border-red-300/40"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-400 text-white shadow-lg shadow-red-400/30">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-base font-black">{u.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{u.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HowWeWork() {
  return (
    <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
      <SectionHead
        tag="كيف نعمل"
        title="نقلتك في أربع خطوات بسيطة"
        desc="عملية واضحة ومنظمة من أول اتصال حتى استلام منزلك الجديد جاهزاً"
      />
      <div className="relative mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="absolute inset-x-16 top-8 hidden border-t-2 border-dashed border-red-200 lg:block" />
        {HOW_STEPS.map((s, i) => (
          <div key={s.title} className="relative text-center">
            <div className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-400 text-xl font-black text-white shadow-lg shadow-red-400/30">
              {i + 1}
            </div>
            <h3 className="mt-3 text-base font-black text-navy sm:text-lg">{s.title}</h3>
            <p className="mx-auto mt-1.5 max-w-[220px] text-sm leading-relaxed text-slate-500">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Fleet() {
  return (
    <section id="fleet" className="scroll-mt-20 bg-slate-50 py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2">
        <img
          src="/images/fleet-desert.jpg"
          alt="أسطول شركة التابل — دينات وشاحنات نقل عفش حديثة ومجهزة ببريدة"
          className="w-full rounded-2xl object-cover shadow-2xl"
          loading="lazy"
        />
        <div>
          <span className="inline-block rounded-full bg-red-50 px-4 py-1 text-sm font-black text-red-800">
            أسطولنا
          </span>
          <h2 className="mt-3 text-2xl font-black text-navy sm:text-3xl">
            دينا نقل عفش مجهزة وأسطول يليق بعفشك
          </h2>
          <p className="mt-4 leading-loose text-slate-600">
            نمتلك أسطولاً حديثاً من الدينات المغلقة والشاحنات المجهزة بأنظمة تثبيت داخلية تحمي
            العفش من الاهتزاز والغبار والعوامل الجوية، يقودها سائقون محترفون يعرفون طرق القصيم
            والمملكة كأبنائها.
          </p>
          <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {[
              "دينات مغلقة بمختلف الأحجام",
              "أنظمة تثبيت وحماية داخلية",
              "صيانة دورية ونظافة تامة",
              "سائقون بزي موحد وخبرة طويلة",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-red-300" />
                {f}
              </li>
            ))}
          </ul>
          <a
            href="#quote"
            className="mt-7 inline-flex min-h-[46px] items-center gap-2 rounded-xl bg-red-400 px-6 font-black text-white shadow-lg shadow-red-400/30 transition-transform hover:scale-105"
          >
            اطلب دينتك الآن
            <ChevronLeft className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section id="reviews" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
      <SectionHead
        tag="آراء العملاء"
        title="ماذا يقول عملاؤنا في القصيم؟"
        desc="ثقة عملائنا هي أثمن ما نملك"
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {SITE_REVIEWS.map((r) => (
          <figure
            key={r.author}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg"
          >
            <div className="flex" aria-label="تقييم 5 نجوم">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} className="h-4 w-4 fill-red-300 text-red-300" />
              ))}
            </div>
            <blockquote className="mt-2.5 text-sm leading-relaxed text-slate-700">{r.text}</blockquote>
            <figcaption className="mt-3 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy font-black text-red-300">
                {r.author.charAt(0)}
              </span>
              <span>
                <span className="block text-sm font-black text-navy">{r.author}</span>
                <span className="block text-xs text-slate-500">{r.city}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/** شريط متحرك بانطباعات العملاء — يتحرك من اليمين إلى اليسار ويقف عند التمرير فوقه */
function ClientsStrip() {
  return (
    <section aria-label="شريط انطباعات عملائنا" className="marquee-hover-pause overflow-hidden bg-navy py-10">
      <div className="mx-auto mb-6 flex max-w-6xl items-center justify-center gap-3 px-4">
        <span className="h-px flex-1 bg-white/15" />
        <p className="text-sm font-black text-red-300">عملاء من كل مدن القصيم يثقون بنا</p>
        <span className="h-px flex-1 bg-white/15" />
      </div>
      <div className="relative">
        {/* تلاشي تدريجي عند الحافتين */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-navy to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-navy to-transparent sm:w-28" />
        <div className="flex w-max animate-marquee-rtl gap-4 px-4">
          {[...CLIENTS_STRIP, ...CLIENTS_STRIP].map((c, i) => (
            <figure
              key={`${c.author}-${i}`}
              aria-hidden={i >= CLIENTS_STRIP.length}
              className="w-72 shrink-0 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:w-80"
            >
              <div className="flex" aria-label="تقييم 5 نجوم">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-3.5 w-3.5 fill-red-300 text-red-300" />
                ))}
              </div>
              <blockquote className="mt-2 text-sm leading-relaxed text-slate-200">{c.text}</blockquote>
              <figcaption className="mt-3 flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-400 text-sm font-black text-red-950">
                  {c.author.charAt(0)}
                </span>
                <span>
                  <span className="block text-sm font-black text-white">{c.author}</span>
                  <span className="block text-xs text-slate-400">{c.city}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuoteForm() {
  const submit = trpc.quote.submit.useMutation({
    onSuccess: (res) => {
      setDoneId(res.id);
      toast.success("تم استلام طلبك بنجاح!");
    },
    onError: (e) => toast.error(e.message || "حدث خطأ — حاول مرة أخرى"),
  });

  const [doneId, setDoneId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    furnitureSize: "",
    fromCity: "",
    toCity: "",
    moveDate: "",
    notes: "",
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.furnitureSize ||
      !form.fromCity ||
      !form.toCity ||
      !form.moveDate
    ) {
      toast.error("يرجى تعبئة جميع الحقول المطلوبة");
      return;
    }
    submit.mutate({
      name: form.name.trim(),
      phone: form.phone.trim(),
      furnitureSize: form.furnitureSize,
      fromCity: form.fromCity,
      toCity: form.toCity,
      moveDate: form.moveDate,
      notes: form.notes.trim() || undefined,
    });
  };

  return (
    <section id="quote" className="scroll-mt-20 bg-slate-50 py-16">
      <div className="mx-auto max-w-3xl px-4">
        <SectionHead
          tag="احسب تكلفتك"
          title="اطلب عرض سعر مجاني خلال دقيقة"
          desc="أخبرنا عن نقلتك وسيتواصل معك فريقنا بعرض سعر فوري — بدون أي التزام"
        />

        {doneId ? (
          <div className="mt-8 rounded-2xl border border-green-200 bg-white p-6 text-center shadow-sm sm:p-8">
            <CheckCircle2 className="mx-auto h-14 w-14 text-green-500" />
            <h3 className="mt-4 text-xl font-black text-navy">تم استلام طلبك بنجاح!</h3>
            <p className="mt-2 text-slate-600">
              رقم الطلب: <span className="font-black text-red-800">#{doneId}</span>
              <br />
              سيتواصل معك فريق التابل خلال دقائق على رقمك لتأكيد التفاصيل وعرض السعر.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-[48px] items-center gap-2 rounded-xl bg-green-500 px-6 font-black text-white"
              >
                <MessageCircle className="h-5 w-5" />
                تواصل فوري عبر واتساب
              </a>
              <button
                onClick={() => {
                  setDoneId(null);
                  setForm({
                    name: "",
                    phone: "",
                    furnitureSize: "",
                    fromCity: "",
                    toCity: "",
                    moveDate: "",
                    notes: "",
                  });
                }}
                className="flex min-h-[48px] items-center rounded-xl border border-slate-300 px-6 font-bold text-slate-600"
              >
                إرسال طلب آخر
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">الاسم الكريم *</label>
                <Input
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="مثال: عبدالله المطيري"
                  className="min-h-[48px]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">رقم الجوال *</label>
                <Input
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="05XXXXXXXX"
                  dir="ltr"
                  inputMode="tel"
                  className="min-h-[48px] text-right"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">حجم العفش *</label>
                <Select value={form.furnitureSize} onValueChange={(v) => set("furnitureSize", v)}>
                  <SelectTrigger className="min-h-[48px]">
                    <SelectValue placeholder="اختر حجم العفش" />
                  </SelectTrigger>
                  <SelectContent>
                    {FURNITURE_SIZES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">تاريخ النقل المفضل *</label>
                <Input
                  type="date"
                  value={form.moveDate}
                  onChange={(e) => set("moveDate", e.target.value)}
                  className="min-h-[48px]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">من مدينة / حي *</label>
                <Select value={form.fromCity} onValueChange={(v) => set("fromCity", v)}>
                  <SelectTrigger className="min-h-[48px]">
                    <SelectValue placeholder="نقطة الانطلاق" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">إلى مدينة / حي *</label>
                <Select value={form.toCity} onValueChange={(v) => set("toCity", v)}>
                  <SelectTrigger className="min-h-[48px]">
                    <SelectValue placeholder="نقطة الوصول" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  ملاحظات إضافية (اختياري)
                </label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="مثال: يوجد بيانو يحتاج عناية خاصة، الدور الثالث بدون مصعد..."
                  rows={3}
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={submit.isPending}
              className="mt-5 min-h-[50px] w-full bg-red-400 text-lg font-black text-red-950 shadow-lg shadow-red-400/30 hover:bg-red-500"
            >
              {submit.isPending ? (
                <>
                  <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                  جارٍ إرسال الطلب...
                </>
              ) : (
                "أرسل طلب عرض السعر"
              )}
            </Button>
            <p className="mt-3 text-center text-xs text-slate-400">
              بإرسالك الطلب أنت توافق على تواصل فريق التابل معك هاتفياً أو عبر واتساب
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="mx-auto max-w-3xl scroll-mt-20 px-4 py-16">
      <SectionHead
        tag="الأسئلة الشائعة"
        title="كل ما يدور في ذهنك.. أجبنا عنه"
      />
      <Accordion type="single" collapsible className="mt-8">
        {SITE_FAQS.map((f, i) => (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="rounded-xl border border-slate-100 px-4 data-[state=open]:bg-slate-50"
          >
            <AccordionTrigger className="min-h-[52px] text-right font-black text-navy hover:no-underline">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-slate-600">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="scroll-mt-20 bg-navy text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-400 text-white">
              <Truck className="h-5 w-5" />
            </span>
            <span className="text-lg font-black text-white">{SITE.fullName}</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            وجهتك الأولى لنقل العفش والأثاث — أفضل شركة نقل أثاث ببريدة بتغطية تشمل جميع
            أنحاء المملكة مع تركيز خاص على القصيم. فك وتركيب، تغليف آمن، وأسطول حديث بضمان
            شامل وأسعار تنافسية.
          </p>
          <p className="mt-3 text-sm font-bold text-red-300">{SITE.slogan}</p>
        </div>
        <div>
          <h3 className="font-black text-white">روابط سريعة</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="transition-colors hover:text-red-300">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <Link to="/studio" className="transition-colors hover:text-red-300">
                استوديو بروفايل جوجل
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-black text-white">خدماتنا</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {SITE_SERVICES.slice(0, 6).map((s) => (
              <li key={s.title}>
                <a href="#services" className="transition-colors hover:text-red-300">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-black text-white">تواصل معنا</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-red-300" />
              <a href={telLink} dir="ltr" className="hover:text-red-300">
                {SITE.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 shrink-0 text-red-300" />
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                dir="ltr"
                className="hover:text-red-300"
              >
                {SITE.whatsapp}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-red-300" />
              <span dir="ltr">{SITE.email}</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
              <a href={SITE.mapUrl} target="_blank" rel="noreferrer" className="hover:text-red-300">
                {SITE.address}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-red-300" />
              {SITE.hours}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-400 sm:flex-row">
          <span>
            © {new Date().getFullYear()} {SITE.fullName} — جميع الحقوق محفوظة
          </span>
          <span>سياسة الخصوصية | الشروط والأحكام</span>
        </div>
      </div>
    </footer>
  );
}
