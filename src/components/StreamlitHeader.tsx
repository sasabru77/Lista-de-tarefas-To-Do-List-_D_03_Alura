import React from 'react';
import { Sparkles, Moon, Sun, Sidebar as SidebarIcon, CheckCircle2, BookOpen } from 'lucide-react';

interface StreamlitHeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  activeTab: 'tasks' | 'agent';
  setActiveTab: (tab: 'tasks' | 'agent') => void;
  onOpenReadme: () => void;
  isAiThinking?: boolean;
}

export const StreamlitHeader: React.FC<StreamlitHeaderProps> = ({
  darkMode,
  toggleDarkMode,
  toggleSidebar,
  activeTab,
  setActiveTab,
  onOpenReadme,
  isAiThinking,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0e1117]/95 backdrop-blur-sm border-b border-[#e6e9ef] dark:border-[#262730] px-4 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Sidebar toggle + App Branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
            title="Alternar Barra Lateral"
          >
            <SidebarIcon className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <img
              src="/assets/aistudio/image_5fc256fd.png"
              alt="Logotipo do Organizador de Tarefas"
              className="w-9 h-9 rounded-lg object-cover shadow-sm ring-1 ring-black/5 dark:ring-white/10"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-lg text-gray-900 dark:text-white leading-tight">
                  Organizador de tarefas
                </h1>
                <span className="text-[10px] font-semibold bg-red-100 text-[#ff4b4b] dark:bg-red-950/60 dark:text-red-400 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-900/50">
                  Agente IA
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                Interface minimalista e prática para o seu dia a dia
              </p>
            </div>
          </div>
        </div>

        {/* Center / Navigation Tabs */}
        <div className="flex items-center gap-1 bg-[#f0f2f6] dark:bg-[#1e2129] p-1 rounded-lg border border-[#e6e9ef] dark:border-[#2e3340]">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
              activeTab === 'tasks'
                ? 'bg-white dark:bg-[#262730] text-gray-900 dark:text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-[#ff4b4b]" />
            <span>Minhas Tarefas</span>
          </button>

          <button
            onClick={() => setActiveTab('agent')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
              activeTab === 'agent'
                ? 'bg-white dark:bg-[#262730] text-gray-900 dark:text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Agente de IA</span>
            {isAiThinking && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            )}
          </button>
        </div>

        {/* Right: Readme guide button, Status indicator & Theme toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenReadme}
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
            title="Abrir o Manual do Projeto (README)"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden md:inline">Guia do Projeto</span>
          </button>

          {/* Status Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
            <span className={`w-2 h-2 rounded-full ${isAiThinking ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
            <span>{isAiThinking ? 'Processando...' : 'Sistema Ativo'}</span>
          </div>

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
            title={darkMode ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
