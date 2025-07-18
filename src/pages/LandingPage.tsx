import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Badge } from '../components/ui/badge'
import { Sparkles, Code, Zap, Globe, Database, Smartphone } from 'lucide-react'
import { blink } from '../blink/client'

export default function LandingPage() {
  const [description, setDescription] = useState('')
  const [techStack, setTechStack] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSignIn = () => {
    blink.auth.login()
  }

  const handleGenerate = async () => {
    if (!description.trim() || !techStack) return
    
    setIsGenerating(true)
    // This will trigger auth if not logged in
    try {
      await blink.auth.me()
      // If we get here, user is authenticated, proceed with generation
      // For now, just redirect to dashboard
      window.location.href = '/dashboard'
    } catch (error) {
      // User not authenticated, trigger login
      blink.auth.login()
    }
  }

  const features = [
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "AI-Powered Generation",
      description: "Describe your app in plain English and watch AI generate the complete codebase"
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "Full-Stack Development",
      description: "Frontend, backend, and database - everything generated and configured automatically"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description: "Go from idea to working prototype in minutes, not weeks"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Multiple Tech Stacks",
      description: "Support for React, Vue, Node.js, Python, and more"
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Database Integration",
      description: "Automatic database schema generation and API endpoints"
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Responsive Design",
      description: "Mobile-first, responsive applications that work everywhere"
    }
  ]

  const techStacks = [
    { value: 'react-typescript', label: 'React + TypeScript' },
    { value: 'vue-typescript', label: 'Vue + TypeScript' },
    { value: 'nextjs', label: 'Next.js' },
    { value: 'nodejs-express', label: 'Node.js + Express' },
    { value: 'python-fastapi', label: 'Python + FastAPI' },
    { value: 'fullstack-react', label: 'Full-Stack React' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Code className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">AI Code Generator</span>
            </div>
            <Button onClick={handleSignIn} variant="outline">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered Development
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
            Build Full-Stack Apps with
            <span className="text-primary"> Natural Language</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Describe your app idea in plain English and watch our AI generate complete, 
            production-ready code with frontend, backend, and database - all in minutes.
          </p>

          {/* Generation Interface */}
          <Card className="max-w-2xl mx-auto mb-12">
            <CardHeader>
              <CardTitle>Try it now - Describe your app</CardTitle>
              <CardDescription>
                Tell us what you want to build and we'll generate the complete codebase
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="I want to build a task management app with user authentication, where users can create, edit, and delete tasks. It should have a clean dashboard with drag-and-drop functionality and real-time updates..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px] resize-none"
              />
              <Select value={techStack} onValueChange={setTechStack}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your tech stack" />
                </SelectTrigger>
                <SelectContent>
                  {techStacks.map((stack) => (
                    <SelectItem key={stack.value} value={stack.value}>
                      {stack.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={handleGenerate}
                disabled={!description.trim() || !techStack || isGenerating}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate My App
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to build modern apps</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI handles the complexity so you can focus on your ideas
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-primary">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to build your next app?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of developers who are building faster with AI
          </p>
          <Button onClick={handleSignIn} size="lg" className="text-lg px-8 py-6">
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 AI Code Generator. Built with AI for developers.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}