import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import {
  defaultContent,
  seoKeywords,
  brandColors,
  recommendedPhotos,
  DESCRIPTION_LIMIT,
  type ProfileContent,
} from "@contracts/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Truck,
  Copy,
  Check,
  Star,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  LayoutDashboard,
  FileText,
  Wrench,
  Megaphone,
  HelpCircle,
  Save,
  RotateCcw,
  LogIn,
  LogOut,
  Pencil,
  Eye,
  Download,
  Palette,
  Camera,
  Search,
  ShieldCheck,
  Zap,
  BadgePercent,
  Users,
  Inbox,
  Globe,
} from "lucide-react";

type TabId = "overview" | "description" | "services" | "reviews" | "posts" | "faqs" | "quotes";

const TABS: { id: TabId; label: string; icon: typeof FileText }[] = [
  { id: "overview", label: "نظرة عامة", icon: LayoutDashboard },
  { id: "description", label: "وصف النشاط", icon: FileText },
  { id: "services", label: "الخدمات", icon: Wrench },
  { id: "reviews", label: "التقييمات", icon: Star },
  { id: "posts", label: "المنشورات", icon: Megaphone },
  { id: "faqs", label: "الأسئلة الشائعة", icon: HelpCircle },
  { id: "quotes", label: "طلبات العروض", icon: Inbox },
];

function copyText(text: string, label: string) {
  navigator.clipboard
    .writeText(text)
    .then(() => toast.success(`تم نسخ ${label} بنجاح`))
    .catch(() => toast.error("تعذر النسخ — انسخ يدوياً"));
}

