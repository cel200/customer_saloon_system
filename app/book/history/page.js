'use client';
import { useBooking } from '../BookingContext';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getAppointmentHistory } from '@/store/userThunk';
import styles from '../Booking.module.css';
import Link from 'next/link';

export default function HistoryPage() {
    const { user } = useBooking();
    const dispatch = useDispatch();
    const { getAppointmentHistoryData } = useSelector((state) => state.getAppointmentHistory);

    useEffect(() => {
        if (user) {
            dispatch(getAppointmentHistory());
        }
    }, [dispatch, user]);

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    return (
        <div className={styles.step}>
            <div className={styles.viewTabs}>
                <Link href="/book/select-service" className={styles.viewTab}>
                    Book Appointment
                </Link>
                <div className={`${styles.viewTab} ${styles.viewTabActive}`}>
                    Appointment History
                </div>
            </div>

            <h2>Your Appointment History</h2>
            {getAppointmentHistoryData?.data?.length > 0 ? (
                <div className={styles.historyList}>
                    {getAppointmentHistoryData?.data?.map((item) => (
                        <div key={item._id} className={styles.historyItem}>
                            <div>
                                <h3>{item.service?.serviceName}</h3>
                                <p>{item.staff?.fullName ? `with ${item.staff?.fullName}` : 'Any Available Staff'}</p>
                                <p>{formatDate(item.appointmentDate)} at {item.timeSlot}</p>
                            </div>
                            <span className={styles.historyStatus}>{item.status || 'Confirmed'}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.emptyHistory}>
                    No appointment history yet.
                </div>
            )}
        </div>
    );
}
