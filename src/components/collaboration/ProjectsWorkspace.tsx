import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  ArrowRight,
  X
} from 'lucide-react';
import { CollaborativeProject, KanbanTask } from '../../types';
import { storageService } from '../../services/storage';

interface ProjectsWorkspaceProps {
  project: CollaborativeProject;
}

export const ProjectsWorkspace: React.FC<ProjectsWorkspaceProps> = ({ project }) => {
  const [tasks, setTasks] = useState<KanbanTask[]>(project.tasks);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo' as KanbanTask['status'],
    priority: 'medium' as KanbanTask['priority'],
    assignee: 'Aditya Vardhan Rao',
    dueDate: '2026-10-15',
    tags: ['Feature', 'Code']
  });

  const columns: { id: KanbanTask['status']; title: string; color: string }[] = [
    { id: 'todo', title: 'To Do', color: 'border-slate-300' },
    { id: 'in_progress', title: 'In Progress', color: 'border-blue-500' },
    { id: 'review', title: 'Under Review', color: 'border-purple-500' },
    { id: 'done', title: 'Completed', color: 'border-emerald-500' }
  ];

  const handleMoveTask = (taskId: string, newStatus: KanbanTask['status']) => {
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t));
    setTasks(updated);
    storageService.updateProjectTasks(updated);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const created: KanbanTask = {
      id: `task_${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      status: newTask.status,
      priority: newTask.priority,
      assignee: newTask.assignee,
      dueDate: newTask.dueDate,
      tags: newTask.tags
    };
    const updated = [...tasks, created];
    setTasks(updated);
    storageService.updateProjectTasks(updated);
    setIsAddTaskOpen(false);
    setNewTask({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      assignee: 'Aditya Vardhan Rao',
      dueDate: '2026-10-15',
      tags: ['Feature']
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-blue-900 uppercase tracking-wider mb-1">
            Capstone & Team Workspace
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {project.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {project.course} · Final Capstone Submission: {project.deadline}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Member avatars */}
          <div className="flex -space-x-2 overflow-hidden">
            {project.members.map((m, idx) => (
              <img
                key={idx}
                src={m.avatar}
                alt={m.name}
                referrerPolicy="no-referrer"
                title={`${m.name} (${m.role})`}
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
              />
            ))}
          </div>

          <button
            onClick={() => setIsAddTaskOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Kanban Board 4 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className="bg-slate-100/70 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between min-h-[500px]"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-800">{col.title}</span>
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-600 shadow-2xs">
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                {/* Task Cards */}
                <div className="space-y-3">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs hover:shadow-sm transition-all space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-xs text-slate-900 leading-snug">
                          {task.title}
                        </h4>
                        <span
                          className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0 ${
                            task.priority === 'urgent'
                              ? 'bg-red-100 text-red-800'
                              : task.priority === 'high'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                        {task.description}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                        <span className="truncate max-w-[120px] text-slate-600 font-medium">
                          {task.assignee.split(' ')[0]}
                        </span>
                        <span>Due {task.dueDate.slice(5)}</span>
                      </div>

                      {/* Quick Move Status Buttons */}
                      <div className="pt-2 flex items-center justify-between gap-1 text-[10px] text-slate-500">
                        <span>Move:</span>
                        <div className="flex gap-1">
                          {col.id !== 'todo' && (
                            <button
                              onClick={() => handleMoveTask(task.id, 'todo')}
                              className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                            >
                              To Do
                            </button>
                          )}
                          {col.id !== 'in_progress' && (
                            <button
                              onClick={() => handleMoveTask(task.id, 'in_progress')}
                              className="px-1.5 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold"
                            >
                              Prog
                            </button>
                          )}
                          {col.id !== 'review' && (
                            <button
                              onClick={() => handleMoveTask(task.id, 'review')}
                              className="px-1.5 py-0.5 rounded bg-purple-50 hover:bg-purple-100 text-purple-900 font-semibold"
                            >
                              Rev
                            </button>
                          )}
                          {col.id !== 'done' && (
                            <button
                              onClick={() => handleMoveTask(task.id, 'done')}
                              className="px-1.5 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold"
                            >
                              Done
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      No tasks in {col.title}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  setNewTask((prev) => ({ ...prev, status: col.id }));
                  setIsAddTaskOpen(true);
                }}
                className="mt-3 w-full py-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg border border-dashed border-slate-300 transition-colors flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add task</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {isAddTaskOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Create Kanban Task</h3>
              <button
                onClick={() => setIsAddTaskOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement SHAP visualization in React"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Task Description</label>
                <textarea
                  rows={2}
                  placeholder="Technical specs, deliverables, or checklist..."
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Column</label>
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Under Review</option>
                    <option value="done">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assignee</label>
                  <select
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    {project.members.map((m) => (
                      <option key={m.name} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddTaskOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
