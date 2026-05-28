import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isEmailVerified } from "@/lib/auth/utils";
import { Button } from "@/components/ui/Button";

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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-amber-50 via-stone-50 to-stone-100">
      <div className="max-w-lg text-center space-y-8">
        <div className="space-y-4">
          <p className="text-6xl">🗂️</p>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-amber-950">
            Messy Desk
          </h1>
          <p className="text-lg text-stone-600 leading-relaxed">
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
