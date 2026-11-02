# 📋 Organizador de Tarefas com Agente de IA

Um aplicativo minimalista, rápido e intuitivo para gerenciar suas atividades diárias, com inteligência artificial integrada e arquitetura pensada para quem está aprendendo desenvolvimento de software.

![Logo da Aplicação](public/assets/aistudio/image_5fc256fd.png)

---

## 🚀 Visão Geral

O **Organizador de Tarefas** combina a simplicidade de uma interface no padrão **Streamlit** com o poder do modelo **Gemini 3.8 Flash** da Google. O objetivo é fornecer uma ferramenta prática para organizar tarefas diárias sem distrações visuais ou tutoriais poluindo a tela.

### Principais Funcionalidades:
- **Gestão Completa de Atividades**: Adicionar, categorizar, definir prioridades (*Alta*, *Média*, *Baixa*) e prazos.
- **Diferenciação Visual Clara**: Tarefas pendentes e concluídas têm áreas e estilos gráficos distintos, permitindo identificar o progresso rapidamente.
- **Agente de IA Integrado (Gemini 3.8 Flash)**:
  - **Decomposição de Metas**: Divide tarefas grandes em micro-passos acionáveis de até 30 minutos.
  - **Criação Rápida por Frases**: Digite frases em linguagem natural (ex: *"Estudar lógica e comprar pão amanhã"*) e a IA extrai automaticamente título, categoria e urgência.
  - **Priorizador Estratégico**: Analisa suas pendências e recomenda onde focar para combater a procrastinação.
  - **Mentor Interativo**: Bate-papo para tirar dúvidas de produtividade e desenvolvimento de software.
- **Armazenamento Seguro**: As tarefas são salvas no armazenamento local do navegador (*Local Storage*).

---

## 📂 Estrutura do Projeto

Para facilitar o aprendizado, o código foi organizado de forma modular:

```text
├── README.md               # Este guia completo de arquitetura e uso
├── app.py                  # Aplicação autônoma completa em Python com Streamlit
├── task_engine.py          # Script Python que processa estatísticas e regras de negócio
├── server.ts               # Servidor Express (rotas da IA Gemini e integração)
├── index.html              # Ponto de entrada HTML da aplicação web
├── package.json            # Dependências e scripts do projeto
└── src/
    ├── App.tsx             # Componente raiz que coordena o estado das tarefas
    ├── types.ts            # Tipagens TypeScript (Task, Priority, Category, etc.)
    ├── index.css           # Estilização com Tailwind e tokens do Streamlit
    └── components/
        ├── StreamlitHeader.tsx    # Cabeçalho com logo, navegação e tema
        ├── StreamlitSidebar.tsx   # Barra lateral com métricas e filtros
        ├── TaskForm.tsx           # Formulário de nova tarefa (manual e IA)
        ├── TaskList.tsx           # Listagem com distinção visual de concluídas
        ├── AIAgentPanel.tsx       # Painel interativo com o Agente Gemini
        └── ReadmeModal.tsx        # Visualizador embutido deste guia
```

---

## 🐍 Guia para Iniciantes em Python

Se você está começando a estudar programação, veja como os principais conceitos foram aplicados:

### 1. Estruturas de Dados Básicas
Cada tarefa é representada por um **dicionário**, e o conjunto de tarefas é uma **lista**:

```python
# Uma lista contendo dicionários de tarefas:
tarefas = [
    {
        "id": 1,
        "titulo": "Praticar laços e condicionais em Python",
        "categoria": "Estudo",
        "prioridade": "Alta",
        "prazo": "2026-11-05",
        "concluida": False
    },
    {
        "id": 2,
        "titulo": "Comprar mantimentos para a semana",
        "categoria": "Pessoal",
        "prioridade": "Média",
        "prazo": "2026-11-03",
        "concluida": True
    }
]
```

### 2. Funções de Manipulação
Funções isolam regras específicas, facilitando a reutilização:

```python
def adicionar_tarefa(lista_tarefas, titulo, categoria, prioridade):
    nova = {
        "id": len(lista_tarefas) + 1,
        "titulo": titulo,
        "categoria": categoria,
        "prioridade": prioridade,
        "concluida": False
    }
    lista_tarefas.append(nova)
    return lista_tarefas

def concluir_tarefa(lista_tarefas, tarefa_id):
    for tarefa in lista_tarefas:
        if tarefa["id"] == tarefa_id:
            tarefa["concluida"] = True
            break
    return lista_tarefas
```

### 3. Interface Declarativa com Streamlit
O Streamlit permite criar interfaces visuais em poucas linhas de Python:

```python
import streamlit as st

st.title("📋 Organizador de tarefas")

# Barra lateral com métricas
with st.sidebar:
    st.header("Métricas")
    st.metric(label="Total de Tarefas", value=len(tarefas))

# Checkbox interativo
for t in tarefas:
    concluida = st.checkbox(t["titulo"], value=t["concluida"], key=t["id"])
```

---

## 💻 Como Executar o Código Python no seu Computador

Caso deseje rodar a versão em Python puro localmente na sua máquina:

1. **Instale o Streamlit e o SDK da Google:**
   ```bash
   pip install streamlit google-genai
   ```

2. **Execute o arquivo `app.py`:**
   ```bash
   streamlit run app.py
   ```

3. O navegador abrirá automaticamente no endereço `http://localhost:8501`.

---

## 🤖 Como Funciona a Integração com o Agente de IA

O Agente utiliza a biblioteca oficial `@google/genai` no lado do servidor (`server.ts`), garantindo segurança e confiabilidade:

1. **Modelo**: `gemini-3.8-flash`
2. **Formato das Respostas**: O modelo responde em `JSON` estruturado (`responseSchema`), eliminando erros de interpretação e permitindo que as tarefas geradas pela IA sejam convertidas imediatamente em itens na tela.

---

## 🎨 Diferenciação Visual das Tarefas

- **Tarefas Pendentes**: Apresentadas em cartões com bordas nítidas, tipografia em destaque, seletor de prioridade colorido e acesso direto à decomposição por IA.
- **Tarefas Concluídas**: Agrupadas em uma seção dedicada, com fundo suavizado em tom esmeralda/neutro, texto tachado com menor contraste e emblema de confirmação de conclusão.
