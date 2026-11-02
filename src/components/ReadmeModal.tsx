import React, { useState } from 'react';
import { X, BookOpen, Download, Copy, Check, Terminal, FileCode } from 'lucide-react';

interface ReadmeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReadmeModal: React.FC<ReadmeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyBash = () => {
    navigator.clipboard.writeText('pip install streamlit google-genai\nstreamlit run app.py');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAppPy = () => {
    fetch('/api/python/files')
      .then((res) => res.json())
      .then((data) => {
        const blob = new Blob([data.appPy || ''], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'app.py';
        link.click();
        URL.revokeObjectURL(url);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#16181d] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/80 dark:bg-gray-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                Manual do Projeto (README)
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Guia de arquitetura, fundamentos em Python e instruções de execução
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Markdown Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-2">
            <h4 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>📋</span> Visão Geral
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              O <strong>Organizador de Tarefas</strong> foi projetado com foco em clareza máxima e produtividade.
              A interface visual foi limpa para o uso diário, enquanto as explicações técnicas e tutoriais foram concentrados aqui neste manual.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h4 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>🐍</span> Fundamentos de Programação em Python
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              O coração de qualquer gerenciador de tarefas consiste em armazenar itens e atualizar seus estados:
            </p>

            <div className="bg-gray-900 text-gray-100 p-4 rounded-xl font-mono text-xs overflow-x-auto space-y-2">
              <span className="text-emerald-400"># 1. Cada tarefa é um dicionário com chave e valor:</span>
              <br />
              <span>tarefa = &#123;</span>
              <br />
              <span className="pl-4">"titulo": "Estudar estruturas de repetição",</span>
              <br />
              <span className="pl-4">"categoria": "Estudo",</span>
              <br />
              <span className="pl-4">"prioridade": "Alta",</span>
              <br />
              <span className="pl-4">"concluida": False</span>
              <br />
              <span>&#125;</span>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h4 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>💻</span> Como Rodar o Aplicativo Python no seu Computador
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              Para executar a versão completa em Python no seu computador:
            </p>

            <div className="bg-gray-900 text-gray-100 p-3.5 rounded-xl font-mono text-xs flex items-center justify-between gap-2">
              <span>pip install streamlit google-genai && streamlit run app.py</span>
              <button
                onClick={handleCopyBash}
                className="shrink-0 p-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                title="Copiar comando"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h4 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>🤖</span> Agente de IA Integrado (Gemini 3.8 Flash)
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              O Agente atua diretamente no servidor. Ele não apenas divide tarefas em passos menores, como também extrai atividades a partir de mensagens soltas e oferece sugestões de prioridade para seu dia a dia.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-900/40">
          <button
            onClick={handleDownloadAppPy}
            className="flex items-center gap-2 text-xs font-medium px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar app.py para sua máquina</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
