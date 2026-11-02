export type Priority = 'Alta' | 'Média' | 'Baixa';

export type Category = 'Estudo' | 'Trabalho' | 'Pessoal' | 'Saúde' | 'Outros';

export interface Task {
  id: string;
  titulo: string;
  categoria: Category;
  prioridade: Priority;
  prazo?: string; // YYYY-MM-DD
  concluida: boolean;
  criadaEm: string;
  subtarefas?: {
    id: string;
    titulo: string;
    concluida: boolean;
  }[];
}

export interface PythonStats {
  total: number;
  concluidas: number;
  pendentes: number;
  taxa_sucesso: number;
  prioridades: {
    Alta: number;
    Média: number;
    Baixa: number;
  };
  categorias?: Record<string, number>;
  dica_produtividade?: string;
  status_python?: string;
}

export interface AIAgentDecomposeResult {
  summary: string;
  subtasks: {
    title: string;
    category: string;
    priority: Priority;
    estimatedMinutes: number;
  }[];
}

export interface AIAgentPrioritizeResult {
  focoPrincipal: string;
  recomendacaoEstrategica: string;
  mensagemMotivadora: string;
  tarefasPrioritariasIds: string[];
}
