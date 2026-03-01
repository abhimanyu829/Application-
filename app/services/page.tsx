'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { useTermsProtection } from '@/hooks/useTermsProtection';
import { Loader2 } from 'lucide-react';
import { LayoutDashboard, Cpu, Code2, Globe, CircleCheck } from 'lucide-react';

export default function Services() {
  // Only enforce terms protection for logged-in users
  const { isLoading: termsLoading, isAllowed: termsAccepted, user } = useTermsProtection();

  // Show loading state while checking terms
  if (user && termsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-yellow-50">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  const services = [
    {
      id: 'saas',
      title: 'SaaS Platforms',
      description: 'We build robust, scalable, and secure SaaS platforms tailored to your industry. From School Management to ERP systems.',
      icon: LayoutDashboard,
      features: ['Multi-tenant Architecture', 'Role-based Access Control', 'Subscription Billing Integration', 'Real-time Analytics Dashboard'],
      benefits: 'Reduce operational costs and scale your business with a centralized management system.',
    },
    {
      id: 'ai',
      title: 'AI Agents & Automation',
      description: 'Leverage the power of artificial intelligence to automate repetitive tasks, enhance customer support, and gain predictive insights.',
      icon: Cpu,
      features: ['Custom LLM Integration', 'Automated Workflows', 'Intelligent Chatbots', 'Predictive Data Analysis'],
      benefits: 'Increase efficiency by 10x and provide 24/7 intelligent support to your customers.',
    },
    {
      id: 'web',
      title: 'Modern Business Websites',
      description: 'High-performance, SEO-optimized, and visually stunning websites that convert visitors into customers.',
      icon: Globe,
      features: ['Next.js App Router', 'Headless CMS Integration', 'Core Web Vitals Optimized', 'Responsive Design'],
      benefits: 'Establish a strong online presence and improve your conversion rates significantly.',
    },
    {
      id: 'enterprise',
      title: 'Custom Enterprise Software',
      description: 'Bespoke software solutions designed to solve complex business challenges and streamline operations.',
      icon: Code2,
      features: ['Microservices Architecture', 'Legacy System Modernization', 'API Development & Integration', 'High Availability Setup'],
      benefits: 'Gain a competitive edge with software that perfectly aligns with your unique business processes.',
    },
  ];

  return (
    <div className="bg-yellow-50 py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-24">
          <h2 className="text-xs font-medium tracking-widest text-black/40 uppercase mb-4">Our Services</h2>
          <p className="font-display text-5xl font-bold tracking-tighter text-black sm:text-7xl leading-[1.1]">
            Solutions engineered for growth
          </p>
          <p className="mt-8 text-xl font-light leading-relaxed text-black/60">
            We provide end-to-end development services, from ideation to deployment, ensuring your product is built to the highest standards.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-12 gap-y-24 lg:max-w-none lg:grid-cols-2">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col bg-transparent"
              >
                <dt className="flex items-center gap-x-4 text-3xl font-bold tracking-tight text-black">
                  <div className="flex h-12 w-12 items-center justify-center bg-black/5 rounded-full">
                    <service.icon className="h-5 w-5 text-black" aria-hidden="true" />
                  </div>
                  {service.title}
                </dt>
                <dd className="mt-8 flex flex-auto flex-col text-base leading-relaxed text-black/60 font-light">
                  <p className="flex-auto text-lg">{service.description}</p>
                  
                  <div className="mt-10">
                    <h4 className="text-xs font-medium text-black uppercase tracking-widest mb-6">Key Features</h4>
                    <ul className="space-y-4">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex gap-x-4 items-center">
                          <CircleCheck className="h-5 w-5 flex-none text-black/20" aria-hidden="true" />
                          <span className="text-base text-black/80">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-10 bg-black/5 p-6 rounded-none border-l-2 border-black">
                    <p className="text-base font-light text-black/80">
                      <span className="font-medium text-black uppercase tracking-widest text-xs block mb-2">Benefit</span> 
                      {service.benefits}
                    </p>
                  </div>

                  <div className="mt-10">
                    <Link
                      href={`/services/${service.id === 'saas' ? 'saas' : service.id === 'ai' ? 'ai-agents' : service.id === 'web' ? 'mvp-development' : 'enterprise-software'}`}
                      className="text-sm font-medium uppercase tracking-widest text-black hover:text-black/60 flex items-center gap-2 transition-colors"
                    >
                      Learn more <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
