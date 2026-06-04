import { detectBot } from "@arcjet/next";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import type { NextFetchEvent } from "next/server";
import { NextResponse } from "next/server";
import arcjet from "@/libs/Arcjet";
import { routing } from "./libs/I18nRouting";

const handleI18nRouting = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
	"/dashboard(.*)",
	"/:locale/dashboard(.*)",
]);

// Improve security with Arcjet
const aj = arcjet.withRule(
	detectBot({
		mode: "LIVE",
		allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW", "CATEGORY:MONITOR"],
	}),
);

export default clerkMiddleware(
	async (auth, request, _event: NextFetchEvent) => {
		// 1. Arcjet Protection
		if (process.env.ARCJET_KEY) {
			const decision = await aj.protect(request);
			if (decision.isDenied()) {
				return NextResponse.json({ error: "Forbidden" }, { status: 403 });
			}
		}

		// 2. Clerk Protection
		const { userId, orgId } = await auth();

		if (isProtectedRoute(request)) {
			const locale =
				request.nextUrl.pathname.match(/(\/.*)\/dashboard/u)?.at(1) ?? "";
			const signInUrl = new URL(`${locale}/sign-in`, request.url);

			if (!userId) {
				return NextResponse.redirect(signInUrl);
			}

			if (
				!orgId &&
				request.nextUrl.pathname.includes("/dashboard/") &&
				!request.nextUrl.pathname.endsWith("/dashboard")
			) {
				return NextResponse.redirect(
					new URL(`${locale}/dashboard`, request.url),
				);
			}
		}

		// 3. I18n Routing
		return handleI18nRouting(request);
	},
);

export const config = {
	matcher: ["/((?!_next|_vercel|monitoring|api|.*\\..*).*)"],
};
