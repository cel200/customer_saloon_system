'use client';
import { useBooking } from '../../BookingContext';
import StepStaff from '../../components/StepStaff';
import styles from '../../Booking.module.css';
import { useRouter } from 'next/navigation';
import { useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { listStaffs } from '@/store/userThunk';
import Cookies from 'js-cookie';

export default function SelectStaffPage() {
  const {
    selectedService, selectedStaff, setSelectedStaff,
    listStaffsData, stepPathMap, selectedCategory
  } = useBooking();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const savedServiceId = Cookies.get('serviceId');
    if (!selectedService && !savedServiceId) {
      router.replace(stepPathMap.service);
    }
  }, [selectedService, router, stepPathMap]);

  useEffect(() => {
    const sectionId = Cookies.get('sectionId') || selectedCategory?.id;
    if (sectionId) {
      dispatch(listStaffs({ sectionId }));
    } else {
      dispatch(listStaffs());
    }
  }, [dispatch, selectedCategory?.id]);

  const staffList = useMemo(() => listStaffsData?.data || listStaffsData || [], [listStaffsData]);

  const handleStaffSelect = (staff) => {
    setSelectedStaff(staff);
    router.push(stepPathMap.datetime);
  };

  if (!selectedService) return null;

  return (
    <StepStaff
      styles={styles}
      onBack={() => router.back()}
      selectedStaff={selectedStaff}
      handleStaffSelect={handleStaffSelect}
      staffList={staffList}
    />
  );
}
