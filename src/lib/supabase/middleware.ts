import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function isEmailVerified(user: { email_confirmed_at?: string | null }): boolean {
  return Boolean(user.email_confirmed_at);
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isAuthRoute =
    path.startsWith("/login") ||
    path.startsWith("/signup") ||
    path === "/verify-email";
  const isAuthCallback = path.startsWith("/auth/callback");
  const isProtected =
    path.startsWith("/dashboard") ||
    path.startsWith("/room") ||
    path.startsWith("/desk") ||
    path.startsWith("/hunt") ||
    path.startsWith("/settings") ||
    path.startsWith("/shared");

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && !isEmailVerified(user)) {
    if (isProtected || path === "/" || (isAuthRoute && path !== "/verify-email")) {
      const url = request.nextUrl.clone();
      url.pathname = "/verify-email";
      if (user.email) url.searchParams.set("email", user.email);
      return NextResponse.redirect(url);
    }
  }

  if (user && isEmailVerified(user)) {
    if (path === "/verify-email" || isAuthRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    if (path === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  if (isAuthCallback) {
    return supabaseResponse;
  }

  return supabaseResponse;
}
