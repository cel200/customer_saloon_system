'use client';
import styles from './Login.module.css';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
    return (
        <div className={styles.page}>
            <div className={`container ${styles.container}`}>
                <LoginForm redirect="/dashboard" />
            </div>
        </div>
    );
}
