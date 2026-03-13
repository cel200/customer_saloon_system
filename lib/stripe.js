import { loadStripe } from "@stripe/stripe-js";

export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_51TA3CrB18eSiB0rCx4uQr1cUreGl8uTGCROEkGSTZD2j4Yz3tAvimAQ7RoUpg7M0Ho0OyzYLvmWUoFltjW1lF3zo00nmWr7yM6"
);