function CopyBtn({ text, label, small }: { text: string; label: string; small?: boolean }) {
  const [done, setDone] = useState(false);
  return (
    <Button
      type="button"
      variant="outline"
      size={small ? "sm" : "default"}
      className="gap-2 min-h-[44px] border-red-200 text-red-800 hover:bg-red-50"
      onClick={() => {
        copyText(text, label);
        setDone(true);
        setTimeout(() => setDone(false), 2000);
      }}
    >
      {done ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
      {small ? "نسخ" : `نسخ ${label}`}
    </Button>
  );
}

export default function Studio() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const mine = trpc.profile.mine.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });
  const saveMutation = trpc.profile.save.useMutation({
    onSuccess: () => {
      setDirty(false);
      toast.success("تم حفظ تعديلاتك في حسابك بنجاح");
    },
    onError: (e) => toast.error(`فشل الحفظ: ${e.message}`),
  });

  const [content, setContent] = useState<ProfileContent>(defaultContent);
  const [dirty, setDirty] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [tab, setTab] = useState<TabId>("overview");

  useEffect(() => {
    if (mine.data?.data && !dirty) {
      setContent(mine.data.data);
    }
  }, [mine.data, dirty]);

  const update = (fn: (c: ProfileContent) => void) => {
    setContent((prev) => {
      const next = structuredClone(prev);
      fn(next);
      return next;
    });
    setDirty(true);
  };

  const handleSave = () => {
    if (!isAuthenticated) {
      toast.info("سجّل الدخول بحساب Kimi لحفظ تعديلاتك بشكل دائم");
      navigate("/login");
      return;
    }
    if (content.description.length > DESCRIPTION_LIMIT) {
      toast.error(`وصف النشاط يتجاوز ${DESCRIPTION_LIMIT} حرفاً`);
      setTab("description");
      return;
    }
    saveMutation.mutate({ data: content });
  };

  const handleReset = () => {
    setContent(mine.data?.data ?? defaultContent);
    setDirty(false);
    toast.info("تم التراجع عن التعديلات غير المحفوظة");
  };

  const servicesText = useMemo(
    () =>
      content.services
        .map(
          (cat) =>
            `■ ${cat.category}\n${cat.items.map((i) => `• ${i.title}: ${i.desc}`).join("\n")}`,
        )
        .join("\n\n"),
    [content.services],
  );

  const reviewsText = useMemo(
    () =>
      content.reviews
        .map((r) => `⭐⭐⭐⭐⭐ ${r.author} — ${r.city}\n${r.text}`)
        .join("\n\n"),
    [content.reviews],
  );

  const postsText = useMemo(
    () => content.posts.map((p) => `📢 ${p.title}\n${p.body}\n👉 ${p.cta}`).join("\n\n"),
    [content.posts],
  );

  const faqsText = useMemo(
    () => content.faqs.map((f) => `س: ${f.q}\nج: ${f.a}`).join("\n\n"),
    [content.faqs],
  );

  const overviewText = useMemo(
    () =>
      [
        `اسم النشاط: ${content.companyName}`,
        `الفئة: ${content.category}`,
        `الجوال: ${content.phone}`,
        `واتساب: ${content.whatsapp}`,
        `العنوان: ${content.address}`,
        `ساعات العمل: ${content.workingHours}`,
        `مناطق الخدمة: ${content.serviceAreas}`,
      ].join("\n"),
    [content],
  );

  const allText = useMemo(
    () =>
      [
        `══════ بيانات النشاط ══════\n${overviewText}`,
        `══════ وصف النشاط ══════\n${content.description}`,
        `══════ الخدمات ══════\n${servicesText}`,
        `══════ نماذج التقييمات ══════\n${reviewsText}`,
        `══════ المنشورات ══════\n${postsText}`,
        `══════ الأسئلة الشائعة ══════\n${faqsText}`,
      ].join("\n\n"),
    [overviewText, content.description, servicesText, reviewsText, postsText, faqsText],
  );

  const descCount = content.description.length;
  const descOver = descCount > DESCRIPTION_LIMIT;

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      {/* الترويسة */}
      <header className="bg-gradient-to-l from-red-950 via-red-900 to-red-800 text-white">
        <div className="mx-auto max-w-6xl px-4 pt-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-white shadow-lg">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold leading-tight">استوديو ملف التابل</h1>
                <p className="text-xs text-red-200">محتوى Google Business Profile جاهز للنشر</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="flex min-h-[44px] items-center gap-2 rounded-lg border border-red-400/50 px-3 text-sm font-bold text-white hover:bg-red-800"
              >
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">الموقع الرئيسي</span>
              </Link>
              {isLoading ? null : isAuthenticated ? (
                <>
                  <span className="hidden max-w-[140px] truncate text-sm text-red-100 sm:inline">
                    {user?.name ?? "مستخدم"}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="min-h-[44px] gap-2 border-red-400/50 bg-transparent text-white hover:bg-red-800 hover:text-white"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4" />
                    خروج
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  className="min-h-[44px] gap-2 bg-red-600 font-bold text-white hover:bg-red-700"
                  onClick={() => navigate("/login")}
                >
                  <LogIn className="h-4 w-4" />
                  دخول لحفظ التعديلات
                </Button>
              )}
            </div>
          </div>

          <div className="mt-6 pb-6">
            <h2 className="text-2xl font-black sm:text-3xl">{content.companyName}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-red-100">
              ملف تجاري متكامل ومحسّن لمحركات البحث المحلية: وصف، خدمات، تقييمات، منشورات، وأسئلة
              شائعة — عدّل ما تشاء، احفظه في حسابك، وانسخه إلى بروفايل جوجل بضغطة زر.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge className="gap-1 bg-red-800/80 text-red-100 hover:bg-red-800">
                <ShieldCheck className="h-3.5 w-3.5 text-red-400" /> نقل مع الضمان
              </Badge>
              <Badge className="gap-1 bg-red-800/80 text-red-100 hover:bg-red-800">
                <Zap className="h-3.5 w-3.5 text-red-400" /> خدمة 24/7
              </Badge>
              <Badge className="gap-1 bg-red-800/80 text-red-100 hover:bg-red-800">
                <BadgePercent className="h-3.5 w-3.5 text-red-400" /> أسعار تنافسية
              </Badge>
              <Badge className="gap-1 bg-red-800/80 text-red-100 hover:bg-red-800">
                <Users className="h-3.5 w-3.5 text-red-400" /> فنيون محترفون
              </Badge>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="min-h-[44px] gap-2 border-red-400/50 bg-transparent text-white hover:bg-red-800 hover:text-white"
                onClick={() => copyText(allText, "الملف كاملاً")}
              >
                <Download className="h-4 w-4" />
                نسخ الملف كاملاً
              </Button>
              <Button
                variant={editMode ? "default" : "outline"}
                className={
                  editMode
                    ? "min-h-[44px] gap-2 bg-red-600 font-bold text-white hover:bg-red-700"
                    : "min-h-[44px] gap-2 border-red-400/50 bg-transparent text-white hover:bg-red-800 hover:text-white"
                }
                onClick={() => setEditMode((v) => !v)}
              >
                {editMode ? <Eye className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                {editMode ? "وضع المعاينة" : "وضع التعديل"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* شريط الأقسام */}
      <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="no-scrollbar mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 py-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex min-h-[44px] shrink-0 items-center gap-2 rounded-lg px-4 text-sm font-bold transition-colors ${
                  active
                    ? "bg-red-900 text-white shadow"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-red-400" : ""}`} />
                {t.label}
              </button>
            );
          })}
        </div>
      </nav>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        {!isAuthenticated && !isLoading && (
          <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900">
            أنت تتصفح النسخة الافتراضية. يمكنك التعديل والنسخ مباشرة، ولكن لحفظ تعديلاتك بشكل دائم
            عبر الأجهزة سجّل الدخول بحساب Kimi.
          </div>
        )}

        {tab === "overview" && (
          <OverviewSection
            content={content}
            editMode={editMode}
            update={update}
            overviewText={overviewText}
          />
        )}

        {tab === "description" && (
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
              <div>
                <CardTitle className="text-red-950">وصف النشاط التجاري</CardTitle>
                <CardDescription>
                  وصف تسويقي محسّن للـ SEO — الحد الأقصى في جوجل {DESCRIPTION_LIMIT} حرفاً
                </CardDescription>
              </div>
              <CopyBtn text={content.description} label="الوصف" />
            </CardHeader>
            <CardContent>
              {editMode ? (
                <Textarea
                  value={content.description}
                  onChange={(e) => update((c) => void (c.description = e.target.value))}
                  rows={8}
                  className="text-base leading-relaxed"
                />
              ) : (
                <p className="rounded-lg bg-slate-50 p-4 leading-loose text-slate-800">
                  {content.description}
                </p>
              )}
              <div
                className={`mt-3 text-sm font-bold ${descOver ? "text-red-600" : "text-slate-500"}`}
              >
                {descCount} / {DESCRIPTION_LIMIT} حرف
                {descOver && " — تجاوزت الحد المسموح في جوجل!"}
              </div>
            </CardContent>
          </Card>
        )}

        {tab === "services" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-red-950">قائمة الخدمات</h2>
              <CopyBtn text={servicesText} label="كل الخدمات" />
            </div>
            {content.services.map((cat, ci) => (
              <Card key={ci} className="border-slate-200 shadow-sm">
                <CardHeader>
                  {editMode ? (
                    <Input
                      value={cat.category}
                      onChange={(e) =>
                        update((c) => void (c.services[ci].category = e.target.value))
                      }
                      className="max-w-sm font-bold"
                    />
                  ) : (
                    <CardTitle className="flex items-center gap-2 text-red-900">
                      <Wrench className="h-5 w-5 text-red-600" />
                      {cat.category}
                    </CardTitle>
                  )}
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2">
                  {cat.items.map((item, ii) => (
                    <div
                      key={ii}
                      className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"
                    >
                      {editMode ? (
                        <div className="space-y-2">
                          <Input
                            value={item.title}
                            onChange={(e) =>
                              update(
                                (c) => void (c.services[ci].items[ii].title = e.target.value),
                              )
                            }
                            className="font-bold"
                          />
                          <Textarea
                            value={item.desc}
                            onChange={(e) =>
                              update(
                                (c) => void (c.services[ci].items[ii].desc = e.target.value),
                              )
                            }
                            rows={3}
                          />
                        </div>
                      ) : (
                        <>
                          <div className="mb-1 flex items-start justify-between gap-2">
                            <h3 className="font-bold text-slate-900">{item.title}</h3>
                            <CopyBtn small text={`${item.title}: ${item.desc}`} label="الخدمة" />
                          </div>
                          <p className="text-sm leading-relaxed text-slate-600">{item.desc}</p>
                        </>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {tab === "reviews" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-red-950">نماذج التقييمات</h2>
                <p className="text-sm text-slate-500">
                  5 نماذج إثبات اجتماعي من عملاء في مدن القصيم
                </p>
              </div>
              <CopyBtn text={reviewsText} label="كل التقييمات" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {content.reviews.map((r, i) => (
                <Card key={i} className="border-slate-200 shadow-sm">
                  <CardContent className="p-5">
                    <div className="mb-2 flex" aria-label="تقييم 5 نجوم">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className="h-5 w-5 fill-red-400 text-red-400" />
                      ))}
                    </div>
                    {editMode ? (
                      <div className="space-y-2">
                        <Textarea
                          value={r.text}
                          onChange={(e) =>
                            update((c) => void (c.reviews[i].text = e.target.value))
                          }
                          rows={4}
                        />
                        <div className="flex gap-2">
                          <Input
                            value={r.author}
                            onChange={(e) =>
                              update((c) => void (c.reviews[i].author = e.target.value))
                            }
                            placeholder="اسم العميل"
                          />
                          <Input
                            value={r.city}
                            onChange={(e) =>
                              update((c) => void (c.reviews[i].city = e.target.value))
                            }
                            placeholder="المدينة"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="leading-relaxed text-slate-700">{r.text}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="text-sm font-bold text-red-900">
                            {r.author}
                            <span className="mr-2 font-normal text-slate-500">— {r.city}</span>
                          </div>
                          <CopyBtn small text={`⭐⭐⭐⭐⭐ ${r.author} — ${r.city}\n${r.text}`} label="التقييم" />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {tab === "posts" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-red-950">منشورات وتحديثات GBP</h2>
                <p className="text-sm text-slate-500">3 منشورات عصرية وعروض خاصة جاهزة للنشر</p>
              </div>
              <CopyBtn text={postsText} label="كل المنشورات" />
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {content.posts.map((p, i) => (
                <Card
                  key={i}
                  className="flex flex-col border-slate-200 shadow-sm"
                >
                  <CardHeader>
                    {editMode ? (
                      <Input
                        value={p.title}
                        onChange={(e) =>
                          update((c) => void (c.posts[i].title = e.target.value))
                        }
                        className="font-bold"
                      />
                    ) : (
                      <CardTitle className="text-base leading-snug text-red-900">
                        {p.title}
                      </CardTitle>
                    )}
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col gap-3">
                    {editMode ? (
                      <>
                        <Textarea
                          value={p.body}
                          onChange={(e) =>
                            update((c) => void (c.posts[i].body = e.target.value))
                          }
                          rows={6}
                        />
                        <Input
                          value={p.cta}
                          onChange={(e) =>
                            update((c) => void (c.posts[i].cta = e.target.value))
                          }
                          placeholder="زر الإجراء"
                        />
                      </>
                    ) : (
                      <>
                        <p className="flex-1 text-sm leading-relaxed text-slate-600">{p.body}</p>
                        <div className="rounded-lg bg-red-50 px-3 py-2 text-center text-sm font-bold text-red-800">
                          {p.cta}
                        </div>
                        <CopyBtn small text={`${p.title}\n${p.body}\n${p.cta}`} label="المنشور" />
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {tab === "faqs" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-red-950">الأسئلة الشائعة</h2>
                <p className="text-sm text-slate-500">
                  أضفها في قسم الأسئلة والأجوبة ببروفايل جوجل
                </p>
              </div>
              <CopyBtn text={faqsText} label="كل الأسئلة" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {content.faqs.map((f, i) => (
                <Card key={i} className="border-slate-200 shadow-sm">
                  <CardContent className="p-5">
                    {editMode ? (
                      <div className="space-y-2">
                        <Input
                          value={f.q}
                          onChange={(e) => update((c) => void (c.faqs[i].q = e.target.value))}
                          className="font-bold"
                        />
                        <Textarea
                          value={f.a}
                          onChange={(e) => update((c) => void (c.faqs[i].a = e.target.value))}
                          rows={4}
                        />
                      </div>
                    ) : (
                      <>
                        <h3 className="flex items-start gap-2 font-bold text-red-900">
                          <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                          {f.q}
                        </h3>
                        <p className="mt-2 pr-7 text-sm leading-relaxed text-slate-600">{f.a}</p>
                        <div className="mt-3 pr-7">
                          <CopyBtn small text={`س: ${f.q}\nج: ${f.a}`} label="السؤال" />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        {tab === "quotes" && <QuotesSection isAuthenticated={isAuthenticated} />}
      </main>

      {/* شريط الحفظ العائم */}
      {dirty && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-2xl backdrop-blur pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <span className="hidden text-sm font-bold text-red-700 sm:block">
              لديك تعديلات غير محفوظة
            </span>
            <span className="text-sm font-bold text-red-700 sm:hidden">غير محفوظ</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="min-h-[44px] gap-2"
                onClick={handleReset}
                disabled={saveMutation.isPending}
              >
                <RotateCcw className="h-4 w-4" />
                تراجع
              </Button>
              <Button
                className="min-h-[44px] gap-2 bg-red-900 font-bold hover:bg-red-800"
                onClick={handleSave}
                disabled={saveMutation.isPending}
              >
                <Save className="h-4 w-4" />
                {saveMutation.isPending ? "جارٍ الحفظ..." : "حفظ التعديلات"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OverviewSection({
  content,
  editMode,
  update,
  overviewText,
}: {
  content: ProfileContent;
  editMode: boolean;
  update: (fn: (c: ProfileContent) => void) => void;
  overviewText: string;
}) {
  const fields: {
    key: "companyName" | "category" | "phone" | "whatsapp" | "address" | "workingHours";
    label: string;
    icon: typeof Phone;
    dir?: "ltr";
  }[] = [
    { key: "companyName", label: "اسم النشاط التجاري", icon: Truck },
    { key: "category", label: "الفئة الرئيسية", icon: FileText },
    { key: "phone", label: "رقم الجوال", icon: Phone, dir: "ltr" },
    { key: "whatsapp", label: "واتساب (بصيغة دولية)", icon: MessageCircle, dir: "ltr" },
    { key: "address", label: "العنوان", icon: MapPin },
    { key: "workingHours", label: "ساعات العمل", icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
          <div>
            <CardTitle className="text-red-950">البيانات الأساسية والنطاق الجغرافي</CardTitle>
            <CardDescription>انسخها كما هي في حقول بروفايل جوجل</CardDescription>
          </div>
          <CopyBtn text={overviewText} label="البيانات" />
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.key}>
                <label className="mb-1 flex items-center gap-1.5 text-sm font-bold text-slate-600">
                  <Icon className="h-4 w-4 text-red-700" />
                  {f.label}
                </label>
                {editMode ? (
                  <Input
                    value={content[f.key]}
                    dir={f.dir}
                    onChange={(e) => update((c) => void (c[f.key] = e.target.value))}
                    className="min-h-[44px]"
                  />
                ) : (
                  <div className="flex min-h-[44px] items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50/60 px-3">
                    <span dir={f.dir} className="text-sm font-medium text-slate-800">
                      {content[f.key]}
                    </span>
                    <CopyBtn small text={content[f.key]} label={f.label} />
                  </div>
                )}
              </div>
            );
          })}
          <div className="sm:col-span-2">
            <label className="mb-1 flex items-center gap-1.5 text-sm font-bold text-slate-600">
              <MapPin className="h-4 w-4 text-red-700" />
              مناطق الخدمة
            </label>
            {editMode ? (
              <Textarea
                value={content.serviceAreas}
                onChange={(e) => update((c) => void (c.serviceAreas = e.target.value))}
                rows={3}
              />
            ) : (
              <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
                <p className="text-sm leading-relaxed text-slate-800">{content.serviceAreas}</p>
                <div className="mt-2">
                  <CopyBtn small text={content.serviceAreas} label="مناطق الخدمة" />
                </div>
              </div>
            )}
            <p className="mt-2 text-xs text-slate-500">
              في بروفايل جوجل: أضف كل مدينة كمنطقة خدمة مستقلة (بريدة، عنيزة، الرس، البكيرية،
              المذنب...) واربط عنوانك برابط خريطة جوجل المباشر لنشاطك.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-red-950">
              <Palette className="h-5 w-5 text-red-600" />
              ألوان الهوية المقترحة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {brandColors.map((c) => (
              <div key={c.hex} className="flex items-center gap-3">
                <span
                  className="h-10 w-10 shrink-0 rounded-lg border border-slate-200 shadow-inner"
                  style={{ backgroundColor: c.hex }}
                />
                <div>
                  <div className="text-sm font-bold text-slate-800">
                    {c.name} <span className="font-normal text-slate-400">{c.hex}</span>
                  </div>
                  <div className="text-xs text-slate-500">{c.usage}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-red-950">
              <Camera className="h-5 w-5 text-red-600" />
              الصور الموصى بنشرها
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-slate-600">
              {recommendedPhotos.map((p, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                  {p}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex-row items-start justify-between gap-2 space-y-0">
            <CardTitle className="flex items-center gap-2 text-base text-red-950">
              <Search className="h-5 w-5 text-red-600" />
              الكلمات المفتاحية
            </CardTitle>
            <CopyBtn small text={seoKeywords.join("\n")} label="الكلمات" />
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {seoKeywords.map((k) => (
              <Badge
                key={k}
                variant="secondary"
                className="cursor-pointer bg-red-50 text-red-900 hover:bg-red-100"
                onClick={() => copyText(k, "الكلمة المفتاحية")}
              >
                {k}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function QuotesSection({ isAuthenticated }: { isAuthenticated: boolean }) {
  const navigate = useNavigate();
  const quotes = trpc.quote.list.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });

  if (!isAuthenticated) {
    return (
      <Card className="border-slate-200 py-14 text-center shadow-sm">
        <CardContent>
          <Inbox className="mx-auto h-12 w-12 text-slate-300" />
          <h2 className="mt-4 text-xl font-extrabold text-red-950">طلبات عروض الأسعار</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            هنا تظهر طلبات العملاء المرسلة من نموذج «اطلب عرض سعر» في الموقع الرئيسي. سجّل الدخول
            لعرضها.
          </p>
          <Button
            className="mt-6 min-h-[44px] gap-2 bg-red-900 font-bold hover:bg-red-800"
            onClick={() => navigate("/login")}
          >
            <LogIn className="h-4 w-4" />
            تسجيل الدخول
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (quotes.isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-200/60" />
        ))}
      </div>
    );
  }

  if (quotes.isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center text-sm font-bold text-red-700">
        تعذر تحميل الطلبات — حاول تحديث الصفحة
      </div>
    );
  }

  const list = quotes.data ?? [];

  if (list.length === 0) {
    return (
      <Card className="border-slate-200 py-14 text-center shadow-sm">
        <CardContent>
          <Inbox className="mx-auto h-12 w-12 text-slate-300" />
          <h2 className="mt-4 text-xl font-extrabold text-red-950">لا توجد طلبات بعد</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            عندما يرسل عميل طلب عرض سعر من الموقع الرئيسي سيظهر هنا مباشرة مع كامل التفاصيل.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-red-950">طلبات عروض الأسعار</h2>
          <p className="text-sm text-slate-500">{list.length} طلب وارد من الموقع</p>
        </div>
      </div>
      <div className="grid gap-3">
        {list.map((q) => (
          <Card key={q.id} className="border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-red-100 px-2 py-0.5 text-xs font-black text-red-800">
                      #{q.id}
                    </span>
                    <h3 className="font-black text-red-950">{q.name}</h3>
                  </div>
                  <a
                    href={`tel:${q.phone}`}
                    dir="ltr"
                    className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-red-700 hover:underline"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {q.phone}
                  </a>
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(q.createdAt).toLocaleDateString("ar-SA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                <div className="rounded-lg bg-slate-50 px-3 py-2">
                  <span className="block text-xs text-slate-400">حجم العفش</span>
                  <span className="font-bold text-slate-700">{q.furnitureSize}</span>
                </div>
                <div className="rounded-lg bg-slate-50 px-3 py-2">
                  <span className="block text-xs text-slate-400">المسار</span>
                  <span className="font-bold text-slate-700">
                    {q.fromCity} ← {q.toCity}
                  </span>
                </div>
                <div className="rounded-lg bg-slate-50 px-3 py-2">
                  <span className="block text-xs text-slate-400">تاريخ النقل</span>
                  <span className="font-bold text-slate-700">{q.moveDate}</span>
                </div>
              </div>
              {q.notes && (
                <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-slate-600">
                  {q.notes}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
