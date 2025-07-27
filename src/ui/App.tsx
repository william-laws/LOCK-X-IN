import { useState } from 'react'
import './App.css'

interface Project {
  id: string;
  title: string;
  createdAt: Date;
}

function App() {
  const [activeTab, setActiveTab] = useState<'project' | 'calendar'>('project')
  const [projects, setProjects] = useState<Project[]>([])
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')

  const handleAddProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: 'New Project',
      createdAt: new Date()
    }
    setProjects([...projects, newProject])
  }

  const handleDoubleClickTitle = (project: Project) => {
    setEditingProjectId(project.id)
    setEditingTitle(project.title)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(e.target.value)
  }

  const handleTitleSave = (projectId: string) => {
    setProjects(projects.map(project => 
      project.id === projectId 
        ? { ...project, title: editingTitle }
        : project
    ))
    setEditingProjectId(null)
    setEditingTitle('')
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, projectId: string) => {
    if (e.key === 'Enter') {
      handleTitleSave(projectId)
    } else if (e.key === 'Escape') {
      setEditingProjectId(null)
      setEditingTitle('')
    }
  }

  const handleTitleBlur = (projectId: string) => {
    handleTitleSave(projectId)
  }

  return (
    <div className="app">
      {/* Header with centered toggle switcher */}
      <header className="header">
        <div className="toggle-container">
          <div className="toggle-switch">
            <button 
              className={`toggle-option ${activeTab === 'project' ? 'active' : ''}`}
              onClick={() => setActiveTab('project')}
            >
              Project View
            </button>
            <button 
              className={`toggle-option ${activeTab === 'calendar' ? 'active' : ''}`}
              onClick={() => setActiveTab('calendar')}
            >
              Calendar View
            </button>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="main-content">
        {activeTab === 'project' && (
          <div className="project-view">
            <div className="add-project-section">
              {projects.map((project) => (
                <div key={project.id} className="project-board">
                  <div className="project-title">
                    {editingProjectId === project.id ? (
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={handleTitleChange}
                        onKeyDown={(e) => handleTitleKeyDown(e, project.id)}
                        onBlur={() => handleTitleBlur(project.id)}
                        className="project-title-input"
                        autoFocus
                      />
                    ) : (
                      <div 
                        className="project-title-text"
                        onDoubleClick={() => handleDoubleClickTitle(project)}
                      >
                        {project.title}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <button 
                className="add-project-button"
                onClick={handleAddProject}
              >
                <div className="plus-icon">+</div>
                <span>Add Project</span>
              </button>
            </div>
            <div className="projects-container">
              {/* Additional projects can be added here if needed */}
            </div>
          </div>
        )}
        
        {activeTab === 'calendar' && (
          <div className="calendar-view">
            <h2>Calendar View</h2>
            <p>Calendar functionality coming soon...</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
