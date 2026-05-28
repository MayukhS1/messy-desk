import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isEmailVerified } from "@/lib/auth/utils";
import { Button } from "@/components/ui/Button";
import { CozyMessDecor } from "@/components/decor/CozyMessDecor";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    if (!isEmailVerified(user)) {
      redirect(`/verify-email?email=${encodeURIComponent(user.email ?? "")}`);
    }
    redirect("/dashboard");
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 bg-paper-texture">
      <div className="sunlight-overlay pointer-events-none fixed inset-0" aria-hidden />
      <CozyMessDecor variant="landing" />

      <div className="relative max-w-lg text-center space-y-8 z-10">
        <div className="space-y-4">
          {/* Hand-drawn desk doodle */}
          <svg
            className="mx-auto drop-shadow-md filter-hand-drawn"
            width="80"
            height="64"
            viewBox="0 0 80 64"
            fill="none"
            aria-hidden
          >
            <rect x="8" y="20" width="64" height="8" rx="2" fill="#92400e" stroke="#78350f" strokeWidth="1.5" />
            <rect x="12" y="28" width="56" height="4" fill="#78350f" />
            <rect x="16" y="12" width="12" height="10" rx="1" fill="#fef3c7" stroke="#78350f" strokeWidth="1" transform="rotate(-5 22 17)" />
            <rect x="34" y="8" width="14" height="12" rx="1" fill="#fde68a" stroke="#78350f" strokeWidth="1" transform="rotate(3 41 14)" />
            <circle cx="58" cy="14" r="6" fill="#fcd34d" stroke="#78350f" strokeWidth="1" />
          </svg>

          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground">
            Messy Desk
          </h1>
          <p className="text-lg text-muted leading-relaxed">
            Hide messages in a cluttered desk. Build your desk, invite your
            partner when you&apos;re ready — they can hunt at their own pace.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto min-w-[160px]">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto min-w-[160px]">
              Sign up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
