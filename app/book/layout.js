'use client';
import { BookingProvider } from './BookingContext';
import styles from './Booking.module.css';
import Navbar from '../components/Navbar';
import { usePathname } from 'next/navigation';

function BookingProgress() {
    const pathname = usePathname();

    const steps = [
        { key: 'service', path: '/book/select-service', label: '1' },
        { key: 'staff', path: '/book/select-service/select-staff', label: '2' },
        { key: 'date', path: '/book/select-service/select-staff/select-date', label: '3' },
        { key: 'confirm', path: '/book/select-service/select-staff/select-date/confirm', label: '4' },
    ];

    const currentStepIndex = steps.findIndex(step => pathname.includes(step.path));

    return (
        <div className={styles.stepper}>
            {steps.map((step, index) => (
                <div
                    key={step.key}
                    className={`${styles.stepIcon} ${index === currentStepIndex ? styles.stepActive :
                            index < currentStepIndex ? styles.stepCompleted : ''
                        }`}
                >
                    {index < currentStepIndex ? '✓' : step.label}
                </div>
            ))}
        </div>
    );
}

export default function BookingLayout({ children }) {
    return (
        <BookingProvider>
            <div className={styles.page}>
                <Navbar />
                <div className={`container ${styles.container}`}>
                    <h1 className={styles.sectionTitle}>Book Your Experience</h1>
                    <BookingProgress />
                    {children}
                </div>
            </div>
        </BookingProvider>
    );
}
