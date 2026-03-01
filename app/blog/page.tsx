'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Cloud, Cpu, Building2 } from 'lucide-react';

export default function BlogPage() {
  const posts = [
    {
      icon: Cloud,
      title: 'Building Multi-Tenant SaaS Platforms',
      excerpt: 'Learn the architectural patterns for scalable SaaS applications.',
      category: 'SaaS Architecture',
    },
    {
      icon: Cpu,
      title: 'AI Agents in Enterprise Environments',
      excerpt: 'How intelligent automation is transforming business operations.',
      category: 'AI & Automation',
    },
    {
      icon: Building2,
      title: 'Enterprise Software Modernization',
      excerpt: 'Strategies for migrating legacy systems to modern architectures.',
      category: 'Enterprise',
    },
  ];

  return (
    <div className="min-h-screen bg-yellow-50">
      <section className="py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center text-black/60 hover:text-black mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-5xl font-bold tracking-tighter text-black sm:text-7xl leading-[1.1]">
              Insights on SaaS, AI, and Scalable Architecture
            </h1>
            <p className="mt-8 text-xl font-light leading-relaxed text-black/60 max-w-3xl">
              Our blog explores modern SaaS architecture, AI-driven automation, enterprise software engineering, and startup product strategies.
            </p>
            <p className="mt-6 text-lg font-light leading-relaxed text-black/60 max-w-3xl">
              We share technical deep dives, scalability frameworks, cloud deployment strategies, and leadership perspectives on digital innovation.
            </p>
            <p className="mt-6 text-lg font-light leading-relaxed text-black/60 max-w-3xl">
              Learn how intelligent systems are transforming industries — and how your organization can lead the change.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-32 bg-black/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="font-display text-4xl font-bold tracking-tighter text-black sm:text-6xl mb-24">
            Featured Articles
          </h2>
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
            {posts.map((post, index) => (
              <motion.div
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-yellow-100/50 p-8"
              >
                <post.icon className="h-10 w-10 text-black mb-6" />
                <span className="text-xs font-medium text-black uppercase tracking-widest">{post.category}</span>
                <h3 className="text-lg font-semibold mt-4 mb-4">{post.title}</h3>
                <p className="text-sm font-light leading-relaxed text-black/60">{post.excerpt}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
