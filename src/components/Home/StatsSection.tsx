'use client'

import { motion } from 'framer-motion'

const stats = [
  { id: 1, name: 'Active Users Building Habits', value: '10,000+' },
  { id: 2, name: 'Habits Completed Successfully', value: '500K+' },
  { id: 3, name: 'Honor Points Earned', value: '2.5M+' },
  { id: 4, name: 'Average Streak Length', value: '42 days' },
]

export function StatsSection() {
  return (
    <div className="premium-gradient py-16">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-4xl mx-auto text-center glass-morphism p-8 rounded-xl card-3d mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-extrabold premium-text sm:text-4xl neon-glow"
          >
            Trusted by thousands of growth-focused individuals
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-3 text-xl premium-text-muted sm:mt-4"
          >
            Join a community of achievers who are transforming their lives through consistent habits.
          </motion.p>
        </div>
        
        <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col mt-10 sm:mt-0 glass-morphism p-6 rounded-xl card-3d floating-animation"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <dt className="order-2 mt-2 text-lg leading-6 font-medium premium-text-muted">
                {stat.name}
              </dt>
              <dd className="order-1 text-5xl font-extrabold gold-accent neon-glow pulse-animation">
                {stat.value}
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </div>
  )
}
