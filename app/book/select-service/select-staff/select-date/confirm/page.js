'use client';

import { useBooking } from '../../../../BookingContext';
import StepConfirm from '../../../../components/StepConfirm';
import styles from '../../../../Booking.module.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { bookAppointment } from '@/store/userThunk';
import Cookies from 'js-cookie';

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

    const [clientSecret, setClientSecret] = useState(null);

    useEffect(() => {
        const savedServiceId = Cookies.get('serviceId');

        if ((!selectedService && !savedServiceId) || !selectedSlot) {
            router.replace(stepPathMap.datetime);
        }
    }, [selectedService, selectedSlot, router, stepPathMap]);

    // Create PaymentIntent
    useEffect(() => {

        const createPaymentIntent = async () => {

            try {

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}admin/create-payment-intent`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            amount: selectedService?.price * 100
                        }),
                    }
                );

                const data = await res.json();

                setClientSecret(data.clientSecret);

            } catch (error) {
                console.error("PaymentIntent creation failed", error);
            }
        };

        if (selectedService) {
            createPaymentIntent();
        }

    }, [selectedService]);

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

    if (!clientSecret) {
        return <p style={{ color: "white" }}>Loading payment...</p>;
    }

    return (
        <Elements
            stripe={stripePromise}
            options={{
                ...ELEMENTS_OPTIONS,
                clientSecret
            }}
        >
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