import React, { useState } from 'react';
import { Priority, Category } from '../types';
import { Plus, ChevronDown, ChevronUp, Sparkles, Calendar, Tag, Loader2 } from 'lucide-react';

interface TaskFormProps {
  onAddTask: (task: {
    titulo: string;
    categoria: Category;
    prioridade: Priority;
    prazo?: string;
  }) => void;
  onQuickAddWithAI: (text: string) => Promise<boolean>;
  isAiProcessing: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  onAddTask,
  onQuickAddWithAI,
  isAiProcessing,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeMode, setActiveMode] = useState<'standard' | 'ai'>('standard');

  // Standard form fields
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState<Category>('Estudo');
  const [prioridade, setPrioridade] = useState<Priority>('Média');
  const [prazo, setPrazo] = useState('');

  // AI prompt field
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    onAddTask({
      titulo: titulo.trim(),
      categoria,
      prioridade,
      prazo: prazo || undefined,
    });

    setTitulo('');
    setPrazo('');
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim() || isAiProcessing) return;

    const success = await onQuickAddWithAI(aiPrompt.trim());
    if (success) {
      setAiSuccessMessage('Atividades identificadas e adicionadas à sua lista com sucesso!');
      setAiPrompt('');
      setTimeout(() => setAiSuccessMessage(null), 4000);
    }
  };

  return (
    <div className="bg-white dark:bg-[#16181d] border border-[#e6e9ef] dark:border-[#2e3340] rounded-xl shadow-xs overflow-hidden mb-6 transition-all">
      {/* Expander Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-950/60 text-[#ff4b4b] flex items-center justify-center text-sm font-bold">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">
              Adicionar Nova Tarefa
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Cadastre manualmente ou use inteligência artificial para converter texto em atividades
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Expander Content */}
      {isExpanded && (
        <div className="p-4 pt-2 border-t border-[#e6e9ef] dark:border-[#2e3340]">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 mb-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg text-xs font-medium w-fit">
            <button
              type="button"
              onClick={() => setActiveMode('standard')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeMode === 'standard'
                  ? 'bg-white dark:bg-[#262730] text-gray-900 dark:text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Preenchimento Manual
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('ai')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                activeMode === 'ai'
                  ? 'bg-white dark:bg-[#262730] text-[#ff4b4b] shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Criação com Agente de IA</span>
            </button>
          </div>

          {activeMode === 'standard' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Task Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Qual é a atividade? <span className="text-[#ff4b4b]">*</span>
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: Praticar funções e loops em Python"
                  className="w-full text-sm rounded-lg border border-[#e6e9ef] dark:border-[#2e3340] bg-white dark:bg-[#1e2129] text-gray-900 dark:text-white px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#ff4b4b] transition-all"
                  required
                />
              </div>

              {/* Category, Priority, Deadline Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Category */}
                <div>
                  <label className="flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    <Tag className="w-3.5 h-3.5 text-gray-400" />
                    <span>Categoria</span>
                  </label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as Category)}
                    className="w-full text-xs rounded-lg border border-[#e6e9ef] dark:border-[#2e3340] bg-white dark:bg-[#1e2129] text-gray-900 dark:text-white px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#ff4b4b]"
                  >
                    <option value="Estudo">📚 Estudo</option>
                    <option value="Trabalho">💼 Trabalho</option>
                    <option value="Pessoal">👤 Pessoal</option>
                    <option value="Saúde">🏃 Saúde</option>
                    <option value="Outros">📌 Outros</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Prioridade
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {(['Baixa', 'Média', 'Alta'] as Priority[]).map((p) => {
                      const isSelected = prioridade === p;
                      const colorBadge =
                        p === 'Alta'
                          ? 'text-red-600 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800'
                          : p === 'Média'
                          ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
                          : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800';

                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPrioridade(p)}
                          className={`py-2 px-2 text-xs font-medium rounded-md border text-center transition-all ${
                            isSelected
                              ? `${colorBadge} ring-1 ring-current`
                              : 'bg-white dark:bg-[#1e2129] border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-900'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <label className="flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>Data Limite (Opcional)</span>
                  </label>
                  <input
                    type="date"
                    value={prazo}
                    onChange={(e) => setPrazo(e.target.value)}
                    className="w-full text-xs rounded-lg border border-[#e6e9ef] dark:border-[#2e3340] bg-white dark:bg-[#1e2129] text-gray-900 dark:text-white px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#ff4b4b]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-[#ff4b4b] hover:bg-[#e03838] text-white text-xs sm:text-sm font-medium py-2.5 px-5 rounded-lg transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Salvar Atividade</span>
                </button>
              </div>
            </form>
          ) : (
            /* AI Quick Add */
            <form onSubmit={handleAiSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Descreva o que você precisa fazer em uma frase:
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ex: Preciso revisar o código do projeto amanhã à tarde, enviar email para meu professor e comprar livros."
                  rows={3}
                  className="w-full text-sm rounded-lg border border-[#e6e9ef] dark:border-[#2e3340] bg-white dark:bg-[#1e2129] text-gray-900 dark:text-white p-3 focus:outline-none focus:ring-2 focus:ring-[#ff4b4b] transition-all resize-none"
                />
              </div>

              {aiSuccessMessage && (
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span>{aiSuccessMessage}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  O Agente de IA identificará automaticamente títulos, categorias e prioridades.
                </span>

                <button
                  type="submit"
                  disabled={isAiProcessing || !aiPrompt.trim()}
                  className="flex items-center justify-center gap-2 bg-[#ff4b4b] hover:bg-[#e03838] disabled:opacity-50 text-white text-xs sm:text-sm font-medium py-2 px-4 rounded-lg transition-colors shadow-xs"
                >
                  {isAiProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Agente Processando...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Extrair e Adicionar Tarefas</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
