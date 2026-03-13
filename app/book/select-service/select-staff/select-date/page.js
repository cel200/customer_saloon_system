'use client';
import { useBooking } from '../../../BookingContext';
import StepDateTime from '../../../components/StepDateTime';
import styles from '../../../Booking.module.css';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';

export default function SelectDatePage() {
  const {
    selectedService, selectedDate, setSelectedDate,
    selectedSlot, setSelectedSlot, stepPathMap
  } = useBooking();
  const router = useRouter();

  useEffect(() => {
    const savedServiceId = Cookies.get('serviceId');
    if (!selectedService && !savedServiceId) {
      router.replace(stepPathMap.service);
    }
  }, [selectedService, router, stepPathMap]);

  const generateSlots = () => [
    { label: '10:00 AM - 11:00 AM', value: '10:00 AM - 11:00 AM', isBreak: false },
    { label: '11:00 AM - 12:00 PM', value: '11:00 AM - 12:00 PM', isBreak: false },
    { label: '12:00 PM - 1:00 PM', value: '12:00 PM - 1:00 PM', isBreak: false },
    { label: '1:00 PM - 2:00 PM (Lunch Break)', value: '', isBreak: true },
    { label: '2:00 PM - 3:00 PM', value: '2:00 PM - 3:00 PM', isBreak: false },
    { label: '3:00 PM - 4:00 PM', value: '3:00 PM - 4:00 PM', isBreak: false },
    { label: '4:00 PM - 4:30 PM (Tea Break)', value: '', isBreak: true },
    { label: '4:30 PM - 5:30 PM', value: '4:30 PM - 5:30 PM', isBreak: false },
    { label: '6:30 PM - 7:30 PM', value: '6:30 PM - 7:30 PM', isBreak: false },
  ];
  const { getAppointmentAvailabilityData } = useSelector((state) => state.getAppointmentAvailability);
  console.log("getAppointmentAvailabilityData",getAppointmentAvailabilityData)
  // const router = useRouter();
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    router.push(stepPathMap.confirm);
  };

  if (!selectedService) return null;

  return (
    <StepDateTime
      styles={styles}
      onBack={() => router.back()}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      selectedSlot={selectedSlot}
      handleSlotSelect={handleSlotSelect}
      generateSlots={getAppointmentAvailabilityData?.availableSlots}
    />
  );
}
