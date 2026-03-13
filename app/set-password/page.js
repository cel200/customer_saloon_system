'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import styles from '../login/Login.module.css';
import { store } from '@/store/store';
import { registerUser } from '@/store/userThunk';

import Cookies from 'js-cookie';

export default function SetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
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
        if (!pendingSignup.mobileOtpVerified) {
            router.push('/verify-mobile-otp');
        }
    }, [router]);

    const handleSetPassword = async (e) => {
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

        if (!pendingSignup.mobileOtpVerified) {
            router.push('/verify-mobile-otp');
            return;
        }

        if (!password || !confirmPassword) {
            setError('Please fill all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const payload = {
                fullName: pendingSignup.name,
                email: pendingSignup.email,
                mobileNo: pendingSignup.mobile,
                password,
            };

            const response = await store.dispatch(registerUser(payload)).unwrap();
            const registeredUser = response?.data?.user || response?.user || response?.data || response;

            if (registeredUser?.token) {
                Cookies.set('userToken', registeredUser.token);
                Cookies.set('userId', registeredUser._id || registeredUser.id);
            }

            localStorage.setItem('user', JSON.stringify(registeredUser));
            sessionStorage.removeItem('pendingSignup');
            router.push(pendingSignup.redirect || '/');
        } catch (err) {
            setError(typeof err === 'string' ? err : err?.message || 'Registration failed');
        }
    };

    return (
        <div className={styles.page}>
            <Navbar />
            <div className={`container ${styles.container}`}>
                <div className={styles.card}>
                    <h2>Set Password</h2>
                    {error && <p className={styles.error}>{error}</p>}

                    <form onSubmit={handleSetPassword}>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>
                            Create Account
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
