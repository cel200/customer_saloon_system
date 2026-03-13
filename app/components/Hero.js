import Link from 'next/link';
import styles from './Hero.module.css';

const Hero = () => {
    return (
        <section className={styles.hero}>
            <div className={`container ${styles.container}`}>
                <h1>Luxury Unleashed.</h1>
                <p>Welcome to LuxeSalon, where beauty meets elegance. Experience our premium services tailored just for you.</p>
                <div className={styles.buttons}>
                    <Link href="/book" className="btn btn-primary">Book Appointment</Link>
                    <Link href="/services" className="btn btn-secondary">Explore Services</Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;
