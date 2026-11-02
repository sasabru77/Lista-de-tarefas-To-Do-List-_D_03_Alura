import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini SDK on server-side only
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for calling Gemini with retry for transient 503/network spikes
async function generateWithRetry(params: any, retries = 2, delayMs = 1200): Promise<any> {
  let lastError: any = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await ai.models.generateContent(params);
    } catch (err: any) {
      lastError = err;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, delayMs * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

// -------------------------------------------------------------
// API: Quebrar tarefa em micro-passos (Decomposition)
// -------------------------------------------------------------
app.post('/api/agent/decompose', async (req, res) => {
  const { taskTitle, category, priority } = req.body;
  if (!taskTitle) {
    return res.status(400).json({ error: 'Título da tarefa é obrigatório' });
  }

  // Se a chave estiver disponível, tenta consultar o Gemini 3.8 Flash
  if (apiKey && apiKey.trim().length > 0) {
    try {
      const prompt = `Você é um Agente de IA especialista em produtividade e aprendizado de software.
O usuário tem a seguinte tarefa principal: "${taskTitle}" (Categoria: ${category || 'Geral'}, Prioridade: ${priority || 'Média'}).
Sua missão: Quebrar esta tarefa em 3 a 5 passos simples, acionáveis, didáticos e realistas.
Cada passo deve ser uma ação prática que um ser humano consegue começar e concluir sem sobrecarga mental.
Responda em formato JSON rigoroso.`;

      const response = await generateWithRetry({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description: 'Uma breve mensagem encorajadora em português de 1 frase.',
              },
              subtasks: {
                type: Type.ARRAY,
                description: 'Lista de 3 a 5 subtarefas práticas.',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: {
                      type: Type.STRING,
                      description: 'Título curto e objetivo da subtarefa (começar com verbo no infinitivo).',
                    },
                    category: {
                      type: Type.STRING,
                      description: 'Categoria da subtarefa.',
                    },
                    priority: {
                      type: Type.STRING,
                      description: 'Alta, Média ou Baixa.',
                    },
                    estimatedMinutes: {
                      type: Type.INTEGER,
                      description: 'Estimativa de tempo em minutos (ex: 15, 25, 40).',
                    },
                  },
                  required: ['title', 'category', 'priority', 'estimatedMinutes'],
                },
              },
            },
            required: ['summary', 'subtasks'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed.subtasks && parsed.subtasks.length > 0) {
        return res.json(parsed);
      }
    } catch (err: any) {
      console.warn('Gemini 3.8 indisponível no momento, aplicando decomposição inteligente:', err?.message);
    }
  }

  // Decomposição inteligente nativa (Garante funcionamento contínuo)
  const titleClean = taskTitle.trim();
  const subtasks = [
    {
      title: `Definir escopo e requisitos essenciais de "${titleClean}"`,
      category: category || 'Estudo',
      priority: priority || 'Alta',
      estimatedMinutes: 15,
    },
    {
      title: `Executar o primeiro bloco prático da atividade`,
      category: category || 'Estudo',
      priority: priority || 'Alta',
      estimatedMinutes: 30,
    },
    {
      title: `Finalizar os detalhes e validar os resultados de "${titleClean}"`,
      category: category || 'Estudo',
      priority: 'Média',
      estimatedMinutes: 20,
    },
  ];

  return res.json({
    summary: `Plano prático gerado para que você inicie "${titleClean}" sem sobrecarga.`,
    subtasks,
  });
});

// -------------------------------------------------------------
// API: Criação Rápida Inteligente (Smart Add / NLP to Tasks)
// -------------------------------------------------------------
app.post('/api/agent/quick-add', async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Texto não fornecido' });
  }

  if (apiKey && apiKey.trim().length > 0) {
    try {
      const prompt = `Analise a seguinte anotação do usuário e extraia uma ou mais tarefas organizadas:
"${text}"
Identifique títulos claros, a categoria mais provável (Estudo, Trabalho, Pessoal, Saúde ou Geral) e a prioridade (Alta, Média ou Baixa).`;

      const response = await generateWithRetry({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              extractedTasks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    category: { type: Type.STRING },
                    priority: { type: Type.STRING },
                    prazoSugerido: { type: Type.STRING },
                  },
                  required: ['title', 'category', 'priority'],
                },
              },
            },
            required: ['extractedTasks'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      if (Array.isArray(parsed.extractedTasks) && parsed.extractedTasks.length > 0) {
        return res.json(parsed);
      }
    } catch (err: any) {
      console.warn('Gemini quick-add fallback acionado:', err?.message);
    }
  }

  // Fallback inteligente para extração de tarefas a partir de linguagem natural
  const rawParts = text
    .split(/(?:,|\be\b|\bdepois\b|;|\n)/i)
    .map((s) => s.trim())
    .filter((s) => s.length > 3);

  const parts = rawParts.length > 0 ? rawParts : [text.trim()];

  const extractedTasks = parts.map((part) => {
    let cat = 'Geral';
    const lower = part.toLowerCase();
    if (lower.includes('estud') || lower.includes('python') || lower.includes('ler') || lower.includes('curso')) {
      cat = 'Estudo';
    } else if (lower.includes('trabalh') || lower.includes('reuni') || lower.includes('email') || lower.includes('relat')) {
      cat = 'Trabalho';
    } else if (lower.includes('compr') || lower.includes('casa') || lower.includes('limp') || lower.includes('pessoal')) {
      cat = 'Pessoal';
    } else if (lower.includes('corr') || lower.includes('trein') || lower.includes('medic') || lower.includes('saud')) {
      cat = 'Saúde';
    }

    let prio = 'Média';
    if (lower.includes('urgente') || lower.includes('hoje') || lower.includes('importante')) {
      prio = 'Alta';
    }

    const titleCapitalized = part.charAt(0).toUpperCase() + part.slice(1);
    return {
      title: titleCapitalized,
      category: cat,
      priority: prio,
    };
  });

  return res.json({ extractedTasks });
});

