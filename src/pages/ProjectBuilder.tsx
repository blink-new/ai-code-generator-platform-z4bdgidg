import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Textarea } from '../components/ui/textarea'
import { ScrollArea } from '../components/ui/scroll-area'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../components/ui/resizable'
import { ArrowLeft, Play, Download, Code, Eye, Sparkles, FileText, Zap } from 'lucide-react'
import { blink } from '../blink/client'
import { Project, CodeFile } from '../types'

export default function ProjectBuilder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [generatedFiles, setGeneratedFiles] = useState<CodeFile[]>([])
  const [selectedFile, setSelectedFile] = useState<CodeFile | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState('')

  const loadProject = useCallback(async (projectId: string) => {
    try {
      const projectData = await blink.db.projects.list({
        where: { id: projectId }
      })
      
      if (projectData.length > 0) {
        setProject(projectData[0])
        if (projectData[0].generatedCode) {
          // Parse existing generated code
          try {
            const files = JSON.parse(projectData[0].generatedCode)
            setGeneratedFiles(files)
            if (files.length > 0) {
              setSelectedFile(files[0])
            }
          } catch (error) {
            console.error('Failed to parse generated code:', error)
          }
        }
      }
    } catch (error) {
      console.error('Failed to load project:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (id) {
      loadProject(id)
    }
  }, [id, loadProject])

  const startGeneration = async (projectData: Project) => {
    setIsGenerating(true)
    setGenerationProgress('Analyzing your requirements...')
    
    try {
      // Simulate AI code generation with streaming updates
      const steps = [
        'Analyzing your requirements...',
        'Designing the application architecture...',
        'Generating frontend components...',
        'Creating backend API endpoints...',
        'Setting up database schema...',
        'Configuring authentication...',
        'Optimizing and finalizing code...'
      ]

      for (let i = 0; i < steps.length; i++) {
        setGenerationProgress(steps[i])
        await new Promise(resolve => setTimeout(resolve, 2000))
      }

      // Generate mock code files based on tech stack
      const files = generateMockFiles(projectData.techStack, projectData.description)
      setGeneratedFiles(files)
      setSelectedFile(files[0])

      // Update project status
      await blink.db.projects.update(projectData.id, {
        status: 'completed',
        generatedCode: JSON.stringify(files),
        updatedAt: new Date().toISOString()
      })

      setProject(prev => prev ? { ...prev, status: 'completed' } : null)
    } catch (error) {
      console.error('Generation failed:', error)
      await blink.db.projects.update(projectData.id, {
        status: 'error',
        updatedAt: new Date().toISOString()
      })
      setProject(prev => prev ? { ...prev, status: 'error' } : null)
    } finally {
      setIsGenerating(false)
      setGenerationProgress('')
    }
  }

  const generateMockFiles = (techStack: string, description: string): CodeFile[] => {
    const files: CodeFile[] = []

    if (techStack.includes('react')) {
      files.push(
        {
          path: 'src/App.tsx',
          language: 'typescript',
          content: `import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App`
        },
        {
          path: 'src/pages/HomePage.tsx',
          language: 'typescript',
          content: `import React from 'react'

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Welcome to Your App
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          ${description.slice(0, 100)}...
        </p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Get Started
        </button>
      </div>
    </div>
  )
}`
        },
        {
          path: 'src/pages/Dashboard.tsx',
          language: 'typescript',
          content: `import React, { useState, useEffect } from 'react'

interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask,
        completed: false,
        createdAt: new Date().toISOString()
      }
      setTasks([...tasks, task])
      setNewTask('')
    }
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 border rounded-lg"
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
          />
          <button
            onClick={addTask}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {tasks.map(task => (
          <div
            key={task.id}
            className="flex items-center gap-3 p-4 bg-white rounded-lg border"
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              className="w-5 h-5"
            />
            <span className={task.completed ? 'line-through text-gray-500' : ''}>
              {task.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}`
        },
        {
          path: 'package.json',
          language: 'json',
          content: `{
  "name": "${project?.name.toLowerCase().replace(/\s+/g, '-')}",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "typescript": "^4.9.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}`
        }
      )
    }

    return files
  }

  const handleDownload = () => {
    // Create a simple download of the generated files
    const content = generatedFiles.map(file => 
      `// ${file.path}\n${file.content}\n\n`
    ).join('\n')
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${project?.name || 'project'}-code.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Project not found</h2>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-lg font-semibold">{project.name}</h1>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {project.techStack}
                  </Badge>
                  <Badge className={`text-xs ${
                    project.status === 'completed' ? 'bg-green-100 text-green-800' :
                    project.status === 'generating' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {project.status}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {project.status === 'completed' && (
                <>
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="h-[calc(100vh-4rem)]">
        {isGenerating ? (
          <div className="h-full flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <CardTitle>Generating Your App</CardTitle>
                <CardDescription>
                  Our AI is creating your complete application...
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="text-sm">{generationProgress}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : project.status === 'completed' ? (
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* File Explorer */}
            <ResizablePanel defaultSize={20} minSize={15}>
              <div className="h-full border-r bg-muted/30">
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-sm">Project Files</h3>
                </div>
                <ScrollArea className="h-[calc(100%-4rem)]">
                  <div className="p-2">
                    {generatedFiles.map((file, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedFile(file)}
                        className={`w-full text-left p-2 rounded text-sm hover:bg-muted transition-colors ${
                          selectedFile?.path === file.path ? 'bg-muted' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span>{file.path}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </ResizablePanel>

            <ResizableHandle />

            {/* Code Editor */}
            <ResizablePanel defaultSize={80}>
              <Tabs defaultValue="code" className="h-full">
                <div className="border-b px-4">
                  <TabsList>
                    <TabsTrigger value="code" className="flex items-center space-x-2">
                      <Code className="h-4 w-4" />
                      <span>Code</span>
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="flex items-center space-x-2">
                      <Eye className="h-4 w-4" />
                      <span>Preview</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="code" className="h-[calc(100%-3rem)] m-0">
                  {selectedFile ? (
                    <div className="h-full">
                      <div className="border-b px-4 py-2 bg-muted/30">
                        <span className="text-sm font-mono">{selectedFile.path}</span>
                      </div>
                      <ScrollArea className="h-[calc(100%-2.5rem)]">
                        <pre className="p-4 text-sm font-mono">
                          <code>{selectedFile.content}</code>
                        </pre>
                      </ScrollArea>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      Select a file to view its contents
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="preview" className="h-[calc(100%-3rem)] m-0">
                  <div className="h-full flex items-center justify-center bg-muted/30">
                    <div className="text-center">
                      <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
                      <p className="text-muted-foreground mb-4">
                        Preview functionality coming soon
                      </p>
                      <Button variant="outline">
                        <Play className="h-4 w-4 mr-2" />
                        Run Preview
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className="h-full flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <CardTitle>Generation Failed</CardTitle>
                <CardDescription>
                  There was an error generating your application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => startGeneration(project)}
                  className="w-full"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Retry Generation
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}