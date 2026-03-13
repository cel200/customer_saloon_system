'use client';
import { useBooking } from '../BookingContext';
import StepService from '../components/StepService';
import styles from '../Booking.module.css';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, Suspense } from 'react';

import Link from 'next/link';
import Cookies from 'js-cookie';

import { useSearchParams } from 'next/navigation';

function SelectServiceContent() {
  const {
    selectedAudience, setSelectedAudience,
    selectedCategory, setSelectedCategory,
    selectedService, setSelectedService,
    listSectionByGenderData, listServicesData,
    stepPathMap
  } = useBooking();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isSkipping = searchParams.get('skip') === 'true';

  // If we have a service selected and skip=true,
  // skip directly to the staff selection.
  useEffect(() => {
    if (selectedService && isSkipping) {
      router.replace(stepPathMap.staff);
    }
  }, [selectedService, isSkipping, router, stepPathMap.staff]);

  const audienceButtons = useMemo(() => [
    { id: 'Men', label: 'Men' },
    { id: 'Women', label: 'Women' },
    { id: 'Kids', label: 'Kids' },
  ], []);

  const services = useMemo(() =>
    (listServicesData?.data || []).map(s => ({
      id: s._id || s.id,
      name: s.serviceName || s.name,
      price: s.price,
      duration: s.duration
    })),
    [listServicesData]);

  // Prevent flicker: if we are about to redirect, don't render anything
  if (selectedService && isSkipping) return null;

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    router.push(stepPathMap.staff);
  };

  const handleAudienceChange = (audience) => {
    setSelectedAudience(audience);
    setSelectedCategory({ id: '', name: '' });
    setSelectedService(null);
    Cookies.remove('sectionId');
    Cookies.remove('serviceId');
    Cookies.remove('staffId');
  };

  return (
    <div className={styles.step}>
      <div className={styles.viewTabs}>
        <div className={`${styles.viewTab} ${styles.viewTabActive}`}>
          Book Appointment
        </div>
        <Link href="/book/history" className={styles.viewTab}>
          Appointment History
        </Link>
      </div>

      <StepService
        styles={styles}
        audienceButtons={audienceButtons}
        selectedAudience={selectedAudience}
        handleAudienceChange={handleAudienceChange}
        listSectionByGenderData={listSectionByGenderData}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        setSelectedService={setSelectedService}
        services={services}
        selectedService={selectedService}
        handleServiceSelect={handleServiceSelect}
      />
    </div>
  );
}

export default function SelectServicePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SelectServiceContent />
    </Suspense>
  );
}
