import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck } from "lucide-react";

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-l from-red-950 via-red-900 to-red-800 px-4">
      <Card className="w-full max-w-sm border-0 shadow-2xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg">
            <Truck className="h-7 w-7" />
          </div>
          <CardTitle className="text-xl font-extrabold text-red-950">
            استوديو ملف التابل
          </CardTitle>
          <p className="text-sm text-slate-500">
            سجّل الدخول بحساب Kimi لحفظ تعديلاتك على محتوى بروفايل جوجل ومزامنتها عبر أجهزتك
          </p>
        </CardHeader>
        <CardContent>
          <Button
            className="min-h-[48px] w-full bg-red-900 text-base font-bold hover:bg-red-800"
            size="lg"
            onClick={() => {
              window.location.href = getOAuthUrl();
            }}
          >
            تسجيل الدخول عبر Kimi
          </Button>
          <p className="mt-3 text-center text-xs text-slate-400">
            يمكنك تصفح المحتوى ونسخه بدون تسجيل — الدخول مطلوب فقط للحفظ الدائم
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
