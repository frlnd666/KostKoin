import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

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
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/auth/login", "/auth/register", "/auth/register-success", "/auth/error"];
  const isPublicRoute = publicRoutes.some((route) => pathname === route);

  // If user is not logged in and trying to access protected routes
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // If user is logged in and trying to access auth pages, redirect to appropriate dashboard
  if (user && (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register"))) {
    // Fetch profile to determine role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const url = request.nextUrl.clone();
    if (profile?.role === "pemilik") {
      url.pathname = "/dashboard";
    } else {
      url.pathname = "/beranda";
    }
    return NextResponse.redirect(url);
  }

  // Role-based route protection
  if (user) {
    const pemilikRoutes = ["/dashboard", "/properti", "/pemesanan"];
    const penyewaRoutes = ["/beranda", "/cari", "/kost", "/pesanan"];

    const isPemilikRoute = pemilikRoutes.some((route) => pathname.startsWith(route));
    const isPenyewaRoute = penyewaRoutes.some((route) => pathname.startsWith(route));

    if (isPemilikRoute || isPenyewaRoute) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (isPemilikRoute && profile?.role !== "pemilik") {
        const url = request.nextUrl.clone();
        url.pathname = "/beranda";
        return NextResponse.redirect(url);
      }

      if (isPenyewaRoute && profile?.role !== "penyewa") {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}
