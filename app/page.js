'use client';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Link from 'next/link';
import ServiceCard from './components/ServiceCard';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listSectionByGender } from '@/store/userThunk';
import { useRouter } from 'next/navigation';

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, loading } = useSelector((state) => state.auth);
  const [selectedAudience, setSelectedAudience] = useState('Men');
  const [selectedCategory, setSelectedCategory] = useState({ id: '', name: '' });

  const { listSectionByGenderData } = useSelector(
    (state) => state.listSectionByGender,
  );

  const audienceButtons = useMemo(
    () => [
      { id: 'Men', label: 'Men' },
      { id: 'Women', label: 'Women' },
      { id: 'Kids', label: 'Kids' }
    ],
    []
  );

  useEffect(() => {
    if (user?.token) {
      dispatch(listSectionByGender({ gender: selectedAudience }));
    }
  }, [dispatch, selectedAudience, user]);

  useEffect(() => {
    const categories = listSectionByGenderData?.data || [];
    if (!categories.length) {
      setSelectedCategory({ id: '', name: '' });
      return;
    }

    const hairCategory = categories.find(
      (category) => category?.name?.toLowerCase() === 'hair'
    );
    const defaultCategory = hairCategory || categories[0];
    setSelectedCategory({
      id: defaultCategory?._id || '',
      name: defaultCategory?.name || '',
    });
  }, [listSectionByGenderData, selectedAudience]);

  const handleAudienceChange = (audience) => {
    setSelectedAudience(audience);
    setSelectedCategory({ id: '', name: '' });
  };

  useEffect(() => {
    if (!loading && !user?.token) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading || !user?.token) {
    return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <main>
      <Navbar />
      <Hero />

      <section className="container" style={{ padding: '4rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 className="section-title">Featured Services</h2>
          <Link href="/services" className="btn btn-secondary">View All</Link>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {audienceButtons.map((audience) => (
              <button
                key={audience.id}
                type="button"
                onClick={() => handleAudienceChange(audience.id)}
                style={{
                  padding: '0.6rem 1.1rem',
                  borderRadius: '999px',
                  border: selectedAudience === audience.id ? '1px solid var(--primary)' : '1px solid var(--border)',
                  background: selectedAudience === audience.id ? 'var(--primary)' : 'var(--white)',
                  color: selectedAudience === audience.id ? 'var(--white)' : 'var(--text)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {audience.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            {listSectionByGenderData?.data?.map((category) => (
              <button
                key={category._id}
                type="button"
                onClick={() => setSelectedCategory({ id: category?._id, name: category?.name })}
                style={{
                  padding: '0.5rem 0.9rem',
                  borderRadius: '0.6rem',
                  border: selectedCategory?.id === category?._id ? '1px solid var(--accent)' : '1px solid var(--border)',
                  background: selectedCategory?.id === category?._id ? 'rgba(32, 100, 244, 0.08)' : 'var(--white)',
                  color: 'var(--text)',
                  cursor: 'pointer'
                }}
              >
                {category?.name}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          <ServiceCard
            selectedAudience={selectedAudience}
            selectedCategoryId={selectedCategory?.id}
          />
        </div>
      </section>

      <section style={{ background: 'var(--secondary)', padding: '4rem 0', marginTop: '2rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">Why Choose Us?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
            <div className="card">
              <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Premium Products</h3>
              <p>We use only the finest organic and dermatologically tested products.</p>
            </div>
            <div className="card">
              <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Expert Staff</h3>
              <p>Our team consists of certified professionals with years of experience.</p>
            </div>
            <div className="card">
              <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Relaxing Ambience</h3>
              <p>Escape the hustle and bustle in our serene and luxurious environment.</p>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ padding: '2rem 0', textAlign: 'center', borderTop: '1px solid var(--border)', marginTop: '4rem' }}>
        <div className="container">
          <p>&copy; 2024 LuxeSalon. All rights reserved.</p>
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link href="#" style={{ color: 'var(--accent)' }}>Instagram</Link>
            <Link href="#" style={{ color: 'var(--accent)' }}>Facebook</Link>
            <Link href="#" style={{ color: 'var(--accent)' }}>Twitter</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
