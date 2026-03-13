'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BookPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const skip = params.get('skip');
    router.replace(`/book/select-service${skip ? '?skip=true' : ''}`);
  }, [router]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p>Initializing booking flow...</p>
    </div>
  );
}
