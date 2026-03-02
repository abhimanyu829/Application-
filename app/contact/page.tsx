'use client';

import { motion } from 'motion/react';

export default function Contact() {
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
            Let's Build the Future Together
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
              Whether you are looking to develop a SaaS platform, implement AI automation, build enterprise software, or launch your MVP — we are ready to collaborate.
            </p>

            <p className="text-lg font-light leading-relaxed text-black/70">
              We work with startups, institutions, and enterprises to transform ideas into scalable digital systems.
            </p>

            <p className="text-lg font-light leading-relaxed text-black/70">
              For business inquiries, partnerships, and project discussions, feel free to reach out.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8 border-t border-black/10 pt-12"
          >
            <div>
              <h2 className="text-xs font-medium tracking-widest text-black/40 uppercase mb-3">Organizer:</h2>
              <p className="text-lg font-light text-black/70">Abhimanyu Kumar</p>
            </div>

            <div>
              <h2 className="text-xs font-medium tracking-widest text-black/40 uppercase mb-3">Mobile:</h2>
              <p className="text-lg font-light text-black/70">9142798767</p>
            </div>

            <div>
              <h2 className="text-xs font-medium tracking-widest text-black/40 uppercase mb-3">Email:</h2>
              <p className="text-lg font-light text-black/70">abhimanyuk50281@gmail.com</p>
            </div>

            <div>
              <h2 className="text-xs font-medium tracking-widest text-black/40 uppercase mb-3">Web Store Projects:</h2>
              <p className="text-lg font-light text-black/70">Coming Soon</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 border-t border-black/10 pt-12"
          >
            <p className="text-lg font-light leading-relaxed text-black/70">
              We respond promptly and strategically to every inquiry.
            </p>

            <p className="text-xl font-light leading-relaxed text-black/70">
              Your next digital breakthrough starts here.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
