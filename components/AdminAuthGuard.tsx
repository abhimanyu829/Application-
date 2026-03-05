
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';

export default function AdminAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { admin, loading, isAuthenticated } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!loading && !isAuthenticated && !isLoginPage) {
      router.push('/admin/login');
    }
    // If authenticated and on login page, redirect to admin dashboard
    if (!loading && isAuthenticated && isLoginPage) {
      router.push('/admin/dashboard');
    }
  }, [loading, isAuthenticated, router, isLoginPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-black/60">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Allow rendering login page even if not authenticated
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return <>{children}</>;
}