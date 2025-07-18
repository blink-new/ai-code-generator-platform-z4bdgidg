import { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Plus, Clock, CheckCircle, AlertCircle, ExternalLink, User, LogOut, Sparkles, Code2, Folder, Search } from 'lucide-react'
import { blink } from '../blink/client'
import { Project } from '../types'
import { LocalProjectStorage } from '../lib/storage'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
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
      const user = await blink.auth.me()
      const userProjects = LocalProjectStorage.getProjects(user.id)
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
      const project = LocalProjectStorage.saveProject({
        id: '',
        name: newProject.name,
        description: newProject.description,
        techStack: newProject.tech_stack,
        userId: user.id,
        status: 'generating',
        createdAt: '',
        updatedAt: ''
      })
      
      setNewProject({ name: '', description: '', tech_stack: '' })
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
        return <Clock className="h-4 w-4 text-amber-500" />
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
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
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

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your projects...</p>
        </div>
      </div>
    )
  }

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
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              <Button onClick={handleSignOut} variant="ghost" size="sm" className="text-gray-600">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="mt-1 text-gray-600">
              Build and manage your AI-generated applications
            </p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-4 sm:mt-0 bg-black hover:bg-gray-800 text-white">
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
                  className="bg-black hover:bg-gray-800"
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Create Project
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        {projects.length > 0 && (
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Code2 className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Create your first AI-generated application and start building amazing things
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-black hover:bg-gray-800 text-white">
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
                    className="bg-black hover:bg-gray-800"
                  >
                    {isCreating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Create Project
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="group hover:shadow-lg transition-all duration-200 border-gray-200 cursor-pointer" onClick={() => navigate(`/project/${project.id}`)}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                        {project.name}
                      </CardTitle>
                      <CardDescription className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {project.description}
                      </CardDescription>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      {getStatusIcon(project.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs font-medium">
                        {project.techStack}
                      </Badge>
                      <Badge className={`text-xs font-medium border ${getStatusColor(project.status)}`}>
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center space-x-2">
                      {project.previewUrl && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(project.previewUrl, '_blank')
                          }}
                          className="h-8 px-2"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/project/${project.id}`)
                        }}
                        className="h-8 px-3 bg-black hover:bg-gray-800 text-white"
                      >
                        <Folder className="h-3 w-3 mr-1" />
                        Open
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Search Results */}
        {projects.length > 0 && filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or create a new project
            </p>
          </div>
        )}
      </main>
    </div>
  )
}