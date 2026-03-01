'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
              <Shield className="h-10 w-10 text-black mr-4" />
              <h1 className="font-display text-5xl font-bold tracking-tighter text-black leading-[1.1]">
                Privacy Policy
              </h1>
            </div>
            <div className="space-y-8 text-lg font-light leading-relaxed text-black/60">
              <p>
                We are committed to protecting user data and maintaining transparency in how information is collected, stored, and processed.
              </p>
              <p>
                All user data is securely stored and used strictly for operational purposes. We implement authentication security, encrypted communication, and controlled database access.
              </p>
              <p>
                We do not sell or misuse user information. Your trust is our responsibility.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
