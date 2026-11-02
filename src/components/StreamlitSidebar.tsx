import React from 'react';
import { Priority, Category, PythonStats } from '../types';
import { 
  Filter, 
  Trash2, 
  Play, 
  CheckCircle, 
  Clock, 
  BookOpen,
  PieChart,
  Lightbulb
} from 'lucide-react';

interface StreamlitSidebarProps {
  isOpen: boolean;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  filterStatus: 'all' | 'pending' | 'completed';
  setFilterStatus: (status: 'all' | 'pending' | 'completed') => void;
  filterPriority: 'all' | Priority;
  setFilterPriority: (prio: 'all' | Priority) => void;
  filterCategory: 'all' | Category;
  setFilterCategory: (cat: 'all' | Category) => void;
  onClearCompleted: () => void;
  onRunPythonAnalysis: () => void;
  pythonStats: PythonStats | null;
  isRunningPython: boolean;
  onOpenReadme: () => void;
}

export const StreamlitSidebar: React.FC<StreamlitSidebarProps> = ({
  isOpen,
  totalTasks,
  completedTasks,
  pendingTasks,
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  filterCategory,
  setFilterCategory,
  onClearCompleted,
  onRunPythonAnalysis,
  pythonStats,
  isRunningPython,
  onOpenReadme,
}) => {
  if (!isOpen) return null;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <aside className="w-full md:w-72 lg:w-80 shrink-0 bg-[#f8f9fb] dark:bg-[#1e2129] border-r border-[#e6e9ef] dark:border-[#2e3340] p-4 flex flex-col gap-5 overflow-y-auto min-h-[calc(100vh-60px)] text-sm">
      {/* Sidebar Title */}
      <div className="flex items-center gap-3 pb-3 border-b border-[#e6e9ef] dark:border-[#2e3340]">
        <img
          src="/assets/aistudio/image_5fc256fd.png"
          alt="Logotipo"
          className="w-9 h-9 rounded-lg object-cover shadow-xs"
        />
        <div>
          <div className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">
            Painel Lateral
          </div>
          <div className="font-semibold text-gray-900 dark:text-white">
            Controle e Métricas
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          <span>Resumo do Dia</span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400">Atualização em tempo real</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Pending Metric */}
          <div className="bg-white dark:bg-[#16181d] p-3 rounded-lg border border-[#e6e9ef] dark:border-[#2e3340] shadow-xs">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Pendentes</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {pendingTasks}
            </div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5">
              {pendingTasks > 0 ? `${pendingTasks} a realizar` : 'Tudo concluído!'}
            </div>
          </div>

          {/* Completed Metric */}
          <div className="bg-white dark:bg-[#16181d] p-3 rounded-lg border border-[#e6e9ef] dark:border-[#2e3340] shadow-xs">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>Concluídas</span>
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {completedTasks}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
              {completionRate}% do total
            </div>
          </div>
        </div>

        {/* General Progress Bar */}
        <div className="bg-white dark:bg-[#16181d] p-3 rounded-lg border border-[#e6e9ef] dark:border-[#2e3340] shadow-xs space-y-1.5">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
            <span>Progresso Geral</span>
            <span className="font-semibold text-[#ff4b4b]">{completionRate}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#ff4b4b] h-full rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          <Filter className="w-3.5 h-3.5" />
          <span>Filtros de Exibição</span>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Situação das Atividades
          </label>
          <div className="grid grid-cols-3 gap-1 bg-gray-200/60 dark:bg-gray-800 p-1 rounded-md">
            <button
              onClick={() => setFilterStatus('all')}
              className={`py-1 text-xs rounded font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-white dark:bg-[#262730] text-gray-900 dark:text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`py-1 text-xs rounded font-medium transition-colors ${
                filterStatus === 'pending'
                  ? 'bg-white dark:bg-[#262730] text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Pendentes
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`py-1 text-xs rounded font-medium transition-colors ${
                filterStatus === 'completed'
                  ? 'bg-white dark:bg-[#262730] text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Concluídas
            </button>
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Prioridade
          </label>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as any)}
            className="w-full text-xs rounded-md border border-[#e6e9ef] dark:border-[#2e3340] bg-white dark:bg-[#16181d] text-gray-900 dark:text-white px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#ff4b4b]"
          >
            <option value="all">Todas as prioridades</option>
            <option value="Alta">🔴 Alta</option>
            <option value="Média">🟡 Média</option>
            <option value="Baixa">🟢 Baixa</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Categoria
          </label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as any)}
            className="w-full text-xs rounded-md border border-[#e6e9ef] dark:border-[#2e3340] bg-white dark:bg-[#16181d] text-gray-900 dark:text-white px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#ff4b4b]"
          >
            <option value="all">Todas as categorias</option>
            <option value="Estudo">📚 Estudo</option>
            <option value="Trabalho">💼 Trabalho</option>
            <option value="Pessoal">👤 Pessoal</option>
            <option value="Saúde">🏃 Saúde</option>
            <option value="Outros">📌 Outros</option>
          </select>
        </div>
      </div>

      {/* Productivity Diagnostic Action */}
      <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-3 rounded-lg border border-emerald-200/70 dark:border-emerald-800/40 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <PieChart className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Diagnóstico de Metas</span>
          </div>
        </div>

        <button
          onClick={onRunPythonAnalysis}
          disabled={isRunningPython}
          className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-medium py-1.5 px-3 rounded-md transition-colors shadow-xs"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>{isRunningPython ? 'Calculando...' : 'Analisar Produtividade'}</span>
        </button>

        {pythonStats?.dica_produtividade && (
          <div className="p-2.5 bg-white dark:bg-[#16181d] rounded border border-emerald-200 dark:border-emerald-800/50 text-xs text-gray-700 dark:text-gray-200 mt-1 space-y-1">
            <div className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-[11px]">
              <Lightbulb className="w-3 h-3" />
              <span>Dica do Sistema:</span>
            </div>
            <p className="text-[11px] leading-relaxed">{pythonStats.dica_produtividade}</p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="space-y-2 pt-2 border-t border-[#e6e9ef] dark:border-[#2e3340] mt-auto">
        <button
          onClick={onOpenReadme}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-500" />
          <span>Manual do Projeto (README)</span>
        </button>

        {completedTasks > 0 && (
          <button
            onClick={onClearCompleted}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpar {completedTasks} concluída(s)</span>
          </button>
        )}
      </div>
    </aside>
  );
};
