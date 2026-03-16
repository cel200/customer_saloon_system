// "use client";

// import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
// import { useState } from "react";

// const CARD_ELEMENT_OPTIONS = {
//   style: {
//     base: {
//       color: "#fff",
//       fontFamily: "'Inter', 'Helvetica Neue', Helvetica, sans-serif",
//       fontSize: "16px",
//       fontSmoothing: "antialiased",
//       "::placeholder": { color: "rgba(255,255,255,0.4)" },
//     },
//     invalid: { color: "#fa755a", iconColor: "#fa755a" },
//   },
// };

// const inputStyle = {
//   width: "100%",
//   padding: "1rem 1.2rem",
//   background: "rgba(255,255,255,0.06)",
//   border: "1px solid rgba(255,255,255,0.12)",
//   borderRadius: "10px",
//   color: "#fff",
//   fontSize: "1rem",
//   outline: "none",
//   boxSizing: "border-box",
//   marginBottom: "1.2rem",
// };

// const tabStyle = (active) => ({
//   flex: 1,
//   padding: "0.75rem",
//   border: "none",
//   borderRadius: "8px",
//   fontSize: "0.95rem",
//   fontWeight: "600",
//   cursor: "pointer",
//   transition: "all 0.2s",
//   background: active
//     ? "linear-gradient(135deg,#d4af37,#f0d060)"
//     : "rgba(255,255,255,0.07)",
//   color: active ? "#1a1a2e" : "rgba(255,255,255,0.6)",
// });

// const payBtnStyle = (loading) => ({
//   width: "100%",
//   padding: "1.1rem",
//   fontSize: "1.05rem",
//   borderRadius: "10px",
//   border: "none",
//   background: loading
//     ? "rgba(212,175,55,0.5)"
//     : "linear-gradient(135deg,#d4af37,#f0d060)",
//   color: "#1a1a2e",
//   fontWeight: "700",
//   cursor: loading ? "not-allowed" : "pointer",
//   transition: "opacity 0.2s",
//   marginTop: "0.2rem",
// });

// /**
//  * PaymentForm — supports Card and UPI payment methods via Stripe.
//  *
//  * Props:
//  *   amount      – amount in paise (e.g. 50000 = ₹500)
//  *   onSuccess   – callback fired after payment succeeds
//  *   onError     – callback(message) fired on error
//  *   apiBase     – backend base URL
//  *   bookingData – forwarded to create-payment-intent
//  */
// export default function PaymentForm({
//   amount = 50000,
//   onSuccess,
//   onError,
//   apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
//   bookingData = {},
// }) {
//   const stripe = useStripe();
//   const elements = useElements();

//   const [method, setMethod] = useState("card"); // "card" | "upi"
//   const [upiId, setUpiId] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [cardComplete, setCardComplete] = useState(false);
//   const [upiStatus, setUpiStatus] = useState(""); // "" | "pending" | "success" | "failed"

//   // ── Helpers ─────────────────────────────────────────────────────────────────

//   const createIntent = async () => {
//     // Ensure apiBase has a trailing slash and path starts correctly
//     const baseUrl = apiBase.endsWith('/') ? apiBase : `${apiBase}/`;
//     const res = await fetch(`${baseUrl}admin/create-payment-intent`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ amount, ...bookingData }),
//     });
//     if (!res.ok) throw new Error("Failed to create payment intent.");
//     const json = await res.json();
//     // Handle both { clientSecret } and { data: { clientSecret } }
//     return json?.data?.clientSecret ? json.data : json;
//   };

//   // ── Card Submit ──────────────────────────────────────────────────────────────

//   const handleCardSubmit = async (e) => {
//     e.preventDefault();
//     if (!stripe || !elements) return;

//     if (!cardComplete) {
//       setError("Please complete your card details.");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const { clientSecret } = await createIntent();

//       const result = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: { card: elements.getElement(CardElement) },
//       });

//       if (result.error) {
//         setError(result.error.message);
//         onError?.(result.error.message);
//       } else if (result.paymentIntent?.status === "succeeded") {
//         onSuccess?.();
//       }
//     } catch (err) {
//       const msg = err.message || "An unexpected error occurred.";
//       setError(msg);
//       onError?.(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── UPI Submit ───────────────────────────────────────────────────────────────

//   const handleUpiSubmit = async (e) => {
//     e.preventDefault();
//     if (!stripe) return;

