'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { acceptTermsAndPrivacy } from '@/lib/termsService';

export default function AcceptTermsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const [termsChecked, setTermsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Redirect if not logged in
  if (!loading && !user) {
    router.push('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!termsChecked || !privacyChecked) {
      setError('You must accept both Terms of Service and Privacy Policy to continue.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const success = await acceptTermsAndPrivacy(user!.$id);
      if (success) {
        // Redirect to dashboard or home
        router.push('/');
      } else {
        setError('Failed to save your acceptance. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-black/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50">
      <div className="py-32">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-display text-5xl font-bold tracking-tighter text-black sm:text-6xl leading-[1.1]">
              Accept Our Policies
            </h1>
            <p className="mt-6 text-lg font-light leading-relaxed text-black/60">
              To continue using our platform, please review and accept our Terms of Service and Privacy Policy.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-black/10 p-8">
            {/* Terms Summary */}
            <div className="mb-8 pb-8 border-b border-black/10">
              <h2 className="font-display text-2xl font-bold text-black mb-4">
                Terms of Service
              </h2>
              <div className="text-black/70 space-y-3 text-sm leading-relaxed max-h-64 overflow-y-auto">
                <p>
                  By accepting these Terms of Service, you agree to comply with all applicable laws and regulations. You agree to use our platform responsibly and not to engage in any activities that could harm the platform or other users.
                </p>
                <p>
                  Our services are provided "as is" without warranties. We are not liable for any indirect, incidental, or consequential damages. Your use of our platform is at your own risk.
                </p>
                <p>
                  You retain all rights to any content you submit. By submitting content, you grant us a license to use it for the purpose of providing our services.
                </p>
                <p>
                  We reserve the right to modify these terms at any time. Continued use of our platform constitutes acceptance of updated terms.
                </p>
              </div>
              <Link 
                href="/terms-of-service" 
                className="inline-block mt-4 text-sm font-medium text-black hover:text-black/60 transition-colors"
              >
                View full Terms of Service →
              </Link>
            </div>

            {/* Privacy Summary */}
            <div className="mb-8 pb-8 border-b border-black/10">
              <h2 className="font-display text-2xl font-bold text-black mb-4">
                Privacy Policy
              </h2>
              <div className="text-black/70 space-y-3 text-sm leading-relaxed max-h-64 overflow-y-auto">
                <p>
                  We collect information to provide and improve our services. Your personal data is handled with care and security.
                </p>
                <p>
                  We may collect: your name, email, usage data, and browser information. This data helps us understand how you use our platform and improve our services.
                </p>
                <p>
                  Your data will not be sold to third parties without explicit consent. We may share data with service providers who help us operate our platform under strict confidentiality agreements.
                </p>
                <p>
                  You have the right to access, modify, or delete your personal data. Contact us to exercise these rights.
                </p>
              </div>
              <Link 
                href="/privacy-policy" 
                className="inline-block mt-4 text-sm font-medium text-black hover:text-black/60 transition-colors"
              >
                View full Privacy Policy →
              </Link>
            </div>

            {/* Checkboxes */}
            <div className="space-y-4 mb-8">
              <label className="flex items-start cursor-pointer group">
                <input
                  type="checkbox"
                  checked={termsChecked}
                  onChange={(e) => setTermsChecked(e.target.checked)}
                  className="mt-1 w-5 h-5 border border-black rounded accent-black cursor-pointer"
                />
                <span className="ml-3 text-sm font-light text-black/70 group-hover:text-black">
                  I accept the <span className="font-medium">Terms of Service</span>
                </span>
              </label>
              <label className="flex items-start cursor-pointer group">
                <input
                  type="checkbox"
                  checked={privacyChecked}
                  onChange={(e) => setPrivacyChecked(e.target.checked)}
                  className="mt-1 w-5 h-5 border border-black rounded accent-black cursor-pointer"
                />
                <span className="ml-3 text-sm font-light text-black/70 group-hover:text-black">
                  I accept the <span className="font-medium">Privacy Policy</span>
                </span>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || !termsChecked || !privacyChecked}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-black px-8 py-4 font-medium text-white hover:bg-black/90 transition-colors disabled:bg-black/50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Processing...' : 'Accept & Continue'}
              {!submitting && <ArrowRight className="h-4 w-4" />}
            </button>

            <p className="mt-4 text-center text-xs font-light text-black/50">
              Version 1.0 • Policy updated March 2026
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
