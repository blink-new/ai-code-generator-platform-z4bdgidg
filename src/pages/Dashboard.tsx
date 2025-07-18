import { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Plus, Code, Clock, CheckCircle, AlertCircle, ExternalLink, User, LogOut } from 'lucide-react'
import { blink } from '../blink/client'
import { Project } from '../types'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    tech_stack: ''
  })
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      if (state.user) {
        loadProjects()
      }
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const loadProjects = async () => {
    try {
      const userProjects = await blink.db.projects.list({
        where: { userId: (await blink.auth.me()).id },
        orderBy: { createdAt: 'desc' }
      })
      setProjects(userProjects)
    } catch (error) {
      console.error('Failed to load projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async () => {
    if (!newProject.name.trim() || !newProject.description.trim() || !newProject.tech_stack) return
    
    setIsCreating(true)
    try {
      const user = await blink.auth.me()
      const project = await blink.db.projects.create({
        name: newProject.name,
        description: newProject.description,
        techStack: newProject.tech_stack,
        userId: user.id,
        status: 'generating',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      
      // Navigate to project builder
      navigate(`/project/${project.id}`)
    } catch (error) {
      console.error('Failed to create project:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleSignOut = () => {
    blink.auth.logout()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'generating':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generating':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const techStacks = [
    { value: 'react-typescript', label: 'React + TypeScript' },
    { value: 'vue-typescript', label: 'Vue + TypeScript' },
    { value: 'nextjs', label: 'Next.js' },
    { value: 'nodejs-express', label: 'Node.js + Express' },
    { value: 'python-fastapi', label: 'Python + FastAPI' },
    { value: 'fullstack-react', label: 'Full-Stack React' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
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
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="text-sm text-muted-foreground">{user?.email}</span>
              </div>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Projects</h1>
            <p className="text-muted-foreground mt-1">
              Manage your AI-generated applications
            </p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Describe your app idea and we'll generate the complete codebase
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    placeholder="My Awesome App"
                    value={newProject.name}
                    onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="I want to build a task management app with user authentication, where users can create, edit, and delete tasks..."
                    value={newProject.description}
                    onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                    className="min-h-[100px] resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tech-stack">Tech Stack</Label>
                  <Select value={newProject.tech_stack} onValueChange={(value) => setNewProject(prev => ({ ...prev, tech_stack: value }))}>
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
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <DialogTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogTrigger>
                <Button 
                  onClick={handleCreateProject}
                  disabled={!newProject.name.trim() || !newProject.description.trim() || !newProject.tech_stack || isCreating}
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    'Create Project'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first AI-generated application
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>
                    Describe your app idea and we'll generate the complete codebase
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Project Name</Label>
                    <Input
                      id="name"
                      placeholder="My Awesome App"
                      value={newProject.name}
                      onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="I want to build a task management app with user authentication, where users can create, edit, and delete tasks..."
                      value={newProject.description}
                      onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                      className="min-h-[100px] resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tech-stack">Tech Stack</Label>
                    <Select value={newProject.tech_stack} onValueChange={(value) => setNewProject(prev => ({ ...prev, tech_stack: value }))}>
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
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <DialogTrigger asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogTrigger>
                  <Button 
                    onClick={handleCreateProject}
                    disabled={!newProject.name.trim() || !newProject.description.trim() || !newProject.tech_stack || isCreating}
                  >
                    {isCreating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      'Create Project'
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription className="mt-1 line-clamp-2">
                        {project.description}
                      </CardDescription>
                    </div>
                    {getStatusIcon(project.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {project.techStack}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                        {project.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      {project.previewUrl && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={project.previewUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        onClick={() => navigate(`/project/${project.id}`)}
                      >
                        Open
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}