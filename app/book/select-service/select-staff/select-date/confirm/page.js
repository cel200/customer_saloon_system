'use client';
import { useBooking } from '../../../../BookingContext';
import StepConfirm from '../../../../components/StepConfirm';
import styles from '../../../../Booking.module.css';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { bookAppointment } from '@/store/userThunk';
import Cookies from 'js-cookie';

// ── Stripe ────────────────────────────────────────────────────────────────────
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';

const ELEMENTS_OPTIONS = {
    appearance: {
        theme: 'night',
        variables: {
            colorPrimary: '#d4af37',
            colorBackground: '#1a1a2e',
            colorText: '#ffffff',
            borderRadius: '8px',
        },
    },
};

export default function ConfirmPage() {
    const {
        selectedService, selectedStaff, selectedDate,
        selectedSlot, paymentStatus, setPaymentStatus,
        selectedCategory, stepPathMap, user
    } = useBooking();
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        const savedServiceId = Cookies.get('serviceId');
        if ((!selectedService && !savedServiceId) || !selectedSlot) {
            router.replace(stepPathMap.datetime);
        }
    }, [selectedService, selectedSlot, router, stepPathMap]);

    // Called by PaymentForm after Stripe payment succeeds
    const handlePaymentSuccess = () => {
        const userId = user?._id || user?.id || Cookies.get('userId');
        const selectedServiceId = selectedService?._id || selectedService?.id;
        const selectedStaffId = selectedStaff?._id || selectedStaff?.id || null;

        if (!userId) {
            console.error('User ID is missing.');
            return;
        }

        dispatch(bookAppointment({
            user: userId,
            service: selectedServiceId,
            section: selectedCategory?.id || null,
            staff: selectedStaffId,
            appointmentDate: selectedDate,
            timeSlot: selectedSlot,
            paymentStatus: "Completed",
            status: "Completed",
            paymentType: "online",
            bookingType: "online",
        }));

        setPaymentStatus('success');
    };

    const handlePaymentError = (message) => {
        console.error('Payment error:', message);
        setPaymentStatus('error');
    };

    // Build bookingData passed to the backend create-payment-intent endpoint
    const bookingData = {
        user: user?._id || user?.id || Cookies.get('userId'),
        service: selectedService?._id || selectedService?.id,
        section: selectedCategory?.id || null,
        staff: selectedStaff?._id || selectedStaff?.id || null,
        appointmentDate: selectedDate,
        timeSlot: selectedSlot,
        paymentStatus: "Completed",
        status: "Completed",
        paymentType: "online",
        bookingType: "online",
    };

    if (!selectedService || !selectedSlot) return null;

    return (
        <Elements stripe={stripePromise} options={ELEMENTS_OPTIONS}>
            <StepConfirm
                styles={styles}
                onBack={() => router.back()}
                selectedService={selectedService}
                selectedStaff={selectedStaff}
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                paymentStatus={paymentStatus}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                bookingData={bookingData}
            />
        </Elements>
    );
}
