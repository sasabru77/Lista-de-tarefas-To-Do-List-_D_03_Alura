import React, { useState } from 'react';
import { Task, AIAgentDecomposeResult, AIAgentPrioritizeResult } from '../types';
import { 
  Sparkles, 
  Send, 
  ListTree, 
  Target, 
  MessageSquare, 
  Loader2, 
  Check, 
  ArrowRight, 
  Clock, 
  Zap,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

interface AIAgentPanelProps {
  tasks: Task[];
  onAddMultipleTasks: (tasksToAdd: Array<{
    titulo: string;
    categoria: any;
    prioridade: any;
    prazo?: string;
  }>) => void;
  onAttachSubtasksToTask: (taskId: string, subtasks: Array<{ title: string }>) => void;
}

export const AIAgentPanel: React.FC<AIAgentPanelProps> = ({
  tasks,
  onAddMultipleTasks,
  onAttachSubtasksToTask,
}) => {
  const [subTab, setSubTab] = useState<'decompose' | 'prioritize' | 'chat'>('decompose');

  // Decompose state
  const [decomposeGoal, setDecomposeGoal] = useState('');
  const [decomposeCategory, setDecomposeCategory] = useState('Estudo');
  const [isDecomposing, setIsDecomposing] = useState(false);
  const [decomposeResult, setDecomposeResult] = useState<AIAgentDecomposeResult | null>(null);
  const [importedSubtasks, setImportedSubtasks] = useState(false);

  // Prioritize state
  const [isPrioritizing, setIsPrioritizing] = useState(false);
  const [prioritizeResult, setPrioritizeResult] = useState<AIAgentPrioritizeResult | null>(null);

  // Chat state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string }>>([
    {
      sender: 'agent',
      text: 'Olá! Sou o seu Agente de IA integrado. Posso ajudar você a planejar seu dia, quebrar projetos em pequenos passos e também tirar dúvidas sobre desenvolvimento de software e Python. Como posso te apoiar hoje?',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Decompose handler
  const handleDecompose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decomposeGoal.trim() || isDecomposing) return;

    setIsDecomposing(true);
    setDecomposeResult(null);
    setImportedSubtasks(false);

    try {
      const res = await fetch('/api/agent/decompose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskTitle: decomposeGoal,
          category: decomposeCategory,
          priority: 'Alta',
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erro ao processar');
      }

      const data = await res.json();
      setDecomposeResult(data);
    } catch (err: any) {
      console.warn('Erro decomposição:', err?.message);
    } finally {
      setIsDecomposing(false);
    }
  };

  // Import decomposed tasks
  const handleImportDecomposedTasks = () => {
    if (!decomposeResult?.subtasks) return;
    const formatted = decomposeResult.subtasks.map((st) => ({
      titulo: st.title,
      categoria: (st.category as any) || decomposeCategory,
      prioridade: (st.priority as any) || 'Média',
    }));

    onAddMultipleTasks(formatted);
    setImportedSubtasks(true);
  };

  // Prioritize handler
  const handleRunPrioritize = async () => {
    if (tasks.length === 0) {
      return;
    }

    setIsPrioritizing(true);
    try {
      const res = await fetch('/api/agent/prioritize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erro ao priorizar');
      }

      const data = await res.json();
      setPrioritizeResult(data);
    } catch (err: any) {
      console.warn('Erro priorização:', err?.message);
    } finally {
      setIsPrioritizing(false);
    }
  };

  // Chat handler
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userText = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          tasksContext: tasks.map((t) => ({
            titulo: t.titulo,
            categoria: t.categoria,
            prioridade: t.prioridade,
            concluida: t.concluida,
          })),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erro no chat');
      }

      const data = await res.json();
      setChatMessages((prev) => [...prev, { sender: 'agent', text: data.reply }]);
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: `Desculpe, ocorreu uma instabilidade: ${err.message}`,
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#16181d] border border-[#e6e9ef] dark:border-[#2e3340] rounded-xl shadow-xs overflow-hidden">
      {/* Agent Banner */}
      <div className="p-5 border-b border-[#e6e9ef] dark:border-[#2e3340] bg-gradient-to-r from-red-50/60 via-amber-50/40 to-transparent dark:from-red-950/20 dark:via-amber-950/10 dark:to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff4b4b] to-amber-500 text-white flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Agente de IA Integrado
              <span className="text-xs font-mono font-normal bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                Gemini 3.8 Flash
              </span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Planejamento, quebra de tarefas e mentoria para desenvolvedores iniciantes
            </p>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1 bg-white/80 dark:bg-black/30 p-1 rounded-lg border border-[#e6e9ef] dark:border-[#2e3340] self-start sm:self-center">
          <button
            onClick={() => setSubTab('decompose')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              subTab === 'decompose'
                ? 'bg-[#ff4b4b] text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <ListTree className="w-3.5 h-3.5" />
            <span>Quebrar Meta</span>
          </button>
          <button
            onClick={() => setSubTab('prioritize')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              subTab === 'prioritize'
                ? 'bg-[#ff4b4b] text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Priorizar Dia</span>
          </button>
          <button
            onClick={() => setSubTab('chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              subTab === 'chat'
                ? 'bg-[#ff4b4b] text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Mentor de IA</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Decompose */}
      {subTab === 'decompose' && (
        <div className="p-5 space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Decompor Projeto ou Meta Complexa
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Quando uma meta parece grande demais, o Agente de IA divide em 3 a 5 micro-passos acionáveis de até 30 minutos cada.
            </p>
          </div>

          <form onSubmit={handleDecompose} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-3">
                <input
                  type="text"
                  value={decomposeGoal}
                  onChange={(e) => setDecomposeGoal(e.target.value)}
                  placeholder="Ex: Criar meu primeiro programa em Python com interface Streamlit"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#e6e9ef] dark:border-[#2e3340] bg-white dark:bg-[#1e2129] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff4b4b]"
                  required
                />
              </div>

              <div>
                <select
                  value={decomposeCategory}
                  onChange={(e) => setDecomposeCategory(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-lg border border-[#e6e9ef] dark:border-[#2e3340] bg-white dark:bg-[#1e2129] text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#ff4b4b]"
                >
                  <option value="Estudo">📚 Estudo</option>
                  <option value="Trabalho">💼 Trabalho</option>
                  <option value="Pessoal">👤 Pessoal</option>
                  <option value="Saúde">🏃 Saúde</option>
                  <option value="Outros">📌 Outros</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isDecomposing || !decomposeGoal.trim()}
              className="flex items-center justify-center gap-2 bg-[#ff4b4b] hover:bg-[#e03838] disabled:opacity-50 text-white text-xs sm:text-sm font-medium py-2.5 px-5 rounded-lg transition-colors shadow-xs"
            >
              {isDecomposing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Agente Analisando e Decompondo...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Decompor com Agente IA</span>
                </>
              )}
            </button>
          </form>

          {/* Result card */}
          {decomposeResult && (
            <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 space-y-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm font-medium text-amber-900 dark:text-amber-200">
                  {decomposeResult.summary}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Passos Gerados:
                </span>
                {decomposeResult.subtasks.map((st, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-[#16181d] border border-gray-200 dark:border-gray-700/60 text-xs text-gray-800 dark:text-gray-200"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-mono text-[11px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-medium">{st.title}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-[11px] text-gray-500">
                        <Clock className="w-3 h-3" />
                        {st.estimatedMinutes} min
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                        {st.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                {importedSubtasks ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <Check className="w-4 h-4" />
                    <span>Adicionadas à lista principal de tarefas!</span>
                  </div>
                ) : (
                  <button
                    onClick={handleImportDecomposedTasks}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium py-2 px-4 rounded-lg transition-colors shadow-xs"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>Importar Todos os Passos para o Organizador</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Prioritize */}
      {subTab === 'prioritize' && (
        <div className="p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Priorização Estratégica do Dia
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                O Agente analisa suas tarefas pendentes e organiza um plano de foco contra a procrastinação.
              </p>
            </div>

            <button
              onClick={handleRunPrioritize}
              disabled={isPrioritizing || tasks.length === 0}
              className="flex items-center gap-2 bg-[#ff4b4b] hover:bg-[#e03838] disabled:opacity-50 text-white text-xs font-medium py-2 px-4 rounded-lg transition-colors shadow-xs self-start sm:self-auto shrink-0"
            >
              {isPrioritizing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analisando...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Analisar Minhas Tarefas Agora</span>
                </>
              )}
            </button>
          </div>

          {prioritizeResult ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/30 dark:bg-red-950/20 space-y-2">
                <span className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wide flex items-center gap-1.5">
                  <Target className="w-4 h-4" />
                  Foco Principal Imediato
                </span>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {prioritizeResult.focoPrincipal}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/30 dark:bg-blue-950/20 space-y-2">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4" />
                  Recomendação Estratégica
                </span>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  {prioritizeResult.recomendacaoEstrategica}
                </p>
              </div>

              <div className="md:col-span-2 p-3 rounded-lg bg-gray-50 dark:bg-[#111317] border border-gray-200 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400 italic text-center">
                "{prioritizeResult.mensagemMotivadora}"
              </div>
            </div>
          ) : (
            <div className="p-8 text-center border border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-[#111317]/30">
              <Target className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Clique no botão acima para o Agente examinar suas tarefas e definir seu plano de ação!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Chat Mentor */}
      {subTab === 'chat' && (
        <div className="p-5 flex flex-col h-[420px]">
          {/* Chat message stream */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-3">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 text-xs sm:text-sm ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'agent' && (
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] p-3 rounded-xl whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-[#ff4b4b] text-white rounded-br-none'
                      : 'bg-gray-100 dark:bg-[#262730] text-gray-900 dark:text-gray-100 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isChatLoading && (
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 p-2">
                <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                <span>O Agente está pensando...</span>
              </div>
            )}
          </div>

          {/* Quick prompt suggestions for beginners */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-[11px] text-gray-500">
            <span className="shrink-0 font-medium text-gray-400">Sugestões:</span>
            <button
              onClick={() => setChatInput('Como posso organizar meu tempo para estudar Python do zero?')}
              className="shrink-0 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            >
              Estudar Python do zero
            </button>
            <button
              onClick={() => setChatInput('Qual tarefa pendente você me aconselha a fazer primeiro?')}
              className="shrink-0 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            >
              O que fazer primeiro?
            </button>
            <button
              onClick={() => setChatInput('O que é o Streamlit e por que ele é tão prático em Python?')}
              className="shrink-0 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            >
              O que é Streamlit?
            </button>
          </div>

          {/* Input form */}
          <form onSubmit={handleSendChat} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Pergunte ao Agente sobre suas tarefas ou sobre programação..."
              className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#e6e9ef] dark:border-[#2e3340] bg-white dark:bg-[#1e2129] text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#ff4b4b]"
            />
            <button
              type="submit"
              disabled={isChatLoading || !chatInput.trim()}
              className="bg-[#ff4b4b] hover:bg-[#e03838] disabled:opacity-50 text-white p-2.5 rounded-lg transition-colors flex items-center justify-center shrink-0"
              title="Enviar mensagem"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
