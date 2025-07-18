export interface Project {
  id: string
  name: string
  description: string
  techStack: string  // Changed from tech_stack
  createdAt: string  // Changed from created_at
  updatedAt: string  // Changed from updated_at
  userId: string     // Changed from user_id
  status: 'generating' | 'completed' | 'error'
  generatedCode?: string  // Changed from generated_code
  previewUrl?: string     // Changed from preview_url
}

export interface GenerationRequest {
  description: string
  techStack: string  // Changed from tech_stack
  features?: string[]
}

export interface CodeFile {
  path: string
  content: string
  language: string
}

export interface GenerationResponse {
  projectId: string  // Changed from project_id
  files: CodeFile[]
  previewUrl: string  // Changed from preview_url
  status: 'success' | 'error'
  message?: string
}