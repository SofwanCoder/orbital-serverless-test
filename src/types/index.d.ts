export type PaymentSource = "vendor" | "client";

export interface CreatePaymentRequest {
  paymentSource: PaymentSource;
  currency: string;
  destination: string;
  amount: string;
}

export interface TDetail extends CreatePaymentRequest{
  id: string;
}