//     if (!upiId || !upiId.includes("@")) {
//       setError("Please enter a valid UPI ID (e.g. name@upi).");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setUpiStatus("pending");

//     try {
//       const { clientSecret } = await createIntent();

//       // Stripe UPI (India) uses confirmUpiPayment
//       const result = await stripe.confirmUpiPayment(clientSecret, {
//         payment_method: { upi: { vpa: upiId } },
//         return_url: `${window.location.origin}/book/payment-status`,
//       });

//       if (result.error) {
//         setError(result.error.message);
//         setUpiStatus("failed");
//         onError?.(result.error.message);
//       } else {
//         // UPI is async — status can be "requires_action" or "processing"
//         const status = result.paymentIntent?.status;
//         if (status === "succeeded") {
//           setUpiStatus("success");
//           onSuccess?.();
//         } else if (status === "requires_action" || status === "processing") {
//           // User needs to approve in their UPI app
//           setUpiStatus("pending");
//         }
//       }
//     } catch (err) {
//       const msg = err.message || "An unexpected error occurred.";
//       setError(msg);
//       setUpiStatus("failed");
//       onError?.(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Render ───────────────────────────────────────────────────────────────────

//   return (
//     <div style={{ width: "100%" }}>
//       {/* Method tabs */}
//       <div
//         style={{
//           display: "flex",
//           gap: "0.6rem",
//           marginBottom: "1.4rem",
//           background: "rgba(255,255,255,0.04)",
//           borderRadius: "10px",
//           padding: "0.3rem",
//         }}
//       >
//         <button
//           type="button"
//           style={tabStyle(method === "card")}
//           onClick={() => { setMethod("card"); setError(""); setUpiStatus(""); }}
//         >
//           💳 Credit / Debit Card
//         </button>
//         <button
//           type="button"
//           style={tabStyle(method === "upi")}
//           onClick={() => { setMethod("upi"); setError(""); setUpiStatus(""); }}
//         >
//           📱 UPI
//         </button>
//       </div>

//       {/* ── Card Form ───────────────────────────────────────────────────────── */}
//       <div style={{ display: method === "card" ? "block" : "none" }}>
//         <form onSubmit={handleCardSubmit} style={{ width: "100%" }}>
//           <div
//             style={{
//               background: "rgba(255,255,255,0.06)",
//               border: "1px solid rgba(255,255,255,0.12)",
//               borderRadius: "10px",
//               padding: "1.1rem 1.2rem",
//               marginBottom: error ? "0.6rem" : "1.4rem",
//             }}
//           >
//             <CardElement 
//               options={CARD_ELEMENT_OPTIONS} 
//               onChange={(e) => {
//                 setCardComplete(e.complete);
//                 if (e.error) setError(e.error.message);
//                 else setError("");
//               }}
//             />
//           </div>

//           {error && method === "card" && (
//             <p style={{ color: "#fa755a", fontSize: "0.85rem", marginBottom: "1rem" }}>
//               {error}
//             </p>
//           )}

//           <button 
//             type="submit" 
//             disabled={!stripe || loading || !cardComplete} 
//             style={payBtnStyle(loading || !cardComplete)}
//           >
//             {loading ? "Processing…" : `Pay ₹${(amount / 100).toFixed(0)}`}
//           </button>
//         </form>
//       </div>

//       {/* ── UPI Form ────────────────────────────────────────────────────────── */}
//       <div style={{ display: method === "upi" ? "block" : "none" }}>
//         <form onSubmit={handleUpiSubmit} style={{ width: "100%" }}>
//           <label
//             style={{
//               display: "block",
//               color: "rgba(255,255,255,0.6)",
//               fontSize: "0.85rem",
//               marginBottom: "0.5rem",
//             }}
//           >
//             Enter your UPI ID
//           </label>
//           <input
//             type="text"
//             placeholder="yourname@upi"
//             value={upiId}
//             onChange={(e) => setUpiId(e.target.value)}
//             style={inputStyle}
//             autoComplete="off"
//           />

//           {error && method === "upi" && (
//             <p style={{ color: "#fa755a", fontSize: "0.85rem", marginBottom: "0.8rem" }}>
//               {error}
//             </p>
//           )}

