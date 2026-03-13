'use client';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import styles from './Dashboard.module.css';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { getAppointmentHistory, getNotificationForAdmin } from '@/store/userThunk';
import { io } from "socket.io-client";
import Cookies from 'js-cookie';

const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
    withCredentials: true,
    transports: ["websocket", "polling"]
});
export default function DashboardPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { user, loading: authLoading } = useSelector((state) => state.auth);
    console.log("user",user)
    const { getAppointmentHistoryData, getAppointmentHistoryLoading } = useSelector((state) => state.getAppointmentHistory);
    const [activeTab, setActiveTab] = useState('appointments');
    const mockNotifications = [
        { id: 1, message: 'Your appointment for Royal Haircut is confirmed.', date: '2 hours ago' },
        { id: 2, message: 'New promotion: 20% off massages next week!', date: '1 day ago' }
    ];
    const [notifications, setNotifications] = useState("");
    // useEffect(() => {
    //     if (!authLoading && !user) {
    //         router.push('/login');
    //     }
    // }, [user, authLoading, router]);

    // useEffect(() => {
    //     if (user) {
    //         dispatch(getAppointmentHistory());
    //     }
    // }, [dispatch, user]);

    // const appointments = getAppointmentHistoryData?.data || [];
    useEffect(() => {
        if (user) {
            dispatch(getAppointmentHistory());

            // join socket room
            socket.emit("joinUserRoom", user.id);
        }
    }, [dispatch, user]);

    // useEffect(() => {
    //     socket.on("connect", () => {
    //         console.log("Socket connected successfully with ID:", socket.id);
    //     });

    //     socket.on("connect_error", (error) => {
    //         console.error("Socket connection error:", error);
    //     });

    //     socket.on("appointmentStatusUpdated", (data) => {
    //         console.log("Notification received:", data);

    //         setNotifications(prev => [
    //             {
    //                 id: Date.now(),
    //                 message: data.message,
    //                 date: "Just now"
    //             },
    //             ...prev
    //         ]);
    //     });

    //     return () => {
    //         socket.off("connect");
    //         socket.off("connect_error");
    //         socket.off("appointmentStatusUpdated");
    //     };

    // }, []);

    const appointments = getAppointmentHistoryData?.data || [];

    
  const { getNotificationForAdminData } = useSelector(
    (state) => state.getNotificationForAdmin,
  );
  console.log("getNotificationForAdminData", getNotificationForAdminData);
  useEffect(() => {
    const userId = Cookies.get("userId")
    dispatch(getNotificationForAdmin({userId:userId}));
  }, []);
  function formatDateTime(dateString) {
    const date = new Date(dateString);

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    if (authLoading || (getAppointmentHistoryLoading && !getAppointmentHistoryData)) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;
    if (!user) return null;

    return (
        <div className={styles.page}>
            <Navbar />
            <div className={`container ${styles.container}`}>
                <h1 className="section-title">Welcome, {user.name || 'User'}</h1>
                <div className={styles.tabs}>
                    <button className={`btn ${activeTab === 'appointments' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('appointments')}>Appointments ({appointments.length})</button>
                    <button className={`btn ${activeTab === 'notifications' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('notifications')}>Notifications</button>
                </div>

                <div className={styles.content}>
                    {activeTab === 'appointments' && (
                        <div className={styles.list}>
                            {appointments.length > 0 ? (
                                appointments.map(app => (
                                    <div key={app._id} className={styles.item}>
                                        <div className={styles.details}>
                                            <h3>{app.service?.serviceName}</h3>
                                            <p>{app.staff?.fullName ? `with ${app.staff.fullName}` : 'Any Available Staff'}</p>
                                            <span className={styles.date}>{formatDate(app.appointmentDate)} at {app.timeSlot}</span>
                                        </div>
                                        <span className={`${styles.status} ${styles[app.status?.toLowerCase() || 'confirmed']}`}>{app.status || 'Confirmed'}</span>
                                    </div>
                                ))
                            ) : (
                                <p style={{ textAlign: 'center', padding: '2rem' }}>No appointments yet. <a href="/book" style={{ color: 'var(--primary)' }}>Book one now!</a></p>
                            )}
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className={styles.list}>
                            {getNotificationForAdminData?.data?.length > 0 ? (
                                getNotificationForAdminData?.data?.map(notif => (
                                    <div key={notif._id} className={styles.item}>
                                        <div className={styles.details}>
                                            <p><strong>Appointment Update</strong></p>
                                            <p>{notif.message}</p>
                                            <span className={styles.date}>{formatDateTime(notif.createdAt)}</span>
                                        </div>

                                    </div>
                                ))
                            ) : (
                                <p>No notifications yet</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