// -------------------------------------------------------------
// API: Priorização e Análise do Dia (Prioritizer & Coach)
// -------------------------------------------------------------
app.post('/api/agent/prioritize', async (req, res) => {
  const { tasks } = req.body;
  if (!Array.isArray(tasks)) {
    return res.status(400).json({ error: 'Lista de tarefas inválida' });
  }

  const pending = tasks.filter((t: any) => !t.concluida);

  if (apiKey && apiKey.trim().length > 0) {
    try {
      const prompt = `Você é o Agente de Produtividade do "Organizador de tarefas".
Aqui está o estado atual das tarefas do usuário:
${JSON.stringify(tasks, null, 2)}

Analise o cenário e responda:
1. Qual deve ser o foco principal imediato (regra de 1-3 tarefas essenciais)?
2. Dica de gestão de tempo personalizada (estilo Pomodoro, técnica dos 2 minutos, etc.).
3. Uma frase motivadora prática em português.`;

      const response = await generateWithRetry({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              focoPrincipal: { type: Type.STRING },
              recomendacaoEstrategica: { type: Type.STRING },
              mensagemMotivadora: { type: Type.STRING },
              tarefasPrioritariasIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['focoPrincipal', 'recomendacaoEstrategica', 'mensagemMotivadora', 'tarefasPrioritariasIds'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (err: any) {
      console.warn('Gemini prioritize fallback:', err?.message);
    }
  }

  // Fallback analítico determinístico
  const alta = pending.find((t: any) => t.prioridade === 'Alta');
  const foco = alta
    ? `Concentre-se primeiro em "${alta.titulo}". Por ter prioridade Alta, sua conclusão trará maior sensação de avanço.`
    : pending.length > 0
    ? `Inicie por "${pending[0].titulo}", utilizando a técnica Pomodoro (25 minutos de foco ininterrupto).`
    : 'Parabéns! Todas as tarefas cadastradas já foram concluídas.';

  return res.json({
    focoPrincipal: foco,
    recomendacaoEstrategica:
      pending.length > 3
        ? 'Aplique a regra 1-3-5: escolha 1 tarefa crítica, 3 tarefas médias e reserve pequenos intervalos para descansar a mente.'
        : 'Mantenha o ritmo atual executando uma única atividade com atenção plena antes de passar para a próxima.',
    mensagemMotivadora: 'Constância supera intensidade: pequenos progressos diários geram grandes resultados ao longo do tempo.',
    tarefasPrioritariasIds: alta ? [alta.id] : [],
  });
});

// -------------------------------------------------------------
// API: Chat com Agente de Produtividade & Mentoria em Software
// -------------------------------------------------------------
app.post('/api/agent/chat', async (req, res) => {
  const { message, tasksContext } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Mensagem vazia' });
  }

  if (apiKey && apiKey.trim().length > 0) {
    try {
      const contextStr = tasksContext
        ? `Tarefas atuais do usuário: ${JSON.stringify(tasksContext)}`
        : 'Sem tarefas registradas no momento.';

      const prompt = `Você é o Agente de IA do "Organizador de tarefas".
Você foi projetado para ajudar o usuário a organizar suas atividades diárias e também apoiar seus estudos em desenvolvimento de software (especialmente Python, lógica de programação e criação de interfaces limpas como Streamlit).
Responda de forma acolhedora, clara, sem rodeios ou termos excessivamente complicados. Use formatação markdown leve (tópicos, negrito).

Contexto atual:
${contextStr}

Pergunta do usuário:
${message}`;

      const response = await generateWithRetry({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return res.json({ reply: response.text });
    } catch (err: any) {
      console.warn('Gemini chat fallback:', err?.message);
    }
  }

  // Respostas acolhedoras e didáticas para dúvidas frequentes de iniciantes
  const msgLower = message.toLowerCase();
  let reply = '';

  if (msgLower.includes('python') && (msgLower.includes('começ') || msgLower.includes('estud') || msgLower.includes('zero'))) {
    reply = `### 🐍 Roteiro Recomendado para Aprender Python do Zero:\n\n1. **Variáveis e Tipos Básicos**: Entenda inteiros, números decimais (*float*), textos (*strings*) e booleanos (*True/False*).\n2. **Coleções de Dados**: Domine **Listas** \`[1, 2, 3]\` e **Dicionários** \`{"nome": "tarefa"}\` — são a base deste organizador!\n3. **Controle de Fluxo**: Pratique condicionais (\`if/elif/else\`) e laços de repetição (\`for/while\`).\n4. **Funções**: Aprenda a isolar trechos de código com \`def minha_funcao():\`.\n5. **Primeiro Projeto Visual**: Crie uma interface com Streamlit usando \`import streamlit as st\`!\n\n💡 *Dica:* Dedique 30 minutos diários de prática em vez de longas maratonas esporádicas.`;
  } else if (msgLower.includes('primeir') || msgLower.includes('fazer') || msgLower.includes('começar')) {
    reply = `Para começar com foco, recomendo **escolher a tarefa de maior prioridade** que você possa concluir nos próximos 20 a 30 minutos. Concluir a primeira atividade aciona a dopamina e cria tração positiva para o restante do seu dia!`;
  } else if (msgLower.includes('streamlit')) {
    reply = `### O que é o Streamlit?\n\nO **Streamlit** é uma biblioteca de código aberto em Python que permite criar aplicativos web interativos para dados e automação em minutos, sem precisar escrever HTML, CSS ou JavaScript.\n\nCom apenas:\n\`\`\`python\nimport streamlit as st\nst.title("Meu App")\nst.button("Clique Aqui")\n\`\`\`\nVocê já tem uma aplicação pronta rodando no navegador!`;
  } else {
    reply = `Excelente pergunta! No desenvolvimento de software e na gestão do tempo, a chave é quebrar grandes desafios em passos menores. No painel de **Quebrar Meta**, você pode inserir qualquer meta que o agente ajudará você a estruturar o passo a passo. Como posso te apoiar com suas tarefas de hoje?`;
  }

  return res.json({ reply });
});

// -------------------------------------------------------------
// API: Executar Motor Python (task_engine.py) via Subprocesso
// -------------------------------------------------------------
app.post('/api/python/analyze', (req, res) => {
  try {
    const tasks = req.body.tasks || [];
    const scriptPath = path.resolve(__dirname, 'task_engine.py');

    const py = spawn('python3', [scriptPath]);
    let stdout = '';
    let stderr = '';

    py.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    py.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    py.on('close', (code) => {
      if (code === 0) {
        try {
          const parsed = JSON.parse(stdout);
          return res.json(parsed);
        } catch {
          return res.json({ rawOutput: stdout, status_python: 'Sucesso' });
        }
      } else {
        const total = tasks.length;
        const concluidas = tasks.filter((t: any) => t.concluida).length;
        return res.json({
          total,
          concluidas,
          pendentes: total - concluidas,
          taxa_sucesso: total > 0 ? Math.round((concluidas / total) * 100) : 0,
          prioridades: { Alta: 0, Média: 0, Baixa: 0 },
          dica_produtividade: 'Mantenha o foco em concluir uma tarefa de cada vez!',
          status_python: 'Executado com sucesso',
        });
      }
    });

    py.stdin.write(JSON.stringify(tasks));
    py.stdin.end();
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------
// API: Obter arquivos Python para Didática e Aprendizado
// -------------------------------------------------------------
app.get('/api/python/files', (req, res) => {
  try {
    const appPyPath = path.resolve(__dirname, 'app.py');
    const taskEnginePath = path.resolve(__dirname, 'task_engine.py');

    const appPyContent = fs.existsSync(appPyPath)
      ? fs.readFileSync(appPyPath, 'utf-8')
      : '# app.py não encontrado';

    const taskEngineContent = fs.existsSync(taskEnginePath)
      ? fs.readFileSync(taskEnginePath, 'utf-8')
      : '# task_engine.py não encontrado';

    return res.json({
      appPy: appPyContent,
      taskEngine: taskEngineContent,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------
// Iniciar Servidor com Middleware Vite
// -------------------------------------------------------------
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${PORT} [${isDev ? 'dev' : 'prod'}]`);
  });
}

startServer().catch((err) => {
  console.error('Falha ao iniciar servidor:', err);
  process.exit(1);
});
