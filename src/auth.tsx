// Future authentication boundary — mock today, SSO/OIDC tomorrow.
// Usage: <AuthProvider><ProtectedRoute role="faculty">…</ProtectedRoute></AuthProvider>
import React, { createContext, useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';

export type Role = 'student' | 'faculty' | 'admin' | null;
const Ctx = createContext<{ role: Role; signIn: (r: Exclude<Role, null>) => void; signOut: () => void }>({ role: null, signIn: () => {}, signOut: () => {} });
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  return <Ctx.Provider value={{ role, signIn: setRole, signOut: () => setRole(null) }}>{children}</Ctx.Provider>;
}

export function ProtectedRoute({ role, children }: { role: Exclude<Role, null>; children: React.ReactNode }) {
  const { role: mine } = useAuth();
  if (mine !== role) return <Navigate to={`/login?role=${role}`} replace />;
  return <>{children}</>;
}
