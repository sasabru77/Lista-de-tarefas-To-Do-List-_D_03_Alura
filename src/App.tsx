/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Task, Priority, Category, PythonStats } from './types';
import { StreamlitHeader } from './components/StreamlitHeader';
import { StreamlitSidebar } from './components/StreamlitSidebar';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { AIAgentPanel } from './components/AIAgentPanel';
import { ReadmeModal } from './components/ReadmeModal';
import { CheckCircle2 } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'organizador_tarefas_db_v2';
const DARK_MODE_KEY = 'organizador_tarefas_dark_mode';

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    titulo: 'Instalar Python e configurar ambiente de desenvolvimento (VS Code)',
    categoria: 'Estudo',
    prioridade: 'Alta',
    prazo: '2026-11-05',
    concluida: true,
    criadaEm: '2026-11-01',
    subtarefas: [
      { id: '1-1', titulo: 'Baixar instalador do Python 3', concluida: true },
      { id: '1-2', titulo: 'Marcar opção "Add Python to PATH"', concluida: true },
      { id: '1-3', titulo: 'Testar python --version no terminal', concluida: true },
    ],
  },
  {
    id: '2',
    titulo: 'Praticar conceitos fundamentais: Variáveis, Listas e Dicionários em Python',
    categoria: 'Estudo',
    prioridade: 'Alta',
    prazo: '2026-11-06',
    concluida: false,
    criadaEm: '2026-11-02',
    subtarefas: [
      { id: '2-1', titulo: 'Criar uma lista de compras simples em Python', concluida: true },
      { id: '2-2', titulo: 'Representar tarefas como dicionários {"titulo": "...", "concluida": False}', concluida: false },
      { id: '2-3', titulo: 'Fazer um loop "for" para percorrer e imprimir as tarefas pendentes', concluida: false },
    ],
  },
  {
    id: '3',
    titulo: 'Compreender como o Streamlit desenha formulários, sidebar e métricas',
    categoria: 'Estudo',
    prioridade: 'Média',
    prazo: '2026-11-08',
    concluida: false,
    criadaEm: '2026-11-02',
  },
  {
    id: '4',
    titulo: 'Experimentar o Agente de IA para decompor projetos complexos em passos rápidos',
    categoria: 'Trabalho',
    prioridade: 'Média',
    prazo: '2026-11-10',
    concluida: false,
    criadaEm: '2026-11-02',
  },
];

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(DARK_MODE_KEY);
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Main tasks state
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Falha ao ler localStorage:', e);
    }
    return INITIAL_TASKS;
  });

  // UI Navigation & Filters
  const [activeTab, setActiveTab] = useState<'tasks' | 'agent'>('tasks');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | Priority>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | Category>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Readme Modal state (keeps UI clean and uncluttered)
  const [isReadmeOpen, setIsReadmeOpen] = useState(false);

  // Python Engine execution state
  const [pythonStats, setPythonStats] = useState<PythonStats | null>(null);
  const [isRunningPython, setIsRunningPython] = useState(false);

  // AI loading state
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [isAiDecomposing, setIsAiDecomposing] = useState(false);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(DARK_MODE_KEY, String(darkMode));
  }, [darkMode]);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --------------------------------------------------------------------------
  // Task Actions
  // --------------------------------------------------------------------------
  const handleAddTask = (newTaskData: {
    titulo: string;
    categoria: Category;
    prioridade: Priority;
    prazo?: string;
  }) => {
    const newTask: Task = {
      id: Date.now().toString(),
      titulo: newTaskData.titulo,
      categoria: newTaskData.categoria,
      prioridade: newTaskData.prioridade,
      prazo: newTaskData.prazo,
      concluida: false,
      criadaEm: new Date().toISOString().split('T')[0],
    };

    setTasks((prev) => [newTask, ...prev]);
    showToast(`Atividade "${newTask.titulo}" adicionada com sucesso!`);
  };

  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextState = !t.concluida;
          showToast(nextState ? `Parabéns! Tarefa concluída.` : `Tarefa reaberta como pendente.`);
          return { ...t, concluida: nextState };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('Atividade removida.');
  };

  const handleClearCompleted = () => {
    const count = tasks.filter((t) => t.concluida).length;
    if (count === 0) return;
    setTasks((prev) => prev.filter((t) => !t.concluida));
    showToast(`${count} tarefa(s) concluída(s) foram limpas.`);
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId && t.subtarefas) {
          return {
            ...t,
            subtarefas: t.subtarefas.map((st) =>
              st.id === subtaskId ? { ...st, concluida: !st.concluida } : st
            ),
          };
        }
        return t;
      })
    );
  };

  const handleAddMultipleTasks = (
    newTasks: Array<{
      titulo: string;
      categoria: any;
      prioridade: any;
      prazo?: string;
    }>
  ) => {
    const formatted: Task[] = newTasks.map((t, index) => ({
      id: `${Date.now()}-${index}`,
      titulo: t.titulo,
      categoria: t.categoria || 'Estudo',
      prioridade: t.prioridade || 'Média',
      prazo: t.prazo,
      concluida: false,
      criadaEm: new Date().toISOString().split('T')[0],
    }));

    setTasks((prev) => [...formatted, ...prev]);
    showToast(`${formatted.length} atividades importadas com sucesso!`);
    setActiveTab('tasks');
  };

  const handleAttachSubtasksToTask = (
    taskId: string,
    subtasks: Array<{ title: string }>
  ) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newSubs = subtasks.map((st, i) => ({
            id: `${taskId}-sub-${Date.now()}-${i}`,
            titulo: st.title,
            concluida: false,
          }));
          return {
            ...t,
            subtarefas: [...(t.subtarefas || []), ...newSubs],
          };
        }
        return t;
      })
    );
  };

  // Quick add with AI
  const handleQuickAddWithAI = async (text: string): Promise<boolean> => {
    setIsAiProcessing(true);
    try {
      const res = await fetch('/api/agent/quick-add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erro ao extrair tarefas');
      }

      const data = await res.json();
      if (Array.isArray(data.extractedTasks) && data.extractedTasks.length > 0) {
        handleAddMultipleTasks(data.extractedTasks);
        return true;
      }
      return false;
    } catch (err: any) {
      showToast(`Aviso: ${err.message || 'Falha ao processar'}`);
      return false;
    } finally {
      setIsAiProcessing(false);
    }
  };

  // Decompose single task with AI
  const handleDecomposeWithAI = async (task: Task) => {
    setIsAiDecomposing(true);
    try {
      const res = await fetch('/api/agent/decompose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskTitle: task.titulo,
          category: task.categoria,
          priority: task.prioridade,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Falha ao decompor tarefa');
      }

      const data = await res.json();
      if (Array.isArray(data.subtasks) && data.subtasks.length > 0) {
        handleAttachSubtasksToTask(task.id, data.subtasks);
        showToast(`O Agente gerou ${data.subtasks.length} etapas para esta tarefa!`);
      }
    } catch (err: any) {
      showToast(`Aviso: ${err.message || 'Não foi possível decompor'}`);
    } finally {
      setIsAiDecomposing(false);
    }
  };

  // Run Python task engine
  const handleRunPythonAnalysis = async () => {
    setIsRunningPython(true);
    try {
      const res = await fetch('/api/python/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks }),
      });

      if (!res.ok) throw new Error('Falha ao rodar engine Python');

      const data = await res.json();
      setPythonStats(data);
      showToast('Diagnóstico de metas atualizado!');
    } catch (err: any) {
      console.error(err);
      showToast('Erro ao atualizar diagnóstico.');
    } finally {
      setIsRunningPython(false);
    }
  };

  const handleAddSampleTasks = () => {
    setTasks(INITIAL_TASKS);
    showToast('Tarefas de exemplo carregadas!');
  };

  // Filter tasks logic
  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === 'pending' && t.concluida) return false;
    if (filterStatus === 'completed' && !t.concluida) return false;
    if (filterPriority !== 'all' && t.prioridade !== filterPriority) return false;
    if (filterCategory !== 'all' && t.categoria !== filterCategory) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.titulo.toLowerCase().includes(q);
      const matchCat = t.categoria.toLowerCase().includes(q);
      const matchSub = t.subtarefas?.some((st) => st.titulo.toLowerCase().includes(q));
      if (!matchTitle && !matchCat && !matchSub) return false;
    }

    return true;
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.concluida).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0e1117] text-gray-900 dark:text-gray-100 transition-colors">
      {/* Streamlit Top Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#ff4b4b] via-amber-400 to-emerald-500" />

      {/* Header */}
      <StreamlitHeader
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReadme={() => setIsReadmeOpen(true)}
        isAiThinking={isAiProcessing || isAiDecomposing}
      />

      {/* Main Layout: Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <StreamlitSidebar
          isOpen={isSidebarOpen}
          totalTasks={totalTasks}
          completedTasks={completedTasks}
          pendingTasks={pendingTasks}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          onClearCompleted={handleClearCompleted}
          onRunPythonAnalysis={handleRunPythonAnalysis}
          pythonStats={pythonStats}
          isRunningPython={isRunningPython}
          onOpenReadme={() => setIsReadmeOpen(true)}
        />

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gray-900/95 dark:bg-white/95 text-white dark:text-gray-900 px-4 py-2.5 rounded-xl shadow-xl text-xs sm:text-sm font-medium border border-white/10 dark:border-black/10 transition-all">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* TAB 1: Tasks View */}
          {activeTab === 'tasks' && (
            <div className="space-y-6">
              {/* Clean App Page Title */}
              <div className="border-b border-[#e6e9ef] dark:border-[#262730] pb-4">
                <div className="flex items-center gap-3">
                  <img
                    src="/assets/aistudio/image_5fc256fd.png"
                    alt="Logo"
                    className="w-10 h-10 rounded-xl object-cover shadow-xs ring-1 ring-black/5 dark:ring-white/10"
                  />
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      Organizador de tarefas
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      com Agente de IA integrado • Visual minimalista e foco diário
                    </p>
                  </div>
                </div>
              </div>

              {/* Task Form Component */}
              <TaskForm
                onAddTask={handleAddTask}
                onQuickAddWithAI={handleQuickAddWithAI}
                isAiProcessing={isAiProcessing}
              />

              {/* Task List Component with strong visual contrast for completed tasks */}
              <TaskList
                tasks={filteredTasks}
                onToggleComplete={handleToggleComplete}
                onDeleteTask={handleDeleteTask}
                onDecomposeWithAI={handleDecomposeWithAI}
                onToggleSubtask={handleToggleSubtask}
                onAddSampleTasks={handleAddSampleTasks}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isAiDecomposing={isAiDecomposing}
              />
            </div>
          )}

          {/* TAB 2: AI Agent View */}
          {activeTab === 'agent' && (
            <AIAgentPanel
              tasks={tasks}
              onAddMultipleTasks={handleAddMultipleTasks}
              onAttachSubtasksToTask={handleAttachSubtasksToTask}
            />
          )}
        </main>
      </div>

      {/* Embedded Clean README Modal */}
      <ReadmeModal
        isOpen={isReadmeOpen}
        onClose={() => setIsReadmeOpen(false)}
      />
    </div>
  );
}
