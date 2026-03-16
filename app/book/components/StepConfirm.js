'use client';

import PaymentForm from './PaymentForm';

export default function StepConfirm({
  styles,
  onBack,
  selectedService,
  selectedStaff,
  selectedDate,
  selectedSlot,
  paymentStatus,
  onPaymentSuccess,
  onPaymentError,
  bookingData,
}) {
  // Price in paise (₹1 = 100 paise). Fallback to ₹500 if price not set.
  const amountInPaise = selectedService?.price
    ? Math.round(Number(selectedService.price)) * 100
    : 50000;

  return (
    <div className={styles.step}>
      <button
        className="btn btn-secondary"
        onClick={onBack}
        style={{ marginBottom: '1.5rem' }}
      >
        ← Back
      </button>
      <h2 className={styles.stepTitle}>Confirm &amp; Pay</h2>

      {/* Booking Summary */}
      <div className={styles.card} style={{ cursor: 'default', marginBottom: '1.5rem' }}>
        <div className={styles.serviceInfo}>
          <h3>Appointment Summary</h3>
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <p>
              <strong>Service:</strong>{' '}
              <span style={{ color: '#fff' }}>{selectedService?.name}</span>
            </p>
            <p>
              <strong>Specialist:</strong>{' '}
              <span style={{ color: '#fff' }}>
                {selectedStaff ? selectedStaff?.fullName : 'Any Available'}
              </span>
            </p>
            <p>
              <strong>Date:</strong>{' '}
              <span style={{ color: '#fff' }}>{selectedDate}</span>
            </p>
            <p>
              <strong>Time:</strong>{' '}
              <span style={{ color: '#fff' }}>{selectedSlot}</span>
            </p>
          </div>
        </div>
        <div
          className={styles.priceTag}
          style={{
            fontSize: '2rem',
            marginTop: '2rem',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            paddingTop: '1.5rem',
          }}
        >
          Total: ₹{selectedService?.price ?? 500}
        </div>
      </div>

      {/* ── Payment States ── */}
      {paymentStatus === 'idle' && (
        <div>
          <p
            style={{
              color: 'rgba(255,255,255,0.55)',
              fontSize: '0.9rem',
              marginBottom: '1rem',
            }}
          >
            Please enter your card details to complete the booking.
          </p>
          <PaymentForm
            amount={amountInPaise}
            bookingData={bookingData}
            onSuccess={onPaymentSuccess}
            onError={onPaymentError}
          />
        </div>
      )}

      {paymentStatus === 'processing' && (
        <p style={{ marginTop: '2rem', textAlign: 'center', color: '#d4af37' }}>
          Securing your slot…
        </p>
      )}

      {paymentStatus === 'success' && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <h3
            style={{
              color: '#48c9b0',
              fontSize: '1.8rem',
              marginBottom: '1rem',
            }}
          >
            Booking Confirmed! 🎉
          </h3>
          <p
            style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}
          >
            Payment successful. We've sent the details to your email.
          </p>
          <button
            className="btn btn-secondary"
            onClick={() => (window.location.href = '/dashboard')}
            style={{ width: '100%' }}
          >
            Go to Dashboard
          </button>
        </div>
      )}

      {paymentStatus === 'error' && (
        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#fa755a' }}>
          Payment failed. Please try again.
        </p>
      )}
    </div>
  );
}
