export const formatDate = (dateString, format = 'short') => {
  if (!dateString) return '';
  const date = new Date(dateString);

  if (format === 'short') {
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  }

  if (format === 'full') {
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (format === 'time') {
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return date.toLocaleDateString();
};

export const formatTaskTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getTaskColor = (priority) => {
  switch (priority) {
    case 'Low':
      return '#3b82f6';
    case 'High':
      return '#f87171';
    case 'Medium':
    default:
      return '#f59e0b';
  }
};

export const getDaysUntilDue = (dueDate) => {
  if (!dueDate) return null;
  const now = new Date();
  const due = new Date(dueDate);
  const diff = due - now;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
};

export const isTaskOverdue = (dueDate, status) => {
  if (status === 'completed' || !dueDate) return false;
  return getDaysUntilDue(dueDate) < 0;
};
