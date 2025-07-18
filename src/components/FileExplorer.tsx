import { useState } from 'react'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { Input } from './ui/input'
import { 
  Folder, 
  FolderOpen, 
  File, 
  FileText, 
  Image, 
  Code, 
  Database, 
  Settings,
  Plus,
  Search,
  MoreHorizontal,
  Trash2,
  Edit,
  Copy,
  Download
} from 'lucide-react'
import { CodeFile } from '../types'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from './ui/context-menu'

interface FileNode {
  name: string
  path: string
  type: 'file' | 'folder'
  children?: FileNode[]
  language?: string
  size?: number
  modified?: string
}

interface FileExplorerProps {
  files: CodeFile[]
  selectedFile: CodeFile | null
  onFileSelect: (file: CodeFile) => void
  onFileCreate?: (path: string, type: 'file' | 'folder') => void
  onFileDelete?: (path: string) => void
  onFileRename?: (oldPath: string, newPath: string) => void
  className?: string
}

export default function FileExplorer({ 
  files, 
  selectedFile, 
  onFileSelect, 
  onFileCreate,
  onFileDelete,
  onFileRename,
  className = '' 
}: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src']))
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  // Convert flat file list to tree structure
  const buildFileTree = (files: CodeFile[]): FileNode[] => {
    const tree: FileNode[] = []
    const folderMap = new Map<string, FileNode>()

    // Filter files based on search query
    const filteredFiles = files.filter(file => 
      !searchQuery || file.path.toLowerCase().includes(searchQuery.toLowerCase())
    )

    filteredFiles.forEach(file => {
      const parts = file.path.split('/')
      let currentPath = ''
      
      parts.forEach((part, index) => {
        const parentPath = currentPath
        currentPath = currentPath ? `${currentPath}/${part}` : part
        
        if (index === parts.length - 1) {
          // This is a file
          const fileNode: FileNode = {
            name: part,
            path: currentPath,
            type: 'file',
            language: file.language,
            size: file.content.length,
            modified: new Date().toISOString()
          }
          
          if (parentPath) {
            const parentFolder = folderMap.get(parentPath)
            if (parentFolder) {
              parentFolder.children = parentFolder.children || []
              parentFolder.children.push(fileNode)
            }
          } else {
            tree.push(fileNode)
          }
        } else {
          // This is a folder
          if (!folderMap.has(currentPath)) {
            const folderNode: FileNode = {
              name: part,
              path: currentPath,
              type: 'folder',
              children: []
            }
            
            folderMap.set(currentPath, folderNode)
            
            if (parentPath) {
              const parentFolder = folderMap.get(parentPath)
              if (parentFolder) {
                parentFolder.children = parentFolder.children || []
                parentFolder.children.push(folderNode)
              }
            } else {
              tree.push(folderNode)
            }
          }
        }
      })
    })

    // Sort tree: folders first, then files, both alphabetically
    const sortTree = (nodes: FileNode[]): FileNode[] => {
      return nodes.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1
        }
        return a.name.localeCompare(b.name)
      }).map(node => ({
        ...node,
        children: node.children ? sortTree(node.children) : undefined
      }))
    }

    return sortTree(tree)
  }

  const getFileIcon = (node: FileNode) => {
    if (node.type === 'folder') {
      return expandedFolders.has(node.path) ? (
        <FolderOpen className="h-4 w-4 text-blue-500" />
      ) : (
        <Folder className="h-4 w-4 text-blue-500" />
      )
    }

    // File icons based on extension or language
    const extension = node.name.split('.').pop()?.toLowerCase()
    const language = node.language?.toLowerCase()

    if (language === 'typescript' || extension === 'ts' || extension === 'tsx') {
      return <div className="h-4 w-4 flex items-center justify-center text-xs font-bold text-blue-600">TS</div>
    }
    if (language === 'javascript' || extension === 'js' || extension === 'jsx') {
      return <div className="h-4 w-4 flex items-center justify-center text-xs font-bold text-yellow-600">JS</div>
    }
    if (extension === 'html') {
      return <div className="h-4 w-4 flex items-center justify-center text-xs font-bold text-orange-600">H</div>
    }
    if (extension === 'css' || extension === 'scss' || extension === 'sass') {
      return <div className="h-4 w-4 flex items-center justify-center text-xs font-bold text-purple-600">C</div>
    }
    if (extension === 'json') {
      return <Database className="h-4 w-4 text-gray-600" />
    }
    if (extension === 'md') {
      return <FileText className="h-4 w-4 text-gray-600" />
    }
    if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(extension || '')) {
      return <Image className="h-4 w-4 text-green-600" />
    }
    if (extension === 'config' || node.name.includes('config')) {
      return <Settings className="h-4 w-4 text-gray-600" />
    }

    return <File className="h-4 w-4 text-gray-500" />
  }

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedFolders(newExpanded)
  }

  const handleFileClick = (node: FileNode) => {
    if (node.type === 'folder') {
      toggleFolder(node.path)
    } else {
      const file = files.find(f => f.path === node.path)
      if (file) {
        onFileSelect(file)
      }
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const renderFileNode = (node: FileNode, depth = 0) => {
    const isSelected = selectedFile?.path === node.path
    const isExpanded = expandedFolders.has(node.path)

    return (
      <div key={node.path}>
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              className={`flex items-center space-x-2 px-2 py-1.5 hover:bg-gray-100 cursor-pointer rounded-md mx-1 ${
                isSelected ? 'bg-blue-50 border border-blue-200' : ''
              }`}
              style={{ paddingLeft: `${depth * 16 + 8}px` }}
              onClick={() => handleFileClick(node)}
            >
              {getFileIcon(node)}
              <span className={`text-sm flex-1 truncate ${
                isSelected ? 'font-medium text-blue-900' : 'text-gray-700'
              }`}>
                {node.name}
              </span>
              {node.type === 'file' && node.size && (
                <span className="text-xs text-gray-400">
                  {formatFileSize(node.size)}
                </span>
              )}
            </div>
          </ContextMenuTrigger>
          
          <ContextMenuContent>
            {node.type === 'folder' ? (
              <>
                <ContextMenuItem onClick={() => onFileCreate?.(node.path + '/new-file.txt', 'file')}>
                  <File className="h-4 w-4 mr-2" />
                  New File
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onFileCreate?.(node.path + '/new-folder', 'folder')}>
                  <Folder className="h-4 w-4 mr-2" />
                  New Folder
                </ContextMenuItem>
                <ContextMenuSeparator />
              </>
            ) : (
              <>
                <ContextMenuItem onClick={() => onFileSelect(files.find(f => f.path === node.path)!)}>
                  <Code className="h-4 w-4 mr-2" />
                  Open
                </ContextMenuItem>
                <ContextMenuSeparator />
              </>
            )}
            <ContextMenuItem onClick={() => onFileRename?.(node.path, node.path)}>
              <Edit className="h-4 w-4 mr-2" />
              Rename
            </ContextMenuItem>
            <ContextMenuItem>
              <Copy className="h-4 w-4 mr-2" />
              Copy Path
            </ContextMenuItem>
            <ContextMenuItem>
              <Download className="h-4 w-4 mr-2" />
              Download
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem 
              className="text-red-600"
              onClick={() => onFileDelete?.(node.path)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>

        {node.type === 'folder' && isExpanded && node.children && (
          <div>
            {node.children.map(child => renderFileNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  const fileTree = buildFileTree(files)

  return (
    <div className={`h-full flex flex-col bg-gray-50 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-white">
        <h3 className="font-semibold text-sm text-gray-900">Explorer</h3>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
            className="h-7 w-7 p-0"
          >
            <Search className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFileCreate?.('new-file.txt', 'file')}
            className="h-7 w-7 p-0"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Search */}
      {showSearch && (
        <div className="p-2 border-b bg-white">
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 text-sm"
          />
        </div>
      )}

      {/* File Tree */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {fileTree.length === 0 ? (
            <div className="text-center py-8">
              <File className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No files found</p>
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-xs"
                >
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-0.5">
              {fileTree.map(node => renderFileNode(node))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-2 border-t bg-white text-xs text-gray-500">
        {files.length} files
      </div>
    </div>
  )
}