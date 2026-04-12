import { AuthError } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

import { signIn } from "@/auth";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { BodyText } from "@/components/ui/typography";

type AdminLoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

async function loginAction(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/admin/login?error=CredentialsSignin");
    }

    throw error;
  }
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = await searchParams;
  const hasError = Boolean(params?.error);

  return (
    <Section className="pt-14 sm:pt-20 lg:pt-24">
      <Container className="max-w-xl">
        <Card className="border-[var(--line-strong)] shadow-[var(--shadow-soft)]" padded>
          <Heading
            eyebrow="Admin"
            title="Einloggen"
            subtitle="Melde dich mit deinem Salon-Zugang an."
          />
          <BodyText className="mt-5 text-zinc-700 dark:text-zinc-300">
            Der Admin-Bereich ist nur fuer berechtigte Salonmitarbeitende.
          </BodyText>

          {hasError ? (
            <p className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
              Anmeldung fehlgeschlagen. Bitte pruefe die Zugangsdaten.
            </p>
          ) : null}

          <form action={loginAction} className="mt-8 space-y-5">
            <div>
              <label
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                htmlFor="email"
              >
                E-Mail
              </label>
              <input
                className="mt-2 w-full rounded-md border border-[var(--line-strong)] bg-white px-3 py-3 text-base text-zinc-950 outline-none focus:border-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-50"
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                htmlFor="password"
              >
                Passwort
              </label>
              <input
                className="mt-2 w-full rounded-md border border-[var(--line-strong)] bg-white px-3 py-3 text-base text-zinc-950 outline-none focus:border-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-50"
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>

            <button
              className="min-h-12 rounded-md bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-foreground)] transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
              type="submit"
            >
              Einloggen
            </button>
          </form>

          <div className="mt-8 text-sm text-zinc-600 dark:text-zinc-300">
            <Link className="underline underline-offset-4" href="/">
              Zurueck zur Website
            </Link>
          </div>
        </Card>
      </Container>
    </Section>
  );
}
