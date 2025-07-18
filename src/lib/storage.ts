import { Project } from '../types'

// Temporary localStorage-based storage until database is available
export class LocalProjectStorage {
  private static STORAGE_KEY = 'ai-code-generator-projects'

  static getProjects(userId: string): Project[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return []
      
      const allProjects = JSON.parse(stored) as Project[]
      return allProjects.filter(p => p.userId === userId)
    } catch (error) {
      console.error('Failed to load projects from localStorage:', error)
      return []
    }
  }

  static saveProject(project: Project): Project {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      const allProjects = stored ? JSON.parse(stored) as Project[] : []
      
      // Generate ID if not provided
      if (!project.id) {
        project.id = 'proj_' + Date.now().toString(36) + Math.random().toString(36).substr(2)
      }
      
      // Set timestamps
      const now = new Date().toISOString()
      if (!project.createdAt) project.createdAt = now
      project.updatedAt = now
      
      // Update existing or add new
      const existingIndex = allProjects.findIndex(p => p.id === project.id)
      if (existingIndex >= 0) {
        allProjects[existingIndex] = project
      } else {
        allProjects.push(project)
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allProjects))
      return project
    } catch (error) {
      console.error('Failed to save project to localStorage:', error)
      throw error
    }
  }

  static getProject(id: string): Project | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return null
      
      const allProjects = JSON.parse(stored) as Project[]
      return allProjects.find(p => p.id === id) || null
    } catch (error) {
      console.error('Failed to get project from localStorage:', error)
      return null
    }
  }

  static updateProject(id: string, updates: Partial<Project>): Project | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return null
      
      const allProjects = JSON.parse(stored) as Project[]
      const projectIndex = allProjects.findIndex(p => p.id === id)
      
      if (projectIndex === -1) return null
      
      const updatedProject = {
        ...allProjects[projectIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      
      allProjects[projectIndex] = updatedProject
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allProjects))
      
      return updatedProject
    } catch (error) {
      console.error('Failed to update project in localStorage:', error)
      return null
    }
  }

  static deleteProject(id: string): boolean {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return false
      
      const allProjects = JSON.parse(stored) as Project[]
      const filteredProjects = allProjects.filter(p => p.id !== id)
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredProjects))
      return true
    } catch (error) {
      console.error('Failed to delete project from localStorage:', error)
      return false
    }
  }
}