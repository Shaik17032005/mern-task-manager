import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { api } from '../api';
import Navbar from './Navbar';
import TaskModal from './TaskModal';
import { useTheme } from '../hooks/useTheme';
import { 
  Plus, Search, CheckCircle2, Circle, 
  Trash2, Edit3, Calendar, ListTodo, AlertCircle, 
  HelpCircle, ChevronLeft, ChevronRight, Server, Database
} from 'lucide-react';

export default function Dashboard({ user, onLogout }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const completionPercentage = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
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
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (data && data.dbMode) {
        setDbMode(data.dbMode);
      }
    } catch (err) {
      setDbMode('Server Unavailable');
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

  const getUserInitials = () => {
    return user?.name
      ? user.name
          .split(' ')
          .map((part) => part[0]?.toUpperCase())
          .join('')
          .slice(0, 2)
      : 'TF';
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <Navbar user={user} onLogout={onLogout} />

      {/* Dashboard Top Header */}
      <header className="glass-card dashboard-header">
        <div className="logo-section">
          <div className="logo-icon">
            <ListTodo size={22} color="#fff" />
          </div>
          <div>
            <h1 className="logo-text">Taskflow</h1>
            <p className="logo-subtitle">Smart task management to keep your day focused.</p>
            <div className="health-row">
              <Database size={12} color="var(--text-muted)" />
              <span className="health-text">{dbMode}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Counter Row */}
      <motion.section
        className="stats-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
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

        <div className="glass-card stat-card">
          <div>
            <div className="stat-value" style={{ color: 'var(--primary)' }}>{completionPercentage}%</div>
            <div className="stat-title">Completion Rate</div>
          </div>
          <div className="stat-icon-wrapper stat-icon-total">
            <Circle size={24} />
          </div>
        </div>
      </motion.section>

      {/* Controls Bar: Search, Filters, Add Button */}
      <motion.div className="glass-card control-bar">
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
      </motion.div>

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
          <motion.div 
            className="tasks-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {tasks.map((task, index) => (
              <motion.div
                key={task._id || task.id}
                className={`glass-card task-card ${task.status === 'completed' ? 'completed' : 'pending'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <div className="task-header">
                  <div>
                    <h4 className="task-title">{task.title}</h4>
                    <div className="task-meta-row">
                      <span className={`task-meta-badge priority ${task.priority?.toLowerCase()}`}>
                        {task.priority}
                      </span>
                      {task.dueDate && (
                        <span className="task-meta-badge due-date">
                          Due {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
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
              </motion.div>
            ))}
          </motion.div>

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
