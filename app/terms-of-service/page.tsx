'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-yellow-50">
      <section className="py-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center text-black/60 hover:text-black mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center mb-8">
              <FileText className="h-10 w-10 text-black mr-4" />
              <h1 className="font-display text-5xl font-bold tracking-tighter text-black leading-[1.1]">
                Terms of Service
              </h1>
            </div>
            <div className="space-y-8 text-lg font-light leading-relaxed text-black/60">
              <p>
                By using our platform, you agree to comply with our service guidelines, usage policies, and operational standards.
              </p>
              <p>
                Users must not misuse the system, compromise security, or violate intellectual property rights. Subscription-based services are governed by defined billing terms.
              </p>
              <p>
                We reserve the right to update services and policies to maintain performance, security, and reliability.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
