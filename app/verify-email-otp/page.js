'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import styles from '../login/Login.module.css';
import { store } from '@/store/store';
import { verifyOtpEmail } from '@/store/userThunk';

export default function VerifyEmailOtpPage() {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const router = useRouter();

    useEffect(() => {
        const pendingSignup = JSON.parse(sessionStorage.getItem('pendingSignup') || 'null');
        if (!pendingSignup) {
            router.push('/login');
            return;
        }
        setEmail(pendingSignup.email || '');
    }, [router]);

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');

        const pendingSignup = JSON.parse(sessionStorage.getItem('pendingSignup') || 'null');
        if (!pendingSignup) {
            router.push('/login');
            return;
        }

        if (!otp) {
            setError('Please enter email OTP');
            return;
        }

        try {
            await store.dispatch(verifyOtpEmail({ email: pendingSignup.email, otp })).unwrap();
            pendingSignup.emailOtpVerified = true;
            sessionStorage.setItem('pendingSignup', JSON.stringify(pendingSignup));
            router.push('/verify-mobile-otp');
        } catch (err) {
            setError(typeof err === 'string' ? err : err?.message || 'Invalid email OTP. Please try again');
        }
    };

    return (
        <div className={styles.page}>
            <Navbar />
            <div className={`container ${styles.container}`}>
                <div className={styles.card}>
                    <h2>Verify Email OTP</h2>
                    {email && <p style={{ marginBottom: '1rem', textAlign: 'center' }}>Code sent to: {email}</p>}
                    {error && <p className={styles.error}>{error}</p>}

                    <form onSubmit={handleVerify}>
                        <div className="form-group">
                            <label>Email OTP</label>
                            <input
                                type="text"
                                placeholder="Enter email OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                        <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>
                            Verify Email OTP
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
