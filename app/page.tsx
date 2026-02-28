'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, Code2, Cpu, Globe, LayoutDashboard, Users, Zap } from 'lucide-react';
import Beams from '@/components/Beams';
import DotGrid from '@/components/DotGrid';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32 bg-yellow-50">
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30">
          <div style={{ width: '1080px', height: '1080px', position: 'relative' }}>
            <DotGrid
              dotSize={38}
              gap={5}
              baseColor="#271E37"
              activeColor="#29ff74"
              proximity={120}
              speedTrigger={100}
              shockRadius={200}
              shockStrength={2}
              maxSpeed={10}
              resistance={0.9}
              returnDuration={0.5}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-display text-6xl font-bold tracking-tighter text-black sm:text-8xl leading-[1.1]">
              Building Scalable SaaS <br className="hidden sm:block" />
              & AI Solutions
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-xl font-light text-black/60 leading-relaxed">
              We are a team of elite engineers crafting enterprise-grade software, intelligent AI agents, and high-performance web platforms that drive growth.
            </p>
            <div className="mt-12 flex items-center justify-center gap-x-8">
              <Link
                href="/services"
                className="group relative inline-flex items-center justify-center bg-black px-8 py-4 text-sm font-medium text-white transition-transform hover:scale-105 uppercase tracking-widest"
              >
                Book a Demo
              </Link>
              <Link
                href="/careers"
                className="group text-sm font-medium leading-6 text-black flex items-center gap-3 uppercase tracking-widest hover:opacity-70 transition-opacity"
              >
                Join Our Team <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div style={{ width: '100%', height: '600px', position: 'relative' }}>
        <Beams
          beamWidth={3}
          beamHeight={16}
          beamNumber={13}
          lightColor="#4ade80"
          speed={7.1}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={289}
        />
      </div>

      {/* Services Overview */}
      <section className="py-32 bg-black/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-xs font-medium tracking-widest text-black/40 uppercase mb-4">Our Expertise</h2>
            <p className="font-display text-4xl font-bold tracking-tighter text-black sm:text-6xl">
              Everything you need to scale
            </p>
          </div>
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'SaaS Platforms',
                description: 'Custom CRM, ERP, and management systems built for scale and performance.',
                icon: LayoutDashboard,
              },
              {
                title: 'AI Agents & Automation',
                description: 'Intelligent workflows and AI-driven agents to automate your business processes.',
                icon: Cpu,
              },
              {
                title: 'Enterprise Software',
                description: 'Robust, secure, and scalable custom software tailored to your specific needs.',
                icon: Code2,
              },
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-yellow-100/50 p-10 hover:-translate-y-2 transition-transform duration-500"
              >
                <div className="mb-8 inline-flex h-12 w-12 items-center justify-center bg-black/5 rounded-full group-hover:bg-black group-hover:text-white transition-colors duration-500">
                  <service.icon className="h-5 w-5 text-black group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-black mb-4">{service.title}</h3>
                <p className="text-base font-light leading-relaxed text-black/60">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-32 bg-yellow-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-24 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="font-display text-5xl font-bold tracking-tighter text-black sm:text-6xl leading-[1.1]">
                Driven by innovation, built for the future.
              </h2>
              <p className="mt-8 text-xl font-light leading-relaxed text-black/60">
                Our mission is to democratize enterprise-grade technology. We believe that every business, regardless of size, deserves access to powerful, scalable, and intelligent software solutions.
              </p>
              <dl className="mt-12 space-y-10 text-base leading-relaxed text-black/60">
                <div className="relative pl-12">
                  <dt className="inline font-bold text-black">
                    <Zap className="absolute left-0 top-1 h-6 w-6 text-black/20" />
                    Speed to Market.
                  </dt>{' '}
                  <dd className="inline font-light">We deliver MVPs in weeks, not months, allowing you to validate and scale faster.</dd>
                </div>
                <div className="relative pl-12">
                  <dt className="inline font-bold text-black">
                    <Globe className="absolute left-0 top-1 h-6 w-6 text-black/20" />
                    Global Standards.
                  </dt>{' '}
                  <dd className="inline font-light">Built with modern tech stacks ensuring security, reliability, and global scale.</dd>
                </div>
              </dl>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-square bg-black/5 overflow-hidden flex items-center justify-center"
            >
              <Users className="h-32 w-32 text-black/10" />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