//           {/* UPI status messages */}
//           {upiStatus === "pending" && !loading && (
//             <div
//               style={{
//                 background: "rgba(212,175,55,0.1)",
//                 border: "1px solid rgba(212,175,55,0.3)",
//                 borderRadius: "8px",
//                 padding: "0.9rem 1.1rem",
//                 marginBottom: "1rem",
//                 color: "#d4af37",
//                 fontSize: "0.9rem",
//               }}
//             >
//               ⏳ Payment request sent to <strong>{upiId}</strong>.<br />
//               Please open your UPI app and approve the payment.
//             </div>
//           )}

//           {upiStatus === "failed" && (
//             <p style={{ color: "#fa755a", fontSize: "0.88rem", marginBottom: "0.8rem" }}>
//               ❌ UPI payment failed or was declined. Please try again.
//             </p>
//           )}

//           <button
//             type="submit"
//             disabled={!stripe || loading || upiStatus === "pending"}
//             style={payBtnStyle(loading || upiStatus === "pending")}
//           >
//             {loading
//               ? "Sending request…"
//               : upiStatus === "pending"
//               ? "Awaiting approval…"
//               : `Pay ₹${(amount / 100).toFixed(0)} via UPI`}
//           </button>

//           <p
//             style={{
//               color: "rgba(255,255,255,0.3)",
//               fontSize: "0.78rem",
//               textAlign: "center",
//               marginTop: "0.8rem",
//             }}
//           >
//             Supported: Google Pay, PhonePe, Paytm, BHIM &amp; all UPI apps
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }


"use client";

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#fff",
      fontFamily: "'Inter', 'Helvetica Neue', Helvetica, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      "::placeholder": { color: "rgba(255,255,255,0.4)" },
    },
    invalid: { color: "#fa755a", iconColor: "#fa755a" },
  },
};

const payBtnStyle = (loading) => ({
  width: "100%",
  padding: "1.1rem",
  fontSize: "1.05rem",
  borderRadius: "10px",
  border: "none",
  background: loading
    ? "rgba(212,175,55,0.5)"
    : "linear-gradient(135deg,#d4af37,#f0d060)",
  color: "#1a1a2e",
  fontWeight: "700",
  cursor: loading ? "not-allowed" : "pointer",
  transition: "opacity 0.2s",
  marginTop: "1.2rem",
});

export default function PaymentForm({
  amount = 50000,
  onSuccess,
  onError,
  apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  bookingData = {},
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [cardComplete, setCardComplete] = useState(false);

  // Create PaymentIntent
  useEffect(() => {
    const createIntent = async () => {
      try {
        const baseUrl = apiBase.endsWith("/") ? apiBase : `${apiBase}/`;

        const res = await fetch(`${baseUrl}admin/create-payment-intent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount, ...bookingData }),
        });

        const data = await res.json();
        // The backend might return { clientSecret: '...' } or { data: { clientSecret: '...' } }
        const secret = data.clientSecret || data.data?.clientSecret;
        if (secret) {
          setClientSecret(secret);
        } else {
          setError("Invalid response from payment server.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to initialize payment.");
      }
    };

    createIntent();
  }, [amount, apiBase]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) return;

    if (!cardComplete) {
      setError("Please complete your card details.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        setError(error.message);
        onError?.(error.message);
        setLoading(false);
      } else if (paymentIntent.status === "succeeded") {
        onSuccess?.();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  if (!clientSecret && !error) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.95rem" }}>Initializing secure payment...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <div
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "10px",
          padding: "1.1rem 1.2rem",
          transition: "border-color 0.2s",
        }}
      >
        <CardElement
          options={CARD_ELEMENT_OPTIONS}
          onChange={(e) => {
            setCardComplete(e.complete);
            if (e.error) setError(e.error.message);
            else setError("");
          }}
        />
      </div>

      {error && (
        <p style={{ color: "#fa755a", fontSize: "0.85rem", marginTop: "12px", textAlign: "center" }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || loading || !cardComplete}
        style={payBtnStyle(loading || !cardComplete)}
      >
        {loading ? "Processing…" : `Pay ₹${(amount / 100).toFixed(0)}`}
      </button>

      <p
        style={{
          color: "rgba(255,255,255,0.3)",
          fontSize: "0.75rem",
          textAlign: "center",
          marginTop: "1rem",
        }}
      >
        🔒 Secure payment powered by Stripe
      </p>
    </form>
  );
}