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
    let persistedUser = null;
    try {
      const rawUser = window.localStorage.getItem("user");
      persistedUser = rawUser ? JSON.parse(rawUser) : null;

      // If we have a token in cookies but not in state yet, 
      // we can use it, but typically we rely on the object in localStorage
      const token = Cookies.get("userToken");
      if (token && persistedUser) {
        persistedUser.token = token;
      }
    } catch {
      persistedUser = null;
    }
    dispatch(hydrateAuth(persistedUser));
  }, [dispatch]);

  useEffect(() => {
    // List of public routes
    const publicRoutes = ['/login', '/signup', '/verify-otp', '/verify-email-otp', '/verify-mobile-otp'];

    if (!loading) {
      if (!user?.token && !publicRoutes.includes(pathname)) {
        router.replace('/login');
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
