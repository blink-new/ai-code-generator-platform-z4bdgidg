export interface Project {
  id: string
  name: string
  description: string
  tech_stack: string
  created_at: string
  updated_at: string
  user_id: string
  status: 'generating' | 'completed' | 'error'
  generated_code?: string
  preview_url?: string
}

export interface GenerationRequest {
  description: string
  tech_stack: string
  features?: string[]
}

export interface CodeFile {
  path: string
  content: string
  language: string
}

export interface GenerationResponse {
  project_id: string
  files: CodeFile[]
  preview_url: string
  status: 'success' | 'error'
  message?: string
}