'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../../components/Navbar';
import styles from '../Booking.module.css';
import { bookAppointment, getAppointmentAvailability, getAppointmentHistory, listSectionByGender, listServices, listStaffs } from '@/store/userThunk';
import Cookies from 'js-cookie';
import StepService from './StepService';
import StepStaff from './StepStaff';
import StepDateTime from './StepDateTime';
import StepConfirm from './StepConfirm';

const generateSlots = () => {
    return [
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
};

export default function BookingFlow({ currentStep = 'service' }) {
    const dispatch = useDispatch();
    const { user, loading } = useSelector((state) => state.auth);
    const { listSectionByGenderData } = useSelector((state) => state.listSectionByGender);
    const { listServicesData } = useSelector((state) => state.listServices);
    const { listStaffsData } = useSelector((state) => state.listStaffs);
    const { getAppointmentHistoryData } = useSelector((state) => state.getAppointmentHistory);
    const { getAppointmentAvailabilityData } = useSelector((state) => state.getAppointmentAvailability);
    const router = useRouter();
    const [selectedAudience, setSelectedAudience] = useState('Men');
    const [selectedCategory, setSelectedCategory] = useState({ id: '', name: '' });
    const [selectedService, setSelectedService] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState('idle');
    const [activeView, setActiveView] = useState('booking');
    const [pendingSelection, setPendingSelection] = useState(null);
    const audienceButtons = useMemo(
        () => [
            { id: 'Men', label: 'Men' },
            { id: 'Women', label: 'Women' },
            { id: 'Kids', label: 'Kids' },
        ],
        []
    );

    const services = useMemo(
        () =>
            (listServicesData?.data || []).map((service) => ({
                id: service?._id || service?.id,
                name: service?.serviceName || service?.name,
                price: service?.price,
                duration: service?.duration,
            })),
        [listServicesData]
    );

    const staffList = useMemo(
        () => listStaffsData?.data || listStaffsData || [],
        [listStaffsData]
    );

    const stepPathMap = useMemo(
        () => ({
            service: '/book/select-service',
            staff: '/book/select-service/select-staff',
            datetime: '/book/select-service/select-staff/select-date',
            confirm: '/book/select-service/select-staff/select-date/confirm',
        }),
        []
    );

    const goToStep = (step) => {
        const nextPath = stepPathMap[step] || '/book';
        router.push(nextPath);
    };

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login?redirect=/book');
        }
    }, [user, loading, router]);

    useEffect(() => {
        try {
            const raw = sessionStorage.getItem('pendingBookingSelection');
            if (!raw) return;

            const parsed = JSON.parse(raw);
            setPendingSelection(parsed);

            if (['Men', 'Women', 'Kids'].includes(parsed?.gender)) {
                setSelectedAudience(parsed.gender);
            }

            if (parsed?.sectionId) {
                setSelectedCategory({ id: parsed.sectionId, name: '' });
            }
        } catch {
            // no-op
        }
    }, []);

    useEffect(() => {
        if (!user) return;
        dispatch(getAppointmentHistory());
    }, [dispatch, user]);

    useEffect(() => {
        dispatch(listSectionByGender({ gender: selectedAudience }));
    }, [dispatch, selectedAudience]);

    useEffect(() => {
        dispatch(listStaffs());
    }, [dispatch]);

    useEffect(() => {
        const payload = { gender: selectedAudience };
        if (selectedCategory?.id) {
            payload.section = selectedCategory.id;
        }
        dispatch(listServices(payload));
    }, [dispatch, selectedAudience, selectedCategory?.id]);

    useEffect(() => {
        const categories = listSectionByGenderData?.data || [];
        if (!categories.length) {
            if (selectedCategory.id || selectedCategory.name) {
                setSelectedCategory({ id: '', name: '' });
            }
            return;
        }

        if (selectedCategory?.id) {
            const existingCategory = categories.find(
                (category) => String(category?._id) === String(selectedCategory.id)
            );

            if (existingCategory) {
                if (selectedCategory.name !== existingCategory?.name) {
                    setSelectedCategory({
                        id: existingCategory?._id || '',
                        name: existingCategory?.name || '',
                    });
                }
                return;
            }
        }

        if (pendingSelection?.sectionId) {
            const matchedCategory = categories.find(
                (category) => String(category?._id) === String(pendingSelection.sectionId)
            );

            if (matchedCategory) {
                const nextId = matchedCategory?._id || '';
                const nextName = matchedCategory?.name || '';
                if (selectedCategory.id !== nextId || selectedCategory.name !== nextName) {
                    setSelectedCategory({
                        id: nextId,
                        name: nextName,
                    });
                }
                return;
            }
        }

        const hairCategory = categories.find(
            (category) => category?.name?.toLowerCase() === 'hair'
        );
        const defaultCategory = hairCategory || categories[0];
        const nextId = defaultCategory?._id || '';
        const nextName = defaultCategory?.name || '';
        if (selectedCategory.id !== nextId || selectedCategory.name !== nextName) {
            setSelectedCategory({
                id: nextId,
                name: nextName,
            });
        }
    }, [listSectionByGenderData, selectedAudience, pendingSelection?.sectionId, selectedCategory.id, selectedCategory.name]);

    useEffect(() => {
        if (!pendingSelection?.serviceId || !services.length) return;

        const matchedService = services.find(
            (service) => String(service?.id) === String(pendingSelection.serviceId)
        );

        if (!matchedService) return;

        setSelectedService(matchedService);
        setSelectedStaff(null);

        // If we were on the service step, move to staff
        if (currentStep === 'service') {
            router.push(stepPathMap.staff);
        }

        setActiveView('booking');
        sessionStorage.removeItem('pendingBookingSelection');
        setPendingSelection(null);
    }, [pendingSelection, services, router, stepPathMap, currentStep]);

    useEffect(() => {
        if (!user) return;

        const staffId = Cookies.get('staffId');
        if (staffId) {
            dispatch(getAppointmentAvailability({ staffId, appointmentDate: selectedDate }));
        }
    }, [dispatch, user, selectedDate]);

    useEffect(() => {
        if (activeView !== 'booking') return;

        if (currentStep === 'staff' && !selectedService) {
            router.replace(stepPathMap.service);
            return;
        }

        if (currentStep === 'datetime' && !selectedService) {
            router.replace(stepPathMap.service);
            return;
        }

        if (currentStep === 'confirm' && (!selectedService || !selectedSlot)) {
            router.replace(stepPathMap.datetime);
        }
    }, [activeView, currentStep, selectedService, selectedSlot, router, stepPathMap]);

    const handleServiceSelect = (service) => {
        setSelectedService(service);
        goToStep('staff');
    };

    const handleAudienceChange = (audience) => {
        setSelectedAudience(audience);
        setSelectedCategory({ id: '', name: '' });
        setSelectedService(null);
    };

    const handleStaffSelect = (staff) => {
        setSelectedStaff(staff);
        goToStep('datetime');
    };

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
        goToStep('confirm');
    };

    const handlePayment = () => {
        const userId = user?._id || user?.id || Cookies.get("userId");
        const selectedServiceId = selectedService?._id || selectedService?.id;
        const selectedStaffId = selectedStaff?._id || selectedStaff?.id || null;

        if (!userId) {
            console.error("User ID is missing.");
            return;
        }

        dispatch(bookAppointment({
            user: userId,
            service: selectedServiceId,
            section: selectedCategory?.id || null,
            staff: selectedStaffId,
            appointmentDate: selectedDate,
            timeSlot: selectedSlot,
            status:"Completed"
        }));
        setPaymentStatus('success');
        // setTimeout(() => {
        //     const booking = {
        //         id: Date.now(),
        //         service: selectedService.name,
        //         staff: selectedStaff ? selectedStaff.name : 'Any Available',
        //         date: selectedDate,
        //         time: selectedSlot,
        //         status: 'Confirmed',
        //         userEmail: user.email
        //     };

        //     const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        //     bookings.push(booking);
        //     localStorage.setItem('bookings', JSON.stringify(bookings));

        //     setPaymentStatus('success');
        // }, 2000);
    };

    if (loading) return <div>Loading...</div>;
    if (!user) return null;

    function formatDate(dateString) {
        const date = new Date(dateString);

        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }
    return (
        <div className={styles.page}>
            <Navbar />
            <div className={`container ${styles.container}`}>
                <h1 className="section-title">Book Your Appointment</h1>
                <div className={styles.viewTabs}>
                    <button
                        type="button"
                        className={`${styles.viewTab} ${activeView === 'booking' ? styles.viewTabActive : ''}`}
                        onClick={() => setActiveView('booking')}
                    >
                        Book Appointment
                    </button>
                    <button
                        type="button"
                        className={`${styles.viewTab} ${activeView === 'history' ? styles.viewTabActive : ''}`}
                        onClick={() => setActiveView('history')}
                    >
                        Appointment History
                    </button>
                </div>

                {activeView === 'booking' && currentStep === 'service' && (
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
                )}

                {activeView === 'booking' && currentStep === 'staff' && (
                    <StepStaff
                        styles={styles}
                        onBack={() => goToStep('service')}
                        selectedStaff={selectedStaff}
                        handleStaffSelect={handleStaffSelect}
                        staffList={staffList}
                    />
                )}

                {activeView === 'booking' && currentStep === 'datetime' && (
                    <StepDateTime
                        styles={styles}
                        onBack={() => goToStep('staff')}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        selectedSlot={selectedSlot}
                        handleSlotSelect={handleSlotSelect}
                        generateSlots={getAppointmentAvailabilityData?.availableSlots}
                    />
                )}

                {activeView === 'booking' && currentStep === 'confirm' && (
                    <StepConfirm
                        styles={styles}
                        onBack={() => goToStep('datetime')}
                        selectedService={selectedService}
                        selectedStaff={selectedStaff}
                        selectedDate={selectedDate}
                        selectedSlot={selectedSlot}
                        paymentStatus={paymentStatus}
                        onPaymentSuccess={handlePayment}
                        onPaymentError={() => setPaymentStatus('error')}
                        bookingData={{
                            user: user?._id || user?.id || Cookies.get("userId"),
                            service: selectedService?._id || selectedService?.id,
                            section: selectedCategory?.id || null,
                            staff: selectedStaff?._id || selectedStaff?.id || null,
                            appointmentDate: selectedDate,
                            timeSlot: selectedSlot,
                        }}
                    />
                )}

                {activeView === 'history' && (
                    <div className={styles.step}>
                        <h2>Your Appointment History</h2>
                        {getAppointmentHistoryData?.data?.length > 0 ? (
                            <div className={styles.historyList}>
                                {getAppointmentHistoryData?.data?.map((item) => (
                                    <div key={item._id} className={styles.historyItem}>
                                        <div>
                                            <h3>{item.service?.serviceName}</h3>
                                            <p>{item.staff?.fullName ? `with ${item.staff?.fullName}` : 'Any Available Staff'}</p>
                                            <p>{formatDate(item.appointmentDate)} at {item.timeSlot}</p>
                                        </div>
                                        <span className={styles.historyStatus}>{item.status || 'Confirmed'}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyHistory}>
                                No appointment history yet.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
