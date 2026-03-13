'use client';
import Link from 'next/link';
import styles from './Navbar.module.css';


import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/userSlice';
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        router.push('/login');
    };

    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.container}`}>
                <Link href="/" className={styles.logo}>
                    LUXE<span style={{ color: 'var(--primary)' }}>SALON</span>
                </Link>
                <div className={styles.links}>
                    <Link href="/">Home</Link>
                    <Link href="/services">Services</Link>
                    <Link href="/book">Book Now</Link>
                    {user ? (
                        <>
                            <Link href="/dashboard" className="btn btn-secondary">Dashboard</Link>
                            <button onClick={handleLogout} className="btn btn-primary" style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }}>Logout</button>
                        </>
                    ) : (
                        <Link href="/login" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
