import { useState } from 'react'
import './App.css'

interface Task {
  id: string;
  content: string;
  createdAt: Date;
}

interface KanbanList {
  id: string;
  title: string;
  tasks: Task[];
}

interface Project {
  id: string;
  title: string;
  createdAt: Date;
  kanbanLists: KanbanList[];
}

function App() {
  const [activeTab, setActiveTab] = useState<'project' | 'calendar'>('project')
  const [projects, setProjects] = useState<Project[]>([])
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [newTaskContent, setNewTaskContent] = useState('')
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editingTaskContent, setEditingTaskContent] = useState('')

  const handleAddProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: 'New Project',
      createdAt: new Date(),
      kanbanLists: [
        { id: 'todo', title: 'To Do', tasks: [] },
        { id: 'doing', title: 'Doing', tasks: [] },
        { id: 'done', title: 'Done', tasks: [] }
      ]
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

  const handleProjectClick = (projectId: string) => {
    setSelectedProjectId(projectId)
  }

  const handleBackToProjects = () => {
    setSelectedProjectId(null)
  }

  const handleAddTask = (projectId: string, listId: string) => {
    if (!newTaskContent.trim()) return

    const newTask: Task = {
      id: Date.now().toString(),
      content: newTaskContent,
      createdAt: new Date()
    }

    setProjects(projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          kanbanLists: project.kanbanLists.map(list => {
            if (list.id === listId) {
              return { ...list, tasks: [...list.tasks, newTask] }
            }
            return list
          })
        }
      }
      return project
    }))

    setNewTaskContent('')
  }

  const handleTaskKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, projectId: string, listId: string) => {
    if (e.key === 'Enter') {
      handleAddTask(projectId, listId)
    }
  }

  const handleTaskDoubleClick = (task: Task) => {
    setEditingTaskId(task.id)
    setEditingTaskContent(task.content)
  }

  const handleTaskContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTaskContent(e.target.value)
  }

  const handleTaskSave = (projectId: string, listId: string, taskId: string) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          kanbanLists: project.kanbanLists.map(list => {
            if (list.id === listId) {
              return {
                ...list,
                tasks: list.tasks.map(task => 
                  task.id === taskId 
                    ? { ...task, content: editingTaskContent }
                    : task
                )
              }
            }
            return list
          })
        }
      }
      return project
    }))

    setEditingTaskId(null)
    setEditingTaskContent('')
  }

  const handleTaskKeyDownEdit = (e: React.KeyboardEvent<HTMLInputElement>, projectId: string, listId: string, taskId: string) => {
    if (e.key === 'Enter') {
      handleTaskSave(projectId, listId, taskId)
    } else if (e.key === 'Escape') {
      setEditingTaskId(null)
      setEditingTaskContent('')
    }
  }

  const handleTaskBlur = (projectId: string, listId: string, taskId: string) => {
    handleTaskSave(projectId, listId, taskId)
  }

  const handleDeleteTask = (projectId: string, listId: string, taskId: string) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          kanbanLists: project.kanbanLists.map(list => {
            if (list.id === listId) {
              return {
                ...list,
                tasks: list.tasks.filter(task => task.id !== taskId)
              }
            }
            return list
          })
        }
      }
      return project
    }))
  }

  const selectedProject = projects.find(p => p.id === selectedProjectId)

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
            {selectedProject ? (
              <div className="kanban-view">
                <div className="kanban-header">
                  <button className="back-button" onClick={handleBackToProjects}>
                    ← Back to Projects
                  </button>
                  <h1 className="project-title-large">{selectedProject.title}</h1>
                </div>
                <div className="kanban-board">
                  {selectedProject.kanbanLists.map((list) => (
                    <div key={list.id} className="kanban-list">
                      <h3 className="list-title">{list.title}</h3>
                      <div className="list-content">
                        {list.tasks.map((task) => (
                          <div key={task.id} className="task-card">
                            {editingTaskId === task.id ? (
                              <input
                                type="text"
                                value={editingTaskContent}
                                onChange={handleTaskContentChange}
                                onKeyDown={(e) => handleTaskKeyDownEdit(e, selectedProject.id, list.id, task.id)}
                                onBlur={() => handleTaskBlur(selectedProject.id, list.id, task.id)}
                                className="task-input"
                                autoFocus
                              />
                            ) : (
                              <div 
                                className="task-content"
                                onDoubleClick={() => handleTaskDoubleClick(task)}
                              >
                                {task.content}
                              </div>
                            )}
                            <button 
                              className="delete-task-btn"
                              onClick={() => handleDeleteTask(selectedProject.id, list.id, task.id)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <div className="add-task-section">
                          <input
                            type="text"
                            placeholder="Add a task..."
                            value={newTaskContent}
                            onChange={(e) => setNewTaskContent(e.target.value)}
                            onKeyDown={(e) => handleTaskKeyDown(e, selectedProject.id, list.id)}
                            className="add-task-input"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="add-project-section">
                  {projects.map((project) => (
                    <div 
                      key={project.id} 
                      className="project-board"
                      onClick={() => handleProjectClick(project.id)}
                    >
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
              </>
            )}
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
