import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Textarea } from '../components/ui/textarea'
import { Badge } from '../components/ui/badge'
import { Card, CardContent } from '../components/ui/card'
import { 
  Plus, 
  Sparkles, 
  ArrowRight, 
  Code2, 
  Zap, 
  Globe, 
  Database, 
  Palette, 
  Smartphone,
  Paperclip,
  Github,
  ArrowUp,
  Monitor,
  Smartphone as Mobile,
  Gamepad2,
  ChevronDown
} from 'lucide-react'
import { blink } from '../blink/client'

export default function LandingPage() {
  const [prompt, setPrompt] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Web Apps')

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

  const categories = [
    { name: 'Websites', icon: <Monitor className="h-4 w-4" /> },
    { name: 'Web Apps', icon: <Globe className="h-4 w-4" /> },
    { name: 'Mobile Apps', icon: <Mobile className="h-4 w-4" /> },
    { name: 'Games', icon: <Gamepad2 className="h-4 w-4" /> }
  ]

  const examples = [
    "Build a retro life simulator game",
    "Create a task management app with user authentication",
    "Build an e-commerce store with payment integration", 
    "Design a social media dashboard with real-time updates",
    "Make a portfolio website with blog functionality",
    "Create a booking system with calendar integration"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-white/20">
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
              className="text-gray-600 hover:text-gray-900 hover:bg-white/50"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Main Heading */}
            <div className="mb-16">
              <h1 className="mb-6 text-6xl font-bold tracking-tight text-gray-900 sm:text-7xl lg:text-8xl">
                Don't just think it,{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Blink
                </span>{' '}
                it.
              </h1>
              <p className="mx-auto max-w-2xl text-xl text-gray-600 mb-12">
                Turn any idea into a beautiful, working app in seconds
              </p>
            </div>

            {/* Input Section */}
            <div className="mx-auto mb-12 max-w-3xl">
              <div className="relative rounded-2xl border border-gray-200 bg-white/90 backdrop-blur-sm p-1 shadow-xl">
                <div className="flex items-start space-x-4 p-5">
                  <button className="mt-3 rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
                    <Plus className="h-5 w-5" />
                  </button>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Build a retro life simulator game"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="border-0 text-lg placeholder:text-gray-400 focus-visible:ring-0 p-0 bg-transparent resize-none min-h-[60px] max-h-[200px]"
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 p-2"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <Paperclip className="h-4 w-4" />
                      <span className="ml-1 text-sm">Attach</span>
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept="image/*,.txt,.js,.ts,.jsx,.tsx,.json,.md,.css,.html,.py,.java,.cpp,.c"
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || [])
                        console.log('Files uploaded:', files)
                        // TODO: Handle file uploads
                      }}
                    />
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 p-2"
                    >
                      <Github className="h-4 w-4" />
                      <span className="ml-1 text-sm">Import Code</span>
                    </Button>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <span>Auto</span>
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </div>
                </div>
                
                {/* Bottom section with categories and submit */}
                <div className="flex items-center justify-between px-5 pb-5">
                  <div className="flex items-center space-x-2">
                    {categories.map((category) => (
                      <button
                        key={category.name}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedCategory === category.name
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        {category.icon}
                        <span>{category.name}</span>
                      </button>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={handleCreate}
                    disabled={!prompt.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Example prompts */}
            <div className="mb-20">
              <div className="flex flex-wrap justify-center gap-3">
                {examples.slice(0, 4).map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(example)}
                    className="rounded-full bg-white/60 backdrop-blur-sm px-4 py-2 text-sm text-gray-700 hover:bg-white/80 transition-all border border-white/40 hover:border-gray-200"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Everything you need to build amazing apps
            </h2>
            <p className="text-xl text-gray-600">
              From idea to deployment, our AI handles the entire development process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Code2 className="h-6 w-6" />,
                title: "AI Code Generation",
                description: "Transform natural language into production-ready code with advanced AI models"
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: "Lightning Fast",
                description: "Generate full-stack applications in seconds, not hours or days"
              },
              {
                icon: <Globe className="h-6 w-6" />,
                title: "Full-Stack Ready",
                description: "Complete frontend, backend, and database setup with one command"
              },
              {
                icon: <Database className="h-6 w-6" />,
                title: "Smart Architecture",
                description: "Optimized code structure and industry best practices built-in"
              },
              {
                icon: <Palette className="h-6 w-6" />,
                title: "Beautiful UI",
                description: "Modern, responsive designs with Tailwind CSS and component libraries"
              },
              {
                icon: <Smartphone className="h-6 w-6" />,
                title: "Multi-Platform",
                description: "Web, mobile, and desktop applications with cross-platform support"
              }
            ].map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-lg transition-all bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    {feature.icon}
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              How it works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to turn your idea into reality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                title: "Describe Your Idea",
                description: "Simply tell us what you want to build in plain English. Be as detailed or as brief as you like.",
                colorClass: "step-blue"
              },
              {
                step: "2", 
                title: "AI Generates Code",
                description: "Our AI analyzes your requirements and generates clean, production-ready code with best practices.",
                colorClass: "step-purple"
              },
              {
                step: "3",
                title: "Deploy & Customize", 
                description: "Preview, edit, and deploy your app instantly. Make changes anytime with natural language.",
                colorClass: "step-green"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className={`mb-6 mx-auto w-20 h-20 ${item.colorClass} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <span className="text-3xl font-bold">{item.step}</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-gray-900 mb-2">50k+</div>
              <div className="text-lg text-gray-600">Apps Generated</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-gray-900 mb-2">&lt;30s</div>
              <div className="text-lg text-gray-600">Average Build Time</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-gray-900 mb-2">99.9%</div>
              <div className="text-lg text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-6">
            Ready to build your next app?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join thousands of developers who are building faster with AI
          </p>
          <Button 
            onClick={handleSignIn}
            size="lg"
            className="bg-white text-black hover:bg-gray-100 px-10 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all"
          >
            Get Started Free
            <ArrowRight className="ml-3 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/90 backdrop-blur-sm py-12">
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