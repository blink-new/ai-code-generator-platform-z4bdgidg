import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Card, CardContent } from '../components/ui/card'
import { Plus, Sparkles, ArrowRight, Code2, Zap, Globe, Database, Palette, Smartphone } from 'lucide-react'
import { blink } from '../blink/client'

export default function LandingPage() {
  const [prompt, setPrompt] = useState('')

  const handleSignIn = () => {
    blink.auth.login()
  }

  const handleCreate = async () => {
    if (!prompt.trim()) return
    
    try {
      await blink.auth.me()
      // If we get here, user is authenticated, proceed with generation
      window.location.href = '/dashboard'
    } catch (error) {
      // User not authenticated, trigger login
      blink.auth.login()
    }
  }

  const features = [
    {
      icon: <Code2 className="h-6 w-6" />,
      title: "AI Code Generation",
      description: "Transform natural language into production-ready code"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description: "Generate full-stack applications in seconds, not hours"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Full-Stack Ready",
      description: "Complete frontend, backend, and database setup"
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Smart Architecture",
      description: "Optimized code structure and best practices built-in"
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Beautiful UI",
      description: "Modern, responsive designs with Tailwind CSS"
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Multi-Platform",
      description: "Web, mobile, and desktop applications supported"
    }
  ]

  const examples = [
    "a task management app with user authentication",
    "an e-commerce store with payment integration", 
    "a social media dashboard with real-time updates",
    "a portfolio website with blog functionality",
    "a booking system with calendar integration"
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black">
                <div className="h-4 w-4 rounded-sm bg-white"></div>
              </div>
              <span className="text-xl font-semibold text-gray-900">Blink</span>
            </div>
            <Button 
              onClick={handleSignIn} 
              variant="ghost" 
              className="text-gray-600 hover:text-gray-900"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8">
              <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
                <Sparkles className="mr-2 h-4 w-4" />
                AI-Powered Development
              </Badge>
              <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl">
                Build apps with
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  just words
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-xl text-gray-600">
                Transform your ideas into production-ready applications using natural language. 
                No coding required – just describe what you want to build.
              </p>
            </div>

            {/* Input Section */}
            <div className="mx-auto mb-16 max-w-2xl">
              <div className="relative rounded-2xl border bg-white p-6 shadow-lg">
                <div className="flex items-start space-x-4">
                  <button className="mt-2 rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600">
                    <Plus className="h-5 w-5" />
                  </button>
                  <div className="flex-1">
                    <Input
                      placeholder="Build me a task management app with user authentication..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="border-0 text-lg placeholder:text-gray-400 focus-visible:ring-0 p-0 h-auto bg-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
                    />
                    <div className="mt-3 flex flex-wrap gap-2">
                      {examples.slice(0, 3).map((example, index) => (
                        <button
                          key={index}
                          onClick={() => setPrompt(example)}
                          className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                          {example}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button 
                    onClick={handleCreate}
                    disabled={!prompt.trim()}
                    className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8 mb-20">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">10k+</div>
                <div className="text-sm text-gray-600">Apps Generated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">&lt;30s</div>
                <div className="text-sm text-gray-600">Average Build Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">99%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to build amazing apps
            </h2>
            <p className="text-lg text-gray-600">
              From idea to deployment, our AI handles the entire development process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-lg text-gray-600">
              Three simple steps to turn your idea into reality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mb-6 mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Describe Your Idea</h3>
              <p className="text-gray-600">
                Simply tell us what you want to build in plain English. Be as detailed or as brief as you like.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-6 mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Generates Code</h3>
              <p className="text-gray-600">
                Our AI analyzes your requirements and generates clean, production-ready code with best practices.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-6 mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Deploy & Customize</h3>
              <p className="text-gray-600">
                Preview, edit, and deploy your app instantly. Make changes anytime with natural language.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to build your next app?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are building faster with AI
          </p>
          <Button 
            onClick={handleSignIn}
            size="lg"
            className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg font-medium"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black">
                <div className="h-4 w-4 rounded-sm bg-white"></div>
              </div>
              <span className="text-xl font-semibold text-gray-900">Blink</span>
            </div>
            <p className="text-sm text-gray-500">
              © 2024 Blink. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}