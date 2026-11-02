#!/usr/bin/env python3
"""
Task Engine em Python (Padrão Didático para Iniciantes)
-------------------------------------------------------
Este script em Python demonstra os fundamentos da linguagem:
- Leitura de JSON (sys.stdin)
- Manipulação de listas e dicionários
- Funções com tipagem sugerida (type hints)
- Estruturas condicionais e laços 'for'
- Retorno de estatísticas estruturadas
"""

import sys
import json
from typing import List, Dict, Any

def analisar_tarefas(tarefas: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Recebe uma lista de tarefas (dicionários) e calcula métricas
    como total, concluídas, pendentes e distribuição de prioridades.
    """
    total = len(tarefas)
    concluidas = sum(1 for t in tarefas if t.get("concluida", False))
    pendentes = total - concluidas
    
    taxa_sucesso = (concluidas / total * 100) if total > 0 else 0.0

    # Contagem de prioridades das tarefas pendentes
    prioridades = {"Alta": 0, "Média": 0, "Baixa": 0}
    categorias: Dict[str, int] = {}

    for t in tarefas:
        if not t.get("concluida", False):
            prio = t.get("prioridade", "Média")
            if prio in prioridades:
                prioridades[prio] += 1
            else:
                prioridades[prio] = 1
                
        cat = t.get("categoria", "Geral")
        categorias[cat] = categorias.get(cat, 0) + 1

    # Dica educativa baseada no estado atual
    if total == 0:
        dica = "Comece adicionando sua primeira tarefa ou use o Agente de IA para sugerir ideias!"
    elif pendentes == 0:
        dica = "Excelente trabalho! Todas as tarefas foram concluídas. Hora de descansar ou planejar o próximo ciclo."
    elif prioridades.get("Alta", 0) > 3:
        dica = "Atenção: Você tem muitas tarefas com prioridade 'Alta'. O método de produtividade sugere focar em no máximo 1 a 3 prioridades críticas por dia."
    elif taxa_sucesso > 50:
        dica = "Ótimo ritmo! Mais da metade das tarefas já foram concluídas."
    else:
        dica = "Foco em pequenos passos: escolha uma tarefa rápida de prioridade Alta ou Média para criar tração."

    return {
        "total": total,
        "concluidas": concluidas,
        "pendentes": pendentes,
        "taxa_sucesso": round(taxa_sucesso, 1),
        "prioridades": prioridades,
        "categorias": categorias,
        "dica_produtividade": dica,
        "status_python": "Executado com sucesso via Python 3 Engine!"
    }

def main():
    try:
        # Se argumentos forem passados ou ler de stdin
        entrada = sys.stdin.read().strip()
        if not entrada:
            dados = []
        else:
            dados = json.loads(entrada)
        
        resultado = analisar_tarefas(dados)
        print(json.dumps(resultado, ensure_ascii=False))
    except Exception as e:
        print(json.dumps({"erro": str(e), "status_python": "Falha na análise"}, ensure_ascii=False), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
