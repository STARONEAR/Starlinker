import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Wrench, ShoppingBag, Bot, Zap } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const features = [
    {
      icon: <Wrench size={32} />,
      title: 'Home Services',
      description: 'Professional installation services for internet, CCTV, and more',
      href: '/services',
    },
    {
      icon: <ShoppingBag size={32} />,
      title: 'Marketplace',
      description: 'Buy and sell new and used products with ease',
      href: '/shop',
    },
    {
      icon: <Bot size={32} />,
      title: 'AI Assistant',
      description: 'Get instant help and recommendations powered by AI',
      href: '/ai',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6">
            <Zap size={16} className="text-primary-main" />
            <span className="text-sm">AI-First Service Marketplace</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary-main via-secondary-main to-primary-light bg-clip-text text-transparent">
              Welcome to Starlinker
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Book professional services, shop products, and get AI-powered assistance—all in one place
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/services">
              <Button size="lg">Explore Services</Button>
            </Link>
            <Link href="/shop">
              <Button variant="ghost" size="lg">Browse Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Link key={feature.title} href={feature.href}>
                <GlassCard hover className="h-full cursor-pointer">
                  <div className="text-primary-main mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
