import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import TaskModal from './TaskModal';
import { 
  Plus, Search, LogOut, CheckCircle2, Circle, 
  Trash2, Edit3, Calendar, ListTodo, AlertCircle, 
  HelpCircle, ChevronLeft, ChevronRight, Server, Database
} from 'lucide-react';

export default function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  
  // Filtering & Pagination State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(6); // 6 tasks per page fits nicely on grid

  // UI States
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState('');
  const [dbMode, setDbMode] = useState('Checking...');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Fetch server health & DB mode
  const fetchHealth = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/health');
      const data = await res.json();
      if (data && data.dbMode) {
        setDbMode(data.dbMode);
      }
    } catch (err) {
      setDbMode('Local Fallback Active');
    }
  };

  // Fetch tasks and compute stats
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch current paginated tasks
      const data = await api.getTasks({
        search,
        status: statusFilter,
        page,
        limit
      });

      setTasks(data.data || []);
      setTotalPages(data.pagination?.pages || 1);
      
      // Fetch ALL tasks to calculate the stats correctly (unpaginated counts)
      const statsData = await api.getTasks({ limit: 1000 });
      const allTasks = statsData.data || [];
      
      setTotalTasks(allTasks.length);
      setPendingTasks(allTasks.filter(t => t.status === 'pending').length);
      setCompletedTasks(allTasks.filter(t => t.status === 'completed').length);

    } catch (err) {
      setError(err.message || 'Error fetching tasks.');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page, limit]);

  useEffect(() => {
    fetchHealth();
  }, []);

  // Fetch tasks whenever filters change
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to page 1 on search
  };

  // Handle Status Filter Change
  const handleFilterChange = (status) => {
    setStatusFilter(status);
    setPage(1); // Reset to page 1 on filter
  };

  // Handle Task Create/Update Submit
  const handleModalSubmit = async (taskData) => {
    setModalLoading(true);
    try {
      if (selectedTask) {
        // Update
        await api.updateTask(selectedTask._id || selectedTask.id, taskData);
      } else {
        // Create
        await api.createTask(taskData);
      }
      setIsModalOpen(false);
      setSelectedTask(null);
      fetchTasks();
    } catch (err) {
      alert(err.message || 'Failed to save task.');
    } finally {
      setModalLoading(false);
    }
  };

  // Handle Status Toggle (Completed / Pending)
  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      // Optimistic UI update
      setTasks(prev => 
        prev.map(t => (t._id === task._id || t.id === task.id) ? { ...t, status: newStatus } : t)
      );
      
      // API call
      await api.updateTask(task._id || task.id, { status: newStatus });
      fetchTasks();
    } catch (err) {
      alert(err.message || 'Failed to toggle status.');
      fetchTasks(); // Rollback
    }
  };

  // Handle Delete Task
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await api.deleteTask(taskId);
      fetchTasks();
    } catch (err) {
      alert(err.message || 'Failed to delete task.');
    }
  };

  // Handle Open Create Modal
  const openCreateModal = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  // Handle Open Edit Modal
  const openEditModal = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="app-container">
      {/* Dashboard Top Header */}
      <header className="glass-card dashboard-header">
        <div className="logo-section">
          <div className="logo-icon">
            <ListTodo size={22} color="#fff" />
          </div>
          <div>
            <h1 className="logo-text">Taskflow</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.1rem' }}>
              <Database size={10} color="var(--text-muted)" />
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {dbMode}
              </span>
            </div>
          </div>
        </div>

        <div className="user-profile">
          <div className="user-info">
            <p className="user-name">{user.name}</p>
            <p className="user-email">{user.email}</p>
          </div>
          <button className="btn btn-secondary action-btn-delete" onClick={onLogout} title="Log Out">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Stats Counter Row */}
      <section className="stats-grid">
        <div className="glass-card stat-card">
          <div>
            <div className="stat-value">{totalTasks}</div>
            <div className="stat-title">Total Tasks</div>
          </div>
          <div className="stat-icon-wrapper stat-icon-total">
            <ListTodo size={24} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div>
            <div className="stat-value" style={{ color: 'var(--warning)' }}>{pendingTasks}</div>
            <div className="stat-title">Pending</div>
          </div>
          <div className="stat-icon-wrapper stat-icon-pending">
            <Circle size={24} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div>
            <div className="stat-value" style={{ color: 'var(--success)' }}>{completedTasks}</div>
            <div className="stat-title">Completed</div>
          </div>
          <div className="stat-icon-wrapper stat-icon-completed">
            <CheckCircle2 size={24} />
          </div>
        </div>
      </section>

      {/* Controls Bar: Search, Filters, Add Button */}
      <div className="glass-card control-bar">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks by title or description..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        <div className="filter-tabs">
          <button 
            className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            All
          </button>
          <button 
            className={`filter-tab ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => handleFilterChange('pending')}
          >
            Pending
          </button>
          <button 
            className={`filter-tab ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => handleFilterChange('completed')}
          >
            Completed
          </button>
        </div>

        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={18} />
          <span>New Task</span>
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Task Grid Area */}
      {loading ? (
        <div className="loading-wrapper">
          <div className="spinner"></div>
          <p style={{ color: 'var(--text-muted)' }}>Retrieving your tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="glass-card empty-state">
          <HelpCircle className="empty-icon" size={48} />
          <h3>No tasks found</h3>
          <p>
            {search || statusFilter !== 'all' 
              ? "We couldn't find any tasks matching your filters. Try adjusting your search query." 
              : "Welcome! You don't have any tasks registered yet. Get started by creating your first task."}
          </p>
          {!search && statusFilter === 'all' && (
            <button className="btn btn-primary" onClick={openCreateModal}>
              <Plus size={16} /> Create Task
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="tasks-grid">
            {tasks.map((task) => (
              <div 
                key={task._id || task.id} 
                className={`glass-card task-card ${task.status === 'completed' ? 'completed' : 'pending'}`}
              >
                <div className="task-header">
                  <h4 className="task-title">{task.title}</h4>
                  <span className={`status-badge ${task.status}`}>
                    {task.status}
                  </span>
                </div>

                <p className="task-description">
                  {task.description || <i>No description provided.</i>}
                </p>

                <div className="task-footer">
                  <span className="task-date">
                    <Calendar size={12} />
                    {formatDate(task.createdAt)}
                  </span>

                  <div className="task-actions">
                    <button 
                      className="action-btn action-btn-toggle"
                      onClick={() => handleToggleStatus(task)}
                      title={task.status === 'completed' ? "Mark Pending" : "Mark Completed"}
                    >
                      {task.status === 'completed' ? <Circle size={14} /> : <CheckCircle2 size={14} />}
                    </button>
                    <button 
                      className="action-btn action-btn-edit"
                      onClick={() => openEditModal(task)}
                      title="Edit Task"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button 
                      className="action-btn action-btn-delete"
                      onClick={() => handleDeleteTask(task._id || task.id)}
                      title="Delete Task"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Row */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <button 
                className="btn btn-secondary action-btn" 
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                <ChevronLeft size={16} />
              </button>
              <span className="pagination-text">
                Page {page} of {totalPages}
              </span>
              <button 
                className="btn btn-secondary action-btn" 
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Task Operations Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={selectedTask}
        onSubmit={handleModalSubmit}
        loading={modalLoading}
      />
    </div>
  );
}
