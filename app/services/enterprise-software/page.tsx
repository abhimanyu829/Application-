'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowLeft, Code2, Server, Database, Shield } from 'lucide-react';

export default function EnterpriseSoftwarePage() {
  const features = [
    {
      icon: Server,
      title: 'Microservices Architecture',
      description: 'Scalable, maintainable systems with independent service deployment.',
    },
    {
      icon: Database,
      title: 'Legacy System Modernization',
      description: 'Transform outdated systems into modern, efficient architectures.',
    },
    {
      icon: Code2,
      title: 'API Development & Integration',
      description: 'RESTful and GraphQL APIs for seamless system connectivity.',
    },
    {
      icon: Shield,
      title: 'High Availability Setup',
      description: '99.9% uptime with redundant infrastructure and failover systems.',
    },
  ];

  return (
    <div className="min-h-screen bg-yellow-50">
      <section className="py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Link href="/services" className="inline-flex items-center text-black/60 hover:text-black mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Services
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-5xl font-bold tracking-tighter text-black sm:text-7xl leading-[1.1]">
              Custom Enterprise Software
            </h1>
            <p className="mt-8 text-xl font-light leading-relaxed text-black/60 max-w-3xl">
              Bespoke software solutions designed to solve complex business challenges and streamline operations.
            </p>
            <p className="mt-6 text-lg font-light leading-relaxed text-black/60 max-w-3xl">
              Gain a competitive edge with software that perfectly aligns with your unique business processes and requirements.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-32 bg-black/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="font-display text-4xl font-bold tracking-tighter text-black sm:text-6xl mb-24">
            Key Features
          </h2>
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-yellow-100/50 p-10"
              >
                <feature.icon className="h-8 w-8 text-black mb-6" />
                <h3 className="text-2xl font-bold tracking-tight text-black mb-4">{feature.title}</h3>
                <p className="text-base font-light leading-relaxed text-black/60">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
