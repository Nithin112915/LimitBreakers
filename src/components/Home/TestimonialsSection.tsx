'use client'

import { motion } from 'framer-motion'

const testimonials = [
  {
    content: "Limit Breakers completely transformed how I approach personal growth. The AI coach gives me personalized insights I never would have discovered on my own, and the Honor Points system keeps me motivated every single day.",
    author: {
      name: 'Sarah Chen',
      role: 'Product Manager',
      company: 'TechCorp',
      imageUrl: '/api/placeholder/64/64'
    }
  },
  {
    content: "The proof submission feature is a game-changer. Having to document my progress with actual evidence has made me more accountable than any other habit app I've tried. Plus, the community support is incredible.",
    author: {
      name: 'Marcus Johnson',
      role: 'Entrepreneur',
      company: 'StartupX',
      imageUrl: '/api/placeholder/64/64'
    }
  },
  {
    content: "I love how my profile showcases my growth journey like a live résumé. It's helped me in networking and job interviews. The streak analytics also help me understand my patterns better.",
    author: {
      name: 'Elena Rodriguez',
      role: 'Marketing Director',
      company: 'GrowthCo',
      imageUrl: '/api/placeholder/64/64'
    }
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-12 bg-gray-50 overflow-hidden md:py-20 lg:py-24">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              What our community is saying
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Real stories from real people who've transformed their lives with Limit Breakers.
            </p>
          </motion.div>
          
          <div className="mt-12 mx-auto grid max-w-lg gap-8 lg:grid-cols-3 lg:max-w-none">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card"
              >
                <div className="pb-8">
                  <blockquote className="text-lg text-gray-700">
                    <p>"{testimonial.content}"</p>
                  </blockquote>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold text-sm">
                        {testimonial.author.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-base font-medium text-gray-900">
                      {testimonial.author.name}
                    </div>
                    <div className="text-base text-gray-500">
                      {testimonial.author.role} at {testimonial.author.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
