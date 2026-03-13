'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import styles from '../login/Login.module.css';
import { store } from '@/store/store';
import { verifyOtpMobile } from '@/store/userThunk';

export default function VerifyMobileOtpPage() {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [mobile, setMobile] = useState('');
    const router = useRouter();

    useEffect(() => {
        const pendingSignup = JSON.parse(sessionStorage.getItem('pendingSignup') || 'null');
        if (!pendingSignup) {
            router.push('/login');
            return;
        }
        if (!pendingSignup.emailOtpVerified) {
            router.push('/verify-email-otp');
            return;
        }
        if (pendingSignup.mobileOtpVerified) {
            router.push('/set-password');
            return;
        }
        setMobile(pendingSignup.mobile || '');
    }, [router]);

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');

        const pendingSignup = JSON.parse(sessionStorage.getItem('pendingSignup') || 'null');
        if (!pendingSignup) {
            router.push('/login');
            return;
        }

        if (!pendingSignup.emailOtpVerified) {
            router.push('/verify-email-otp');
            return;
        }

        if (!otp) {
            setError('Please enter mobile OTP');
            return;
        }

        try {
            await store.dispatch(verifyOtpMobile({ phone: pendingSignup.mobile, code:otp,portal:"user" })).unwrap();
            pendingSignup.mobileOtpVerified = true;
            sessionStorage.setItem('pendingSignup', JSON.stringify(pendingSignup));
            router.push('/set-password');
        } catch (err) {
            setError(typeof err === 'string' ? err : err?.message || 'Invalid mobile OTP. Please try again');
        }
    };

    return (
        <div className={styles.page}>
            <Navbar />
            <div className={`container ${styles.container}`}>
                <div className={styles.card}>
                    <h2>Verify Mobile OTP</h2>
                    {mobile && <p style={{ marginBottom: '1rem', textAlign: 'center' }}>Code sent to: {mobile}</p>}
                    {error && <p className={styles.error}>{error}</p>}

                    <form onSubmit={handleVerify}>
                        <div className="form-group">
                            <label>Mobile OTP</label>
                            <input
                                type="text"
                                placeholder="Enter mobile OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                        <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>
                            Verify Mobile OTP
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
