import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Register",
};

type RegisterPageProps = {
  searchParams: Promise<{ phone?: string | string[] }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { phone } = await searchParams;
  const initialPhone = typeof phone === "string" ? phone.slice(0, 20) : "";
  return <RegisterForm initialPhone={initialPhone} />;
}
