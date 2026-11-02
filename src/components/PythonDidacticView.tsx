import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  BookOpen, 
  Layers, 
  Cpu, 
  HelpCircle,
  Play,
  FileCode,
  Sparkles
} from 'lucide-react';

export const PythonDidacticView: React.FC = () => {
  const [activeFile, setActiveFile] = useState<'app.py' | 'task_engine.py'>('app.py');
  const [appPyCode, setAppPyCode] = useState<string>('');
  const [taskEngineCode, setTaskEngineCode] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/python/files')
      .then((res) => res.json())
      .then((data) => {
        setAppPyCode(data.appPy || '');
        setTaskEngineCode(data.taskEngine || '');
      })
      .catch((err) => {
        console.error('Erro ao carregar arquivos Python:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const currentCode = activeFile === 'app.py' ? appPyCode : taskEngineCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([currentCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFile;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Educational Welcome Banner */}
      <div className="p-5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Didática do Projeto: Python + Streamlit para Iniciantes
              <span className="text-xs font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                Guia Prático
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Como você está começando a aprender desenvolvimento de software, este projeto foi estruturado com foco em máxima clareza.
              Abaixo você pode ver o código Python completo da aplicação, entender como cada componente funciona e baixar o arquivo para rodar no seu computador!
            </p>
          </div>
        </div>
      </div>

      {/* 3 Core Architecture Concepts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Concept 1 */}
        <div className="p-4 rounded-xl border border-[#e6e9ef] dark:border-[#2e3340] bg-white dark:bg-[#16181d] space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-white">
            <div className="w-6 h-6 rounded bg-red-100 dark:bg-red-950/60 text-[#ff4b4b] flex items-center justify-center text-xs font-bold">
              1
            </div>
            <span>Estrutura de Dados (Listas & Dicionários)</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            Cada tarefa é representada por um dicionário em Python com chaves simples: <code className="text-[#ff4b4b] font-mono text-[11px]">titulo</code>, <code className="text-[#ff4b4b] font-mono text-[11px]">categoria</code>, <code className="text-[#ff4b4b] font-mono text-[11px]">prioridade</code> e <code className="text-[#ff4b4b] font-mono text-[11px]">concluida</code>.
          </p>
        </div>

        {/* Concept 2 */}
        <div className="p-4 rounded-xl border border-[#e6e9ef] dark:border-[#2e3340] bg-white dark:bg-[#16181d] space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-white">
            <div className="w-6 h-6 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center text-xs font-bold">
              2
            </div>
            <span>Interface Minimalista Streamlit</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            O Streamlit cria interfaces sem precisar de HTML complicado: <code className="text-amber-600 dark:text-amber-400 font-mono text-[11px]">st.sidebar</code> desenha a barra lateral, <code className="text-amber-600 dark:text-amber-400 font-mono text-[11px]">st.metric</code> cria os cards de métricas e <code className="text-amber-600 dark:text-amber-400 font-mono text-[11px]">st.checkbox</code> gerencia a conclusão.
          </p>
        </div>

        {/* Concept 3 */}
        <div className="p-4 rounded-xl border border-[#e6e9ef] dark:border-[#2e3340] bg-white dark:bg-[#16181d] space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-white">
            <div className="w-6 h-6 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center text-xs font-bold">
              3
            </div>
            <span>Agente de IA Integrado</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            O Agente utiliza o modelo <strong className="text-blue-600 dark:text-blue-400">Gemini 3.8 Flash</strong> da Google para processar linguagem natural, analisar prioridades e decompor metas complexas em passos rápidos.
          </p>
        </div>
      </div>

      {/* Code Viewer Panel */}
      <div className="rounded-xl border border-[#e6e9ef] dark:border-[#2e3340] bg-[#1e2129] text-gray-200 overflow-hidden shadow-md">
        {/* Code Bar Header */}
        <div className="px-4 py-3 bg-[#16181d] border-b border-[#2e3340] flex flex-wrap items-center justify-between gap-3">
          {/* File selector buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFile('app.py')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-md transition-colors ${
                activeFile === 'app.py'
                  ? 'bg-[#ff4b4b] text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>app.py (App Streamlit Completo)</span>
            </button>

            <button
              onClick={() => setActiveFile('task_engine.py')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-md transition-colors ${
                activeFile === 'task_engine.py'
                  ? 'bg-[#ff4b4b] text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>task_engine.py (Lógica & Estatísticas)</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
              title="Copiar código para a área de transferência"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Código</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-emerald-700 hover:bg-emerald-600 text-white transition-colors"
              title="Baixar arquivo .py para o seu computador"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar {activeFile}</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 max-h-[500px] overflow-y-auto font-mono text-xs leading-relaxed selection:bg-[#ff4b4b] selection:text-white">
          {isLoading ? (
            <div className="py-12 text-center text-gray-400">
              Carregando código Python didático...
            </div>
          ) : (
            <pre className="text-gray-300 whitespace-pre-wrap">
              {currentCode}
            </pre>
          )}
        </div>
      </div>

      {/* How to run locally instructions */}
      <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-[#16181d]/50 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#ff4b4b]" />
          Como rodar este app Python com Streamlit no seu computador (Passo a Passo)
        </h3>

        <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-start gap-2">
            <span className="font-mono font-bold text-gray-900 dark:text-white">1.</span>
            <span>Abra o terminal (Prompt de Comando ou VS Code) e instale o Streamlit e a biblioteca do Gemini:</span>
          </div>
          <div className="bg-[#1e2129] text-gray-200 p-2.5 rounded-lg font-mono text-xs overflow-x-auto">
            pip install streamlit google-genai
          </div>

          <div className="flex items-start gap-2 pt-2">
            <span className="font-mono font-bold text-gray-900 dark:text-white">2.</span>
            <span>Clique no botão verde acima <strong>"Baixar app.py"</strong> e salve o arquivo na sua pasta de estudos.</span>
          </div>

          <div className="flex items-start gap-2 pt-2">
            <span className="font-mono font-bold text-gray-900 dark:text-white">3.</span>
            <span>Execute o Streamlit pelo terminal:</span>
          </div>
          <div className="bg-[#1e2129] text-gray-200 p-2.5 rounded-lg font-mono text-xs overflow-x-auto">
            streamlit run app.py
          </div>
          <p className="text-[11px] text-gray-500 pt-1">
            O Streamlit abrirá instantaneamente uma aba no seu navegador rodando sua aplicação de tarefas com a interface visual!
          </p>
        </div>
      </div>
    </div>
  );
};
