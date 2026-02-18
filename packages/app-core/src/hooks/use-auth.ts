'use client';

import { useEffect, useState } from 'react';
import { authClient } from '@zunftgewerk/auth/client';
import type { AuthState } from '@zunftgewerk/types';

export function useAuth(): AuthState & {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<{ userId: string }>;
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
        user: (session.data?.user as any) ?? null,
        session: (session.data?.session as any) ?? null,
        isLoading: false,
        isAuthenticated: !!session.data?.user,
      });
    });
  }, []);

  const signIn = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    const result = await authClient.signIn.email({ email, password });
    if (result.error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw new Error(result.error.message ?? 'Anmeldung fehlgeschlagen');
    }
    const data = result.data as any;
    if (data) {
      setState({
        user: data.user ?? null,
        session: data.session ?? null,
        isLoading: false,
        isAuthenticated: !!data.user,
      });
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
  ): Promise<{ userId: string }> => {
    setState((prev) => ({ ...prev, isLoading: true }));
    const result = await authClient.signUp.email({ email, password, name });
    if (result.error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw new Error(result.error.message ?? 'Registrierung fehlgeschlagen');
    }
    const data = result.data as any;
    if (data) {
      setState({
        user: data.user ?? null,
        session: data.session ?? null,
        isLoading: false,
        isAuthenticated: !!data.user,
      });
    }
    return { userId: data?.user?.id ?? '' };
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
