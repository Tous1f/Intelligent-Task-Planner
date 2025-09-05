'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  Circle,
  Clock,
  Tag,
  AlertCircle,
  MoreVertical,
  Edit,
  Trash2,
  Filter,
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  dueDate: string;
  category: string;
  completed: boolean;
}

export function TaskList({ tasks, onTaskUpdate, onTaskDelete }: {
  tasks: Task[];
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
}) {
  const [filter, setFilter] = useState({
    status: 'all',
    priority: 'all',
    category: 'all'
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-500 bg-green-50 border-green-200';
      default:
        return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const filteredTasks = tasks.filter(task => {
    return (
      (filter.status === 'all' || 
        (filter.status === 'completed' ? task.completed : !task.completed)) &&
      (filter.priority === 'all' || task.priority === filter.priority) &&
      (filter.category === 'all' || task.category === filter.category)
    );
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <Filter className="h-5 w-5 text-gray-400" />
        <select
          className="bg-transparent text-sm text-gray-600 focus:outline-none"
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>

        <select
          className="bg-transparent text-sm text-gray-600 focus:outline-none"
          value={filter.priority}
          onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
        >
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          className="bg-transparent text-sm text-gray-600 focus:outline-none"
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
        >
          <option value="all">All Categories</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Study">Study</option>
          <option value="Health">Health</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      {/* Tasks */}
      <AnimatePresence>
        {filteredTasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onTaskUpdate({ ...task, completed: !task.completed })}
                  className="focus:outline-none"
                >
                  {task.completed ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <Circle className="h-6 w-6 text-gray-300" />
                  )}
                </button>

                <div>
                  <h3 className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                  
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Tag className="h-4 w-4" />
                      <span>{task.category}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>

                <div className="relative group">
                  <button className="p-1 rounded-lg hover:bg-gray-100">
                    <MoreVertical className="h-5 w-5 text-gray-400" />
                  </button>

                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 hidden group-hover:block">
                    <button
                      onClick={() => onTaskUpdate(task)}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => onTaskDelete(task.id)}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="flex justify-center">
            <AlertCircle className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks found</h3>
          <p className="mt-2 text-gray-500">
            {tasks.length === 0 
              ? "You haven't created any tasks yet. Create one to get started!"
              : "No tasks match your current filters. Try adjusting them."}
          </p>
        </div>
      )}
    </div>
  );
}
