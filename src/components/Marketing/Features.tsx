'use client';

import { motion } from 'framer-motion';
import { Layout, FileText, Settings, Code, CheckCircle, Database } from 'lucide-react';

const features = [
  {
    title: 'Website Builder',
    description: 'Create landing pages that convert using GrapesJS. Full control over HTML, CSS, and layout.',
    icon: Layout,
    color: 'bg-blue-500',
  },
  {
    title: 'PDF Generator',
    description: 'Generate dynamic PDFs with custom variables and logic blocks for invoices, reports, and more.',
    icon: FileText,
    color: 'bg-red-500',
  },
  {
    title: 'Funnel Customizer',
    description: 'Map out questionnaire paths using an intuitive JSON-based builder. Branching logic included.',
    icon: Settings,
    color: 'bg-green-500',
  },
  {
    title: 'Logic Engine',
    description: 'Use if/else, each, and switch statements inside your components for complex business logic.',
    icon: Code,
    color: 'bg-purple-500',
  },
  {
    title: 'SpacetimeDB Integration',
    description: 'Hyper-fast data storage and retrieval with our custom SpacetimeDB backend.',
    icon: Database,
    color: 'bg-indigo-500',
  },
  {
    title: 'Clerk Auth',
    description: 'Enterprise-grade security and organization management out of the box.',
    icon: CheckCircle,
    color: 'bg-yellow-500',
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-4">Everything you need to scale</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Our platform provides a comprehensive suite of tools designed to handle every aspect of your sales funnel.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/10 transition-all group"
            >
              <div className={`${feature.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
