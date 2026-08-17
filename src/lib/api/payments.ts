import { apiClient } from "./client";
import { getStoredToken } from "./auth";

function authOptions() {
  const token = getStoredToken();
  return {
    credentials: "include" as const,
    token: token ?? undefined,
  };
}

export type HubtelCheckoutResponse = {
  checkout_url: string;
  checkout_direct_url?: string | null;
  checkout_id?: string;
  client_reference: string;
  order_id: number;
  amount: string;
};

export type HubtelPaymentStatus = {
  status: "P" | "C" | "F";
  order_id: number;
  client_reference: string;
  paid: boolean;
};

export async function startHubtelCheckout(): Promise<HubtelCheckoutResponse> {
  return apiClient<HubtelCheckoutResponse>("/api/user/payments/hubtel/checkout/", {
    method: "POST",
    ...authOptions(),
  });
}

export async function getHubtelPaymentStatus(ref: string): Promise<HubtelPaymentStatus> {
  return apiClient<HubtelPaymentStatus>(
    `/api/user/payments/hubtel/status/?ref=${encodeURIComponent(ref)}`,
    authOptions(),
  );
}
