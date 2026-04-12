export { auth as proxy } from "@/auth";

export const publicAdminAuthPaths = ["/admin/login", "/api/auth/:path*"] as const;

export const config = {
  matcher: ["/admin((?!/login).*)"],
};
