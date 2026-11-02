import React from 'react';
import { Task, Priority } from '../types';
import { 
  Check, 
  Trash2, 
  Sparkles, 
  Search, 
  Calendar, 
  Tag, 
  RotateCcw,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  ListPlus
} from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onDecomposeWithAI: (task: Task) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddSampleTasks: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isAiDecomposing: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleComplete,
  onDeleteTask,
  onDecomposeWithAI,
  onToggleSubtask,
  onAddSampleTasks,
  searchQuery,
  setSearchQuery,
  isAiDecomposing,
}) => {
  const [showCompletedSection, setShowCompletedSection] = React.useState(true);

  const pendingTasks = tasks.filter((t) => !t.concluida);
  const completedTasks = tasks.filter((t) => t.concluida);

  const getPriorityBadge = (prio: Priority, isCompleted = false) => {
    if (isCompleted) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-normal px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          {prio}
        </span>
      );
    }

    switch (prio) {
      case 'Alta':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-900/40">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Alta
          </span>
        );
      case 'Média':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Média
          </span>
        );
      case 'Baixa':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Baixa
          </span>
        );
    }
  };

  const getCategoryBadge = (category: string, isCompleted = false) => {
    return (
      <span
        className={`text-[11px] px-2 py-0.5 rounded-md border ${
          isCompleted
            ? 'bg-transparent text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 font-medium'
        }`}
      >
        {category}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Bar & Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título ou categoria..."
            className="w-full text-xs sm:text-sm pl-9 pr-4 py-2 rounded-lg border border-[#e6e9ef] dark:border-[#2e3340] bg-white dark:bg-[#16181d] text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#ff4b4b]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              Limpar
            </button>
          )}
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 self-end sm:self-center">
          <span className="font-semibold text-gray-900 dark:text-white">{pendingTasks.length}</span> a fazer
          <span>•</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{completedTasks.length}</span> concluída(s)
        </div>
      </div>

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="text-center py-12 px-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30">
          <div className="w-12 h-12 mx-auto rounded-full bg-red-50 dark:bg-red-950/40 text-[#ff4b4b] flex items-center justify-center mb-3">
            <ListPlus className="w-6 h-6" />
          </div>
          <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
            Nenhuma atividade cadastrada
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-4">
            Adicione sua primeira tarefa no formulário acima ou carregue alguns exemplos prontos.
          </p>
          <button
            onClick={onAddSampleTasks}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-white dark:bg-[#262730] text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 hover:border-[#ff4b4b] transition-all shadow-xs"
          >
            <span>Carregar Tarefas de Exemplo</span>
          </button>
        </div>
      )}

      {/* SEÇÃO 1: TAREFAS PENDENTES (A FAZER) */}
      {pendingTasks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Atividades Pendentes ({pendingTasks.length})</span>
            </span>
            <span className="text-[11px] text-gray-400 font-normal">Foco e prioridade</span>
          </div>

          <div className="space-y-2.5">
            {pendingTasks.map((task) => {
              const hasSubtasks = task.subtarefas && task.subtarefas.length > 0;
              const completedSubtasks = task.subtarefas?.filter((st) => st.concluida).length || 0;
              const totalSubtasks = task.subtarefas?.length || 0;

              return (
                <div
                  key={task.id}
                  className="rounded-xl border border-[#e6e9ef] dark:border-[#2e3340] bg-white dark:bg-[#16181d] hover:border-gray-300 dark:hover:border-gray-700 shadow-xs transition-all overflow-hidden"
                >
                  <div className="p-4 flex items-start gap-3.5">
                    {/* Checkbox de Conclusão */}
                    <button
                      onClick={() => onToggleComplete(task.id)}
                      className="mt-0.5 w-5 h-5 rounded-md border-2 border-gray-300 dark:border-gray-600 hover:border-[#ff4b4b] hover:bg-red-50/50 dark:hover:bg-red-950/20 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                      title="Marcar como concluída"
                    >
                      <span className="sr-only">Concluir</span>
                    </button>

                    {/* Conteúdo da Tarefa Pendente */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1.5 leading-snug">
                        {task.titulo}
                      </div>

                      {/* Metadados */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        {getCategoryBadge(task.categoria)}
                        {getPriorityBadge(task.prioridade)}

                        {task.prazo && (
                          <span className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                            <Calendar className="w-3 h-3" />
                            <span>{task.prazo}</span>
                          </span>
                        )}

                        {hasSubtasks && (
                          <span className="text-[11px] font-mono bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 px-2 py-0.5 rounded-md">
                            {completedSubtasks}/{totalSubtasks} passos
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Ações da Tarefa */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => onDecomposeWithAI(task)}
                        disabled={isAiDecomposing}
                        className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 rounded-md bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 transition-colors"
                        title="Quebrar esta tarefa em passos práticos com o Agente de IA"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span className="hidden sm:inline">Dividir com IA</span>
                      </button>

                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        title="Excluir tarefa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Subtarefas */}
                  {hasSubtasks && (
                    <div className="px-4 pb-3 pt-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-[#111317]/60">
                      <div className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-2 flex items-center justify-between">
                        <span>Etapas geradas pelo Agente de IA:</span>
                        <span className="font-mono text-[10px]">
                          {Math.round((completedSubtasks / totalSubtasks) * 100)}% concluído
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {task.subtarefas?.map((subtask) => (
                          <div
                            key={subtask.id}
                            className="flex items-center gap-2 text-xs py-1 px-2 rounded-md hover:bg-white dark:hover:bg-gray-800 transition-colors"
                          >
                            <button
                              onClick={() => onToggleSubtask(task.id, subtask.id)}
                              className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                                subtask.concluida
                                  ? 'bg-emerald-500 text-white'
                                  : 'border border-gray-300 dark:border-gray-600'
                              }`}
                            >
                              {subtask.concluida && <Check className="w-3 h-3 stroke-[3]" />}
                            </button>
                            <span
                              className={
                                subtask.concluida
                                  ? 'line-through text-gray-400 dark:text-gray-500'
                                  : 'text-gray-700 dark:text-gray-300'
                              }
                            >
                              {subtask.titulo}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SEÇÃO 2: TAREFAS CONCLUÍDAS (VISUALMENTE DIFERENCIADAS) */}
      {completedTasks.length > 0 && (
        <div className="pt-2 space-y-3">
          {/* Header da Seção de Concluídas */}
          <div className="flex items-center justify-between border-t border-dashed border-gray-200 dark:border-gray-800 pt-4">
            <button
              onClick={() => setShowCompletedSection(!showCompletedSection)}
              className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide hover:opacity-80 transition-opacity"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Concluídas ({completedTasks.length})</span>
              {showCompletedSection ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>
            <span className="text-[11px] text-gray-400">Atividades finalizadas com sucesso</span>
          </div>

          {/* Lista com Estilo Especial para Concluídas */}
          {showCompletedSection && (
            <div className="space-y-2">
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-xl border border-emerald-200/70 dark:border-emerald-800/40 bg-emerald-50/40 dark:bg-emerald-950/15 border-l-4 border-l-emerald-500 p-3.5 flex items-start gap-3.5 transition-all shadow-2xs"
                >
                  {/* Checkbox Concluído (Verde preenchido) */}
                  <button
                    onClick={() => onToggleComplete(task.id)}
                    className="mt-0.5 w-5 h-5 rounded-md bg-emerald-500 text-white flex items-center justify-center transition-transform hover:scale-105 shrink-0 cursor-pointer shadow-xs"
                    title="Clique para reabrir esta tarefa"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </button>

                  {/* Informações da Tarefa Concluída */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="line-through text-sm text-gray-500 dark:text-gray-400 select-none">
                        {task.titulo}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                        Concluída
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                      {getCategoryBadge(task.categoria, true)}
                      {getPriorityBadge(task.prioridade, true)}

                      {task.prazo && (
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span>Finalizada</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Ações da Tarefa Concluída */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onToggleComplete(task.id)}
                      className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      title="Reabrir esta atividade"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span className="hidden sm:inline">Reabrir</span>
                    </button>

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Excluir do histórico"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
