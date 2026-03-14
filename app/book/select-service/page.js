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

  // When arriving via "Book Now" from featured/service cards,
  // read the pending selection saved in sessionStorage and hydrate the context.
  useEffect(() => {
    if (!isSkipping) return;

    try {
      const raw = sessionStorage.getItem('pendingBookingSelection');
      if (!raw) return;
      const { serviceId, sectionId, gender } = JSON.parse(raw);
      sessionStorage.removeItem('pendingBookingSelection');

      // Hydrate gender (audience)
      if (gender) {
        setSelectedAudience(gender);
        Cookies.set('selectedAudience', gender, { expires: 7 });
      }

      // Hydrate section (category)
      if (sectionId) {
        const sections = listSectionByGenderData?.data || [];
        const matched = sections.find((c) => (c._id || c.id) === sectionId);
        if (matched) {
          setSelectedCategory({ id: matched._id || matched.id, name: matched.name });
        }
        Cookies.set('sectionId', sectionId, { expires: 7 });
      }

      // Hydrate service
      if (serviceId) {
        const services = listServicesData?.data || [];
        const matched = services.find((s) => (s._id || s.id) === serviceId);
        if (matched) {
          setSelectedService({
            id: matched._id || matched.id,
            name: matched.serviceName || matched.name,
            price: matched.price,
            duration: matched.duration,
          });
        } else {
          // Services might not be loaded yet — store the serviceId in cookie
          // so BookingContext hydration picks it up once services load.
          Cookies.set('serviceId', serviceId, { expires: 7 });
        }
      }
    } catch {
      // no-op
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSkipping]);

  // Once the service is hydrated and we are in skip mode, go directly to staff.
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

  const services = useMemo(() => {
    const rawServices = listServicesData?.data || (Array.isArray(listServicesData) ? listServicesData : []);
    return rawServices.map(s => ({
      id: s._id || s.id,
      name: s.serviceName || s.name,
      price: s.price,
      duration: s.duration
    }));
  }, [listServicesData]);

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
