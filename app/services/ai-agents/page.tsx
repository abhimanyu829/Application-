'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowLeft, Cpu, MessageCircle, Brain, TrendingUp, Zap } from 'lucide-react';

export default function AIAgentsPage() {
  const features = [
    {
      icon: Brain,
      title: 'Custom LLM Integration',
      description: 'Integrate OpenAI, Claude, or custom language models tailored to your business needs.',
    },
    {
      icon: Zap,
      title: 'Automated Workflows',
      description: 'Streamline business processes with intelligent automation and decision-making.',
    },
    {
      icon: MessageCircle,
      title: 'Intelligent Chatbots',
      description: '24/7 customer support with context-aware conversational AI.',
    },
    {
      icon: TrendingUp,
      title: 'Predictive Data Analysis',
      description: 'Leverage machine learning for forecasting and actionable insights.',
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
              AI Agents & Automation
            </h1>
            <p className="mt-8 text-xl font-light leading-relaxed text-black/60 max-w-3xl">
              Leverage the power of artificial intelligence to automate repetitive tasks, enhance customer support, and gain predictive insights.
            </p>
            <p className="mt-6 text-lg font-light leading-relaxed text-black/60 max-w-3xl">
              Increase efficiency by 10x and provide 24/7 intelligent support to your customers with our advanced AI solutions.
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
