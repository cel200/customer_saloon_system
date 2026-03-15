'use client';
import { useState } from 'react';
import styles from '../login/Login.module.css';
import { useRouter } from 'next/navigation';
import { store } from '@/store/store';
import { loginUser, sendOtpMobile } from '@/store/userThunk';
import Cookies from 'js-cookie';

export default function LoginForm({ redirect = '/' }) {
    const [isLogin, setIsLogin] = useState(true);
    const [credentials, setCredentials] = useState({ email: '', password: '', name: '', mobile: '' });
    const [error, setError] = useState('');

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const params = new URLSearchParams(window.location.search);
            const targetRedirect = params.get('redirect') || redirect;

            if (isLogin) {
                if (!credentials.email || !credentials.password) {
                    setError('Please fill all fields');
                    return;
                }

                const response = await store.dispatch(
                    loginUser({ email: credentials.email, password: credentials.password })
                ).unwrap();

                const userData = response?.user || response?.data || response;
                console.log("userData", userData)
                Cookies.set("userToken", userData?.token)
                Cookies.set("userId", userData?.id || userData?.id)
                if (userData) {
                    router.push(targetRedirect);
                }
            } else {
                if (!credentials.name || !credentials.email || !credentials.mobile) {
                    setError('Please fill all fields');
                    return;
                }

                await store.dispatch(sendOtpMobile({ phone: credentials.mobile, portal: "user" })).unwrap();

                const pendingSignup = {
                    name: credentials.name,
                    email: credentials.email,
                    mobile: credentials.mobile,
                    emailOtpVerified: true,
                    mobileOtpVerified: false,
                    redirect: targetRedirect,
                };

                sessionStorage.setItem('pendingSignup', JSON.stringify(pendingSignup));
                router.push('/verify-mobile-otp');
            }
        } catch (err) {
            setError(typeof err === 'string' ? err : err?.message || 'Something went wrong');
        }
    };

    return (
        <div className={styles.card}>
            <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            {error && <p className={styles.error}>{error}</p>}
            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={credentials.name}
                                onChange={(e) => setCredentials({ ...credentials, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={credentials.email}
                                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Contact Number</label>
                            <input
                                type="tel"
                                placeholder="Enter your mobile no"
                                value={credentials.mobile}
                                onChange={(e) => setCredentials({ ...credentials, mobile: e.target.value })}
                            />
                        </div>
                    </>
                )}

                {isLogin && (
                    <>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={credentials.email}
                                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            />
                        </div>
                    </>
                )}

                <button className="btn btn-primary" type="submit" style={{ width: '100%', marginTop: '1rem' }}>
                    {isLogin ? 'Login' : 'Sign Up'}
                </button>
            </form>
            <p
                className={styles.toggle}
                onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setCredentials({ email: '', password: '', name: '', mobile: '' });
                }}
            >
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </p>
        </div>
    );
}
