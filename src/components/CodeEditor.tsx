import { useState, useRef, useEffect } from 'react'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { Badge } from './ui/badge'
import { 
  Copy, 
  Download, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Save,
  Search,
  Replace,
  Settings,
  Palette,
  Type,
  Zap
} from 'lucide-react'
import { CodeFile } from '../types'

interface CodeEditorProps {
  file: CodeFile | null
  onFileChange?: (file: CodeFile) => void
  readOnly?: boolean
  className?: string
}

export default function CodeEditor({ file, onFileChange, readOnly = false, className = '' }: CodeEditorProps) {
  const [content, setContent] = useState(file?.content || '')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [replaceQuery, setReplaceQuery] = useState('')
  const [lineNumbers, setLineNumbers] = useState(true)
  const [wordWrap, setWordWrap] = useState(true)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [fontSize, setFontSize] = useState(14)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lineNumbersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (file) {
      setContent(file.content)
    }
  }, [file])

  useEffect(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      const textarea = textareaRef.current
      const lineNumbersDiv = lineNumbersRef.current
      
      const updateLineNumbers = () => {
        const lines = content.split('\n').length
        const lineNumbersHtml = Array.from({ length: lines }, (_, i) => 
          `<div class="text-right pr-2 text-gray-400 select-none leading-6" style="font-size: ${fontSize}px;">${i + 1}</div>`
        ).join('')
        lineNumbersDiv.innerHTML = lineNumbersHtml
      }

      const syncScroll = () => {
        lineNumbersDiv.scrollTop = textarea.scrollTop
      }

      updateLineNumbers()
      textarea.addEventListener('scroll', syncScroll)
      
      return () => {
        textarea.removeEventListener('scroll', syncScroll)
      }
    }
  }, [content, fontSize])

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    if (file && onFileChange) {
      onFileChange({ ...file, content: newContent })
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleDownload = () => {
    if (!file) return
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file.path.split('/').pop() || 'file.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleSearch = () => {
    if (!searchQuery || !textareaRef.current) return
    
    const textarea = textareaRef.current
    const text = textarea.value
    const index = text.toLowerCase().indexOf(searchQuery.toLowerCase())
    
    if (index !== -1) {
      textarea.focus()
      textarea.setSelectionRange(index, index + searchQuery.length)
    }
  }

  const handleReplace = () => {
    if (!searchQuery || !textareaRef.current) return
    
    const newContent = content.replace(new RegExp(searchQuery, 'gi'), replaceQuery)
    handleContentChange(newContent)
  }

  const getLanguageIcon = (language: string) => {
    switch (language.toLowerCase()) {
      case 'typescript':
      case 'tsx':
        return '🔷'
      case 'javascript':
      case 'jsx':
        return '🟨'
      case 'html':
        return '🟧'
      case 'css':
        return '🎨'
      case 'json':
        return '📋'
      case 'python':
        return '🐍'
      case 'java':
        return '☕'
      case 'cpp':
      case 'c++':
        return '⚡'
      default:
        return '📄'
    }
  }

  const getLanguageColor = (language: string) => {
    switch (language.toLowerCase()) {
      case 'typescript':
      case 'tsx':
        return 'bg-blue-100 text-blue-800'
      case 'javascript':
      case 'jsx':
        return 'bg-yellow-100 text-yellow-800'
      case 'html':
        return 'bg-orange-100 text-orange-800'
      case 'css':
        return 'bg-purple-100 text-purple-800'
      case 'json':
        return 'bg-gray-100 text-gray-800'
      case 'python':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!file) {
    return (
      <div className={`h-full flex items-center justify-center bg-gray-50 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Type className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No File Selected</h3>
          <p className="text-gray-600">Select a file from the explorer to start editing</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`h-full flex flex-col bg-white ${isFullscreen ? 'fixed inset-0 z-50' : ''} ${className}`}>
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
        <div className="flex items-center space-x-3">
          <span className="text-lg">{getLanguageIcon(file.language)}</span>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm font-medium text-gray-900">{file.path}</span>
              <Badge className={`text-xs ${getLanguageColor(file.language)}`}>
                {file.language}
              </Badge>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {content.split('\n').length} lines • {content.length} characters
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Search className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="text-gray-600 hover:text-gray-900"
          >
            <Copy className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="text-gray-600 hover:text-gray-900"
          >
            <Download className="h-4 w-4" />
          </Button>
          
          {!readOnly && (
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
            >
              <Save className="h-4 w-4" />
            </Button>
          )}
          
          <div className="w-px h-6 bg-gray-300"></div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-gray-600 hover:text-gray-900"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Search/Replace Bar */}
      {showSearch && (
        <div className="flex items-center space-x-2 px-4 py-2 border-b bg-gray-50">
          <div className="flex items-center space-x-2 flex-1">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button size="sm" onClick={handleSearch} className="px-3">
              Find
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Replace className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Replace..."
              value={replaceQuery}
              onChange={(e) => setReplaceQuery(e.target.value)}
              className="px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button size="sm" onClick={handleReplace} className="px-3">
              Replace
            </Button>
          </div>
        </div>
      )}

      {/* Editor Settings Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-white">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={lineNumbers}
              onChange={(e) => setLineNumbers(e.target.checked)}
              className="rounded"
            />
            <span>Line Numbers</span>
          </label>
          
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={wordWrap}
              onChange={(e) => setWordWrap(e.target.checked)}
              className="rounded"
            />
            <span>Word Wrap</span>
          </label>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Type className="h-4 w-4 text-gray-400" />
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="text-sm border rounded px-2 py-1"
            >
              <option value={12}>12px</option>
              <option value={14}>14px</option>
              <option value={16}>16px</option>
              <option value={18}>18px</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Palette className="h-4 w-4 text-gray-400" />
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Line Numbers */}
        {lineNumbers && (
          <div 
            ref={lineNumbersRef}
            className="w-12 bg-gray-50 border-r overflow-hidden"
            style={{ fontSize: `${fontSize}px` }}
          />
        )}
        
        {/* Code Editor */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            readOnly={readOnly}
            className={`w-full h-full p-4 font-mono resize-none focus:outline-none leading-6 ${
              theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
            } ${wordWrap ? '' : 'whitespace-nowrap overflow-x-auto'}`}
            style={{ 
              fontSize: `${fontSize}px`,
              tabSize: 2,
              lineHeight: '1.5'
            }}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            placeholder={readOnly ? "This file is read-only" : "Start typing..."}
          />
          
          {/* Syntax highlighting overlay would go here in a real implementation */}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t bg-gray-50 text-xs text-gray-600">
        <div className="flex items-center space-x-4">
          <span>UTF-8</span>
          <span>{file.language.toUpperCase()}</span>
          <span>Spaces: 2</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <span>Ln {content.slice(0, textareaRef.current?.selectionStart || 0).split('\n').length}</span>
          <span>Col {(textareaRef.current?.selectionStart || 0) - content.lastIndexOf('\n', (textareaRef.current?.selectionStart || 0) - 1)}</span>
          {!readOnly && <span className="text-green-600">● Saved</span>}
        </div>
      </div>
    </div>
  )
}