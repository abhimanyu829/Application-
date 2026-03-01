import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { checkTermsAcceptance, UserTermsStatus } from '@/lib/termsService';

/**
 * Hook to protect routes that require terms acceptance
 * Use this in protected pages to automatically redirect unauthenticated users
 * or users who haven't accepted terms to the accept-terms page
 */
export function useTermsProtection() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [termsStatus, setTermsStatus] = useState<UserTermsStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      // If still loading auth, wait
      if (authLoading) {
        return;
      }

      // If no user, redirect to home
      if (!user) {
        router.push('/');
        setIsLoading(false);
        return;
      }

      // Check terms acceptance
      const status = await checkTermsAcceptance(user.$id);
      setTermsStatus(status);

      // If terms not accepted, redirect
      if (status.needsAcceptance) {
        router.push('/accept-terms');
      } else {
        setIsAllowed(true);
      }

      setIsLoading(false);
    };

    checkAccess();
  }, [user, authLoading, router]);

  return {
    isLoading: isLoading || authLoading,
    isAllowed,
    termsStatus,
    user,
  };
}
