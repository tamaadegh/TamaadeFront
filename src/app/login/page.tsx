import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log In",
};

type LoginPageProps = {
  searchParams: Promise<{ phone?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { phone } = await searchParams;
  const initialPhone = typeof phone === "string" ? phone.slice(0, 20) : "";
  return <LoginForm initialPhone={initialPhone} />;
}
