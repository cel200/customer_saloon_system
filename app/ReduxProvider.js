"use client";

import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "@/store/store";
import { hydrateAuth } from "@/store/userSlice";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";

function AuthBootstrap({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Force logout/clear state on fresh load to require login every time
    localStorage.removeItem("user");
    Cookies.remove("userToken");
    Cookies.remove("userId");
    dispatch(hydrateAuth(null));
  }, [dispatch]);

  useEffect(() => {
    // List of public routes
    const publicRoutes = ['/login', '/signup', '/verify-otp', '/verify-email-otp', '/verify-mobile-otp', '/set-password'];

    if (!loading) {
      if (!user?.token && !publicRoutes.includes(pathname)) {
        router.replace('/login');
      } else if (user?.token && publicRoutes.includes(pathname)) {
        router.replace('/');
      }
    }
  }, [loading, user, pathname, router]);

  return children;
}

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <AuthBootstrap>{children}</AuthBootstrap>
    </Provider>
  );
}
