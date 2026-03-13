'use client';
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { listSectionByGender, listServices, listStaffs, getAppointmentAvailability } from '@/store/userThunk';
import Cookies from 'js-cookie';

const BookingContext = createContext();

export function BookingProvider({ children }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading } = useSelector((state) => state.auth);
    const { listSectionByGenderData } = useSelector((state) => state.listSectionByGender);
    const { listServicesData } = useSelector((state) => state.listServices);
    const { listStaffsData } = useSelector((state) => state.listStaffs);
    const { getAppointmentAvailabilityData } = useSelector((state) => state.getAppointmentAvailability)
    const [selectedAudience, setSelectedAudience] = useState('Men');
    const [selectedCategory, setSelectedCategory] = useState({ id: '', name: '' });
    const [selectedService, setSelectedService] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState('idle');
    const [activeView, setActiveView] = useState('booking');

    const stepPathMap = useMemo(() => ({
        service: '/book/select-service',
        staff: '/book/select-service/select-staff',
        datetime: '/book/select-service/select-staff/select-date',
        confirm: '/book/select-service/select-staff/select-date/confirm',
    }), []);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            router.push(`/login?redirect=${pathname}`);
        }
    }, [user, loading, router, pathname]);

    // Initial hydration for audience
    useEffect(() => {
        const savedAudience = Cookies.get('selectedAudience');
        if (savedAudience) setSelectedAudience(savedAudience);
    }, []);

    // Save audience to cookie
    useEffect(() => {
        Cookies.set('selectedAudience', selectedAudience, { expires: 7 });
    }, [selectedAudience]);

    // Data fetching
    useEffect(() => {
        if (user) {
            dispatch(listSectionByGender({ gender: selectedAudience }));
        }
    }, [dispatch, user, selectedAudience]);

    useEffect(() => {
        const payload = { gender: selectedAudience };
        if (selectedCategory?.id) {
            payload.section = selectedCategory.id;
        }
        dispatch(listServices(payload));
    }, [dispatch, selectedAudience, selectedCategory?.id]);

    useEffect(() => {
        if (selectedStaff && selectedDate) {
            const staffId = selectedStaff._id || selectedStaff.id;
            dispatch(getAppointmentAvailability({ staffId, appointmentDate: selectedDate }));
        }
    }, [dispatch, selectedStaff, selectedDate]);

    // Set sectionId cookie when category changes
    useEffect(() => {
        if (selectedCategory?.id) {
            Cookies.set('sectionId', selectedCategory.id, { expires: 7 });
        }
    }, [selectedCategory?.id]);

    // Set serviceId cookie when service changes
    useEffect(() => {
        if (selectedService?.id) {
            Cookies.set('serviceId', selectedService.id, { expires: 7 });
        }
    }, [selectedService?.id]);

    // Set staffId cookie when staff changes
    useEffect(() => {
        if (selectedStaff) {
            Cookies.set('staffId', selectedStaff._id || selectedStaff.id, { expires: 7 });
        }
    }, [selectedStaff]);

    // Hydrate selectedService from cookie once listServicesData is available
    useEffect(() => {
        if (!selectedService && listServicesData?.data?.length > 0) {
            const savedServiceId = Cookies.get('serviceId');
            if (savedServiceId) {
                const matched = listServicesData.data.find(s => (s._id || s.id) === savedServiceId);
                if (matched) {
                    setSelectedService({
                        id: matched._id || matched.id,
                        name: matched.serviceName || matched.name,
                        price: matched.price,
                        duration: matched.duration
                    });
                }
            }
        }
    }, [listServicesData, selectedService, setSelectedService]);

    // Hydrate selectedStaff from cookie once listStaffsData is available
    useEffect(() => {
        const staffList = listStaffsData?.data || (Array.isArray(listStaffsData) ? listStaffsData : []);
        if (!selectedStaff && staffList.length > 0) {
            const savedStaffId = Cookies.get('staffId');
            if (savedStaffId) {
                const matched = staffList.find(s => (s._id || s.id) === savedStaffId);
                if (matched) {
                    setSelectedStaff(matched);
                }
            }
        }
    }, [listStaffsData, selectedStaff, setSelectedStaff]);

    // Auto-select category if none selected
    useEffect(() => {
        const categories = listSectionByGenderData?.data || [];
        if (categories.length > 0 && !selectedCategory.id) {
            const savedSectionId = Cookies.get('sectionId');
            const matchedCategory = savedSectionId ? categories.find(c => (c._id || c.id) === savedSectionId) : null;

            if (matchedCategory) {
                setSelectedCategory({ id: matchedCategory._id || matchedCategory.id, name: matchedCategory.name });
            } else {
                const hairCategory = categories.find(c => c.name?.toLowerCase() === 'hair');
                const defaultCat = hairCategory || categories[0];
                setSelectedCategory({ id: defaultCat._id, name: defaultCat.name });
            }
        }
    }, [listSectionByGenderData, selectedCategory.id]);

    const value = {
        selectedAudience, setSelectedAudience,
        selectedCategory, setSelectedCategory,
        selectedService, setSelectedService,
        selectedStaff, setSelectedStaff,
        selectedDate, setSelectedDate,
        selectedSlot, setSelectedSlot,
        paymentStatus, setPaymentStatus,
        activeView, setActiveView,
        stepPathMap,
        listSectionByGenderData,
        listServicesData,
        listStaffsData,
        user,
        loading,
        getAppointmentAvailabilityData
    };

    return (
        <BookingContext.Provider value={value}>
            {children}
        </BookingContext.Provider>
    );
}

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
};
