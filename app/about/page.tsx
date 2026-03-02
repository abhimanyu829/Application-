'use client';

import { motion } from 'motion/react';

export default function About() {
  return (
    <div className="bg-yellow-50 py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl lg:text-center mb-24"
        >
          <h1 className="font-display text-5xl font-bold tracking-tighter text-black sm:text-7xl leading-[1.1]">
            About Our Company
          </h1>
        </motion.div>

        <div className="mx-auto max-w-3xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <p className="text-lg font-light leading-relaxed text-black/70">
              We are a technology-driven startup focused on building scalable SaaS platforms, AI-powered automation systems, and enterprise-grade digital solutions.
            </p>

            <p className="text-lg font-light leading-relaxed text-black/70">
              Founded with a vision to engineer high-performance software ecosystems, our team combines structured architecture, modern cloud infrastructure, and intelligent automation to deliver real-world impact.
            </p>

            <p className="text-lg font-light leading-relaxed text-black/70">
              We specialize in SaaS product development, AI agents, enterprise software systems, and rapid MVP development for startups and growing businesses.
            </p>

            <p className="text-lg font-light leading-relaxed text-black/70">
              Our approach is rooted in clean code principles, modular backend architecture, secure authentication systems, and scalable cloud deployment strategies.
            </p>

            <p className="text-lg font-light leading-relaxed text-black/70">
              We believe innovation is not just about technology — it is about solving operational challenges with precision, efficiency, and long-term sustainability.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 border-t border-black/10 pt-12"
          >
            <div>
              <h2 className="text-xs font-medium tracking-widest text-black/40 uppercase mb-4">Our Mission:</h2>
              <p className="text-lg font-light leading-relaxed text-black/70">
                To build intelligent, secure, and scalable software solutions that empower modern organizations.
              </p>
            </div>

            <div>
              <h2 className="text-xs font-medium tracking-widest text-black/40 uppercase mb-4">Our Vision:</h2>
              <p className="text-lg font-light leading-relaxed text-black/70">
                To become a globally recognized technology partner for SaaS and AI-driven digital transformation.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-center border-t border-black/10 pt-12"
          >
            <p className="text-xl font-light leading-relaxed text-black/70">
              We don't just build software — we architect digital ecosystems for growth.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
