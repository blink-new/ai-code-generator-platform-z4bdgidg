import { useState, useRef, useEffect } from 'react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'
import { Progress } from './ui/progress'
import { 
  Send, 
  Paperclip, 
  Image, 
  Code, 
  Sparkles, 
  Bot, 
  User, 
  Loader2,
  Upload,
  X,
  FileText,
  Github,
  ChevronDown,
  Zap,
  Brain,
  Wand2
} from 'lucide-react'
import { blink } from '../blink/client'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  attachments?: Attachment[]
  isStreaming?: boolean
}

interface Attachment {
  id: string
  name: string
  type: 'image' | 'file' | 'code'
  url?: string
  content?: string
  size?: number
}

interface AIAgentBuilderProps {
  onCodeGenerated?: (code: string, files: any[]) => void
  onProjectUpdate?: (update: any) => void
  className?: string
}

export default function AIAgentBuilder({ 
  onCodeGenerated, 
  onProjectUpdate, 
  className = '' 
}: AIAgentBuilderProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI coding assistant. I can help you build full-stack applications, generate code, debug issues, and answer technical questions. What would you like to create today?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [selectedModel, setSelectedModel] = useState('auto')
  const [generationProgress, setGenerationProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const models = [
    { value: 'auto', label: 'Auto', description: 'Best model for your task' },
    { value: 'gpt-4o', label: 'GPT-4o', description: 'Most capable model' },
    { value: 'claude-3.5-sonnet', label: 'Claude 3.5 Sonnet', description: 'Great for coding' },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini', description: 'Fast and efficient' }
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      attachments: attachments.length > 0 ? [...attachments] : undefined
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setAttachments([])
    setIsLoading(true)

    try {
      // Simulate AI response with streaming
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true
      }

      setMessages(prev => [...prev, assistantMessage])

      // Simulate streaming response
      const response = await generateAIResponse(userMessage.content, userMessage.attachments)
      
      let streamedContent = ''
      for (let i = 0; i < response.length; i++) {
        streamedContent += response[i]
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessage.id 
            ? { ...msg, content: streamedContent }
            : msg
        ))
        await new Promise(resolve => setTimeout(resolve, 20))
      }

      // Mark streaming as complete
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessage.id 
          ? { ...msg, isStreaming: false }
          : msg
      ))

      // If the response contains code, trigger code generation
      if (response.includes('```') || userMessage.content.toLowerCase().includes('build') || userMessage.content.toLowerCase().includes('create')) {
        await simulateCodeGeneration()
      }

    } catch (error) {
      console.error('Failed to get AI response:', error)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const generateAIResponse = async (userInput: string, attachments?: Attachment[]): Promise<string> => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (userInput.toLowerCase().includes('build') || userInput.toLowerCase().includes('create')) {
      return `I'll help you build that! Let me analyze your requirements and generate the code structure.

Here's what I'll create for you:

\`\`\`typescript
// App.tsx - Main application component
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Dashboard from './pages/Dashboard'

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

export default App
\`\`\`

I'm generating the complete application structure with:
- Modern React with TypeScript
- Responsive design with Tailwind CSS
- Component-based architecture
- Routing setup
- State management

Would you like me to add any specific features or modify the structure?`
    }

    if (userInput.toLowerCase().includes('debug') || userInput.toLowerCase().includes('error')) {
      return `I can help you debug that issue! Based on the error, here are the most likely causes and solutions:

1. **Check your imports** - Make sure all components are properly imported
2. **Verify prop types** - Ensure you're passing the correct data types
3. **Look for typos** - Check variable names and function calls
4. **Console logs** - Add strategic console.log statements to trace the issue

Could you share the specific error message or code snippet you're having trouble with?`
    }

    return `I understand you want to ${userInput}. I can definitely help with that! 

Let me break this down into steps:
1. First, I'll analyze your requirements
2. Then I'll design the optimal architecture
3. Finally, I'll generate clean, production-ready code

What specific features or technologies would you like me to focus on?`
  }

  const simulateCodeGeneration = async () => {
    const steps = [
      'Analyzing requirements...',
      'Designing architecture...',
      'Generating components...',
      'Setting up routing...',
      'Adding styling...',
      'Optimizing code...',
      'Finalizing project...'
    ]

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(steps[i])
      setGenerationProgress((i + 1) / steps.length * 100)
      await new Promise(resolve => setTimeout(resolve, 800))
    }

    setCurrentStep('')
    setGenerationProgress(0)

    // Simulate code generation callback
    if (onCodeGenerated) {
      const mockFiles = [
        { path: 'src/App.tsx', content: '// Generated App component', language: 'typescript' },
        { path: 'src/components/Header.tsx', content: '// Generated Header component', language: 'typescript' }
      ]
      onCodeGenerated('Generated code content', mockFiles)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    files.forEach(file => {
      const attachment: Attachment = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'file',
        size: file.size
      }

      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          attachment.url = e.target?.result as string
          setAttachments(prev => [...prev, attachment])
        }
        reader.readAsDataURL(file)
      } else {
        const reader = new FileReader()
        reader.onload = (e) => {
          attachment.content = e.target?.result as string
          setAttachments(prev => [...prev, attachment])
        }
        reader.readAsText(file)
      }
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className={`h-full flex flex-col bg-white ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Assistant</h3>
            <p className="text-xs text-gray-500">Powered by advanced AI models</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs">
            <Brain className="h-3 w-3 mr-1" />
            {models.find(m => m.value === selectedModel)?.label}
          </Badge>
        </div>
      </div>

      {/* Generation Progress */}
      {generationProgress > 0 && (
        <div className="p-4 border-b bg-blue-50">
          <div className="flex items-center space-x-3 mb-2">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <span className="text-sm font-medium text-blue-900">{currentStep}</span>
          </div>
          <Progress value={generationProgress} className="h-2" />
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {message.role === 'user' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              
              <div className={`flex-1 max-w-3xl ${
                message.role === 'user' ? 'text-right' : ''
              }`}>
                <div className={`inline-block p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                    {message.isStreaming && (
                      <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" />
                    )}
                  </div>
                  
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center space-x-2 text-xs opacity-80">
                          {attachment.type === 'image' ? (
                            <Image className="h-3 w-3" />
                          ) : (
                            <FileText className="h-3 w-3" />
                          )}
                          <span>{attachment.name}</span>
                          {attachment.size && (
                            <span>({formatFileSize(attachment.size)})</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className={`text-xs text-gray-500 mt-1 ${
                  message.role === 'user' ? 'text-right' : ''
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <Bot className="h-4 w-4 text-gray-600" />
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-600">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t bg-white">
        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="p-3 border-b bg-gray-50">
            <div className="flex flex-wrap gap-2">
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center space-x-2 bg-white border rounded-lg px-3 py-2"
                >
                  {attachment.type === 'image' ? (
                    <Image className="h-4 w-4 text-green-600" />
                  ) : (
                    <FileText className="h-4 w-4 text-blue-600" />
                  )}
                  <span className="text-sm font-medium">{attachment.name}</span>
                  {attachment.size && (
                    <span className="text-xs text-gray-500">
                      ({formatFileSize(attachment.size)})
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(attachment.id)}
                    className="h-5 w-5 p-0 hover:bg-red-100"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe what you want to build, ask a question, or request help with your code..."
                className="min-h-[60px] max-h-[200px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                disabled={isLoading}
              />
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,.txt,.js,.ts,.jsx,.tsx,.json,.md,.css,.html"
                  />
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-gray-500 hover:text-gray-700"
                    disabled={isLoading}
                  >
                    <Paperclip className="h-4 w-4 mr-1" />
                    Attach
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700"
                    disabled={isLoading}
                  >
                    <Github className="h-4 w-4 mr-1" />
                    Import Code
                  </Button>
                  
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <span>{models.find(m => m.value === selectedModel)?.label}</span>
                    <ChevronDown className="h-3 w-3" />
                  </div>
                </div>
                
                <div className="text-xs text-gray-400">
                  Press Enter to send, Shift+Enter for new line
                </div>
              </div>
            </div>
            
            <Button
              onClick={handleSend}
              disabled={(!input.trim() && attachments.length === 0) || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}