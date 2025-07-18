import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { ScrollArea } from '../components/ui/scroll-area'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../components/ui/resizable'
import { ArrowLeft, Play, Download, Code, Eye, Sparkles, FileText, Zap, Terminal, Globe, Settings, Bot, MessageSquare } from 'lucide-react'
import { blink } from '../blink/client'
import { Project, CodeFile } from '../types'
import { LocalProjectStorage } from '../lib/storage'
import CodeEditor from '../components/CodeEditor'
import FileExplorer from '../components/FileExplorer'
import AIAgentBuilder from '../components/AIAgentBuilder'

export default function ProjectBuilder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [generatedFiles, setGeneratedFiles] = useState<CodeFile[]>([])
  const [selectedFile, setSelectedFile] = useState<CodeFile | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState('')
  const [generationStep, setGenerationStep] = useState(0)

  const loadProject = useCallback(async (projectId: string) => {
    try {
      const projectData = LocalProjectStorage.getProject(projectId)
      
      if (projectData) {
        setProject(projectData)
        if (projectData.generatedCode) {
          try {
            const files = JSON.parse(projectData.generatedCode)
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
    setGenerationStep(0)
    
    try {
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
        setGenerationStep(i + 1)
        await new Promise(resolve => setTimeout(resolve, 2000))
      }

      const files = generateMockFiles(projectData.techStack, projectData.description)
      setGeneratedFiles(files)
      setSelectedFile(files[0])

      const updatedProject = LocalProjectStorage.updateProject(projectData.id, {
        status: 'completed',
        generatedCode: JSON.stringify(files)
      })

      setProject(updatedProject)
    } catch (error) {
      console.error('Generation failed:', error)
      const updatedProject = LocalProjectStorage.updateProject(projectData.id, {
        status: 'error'
      })
      setProject(updatedProject)
    } finally {
      setIsGenerating(false)
      setGenerationProgress('')
      setGenerationStep(0)
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
  "name": "${project?.name.toLowerCase().replace(/\\s+/g, '-')}",
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
    const content = generatedFiles.map(file => 
      `// ${file.path}\\n${file.content}\\n\\n`
    ).join('\\n')
    
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project not found</h2>
          <Button onClick={() => navigate('/dashboard')} className="bg-black hover:bg-gray-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
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
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="text-gray-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{project.name}</h1>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {project.techStack}
                  </Badge>
                  <Badge className={`text-xs border ${
                    project.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                    project.status === 'generating' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-red-50 text-red-700 border-red-200'
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
                  <div className="w-px h-6 bg-gray-300"></div>
                  <Button variant="outline" size="sm">
                    <Bot className="h-4 w-4 mr-2" />
                    AI Assistant
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
          <div className="h-full flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-lg mx-4">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="h-10 w-10 text-white animate-pulse" />
                </div>
                <CardTitle className="text-2xl">Generating Your App</CardTitle>
                <CardDescription className="text-base">
                  Our AI is creating your complete application...
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                    <span className="text-sm font-medium">{generationProgress}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Progress</span>
                      <span>{generationStep}/7</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-black h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${(generationStep / 7) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : project.status === 'completed' ? (
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* File Explorer */}
            <ResizablePanel defaultSize={20} minSize={15}>
              <FileExplorer
                files={generatedFiles}
                selectedFile={selectedFile}
                onFileSelect={setSelectedFile}
                onFileCreate={(path, type) => {
                  console.log('Create file:', path, type)
                  // TODO: Implement file creation
                }}
                onFileDelete={(path) => {
                  console.log('Delete file:', path)
                  // TODO: Implement file deletion
                }}
                onFileRename={(oldPath, newPath) => {
                  console.log('Rename file:', oldPath, newPath)
                  // TODO: Implement file renaming
                }}
              />
            </ResizablePanel>

            <ResizableHandle />

            {/* Main Content Area */}
            <ResizablePanel defaultSize={60}>
              <Tabs defaultValue="code" className="h-full">
                <div className="border-b px-4 bg-white">
                  <TabsList className="bg-gray-100">
                    <TabsTrigger value="code" className="flex items-center space-x-2">
                      <Code className="h-4 w-4" />
                      <span>Code</span>
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="flex items-center space-x-2">
                      <Eye className="h-4 w-4" />
                      <span>Preview</span>
                    </TabsTrigger>
                    <TabsTrigger value="terminal" className="flex items-center space-x-2">
                      <Terminal className="h-4 w-4" />
                      <span>Terminal</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="code" className="h-[calc(100%-3rem)] m-0">
                  <CodeEditor
                    file={selectedFile}
                    onFileChange={(updatedFile) => {
                      setGeneratedFiles(prev => 
                        prev.map(file => 
                          file.path === updatedFile.path ? updatedFile : file
                        )
                      )
                    }}
                    readOnly={false}
                  />
                </TabsContent>

                <TabsContent value="preview" className="h-[calc(100%-3rem)] m-0">
                  <div className="h-full flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <Globe className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Live Preview</h3>
                      <p className="text-gray-600 mb-6 max-w-md">
                        Preview functionality coming soon. You'll be able to see your app running live.
                      </p>
                      <Button variant="outline" className="border-gray-300">
                        <Play className="h-4 w-4 mr-2" />
                        Run Preview
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="terminal" className="h-[calc(100%-3rem)] m-0">
                  <div className="h-full bg-black text-green-400 font-mono text-sm">
                    <div className="p-4">
                      <div className="mb-2">
                        <span className="text-gray-500">$</span> npm install
                      </div>
                      <div className="mb-2 text-gray-400">Installing dependencies...</div>
                      <div className="mb-2">
                        <span className="text-gray-500">$</span> npm start
                      </div>
                      <div className="mb-2 text-gray-400">Starting development server...</div>
                      <div className="text-green-400">✓ Server running on http://localhost:3000</div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </ResizablePanel>

            <ResizableHandle />

            {/* AI Assistant Panel */}
            <ResizablePanel defaultSize={20} minSize={15}>
              <AIAgentBuilder
                onCodeGenerated={(code, files) => {
                  console.log('Code generated:', code, files)
                  if (files && files.length > 0) {
                    setGeneratedFiles(prev => [...prev, ...files])
                  }
                }}
                onProjectUpdate={(update) => {
                  console.log('Project update:', update)
                  // TODO: Handle project updates
                }}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle>Generation Failed</CardTitle>
                <CardDescription>
                  There was an error generating your application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => startGeneration(project)}
                  className="w-full bg-black hover:bg-gray-800"
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