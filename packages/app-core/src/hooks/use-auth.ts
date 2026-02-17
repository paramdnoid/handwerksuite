"use client";

import { useEffect, useState } from "react";
import { authClient } from "@handwerksuite/auth/client";
import type { AuthState } from "@handwerksuite/types";

export function useAuth(): AuthState & {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
} {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    authClient.getSession().then((session) => {
      setState({
        user: session.data?.user ?? null,
        session: session.data?.session ?? null,
        isLoading: false,
        isAuthenticated: !!session.data?.user,
      });
    });
  }, []);

  const signIn = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    const result = await authClient.signIn.email({ email, password });
    if (result.data) {
      setState({
        user: result.data.user as any,
        session: result.data.session as any,
        isLoading: false,
        isAuthenticated: true,
      });
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    const result = await authClient.signUp.email({ email, password, name });
    if (result.data) {
      setState({
        user: result.data.user as any,
        session: result.data.session as any,
        isLoading: false,
        isAuthenticated: true,
      });
    }
  };

  const signOut = async () => {
    await authClient.signOut();
    setState({
      user: null,
      session: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  return { ...state, signIn, signUp, signOut };
}
