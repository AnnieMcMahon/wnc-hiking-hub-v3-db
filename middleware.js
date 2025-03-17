import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
  console.log("✅ Middleware is running on:", request.nextUrl.pathname);

  let response = NextResponse.next();

  request.cookies.getAll();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: user, error } = await supabase.auth.getUser();

  if (error || !user) {
    console.warn("⚠️ No user session found.");
  } else {
    console.log("✅ User session active");
  }

  return response;
}

export const config = {
  matcher: "/:path*", 
};
